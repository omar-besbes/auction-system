import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from '@bid/schema/bid.schema';
import { ItemModule } from '@item/item.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }]),
    ItemModule,
  ],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
