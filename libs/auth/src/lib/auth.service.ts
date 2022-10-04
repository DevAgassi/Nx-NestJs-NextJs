import {
  BadRequestException,
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
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`User with email ${email} does not exist`);
    }

    const passwordValid = await Helper.validate(password, user.password);

    if (!passwordValid) {
      throw new Error(`Invalid password`);
    }

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

  async generateTokens(user: PublicUser) {
    return Promise.all([
      this.createAccessToken(user),
      this.createRefreshToken(user),
    ]);
  }

  async createAccessToken(user: PublicUser, ttl?: number) {
    const payload: JwtAccessPayload = {
      uuid: user.uuid,
      //email: user.email,
      //roles: user.roles,
    };

    let expiresIn = ttl || this.configService.get<number>('expires_in');
    
    expiresIn =  (date => date.setSeconds(date.getSeconds() + expiresIn))(new Date());

    return this.generateJwt(payload, { /*secret: this.configService.get('JWT_SECRET'),*/ expiresIn });
  }

  async createRefreshToken(user: PublicUser): Promise<UserAuthTokenRefresh> {
    return this.createUserRefreshToken(user.uuid);
  }

  createUserRefreshToken(uuid: string): UserAuthTokenRefresh {
    const refresh_expires_in =  (date => date.setSeconds(date.getSeconds() + this.configService.get('refresh_expires_in')))(new Date());
    const token = this.jwtService.sign(
      { uuid },
      {
        secret: this.configService.get('refresh_jwt_secret'),
        expiresIn: refresh_expires_in,
      }
    );

    return {refresh_token: token, expiresIn: refresh_expires_in};
  }

  generateJwt(payload: object, options?: JwtSignOptions): string {
    return this.jwtService.sign(payload, options);
  }

  async getUserFromJwtPayload(payload: JwtAccessPayload) {
    return await this.userService.findByUUID(payload.uuid);
  }
}
