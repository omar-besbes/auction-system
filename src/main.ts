import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow('misc').port;
  const config = new DocumentBuilder()
    .setTitle('Auction System')
    .setDescription('The bidding API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
}

bootstrap();
