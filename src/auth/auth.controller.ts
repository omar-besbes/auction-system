import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { UserDocument } from '@user/schema/user.schema';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UseBasicAuth } from '@auth/decorator/basic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @UseBasicAuth()
  async signin(@Req() { user }: { user: UserDocument }) {
    return await this.authService.signin(user);
  }

  @Post('signup')
  async signup(@Body() userData: CreateUserDto) {
    return await this.authService.signup(userData);
  }
}
