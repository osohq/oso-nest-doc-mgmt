import { Base } from '../../base/base.service';
import { Document } from './document';

describe('Document', () => {
  const id = 100;
  const baseId: number = id;
  const data = 'document data';
  const allPermsDoc: Document = new Document(id, baseId, data, true, true);
  const noPermsDoc: Document = new Document(100, 100, 'I allow no comments', false, false);
  it('should have a valid constructor', () => {
    expect(allPermsDoc).toBeDefined();
    expect(allPermsDoc.id).toEqual(id);
    expect(allPermsDoc.baseId).toEqual(baseId);
    expect(allPermsDoc.document).toEqual(data);
    expect(allPermsDoc.allowsDocumentComment).toEqual(true);
    expect(allPermsDoc.allowsInlineComment).toEqual(true);

    expect(noPermsDoc.allowsDocumentComment).toEqual(false);
    expect(noPermsDoc.allowsInlineComment).toEqual(false);
  });

  it('should return a valid base object', async () => {
    const base: Base = await allPermsDoc.base();
    expect(base).toBeDefined();
    expect(base.ownerId).toEqual(baseId);
  });
});