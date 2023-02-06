import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @Get()
  findAll() {
    return this.userService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.find({ _id: id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() user: UserDto) {
    return this.userService.update({ _id: id }, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove({ _id: id });
  }
}
