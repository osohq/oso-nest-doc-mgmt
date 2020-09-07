import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const shouldLog = false;
  const app = await NestFactory.create(AppModule, {
    logger: shouldLog ? ['log', 'error', 'warn'] : false
  });
  await app.listen(3000);
}

bootstrap();
