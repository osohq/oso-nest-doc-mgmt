import {Document} from '../entity/document';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {

  @IsInt()
  public baseId: number;

  @IsNotEmpty()
  public document: string;

  @IsBoolean()
  public allowsDocumentComment: boolean;

  @IsBoolean()
  public allowsInlineComment: boolean;
}

export class FindDocumentDto {

  public readonly document: string;
  public readonly allowsDocumentComment: boolean;
  public readonly allowsInlineComment: boolean;

  constructor(doc: Document) {
    this.document = doc.document;
    this.allowsDocumentComment = doc.allowsDocumentComment;
    this.allowsInlineComment = doc.allowsInlineComment;
  }

}

export class DocumentSetDto {
  public readonly documents: FindDocumentDto[]
  constructor(documents: Document[]) {
    this.documents = documents.map((document: Document) => new FindDocumentDto(document));
  }
}