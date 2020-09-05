import { Base } from '../../base/base.service';
import { Document } from './document';

describe('Document', () => {
  const id = 100;
  const baseId: number = id;
  const data = 'document data';
  const document: Document = new Document(id, baseId, data);
  it('has a valid constructor', () => {
    expect(document).toBeDefined();
    expect(document.id).toEqual(id);
    expect(document.baseId).toEqual(baseId);
    expect(document.document).toEqual(data);
  });
  it('returns a valid base object', async () => {
    const base: Base = await document.base();
    expect(base).toBeDefined();
    expect(base.ownerId).toEqual(baseId);
  });
});