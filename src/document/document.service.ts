import { Injectable } from '@nestjs/common';
import { Base } from '../base/base.service';

export class Document {
  constructor(public id: number, public baseId, public document: string) { }

  async base(): Promise<Base> {
    return new Base(this.baseId)
  }
}

@Injectable()
export class DocumentService {
  private readonly entities: Document[];

  constructor() {
    this.entities = [
      new Document(1, 1, "Hello, World!"),
      new Document(2, 2, "Goodbye, Moon!")
    ];
  }

  async findOne(id: number): Promise<Document | undefined> {
    return await this.entities.find(document => document.id === id);
  }
}
