import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UseJwtAuth } from '@auth/decorator/jwt.decorator';
import { UserDocument } from '@user/schema/user.schema';
import { Types } from 'mongoose';
import { ItemState } from '@item/schema/item.schema';
import { ApiTags } from '@nestjs/swagger';

@Controller('item')
@ApiTags('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseJwtAuth()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.create(createItemDto);
  }

  @Get('published')
  async findPublished() {
    return await this.itemService.findAll({ state: ItemState.published });
  }

  @Get('ongoing')
  @UseJwtAuth()
  async findOnGoing() {
    return await this.itemService.findAll({
      state: { $in: [ItemState.draft, ItemState.possession] },
    });
  }

  @Get('mine')
  @UseJwtAuth()
  async findMine(@Req() { user }: { user: UserDocument }) {
    return await this.itemService.findByOwner(user.id);
  }

  @Patch('publish')
  @UseJwtAuth()
  async publish(
    @Body('itemId') id: Types.ObjectId,
    @Req() { user }: { user: UserDocument },
  ) {
    return await this.itemService.update(id, user._id, {
      state: ItemState.published,
    });
  }

  @Delete('remove')
  @UseJwtAuth()
  async remove(@Body('itemId') id: Types.ObjectId) {
    return await this.itemService.remove(id);
  }
}
