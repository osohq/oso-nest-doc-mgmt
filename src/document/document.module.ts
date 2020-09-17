import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OsoInstance } from '../oso/oso-instance';
import { ProjectModule } from '../project/project.module';
import { UsersModule } from '../users/users.module';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [AuthModule, ProjectModule, UsersModule],
  controllers: [DocumentController],
  providers: [DocumentService, OsoInstance]
})
export class DocumentModule {}
