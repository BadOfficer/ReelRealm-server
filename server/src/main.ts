import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log']
  });
  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(config.getOrThrow("COOKIES_SECRET")))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
