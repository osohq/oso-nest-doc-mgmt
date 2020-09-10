import { Controller, Param, Get, UseGuards, Post, Body } from '@nestjs/common';
import { OsoInstance } from '../oso/oso-instance';
import { CreateDocumentDto, DocumentSetDto } from './dto/document.dto';
import { DocumentService } from './document.service';
import { Action, Authorize } from '../oso/oso.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';

@UseGuards(OsoInstance)
//@UseGuards(LocalAuthGuard)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {
  }

  @Get(':id')
  async findOne(@Param() param: any, @Authorize('read') authorize: any): Promise<string> {
    const document = await this.documentService.findOne(Number.parseInt(param.id));
    await authorize(document);
    return document ? document.document : undefined;
  }

  @Action('read')
  @Get()
  async findAll(): Promise<DocumentSetDto> {
    return new DocumentSetDto(await this.documentService.findAll());
  }

  @Action('create')
  @Post('create')
  async create(@Body() document: CreateDocumentDto): Promise<number> {
    return this.documentService.create(document);
  }
}
