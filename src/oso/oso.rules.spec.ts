import { Document } from '../document/entity/document';
import { User } from '../users/entity/user';
import { Guest } from '../users/entity/guest';
import { OsoInstance } from './oso-instance';

const {getLogger} = require('log4js');
const logger = getLogger('oso.rules.spec');
getLogger().level = 'info';

describe('oso.rules.test', () => {
  let john: User, alexandra: User;
  let johnDocOne: Document, johnDocTwo: Document, alexandraDocOne: Document;
  let oso: OsoInstance;
  beforeEach(async () => {
    john = new User(1, 'john', 'pass');
    alexandra = new User(2, 'alexandra', 'pass');
    johnDocOne = new Document(1, 1, 'I am a document owned by john b/c my baseId is john\'s user id.');
    johnDocTwo = new Document(2, 1, 'I am also a document owned by john.');
    alexandraDocOne = new Document(3, 2, 'I am a document owned by alexandra');
    oso = new OsoInstance();
    await oso.initialized();
  });

  it('should not allow by default', async () => {
    expect(await oso.isAllowed('no', 'matching', 'rule')).toBeFalsy();
  });

  it('should allow something super basic', async () => {
    const isAllowed = await oso.isAllowed('foo', 'read', 'bar');
    expect(isAllowed).toBeTruthy();
  });

  it('should allow any User to read any "bar"', async () => {
    expect(await oso.isAllowed(john, 'read', 'bar')).toBeTruthy();
  });

  it('should allow user "testuser" to read document.id = 1', async () => {
    expect(await oso.isAllowed(new User(1, 'testuser', 'changeme'),
      'read', new Document(1, 1, 'document text')))
      .toBeTruthy();
  }
  );
  it('should allow guests to read every Document', async () => {
    expect(await oso.isAllowed(new Guest(), 'read', new Document(1, 1, 'document text')))
      .toBeTruthy();
  });

  it('should allow users to read every Document', async () => {
    expect(await oso.isAllowed(john, 'read', johnDocOne)).toBeTruthy();
    expect(await oso.isAllowed(alexandra, 'read', johnDocOne)).toBeTruthy();
  });

});