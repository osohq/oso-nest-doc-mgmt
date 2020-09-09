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