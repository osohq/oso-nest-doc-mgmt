import { Test, TestingModule } from '@nestjs/testing';
import { Document } from '../document/entity/document';
import { User } from '../users/entity/user';
import { OsoInstance } from './oso-instance';
import { OsoModule } from './oso.module';

describe('Oso Policy', () => {
  let oso: OsoInstance;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [OsoModule],
      exports: [OsoModule]
    }).compile();

    oso = module.get<OsoInstance>(OsoInstance);
  });

  it('does stuff', async () => {
    const user: User = new User(1, 'john', 'changeme');
    const document: Document = new Document(1, 1, 'the doc', true);
    const isAllowed = await oso.isAllowed(user, 'read', document);
    console.log('isAllowed: ', isAllowed);
    expect(isAllowed).toBeTruthy();
  });

});