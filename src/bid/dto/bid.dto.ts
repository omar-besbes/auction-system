import { IBid } from '@bid/schema/bid.schema';
import { Types } from 'mongoose';
import { IsMongoId, IsNumber, Min } from 'class-validator';

export class BidDto implements IBid {
  @IsMongoId()
  bidder: Types.ObjectId;

  @IsMongoId()
  item: Types.ObjectId;

  @IsNumber()
  @Min(0)
  price: number;
}
