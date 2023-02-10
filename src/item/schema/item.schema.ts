import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { BidDocument } from '@bid/schema/bid.schema';

export enum ItemState {
  possession = 'possession',
  draft = 'draft',
  published = 'published',
}

export interface IItem {
  name: string;
  description: string;
  owner: Types.ObjectId;
  lastBid?: Types.ObjectId;
  startingPrice?: number;
  currentPrice?: number;
  timeWindow?: Date;
  state: ItemState;
}

export interface IItemMethods {
  makeDraft(startingPrice: number): void;

  publish(startingPrice?: number): void;

  cancelBid(): void;

  sell(price: number): void;

  canBid(price: number): boolean;
}

export type ItemModel = Model<IItem, Record<string, never>, IItemMethods>;

export type ItemDocument = InstanceType<ItemModel>;

export type PopulatedItemDocument = Omit<ItemDocument, 'lastBid'> & {
  lastBid: BidDocument;
};

@Schema({
  timestamps: true,
})
export class Item implements IItem {
  @Prop({
    type: String,
    required: true,
    maxlength: 100,
  })
  name: string;
  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  owner: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Bid',
  })
  lastBid?: Types.ObjectId;

  @Prop({
    type: Number,
    min: 0,
  })
  startingPrice?: number;

  @Prop({
    type: Number,
    min: 0,
  })
  currentPrice?: number;

  @Prop({
    type: String,
    enum: ItemState,
    required: true,
    default: ItemState.draft,
  })
  state: ItemState;

  @Prop({
    type: Date,
    default: new Date(Date.now() + 7 * 24 * 3600 * 1000),
  })
  timeWindow: Date;
}

export const ItemSchema = SchemaFactory.createForClass<IItem, ItemModel>(Item);

ItemSchema.method('makeDraft', function (startingPrice: number): void {
  const self: ItemDocument = this;
  self.startingPrice = startingPrice;
  self.state = ItemState.draft;
});

ItemSchema.method('publish', function (startingPrice?: number): void {
  const self: ItemDocument = this;
  if (startingPrice) self.startingPrice = startingPrice;
  self.state = ItemState.published;
});

ItemSchema.method('cancelBid', function (): void {
  const self: ItemDocument = this;
  delete self.startingPrice;
  delete self.currentPrice;
  self.state = ItemState.possession;
});

ItemSchema.method('sell', function (price: number): void {
  const self: ItemDocument = this;
  if (price < self.startingPrice)
    throw new BadRequestException(
      'Can not sell an item for a price lower than its starting price',
    );
  delete self.startingPrice;
  delete self.currentPrice;
  self.state = ItemState.possession;
});

ItemSchema.method('canBid', function (price: number): boolean {
  const self: ItemDocument = this;
  return (
    self.state === ItemState.published &&
    (self.currentPrice ?? self.startingPrice) < price
  );
});
