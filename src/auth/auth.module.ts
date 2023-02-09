import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfig } from '@config/auth';
import { JwtStrategy } from '@auth/strategy/jwt.strategy';
import { BasicStrategy } from '@auth/strategy/basic.startegy';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule.register({ session: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow<AuthConfig>('auth').secret,
        signOptions: {
          expiresIn: configService.getOrThrow<AuthConfig>('auth').maximumAge,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, BasicStrategy],
  exports: [],
})
export class AuthModule {}
