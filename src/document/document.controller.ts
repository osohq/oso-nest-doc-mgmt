import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { getLogger } from 'log4js';
import { LocalRejectingAuthGuard, LocalResolvingAuthGuard } from '../auth/local-auth.guard';
import { OsoInstance } from '../oso/oso-instance';
import { Action, Authorize, OsoGuard, Resource } from '../oso/oso.guard';
import { DocumentService } from './document.service';
import { Document } from './entity/document';
import { CreateDocumentDto, DocumentSetDto, FindDocumentDto } from './dto/document.dto';
import { EditActionDto } from './dto/edit-action.dto';

@UseGuards(LocalResolvingAuthGuard, OsoInstance)
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
    const authorized: Document[] = [];
    for (const document of await this.documentService.findAll()) {
      try {
        await authorize(document);
        authorized.push(document);
      } catch (err) {
        this.logger.info('document is NOT authorized: ', document);
      }
    }
    return new DocumentSetDto(authorized);
  }

  @UseGuards(LocalRejectingAuthGuard, OsoGuard)
  @Action('create')
  @Resource('Document')
  @Post('create')
  async create(@Request() request, @Body() document: CreateDocumentDto): Promise<number> {
    // TODO: project id should be set by the request. Or, use the user's default project.
    document.ownerId = request.user.id;
    document.projectId = request.user.id;
    return this.documentService.create(document);
  }

  @UseGuards(LocalRejectingAuthGuard, OsoGuard)
  @Action('edit')
  @Resource('Document')
  @Post('edit')
  async edit(@Authorize('edit')authorize,
             @Request() request,
             @Body() editAction: EditActionDto): Promise<FindDocumentDto> {
    this.logger.info('Attempt to edit document: id: ', editAction.documentId);
    const document = await this.documentService.findOne(editAction.documentId);
    this.logger.info('Checking authorization on document: ', document);
    await authorize(document);
    editAction.userId = request.user.id;
    return new FindDocumentDto(await this.documentService.edit(editAction));
  }
}
