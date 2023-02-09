import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@user/user.service';
import { AuthConfig } from '@config/auth';
import { UserDocument } from '@user/schema/user.schema';
import { JwtPayloadDto } from '@auth/dto/jwt-payload.dto';
import { Types } from 'mongoose';

export const JWT_STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<AuthConfig>('auth').secret,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<UserDocument> {
    try {
      return await this.userService.find({
        _id: payload.sub,
        emails: new Types.Map<string>([['principal', payload.email]]),
      });
    } catch {
      throw new UnauthorizedException('JWT not valid');
    }
  }
}
