import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface MiscConfig {
  port: number;
}

export const miscConfig = registerAs(
  'misc',
  (): MiscConfig => ({
    port: parseInt(process.env.PORT) ?? 3000,
  }),
);
