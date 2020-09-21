import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';
import { Document } from '../entity/document';

export class CreateDocumentDto {

  @IsInt()
  public projectId: number;

  public ownerId: number;

  @IsNotEmpty()
  public document: string;

  @IsBoolean()
  public membersOnly: boolean
}

export class FindDocumentDto {

  public readonly id: number;
  public readonly ownerId: number;
  public readonly document: string;
  public readonly membersOnly: boolean;

  constructor(doc: Document) {
    this.id = doc.id;
    this.ownerId = doc.owner.id;
    this.document = doc.document;
    this.membersOnly = doc.membersOnly;
  }

}

export class DocumentSetDto {
  public readonly documents: FindDocumentDto[]

  constructor(documents: Document[]) {
    this.documents = documents.map((document: Document) => new FindDocumentDto(document));
  }
}