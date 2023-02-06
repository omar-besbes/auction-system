import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

const bcrypt = require('bcrypt');

export interface IUser {
  displayName: string;
  name: {
    familyName: string;
    firstName: string;
    middleName?: string;
  };
  birthDate?: Date;
  emails: Types.Map<string>;
  phones: Types.Map<string>;
  hashedPassword: string;
  salt: string;
}

export interface IUserMethods {
  generateSalt(): Promise<boolean>;

  hashPassword(password: string): Promise<boolean>;

  changePassword(password: string): Promise<boolean>;

  verifyPassword(password: string): Promise<boolean>;
}

export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;

export type UserDocument = InstanceType<UserModel>;

@Schema({
  timestamps: true,
})
export class User implements IUser {
  @Prop({
    type: String,
    trim: true,
  })
  displayName: string;

  @Prop({
    type: {
      familyName: {
        type: String,
        lowercase: true,
        trim: true,
        maxLength: 30,
        required: true,
      },
      firstName: {
        type: String,
        lowercase: true,
        trim: true,
        maxLength: 30,
        required: true,
      },
      middleName: { type: String, lowercase: true, trim: true, maxLength: 30 },
    },
  })
  name: { familyName: string; firstName: string; middleName?: string };

  @Prop({
    type: Date,
    max: new Date(Date.now() - 18 * 365 * 24 * 3600 * 1000), // at least 18 years old
  })
  birthDate: Date;

  @Prop({
    type: Types.Map,
    of: String,
    required: true,
    validate: {
      validator(emails: Types.Map<string>) {
        return emails.size > 0;
      },
      message: 'A minimum of 1 email is required',
    },
  })
  emails: Types.Map<string>;

  @Prop({
    type: Types.Map,
    of: String,
    required: true,
    validate: {
      validator(phones: Types.Map<string>) {
        return phones.size > 0;
      },
      message: 'A minimum of 1 phone number is required',
    },
  })
  phones: Types.Map<string>;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  hashedPassword: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass<IUser, UserModel>(User);

UserSchema.method('generateSalt', async function (): Promise<void> {
  this.salt = await bcrypt.genSalt(10);
});

UserSchema.method(
  'hashPassword',
  async function (password: string): Promise<void> {
    this.hashedPassword = await bcrypt.hash(password, this.salt);
  },
);

UserSchema.method(
  'changePassword',
  async function (password: string): Promise<void> {
    await this.generateSalt();
    await this.hashPassword(password);
  },
);

UserSchema.method(
  'verifyPassword',
  async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.hashedPassword);
  },
);
