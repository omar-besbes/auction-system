import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export interface IBid {
  bidder: Types.ObjectId;
  item: Types.ObjectId;
  price: number;
}

export interface IBidMethods {}

export type BidModel = Model<IBid, Record<string, never>, IBidMethods>;

export type BidDocument = InstanceType<BidModel>;

@Schema({
  timestamps: true,
})
export class Bid implements IBid {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  bidder: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Item',
    required: true,
    index: true,
  })
  item: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
    min: 0,
  })
  price: number;
}

export const BidSchema = SchemaFactory.createForClass<IBid, BidModel>(Bid);
