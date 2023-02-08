import { Module } from '@nestjs/common';
import { AppController } from '@app.controller';
import { AppService } from '@app.service';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { ItemModule } from '@item/item.module';
import { BidModule } from '@bid/bid.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { authConfig } from '@config/auth';
import { MongooseModule } from '@nestjs/mongoose';
import { miscConfig } from '@config/misc';
import { databaseConfig } from '@config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      load: [authConfig, miscConfig, databaseConfig],
      expandVariables: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('database').uri,
      }),
    }),
    UserModule,
    AuthModule,
    ItemModule,
    BidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
