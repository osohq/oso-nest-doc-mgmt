import { Injectable } from '@nestjs/common';
import { Document } from './entity/document';
import { Comment } from './entity/comment';

@Injectable()
export class DocumentService {
  private sequence = 100
  private readonly entities: Document[];
  private readonly comments: Comment[];

  constructor() {
    this.entities = [
      new Document(1, 1, 'Hello, World!', false, false),
      new Document(2, 2, 'Goodbye, Moon!', false, false)
    ];
    this.comments = [];
  }

  async create(baseId: number, document: string): Promise<number> {
    const id = ++this.sequence;
    this.entities.push(new Document(this.sequence, baseId, document, false, false));
    return id;
  }

  async findOne(id: number): Promise<Document | undefined> {
    return this.entities.find(document => document.id === id);
  }

  async findAll(): Promise<Document[]> {
    return [...this.entities];
  }

  async findCommentsByDocument(documentId: number): Promise<Comment[]> {
    return this.comments.filter(comment => comment.documentId === documentId);
  }

  async createComment(documentId: number, data: string): Promise<number> {
    const id = ++this.sequence;
    this.comments.push(new Comment(id, documentId, data));
    return id;
  }
}
