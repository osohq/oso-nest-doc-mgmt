import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getLogger } from 'log4js';

getLogger().level = 'info';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
