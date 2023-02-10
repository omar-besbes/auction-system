import { PartialType } from '@nestjs/mapped-types';
import { ItemDto } from '@item/dto/item.dto';
import { Types } from 'mongoose';
import { IsOptional } from 'class-validator';

export class CreateItemDto extends PartialType(ItemDto) {
  @IsOptional()
  lastBid: Types.ObjectId;
}
