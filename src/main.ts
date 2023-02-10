import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // get port
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow('misc').port;

  // setup global validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // swagger integration
  const config = new DocumentBuilder()
    .setTitle('Auction System')
    .setDescription('The bidding API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // app launching
  await app.listen(port);
}

bootstrap();
