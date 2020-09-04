import { Controller, Param, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { CreateDocumentDto } from './dto/document.dto';
import { Document, DocumentService } from './document.service';
import { OsoInstance, Authorize } from '../oso/oso.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';


//@UseGuards(OsoInstance)
@Controller('document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {
  }

  @UseGuards(LocalAuthGuard)
  @Get(':id')
  async findOne(@Param() param, @Authorize() authorize): Promise<string> {
    const document = await this.documentService.findOne(Number.parseInt(param.id));
    await authorize(document);
    return document.document;
  }

  @Get()
  async findAll(): Promise<Document[]> {
    return await this.documentService.findAll()
  }

  @UseGuards(LocalAuthGuard)
  @Post('create')
  async create(@Body() document: CreateDocumentDto): Promise<number> {
    return this.documentService.create(document.basId, document.document)
  }
}
