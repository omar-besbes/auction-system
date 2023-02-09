import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BASIC_STRATEGY_NAME } from '@auth/strategy/basic.startegy';

@Injectable()
export class BasicAuthGuard extends AuthGuard(BASIC_STRATEGY_NAME) {}
