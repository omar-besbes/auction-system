import { IUser } from '@user/schema/user.schema';
import { Types } from 'mongoose';
import {
  IsDate,
  IsEmail,
  IsMongoId,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto implements Omit<IUser, 'hashedPassword' | 'salt'> {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  displayName: string;

  @ValidateNested()
  name: {
    familyName: string;
    firstName: string;
    middleName?: string;
  };

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(Date.now() - 18 * 365 * 24 * 3600 * 1000), {
    message: 'you must be at least 18 years old in order to participate',
  })
  @IsOptional()
  birthDate?: Date;

  @IsEmail({}, { each: true })
  emails: Types.Map<string>;

  @IsPhoneNumber('TN', { each: true })
  phones: Types.Map<string>;
}
