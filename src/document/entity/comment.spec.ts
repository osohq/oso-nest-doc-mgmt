import { Comment } from './comment';

describe('Comment', () => {
  it('has  a valid constructor', () => {
    const id = 1000;
    const documentId = 100;
    const data = 'A nice comment.';
    const comment: Comment = new Comment(id, documentId, data);
    expect(comment).toBeDefined();
    expect(comment.id).toEqual(id);
    expect(comment.documentId).toEqual(documentId);
    expect(comment.data).toEqual(data);
  });
});