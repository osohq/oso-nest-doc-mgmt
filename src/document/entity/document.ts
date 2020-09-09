import { Base } from '../../base/base.service';

export class Document {
  constructor(public id: number, public baseId: number, public document: string, public allowsDocumentComment: boolean) {
  }

  async base(): Promise<Base> {
    return new Base(this.baseId);
  }
}