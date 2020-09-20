import { IsInt, IsString } from 'class-validator';

export class EditActionDto {

  public userId: number;

  @IsInt()
  public documentId: number;

  @IsString()
  public document: string;


}