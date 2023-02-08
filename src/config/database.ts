import { registerAs } from '@nestjs/config';
import * as process from 'process';

export interface DatabaseConfig {
  uri: string;
}

export const databaseConfig = registerAs(
  'database',
  (): DatabaseConfig => ({
    uri: process.env.MONGO_URI,
  }),
);
