import { mock } from 'jest-mock-extended';
import { Project } from '../../project/project.service';
import { User } from '../../users/entity/user';
import { Document } from './document';

describe('Document', () => {
  const id = 100;
  const owner: User = mock<User>();
  const project: Project = mock<Project>();
  const data = 'document data';

  const doc: Document = new Document(id, owner, project, data);
  it('should have a valid constructor', () => {
    expect(doc).toBeDefined();
    expect(doc.id).toEqual(id);
    expect(doc.project).toEqual(project);
    expect(doc.document).toEqual(data);
  });
});