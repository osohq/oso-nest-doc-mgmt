import { Injectable } from '@nestjs/common';
import { Base } from '../base/base.service';

export class Document {
  constructor(public id: number, public baseId, public document: string) {
  }

  async base(): Promise<Base> {
    return new Base(this.baseId)
  }
}

export class Comment {
  constructor(public id: number, public documentId: number, public data: string) {
  }
}

@Injectable()
export class DocumentService {
  private sequence: number = 0
  private readonly entities: Document[];
  private readonly comments: Comment[];

  constructor() {
    this.entities = [
      new Document(1, 1, "Hello, World!"),
      new Document(2, 2, "Goodbye, Moon!")
    ];
  }

  async create(baseId: number, document: string): Promise<number> {
    const id = this.sequence++
    this.entities.push(new Document(this.sequence, baseId, document))
    return id
  }

  async findOne(id: number): Promise<Document | undefined> {
    return this.entities.find(document => document.id === id);
  }

  async findAll(): Promise<Document[] | undefined> {
    return [...this.entities];
  }

  async findCommentsByDocument(documentId: number): Promise<Comment[] | undefined> {
    return this.comments.filter(comment => comment.documentId === documentId);
  }

  async addComment(documentId: number, data: string): Promise<number> {
    const id = this.sequence++
    this.comments.push(new Comment(id, documentId, data))
    return id
  }
}
