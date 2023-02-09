import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guard/jwt.guard';

export const UseJwtAuth = () => UseGuards(JwtAuthGuard);
