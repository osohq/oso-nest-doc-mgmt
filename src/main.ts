import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getLogger } from 'log4js';
import { AppModule } from './app.module';
import { UsersInterceptor } from './users/users-interceptor';

// set the global logging level for log4js
getLogger().level = 'info';

export async function configApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe()).useGlobalInterceptors(new UsersInterceptor());
}

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  await configApp(app);
  await app.listen(3000);
}

bootstrap();
