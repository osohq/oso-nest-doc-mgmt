import { Module } from '@nestjs/common';
import { OsoInstance } from '../oso/oso-instance';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';

@Module({
  imports: [],
  controllers: [DocumentController],
  providers: [DocumentService, OsoInstance],
})
export class DocumentModule {}
