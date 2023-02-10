import { IItem, ItemState } from '@item/schema/item.schema';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';

export class ItemDto implements IItem {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsMongoId()
  owner: Types.ObjectId;

  @IsMongoId()
  lastBid: Types.ObjectId;

  @IsOptional()
  @IsNumber()
  @Min(0)
  startingPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentPrice?: number;

  @IsEnum(ItemState)
  state: ItemState;
}
