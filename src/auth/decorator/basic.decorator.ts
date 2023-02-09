import { UseGuards } from '@nestjs/common';
import { BasicAuthGuard } from '@auth/guard/basic.guard';

export const UseBasicAuth = () => UseGuards(BasicAuthGuard);
