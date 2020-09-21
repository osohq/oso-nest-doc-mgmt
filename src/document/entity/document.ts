import { Project } from '../../project/project.service';
import { User } from '../../users/entity/user';

export class Document {
  constructor(public readonly id: number,
              public readonly owner: User,
              public readonly project: Project,
              public document: string,
              public membersOnly: boolean) {
  }
}