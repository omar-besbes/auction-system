import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  IItem,
  Item,
  ItemDocument,
  ItemModel,
  ItemState,
  PopulatedItemDocument,
} from '@item/schema/item.schema';
import { ClientSession, FilterQuery, Types, UpdateQuery } from 'mongoose';
import { BidDocument } from '@bid/schema/bid.schema';

@Injectable()
export class ItemService {
  constructor(@InjectModel(Item.name) private readonly itemModel: ItemModel) {}

  async create(
    itemData: CreateItemDto,
    session?: ClientSession,
  ): Promise<ItemDocument[]> {
    return await this.itemModel.create([itemData], { session });
  }

  async findAll(
    conditions: FilterQuery<IItem>,
    session?: ClientSession,
  ): Promise<PopulatedItemDocument[]> {
    return await this.itemModel
      .find(conditions, {}, { session })
      .populate<{ lastBid: BidDocument }>({ path: 'lastBid' })
      .exec();
  }

  async findById(
    id: Types.ObjectId,
    session?: ClientSession,
  ): Promise<PopulatedItemDocument> {
    return await this.itemModel
      .findById(id, {}, { session })
      .populate<{ lastBid: BidDocument }>({ path: 'lastBid' })
      .exec();
  }

  async findByOwner(
    ownerId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<PopulatedItemDocument[]> {
    return await this.itemModel
      .find({ owner: ownerId }, {}, { session })
      .populate<{ lastBid: BidDocument }>({ path: 'lastBid' })
      .exec();
  }

  async update(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    item: UpdateQuery<IItem>,
    session?: ClientSession,
  ): Promise<PopulatedItemDocument> {
    return await this.itemModel
      .findOneAndUpdate({ _id: id, owner: userId }, { ...item }, { session })
      .populate<{ lastBid: BidDocument }>({ path: 'lastBid' })
      .exec();
  }

  async close(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<ItemDocument> {
    const item = await this.itemModel
      .findById(id, {}, { session })
      .populate<{ lastBid: BidDocument }>({ path: 'lastBid' })
      .exec();

    if (item.owner !== userId)
      throw new BadRequestException('You are not the owner of this item');

    item.owner = item.lastBid.bidder;
    item.state = ItemState.possession;
    delete item.startingPrice;
    return await item.save({ session });
  }

  async remove(
    id: Types.ObjectId,
    session?: ClientSession,
  ): Promise<ItemDocument> {
    return await this.itemModel
      .findOneAndDelete(
        { _id: id, state: { $in: [ItemState.draft, ItemState.possession] } },
        { session },
      )
      .exec();
  }
}
