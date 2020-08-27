import { Controller, Param, Get, Req, UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { OsoInstance, OsoGuard, Authorize } from 'src/oso/oso.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@UseGuards(LocalAuthGuard)
@UseGuards(OsoInstance)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get(':id')
  async findOne(@Param() param, @Authorize() authorize): Promise<string> {
    const document = await this.documentService.findOne(Number.parseInt(param.id));
    await authorize(document);
    return document.document;
  }
}
