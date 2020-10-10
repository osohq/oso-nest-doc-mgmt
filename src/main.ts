import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getLogger } from 'log4js';
import { AppModule } from './app.module';

// set the global logging level for log4js
getLogger().level = 'warn';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
