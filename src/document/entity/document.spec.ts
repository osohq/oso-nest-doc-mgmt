import { mock } from 'jest-mock-extended';
import { Project } from '../../project/project.service';
import { User } from '../../users/entity/user';
import { Document } from './document';

describe('Document', () => {
  const id = 100;
  const owner: User = mock<User>();
  const project: Project = mock<Project>();
  const data = 'document data';

  const allPermsDoc: Document = new Document(id, owner, project, data, true, true);
  const noPermsDoc: Document = new Document(101, owner, project, 'I allow no comments', false, false);
  it('should have a valid constructor', () => {
    expect(allPermsDoc).toBeDefined();
    expect(allPermsDoc.id).toEqual(id);
    expect(allPermsDoc.project).toEqual(project);
    expect(allPermsDoc.document).toEqual(data);
    expect(allPermsDoc.allowsDocumentComment).toEqual(true);
    expect(allPermsDoc.allowsInlineComment).toEqual(true);

    expect(noPermsDoc.allowsDocumentComment).toEqual(false);
    expect(noPermsDoc.allowsInlineComment).toEqual(false);
  });
});