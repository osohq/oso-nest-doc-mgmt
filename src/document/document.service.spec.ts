import { Test, TestingModule } from '@nestjs/testing';
import { Comment, Document, DocumentService } from './document.service';
import { Base } from '../base/base.service';

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

describe('DocumentService', () => {
  let service: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentService],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to find a unique document by id', async () => {
    const id = 1;
    const document = await service.findOne(id);
    expect(document).toBeDefined();
    expect(document.id).toBeDefined();
    expect(document.id).toEqual(id);

    // make sure it doesn't always return the same doc
    const id2 = 2;
    const document2 = await service.findOne(id2);
    expect(document2).toBeDefined();
    expect(document2.id).toEqual(id2);
    expect(document2.id).not.toEqual(document.id);
  });

  it( 'should be able to get all documents', async () => {
    const documents: Document[] = await service.findAll();
    expect(documents).toBeDefined();
    expect(documents.length).toEqual(2);
  });

  it('should be able to create a new document', async () => {
    const baseId = 100;
    const data = 'a nice new document';
    const id = await service.create(baseId, data);
    expect(id).toBeDefined();

    const document = await service.findOne(id);
    expect(document).toBeDefined();
    expect(document.id).toEqual(id);
    expect(document.baseId).toEqual(baseId);
    expect(document.document).toEqual(data);
  });

  it('should be able to create and retrieve comments for a specific document', async () => {
    const document =  await service.findOne(1);
    expect(document).toBeDefined();

    const commentData = 'A nice new comment';
    const commentId = await service.createComment(document.id, commentData);
    expect(commentId).toBeDefined();

    // ensure comment retrieved is sane
    let comments = await service.findCommentsByDocument(document.id);
    expect(comments).toBeDefined();
    expect(comments.length).toEqual(1);
    expect(comments[0].id).toEqual(commentId);
    expect(comments[0].documentId).toEqual(document.id);
    expect(comments[0].data).toEqual(commentData);

    // ensure multiple comments retrieved are sane

    const comment2Data = 'Comment 2';
    const comment2Id = await service.createComment(document.id, comment2Data);
    comments = await service.findCommentsByDocument(document.id);
    expect(comments).toBeDefined();
    expect(comments.length).toEqual(2);
    expect(comments[1].id).toEqual(comment2Id);
    expect(comments[1].documentId).toEqual(document.id);
    expect(comments[1].data).toEqual(comment2Data);
  });
});
