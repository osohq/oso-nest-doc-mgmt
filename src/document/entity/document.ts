import { Project } from '../../project/project.service';
import { User } from '../../users/entity/user';

export class Document {
  constructor(public readonly id: number,
              public readonly owner: User,
              public readonly project: Project,
              public readonly document: string,
              public readonly allowsDocumentComment: boolean,
              public readonly allowsInlineComment: boolean) {
  }
}