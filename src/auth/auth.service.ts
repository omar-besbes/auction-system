import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UserService } from '@user/user.service';
import { UserDocument } from '@user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signin(user: UserDocument) {
    if (!user.emails.has('principal'))
      throw new InternalServerErrorException('email was not found');
    const email = user.emails.get('principal');
    const token = this.jwtService.sign(
      { email },
      { subject: user._id.toString() },
    );
    return { token };
  }

  async signup(userData: CreateUserDto) {
    const user = await this.userService.create(userData);
    const token = this.jwtService.sign({ _id: user._id });
    return { token };
  }
}
