import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { startSession, Types } from 'mongoose';
import { UserDocument } from '@user/schema/user.schema';
import { UseJwtAuth } from '@auth/decorator/jwt.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('bid')
@ApiTags('bid')
@UseJwtAuth()
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post('create')
  async create(@Body() createBidDto: CreateBidDto) {
    const session = await startSession();
    return await session.withTransaction(async (session) => {
      return await this.bidService.create(createBidDto, session);
    });
  }

  @Get('mine')
  findMine(@Req() { user }: { user: UserDocument }) {
    return this.bidService.findByBidder(user.id);
  }

  @Get('item')
  findByItem(@Body('itemId') id: Types.ObjectId) {
    return this.bidService.findByItem(id);
  }

  @Delete('remove')
  remove(@Body('itemId') id: Types.ObjectId) {
    return this.bidService.remove(id);
  }
}
