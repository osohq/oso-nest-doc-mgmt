import { Document } from '../entity/document';
import { IsBoolean, IsInt, IsNotEmpty} from 'class-validator';

export class CreateDocumentDto {

  @IsInt()
  public projectId: number;

  public ownerId: number;

  @IsNotEmpty()
  public document: string;
}

export class FindDocumentDto {

  public readonly id: number;
  public readonly ownerId: number;
  public readonly document: string;

  constructor(doc: Document) {
    this.id = doc.id;
    this.ownerId = doc.owner.id;
    this.document = doc.document;
  }

}

export class DocumentSetDto {
  public readonly documents: FindDocumentDto[]

  constructor(documents: Document[]) {
    this.documents = documents.map((document: Document) => new FindDocumentDto(document));
  }
}