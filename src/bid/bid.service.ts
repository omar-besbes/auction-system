import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bid, BidDocument, BidModel, IBid } from '@bid/schema/bid.schema';
import { ClientSession, Types, UpdateQuery } from 'mongoose';
import { ItemService } from '@item/item.service';
import { ItemState } from '@item/schema/item.schema';

@Injectable()
export class BidService {
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: BidModel,
    private readonly itemService: ItemService,
  ) {}

  async create(
    bidData: CreateBidDto,
    session: ClientSession,
  ): Promise<BidDocument[]> {
    const item = await this.itemService.findById(bidData.item, session);

    if (item.owner === bidData.bidder)
      throw new BadRequestException('One can not bid on his own items');

    if (item.lastBid.price >= bidData.price)
      throw new BadRequestException(
        `The new must be higher than the current bid price (${item.lastBid.price})`,
      );

    if (item.timeWindow && item.timeWindow.getTime() < Date.now()) {
      await this.itemService.close(item.id, bidData.bidder, session);
      throw new BadRequestException('Bidding on this item is completed');
    }

    const [bid] = await this.bidModel.create([bidData], { session });
    item.lastBid = bid;
    item.currentPrice = bid.price;
    await item.save({ session });
    return [bid];
  }

  async findAll(session?: ClientSession): Promise<BidDocument[]> {
    return await this.bidModel.find({}, {}, { session }).exec();
  }

  async findByBidder(
    bidderId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<BidDocument[]> {
    return await this.bidModel
      .find({ bidder: bidderId }, {}, { session })
      .exec();
  }

  async findByItem(
    itemId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<BidDocument[]> {
    return await this.bidModel
      .find({ item: itemId, state: ItemState.published }, {}, { session })
      .exec();
  }

  async update(
    id: number,
    item: UpdateQuery<IBid>,
    session?: ClientSession,
  ): Promise<BidDocument> {
    return await this.bidModel.findByIdAndUpdate(id, item, { session }).exec();
  }

  async remove(
    id: Types.ObjectId,
    session?: ClientSession,
  ): Promise<BidDocument> {
    return await this.bidModel.findByIdAndDelete(id, { session }).exec();
  }
}
