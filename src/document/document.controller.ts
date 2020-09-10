import { Controller, Param, Get, UseGuards, Post, Body, Request } from '@nestjs/common';
import { getLogger } from 'log4js';
import { LocalRejectingAuthGuard, LocalResolvingAuthGuard } from '../auth/local-auth.guard';
import { OsoInstance } from '../oso/oso-instance';
import { CreateDocumentDto, DocumentSetDto } from './dto/document.dto';
import { DocumentService } from './document.service';
import { Action, Authorize, OsoGuard, Resource } from '../oso/oso.guard';

//@UseGuards(LocalRejectingAuthGuard)

@UseGuards(OsoInstance)
@UseGuards(LocalResolvingAuthGuard)
@Controller('document')
export class DocumentController {

  private readonly logger = getLogger(DocumentController.name);

  constructor(private readonly documentService: DocumentService) {
  }

  @Get(':id')
  async findOne(@Param() param: any, @Authorize('read') authorize: any): Promise<string> {
    const document = await this.documentService.findOne(Number.parseInt(param.id));
    await authorize(document);
    return document ? document.document : undefined;
  }

  @Get()
  async findAll(@Authorize('read') authorize: any): Promise<DocumentSetDto> {
    return new DocumentSetDto((await this.documentService.findAll()).filter((document) => {
      try {
        authorize(document);
        return document;
      } catch (e) {
        this.logger.info('Unauthorized document access: ', e);
      }
    }));
  }

  @UseGuards(OsoGuard)
  @Action('create')
  @Resource('Document')
  @Post('create')
  async create(@Request() request, @Body() document: CreateDocumentDto): Promise<number> {
    document.baseId = request.user.id;
    return this.documentService.create(document);
  }
}
