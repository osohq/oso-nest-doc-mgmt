import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { LocalResolvingAuthGuard } from '../auth/local-auth.guard';
import { LocalStrategy } from '../auth/local.strategy';
import { OsoInstance } from '../oso/oso-instance';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [AuthModule],
  controllers: [DocumentController],
  providers: [DocumentService, OsoInstance],
})
export class DocumentModule {}
