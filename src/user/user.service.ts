import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IUser, User, UserDocument, UserModel } from '@user/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { ClientSession, FilterQuery, Types, UpdateQuery } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async findAll(
    conditions: FilterQuery<IUser>,
    session?: ClientSession,
  ): Promise<UserDocument[]> {
    return this.userModel.find(conditions, {}, { session }).exec();
  }

  async get(
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId, {}, { session }).exec();

    // null safety
    if (user === null) throw new NotFoundException('User not found');
    else return user;
  }

  async find(
    conditions: FilterQuery<IUser>,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOne(conditions, {}, { session })
      .exec();

    // null safety
    if (user === null) throw new NotFoundException('User not found');
    else return user;
  }

  async findAndVerifyPassword(
    conditions: FilterQuery<IUser>,
    password: string,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOne(conditions, {}, { session })
      .select('+hashedPassword')
      .exec();

    if (user && (await user.verifyPassword(password))) {
      return user;
    } else {
      throw new UnauthorizedException('Password or handle incorrect');
    }
  }

  async create(
    userData: CreateUserDto,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const { password, ...userInfo } = { ...userData };
    const user = new this.userModel(userInfo);
    await user.changePassword(password);
    return await user.save({ session });
  }

  async resetPassword(
    user: UserDocument,
    newPassword: string,
    session?: ClientSession,
  ): Promise<UserDocument> {
    await user.changePassword(newPassword);
    return await user.save({ session });
  }

  async update(
    conditions: FilterQuery<IUser>,
    toUpdate: UpdateQuery<IUser> | IUser,
    session?: ClientSession,
  ): Promise<UserDocument> {
    // setting returnOriginal to false ensures that the returned document is the one after update is applied
    const user = await this.userModel
      .findOneAndUpdate(conditions, toUpdate, {
        session,
        returnOriginal: false,
      })
      .exec();

    // null safety
    if (user === null) throw new NotFoundException('User not found');
    else return user;
  }

  async remove(
    conditions: FilterQuery<IUser>,
    session?: ClientSession,
  ): Promise<UserDocument> {
    const user = await this.userModel
      .findOneAndDelete(conditions, { session })
      .exec();

    // null safety
    if (user === null) throw new NotFoundException('User not found');
    else return user;
  }
}
