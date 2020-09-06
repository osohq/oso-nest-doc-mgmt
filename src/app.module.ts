import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OsoInstance } from './oso/oso-instance';
import { OsoGuard} from './oso/oso.guard';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentService } from './document/document.service';
import { DocumentController } from './document/document.controller';
import { DocumentModule } from './document/document.module';
import { OsoModule } from './oso/oso.module';
import { BaseModule } from './base/base.module';

@Module({
  imports: [AuthModule, UsersModule, DocumentModule, OsoModule, BaseModule],
  controllers: [AppController, DocumentController],
  providers: [AppService, OsoGuard, OsoInstance, DocumentService],
  exports: [],
})
export class AppModule {}
