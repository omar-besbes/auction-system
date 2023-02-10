import { PartialType } from '@nestjs/mapped-types';
import { BidDto } from '@bid/dto/bid.dto';

export class CreateBidDto extends PartialType(BidDto) {}
