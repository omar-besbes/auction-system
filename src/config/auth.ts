import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface AuthConfig {
  secret: string;
  maximumAge: string;
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    secret: process.env.JWT_SECRET,
    maximumAge: process.env.JWT_MAXIMUM_AGE ?? '30m',
  }),
);
