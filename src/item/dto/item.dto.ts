import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';

export class ItemDto extends PartialType(CreateItemDto) {}
