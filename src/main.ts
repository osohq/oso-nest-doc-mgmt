import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getLogger } from 'log4js';
import { AppModule } from './app.module';
import { UsersInterceptor } from './users/users-interceptor';

// set the global logging level for log4js
getLogger().level = 'info';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()).useGlobalInterceptors(new UsersInterceptor());

  await app.listen(3000);
}

bootstrap();
