import { Controller, Patch, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Patch()
  async resetPassword() {}

  @Patch()
  async forgotPassword() {}

  @Post()
  async activateAccount() {}

  @Post()
  async signin() {}

  @Post()
  async signup() {}
}
