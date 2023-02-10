import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
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

  @Post('create')
  @UseJwtAuth()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemService.create(createItemDto);
  }

  @Get('published')
  async findPublished(
    @Query('sort') sort?: 'highest' | 'latest',
    @Query('paginate') page?: number,
  ) {
    return await this.itemService.findAll(
      { state: ItemState.published },
      page,
      sort,
    );
  }

  @Get('ongoing')
  @UseJwtAuth()
  async findOnGoing(
    @Query('sort') sort?: 'highest' | 'latest',
    @Query('paginate') page?: number,
  ) {
    return await this.itemService.findAll(
      {
        state: { $in: [ItemState.draft, ItemState.possession] },
      },
      page,
      sort,
    );
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

  @Patch('close')
  @UseJwtAuth()
  async close(
    @Body('itemId') id: Types.ObjectId,
    @Req() { user }: { user: UserDocument },
  ) {
    return await this.itemService.close(id, user._id);
  }

  @Delete('remove')
  @UseJwtAuth()
  async remove(@Body('itemId') id: Types.ObjectId) {
    return await this.itemService.remove(id);
  }
}
