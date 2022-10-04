import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role } from '@pet-project/user';
import { AuthLoginInput } from './dto/auth-login.input';
import { AuthRegisterInput } from './dto/auth-register.input';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserToken } from './models/user-token';
import { UserService } from '@pet-project/user';
import { User } from '@prisma/client';
import { AccessAuthUserDto } from './dto/access-auth-user.dto';
import { PublicUser } from '@pet-project/user';
import { JwtAccessPayload } from './dto/jwt.access.payload';
import { Helper } from './common/helper';
import { UserAuthTokenRefresh } from './models/user-auth-token-refresh';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {}

  public async login(input: AuthLoginInput): Promise<UserToken> {
    const { email, password } = input;
    const user = await this.validate(email, password);

    const [token, refreshToken] = await this.generateTokens(user);

    return {
      user,
      token,
      refreshToken,
    };
  }

  public async register(input: AuthRegisterInput): Promise<UserToken> {
    // Make sure that we have user with that email already
    const found = await this.userService.findByEmail(input.email);

    if (found) {
      throw new BadRequestException(
        `Cannot register with email ${input.email}, must by unique`
      );
    }

    const password = await Helper.hash(input.password);

    const user = await this.userService.create({
      ...input,
      password,
      roles: Role['user'],
    });

    const [token, refreshToken] = await this.generateTokens(user);

    return {
      user,
      token,
      refreshToken,
    };
  }

  private async validate(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} does not exist`);
    }

    const passwordValid = await Helper.validate(password, user.password);

    if (!passwordValid) {
      throw new NotFoundException(`Invalid password`);
    }

    return user;
  }

  private async generateTokens(user: PublicUser) {
    return Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);
  }

  private async createAccessToken(user: PublicUser, ttl?: number) {
    const payload: JwtAccessPayload = {
      sub: user.uuid,
      email: user.email,
      //roles: user.roles,
    };

    let expiresIn = ttl || this.configService.get<number>('expires_in');

    expiresIn = ((date) => date.setSeconds(date.getSeconds() + expiresIn))(
      new Date()
    );

    return this.generateJwt(payload, {
      /*secret: this.configService.get('JWT_SECRET'),*/ expiresIn,
    });
  }

  private async createRefreshToken(
    user: PublicUser
  ): Promise<UserAuthTokenRefresh> {
    return this.createUserRefreshToken(user.uuid);
  }

  private createUserRefreshToken(uuid: string): UserAuthTokenRefresh {
    const refresh_expires_in = ((date) =>
      date.setSeconds(
        date.getSeconds() + this.configService.get('refresh_expires_in')
      ))(new Date());
    const token = this.jwtService.sign(
      { uuid },
      {
        secret: this.configService.get('refresh_jwt_secret'),
        expiresIn: refresh_expires_in,
      }
    );

    return { refresh_token: token, expiresIn: refresh_expires_in };
  }

  private generateJwt(payload: object, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  public async getUserFromJwtPayload(uuid: string) {
    return await this.userService.findByUUID(uuid);
  }

  public async verifyToken(token: string): Promise<User> {
    const decoded = await this.jwtService.verify(token, {
      secret: this.configService.get('jwt_secret'),
    });

    const user = await this.userService.findByEmail(decoded.email);

    if (!user) {
      throw new Error('Unable to get the user from decoded token.');
    }

    return user;
  }
}
