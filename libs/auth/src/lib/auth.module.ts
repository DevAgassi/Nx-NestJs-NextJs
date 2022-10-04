import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService, ConfigModule} from '@nestjs/config';
import { PrismaService } from '@pet-project/prisma';
import { UserService } from '@pet-project/user';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    /* imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('EXPIRES_IN') },
      }),
      inject: [ConfigService],*/
    }),
  ],
  controllers: [],
  providers: [
    AuthResolver,
    AuthService,
    JwtStrategy,
    GqlAuthGuard,
    PrismaService,
    ConfigService,
    UserService,
  ],
  exports: [],
})
export class AuthModule {}
