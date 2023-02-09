import { IStrategyOptions, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { UserDto } from '@user/dto/user.dto';
import { Types } from 'mongoose';

export const BASIC_STRATEGY_NAME = 'basic';

@Injectable()
export class BasicStrategy extends PassportStrategy(
  Strategy,
  BASIC_STRATEGY_NAME,
) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email.principal',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(email: string, password: string): Promise<UserDto> {
    try {
      return await this.userService.findAndVerifyPassword(
        { email: new Types.Map<string>([['principal', email]]) },
        password,
      );
    } catch {
      throw new UnauthorizedException('Email or password is incorrect');
    }
  }
}
