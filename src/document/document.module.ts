import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OsoInstance } from 'src/oso/oso.guard';

@Module({
  imports: [],
  controllers: [DocumentController],
  providers: [DocumentService, OsoInstance],
})
export class DocumentModule {}
