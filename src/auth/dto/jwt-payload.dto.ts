import { Types } from 'mongoose';
import { IsEmail, IsMongoId } from 'class-validator';

export class JwtPayloadDto {
  @IsMongoId()
  sub: Types.ObjectId;

  @IsEmail()
  email: string;
}
