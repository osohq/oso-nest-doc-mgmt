import { Document } from '../document/entity/document';
import { User } from '../users/entity/user';
import { Guest } from '../users/entity/guest';
import { OsoInstance } from './oso-instance';

const {getLogger} = require('log4js');
const logger = getLogger('oso.rules.spec');
getLogger().level = 'info';

describe('oso.rules.test', () => {
  let guest: Guest;
  let john: User, alexandra: User;
  let allPermissionsDoc: Document, noPermissionsDoc: Document, johnDocOne: Document, johnDocTwo: Document, alexandraDocOne: Document;
  let oso: OsoInstance;
  const actions = {
    addDocumentComment: 'addDocumentComment',
    addInlineComment: 'addInlineComment'
  };
  beforeEach(async () => {
    guest = new Guest();
    john = new User(1, 'john', 'pass');
    alexandra = new User(2, 'alexandra', 'pass');
    allPermissionsDoc = new Document(100, 100, 'I am a document with all comments allowed', true, true);
    noPermissionsDoc = new Document(101, 101, 'I am a document with no comments allowed', false, false);
    johnDocOne = new Document(1, 1, 'I am a document owned by john b/c my baseId is john\'s user id.', false, false);
    johnDocTwo = new Document(2, 1, 'I am also a document owned by john.', false, false);
    alexandraDocOne = new Document(3, 2, 'I am a document owned by alexandra', false, false);
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
      'read', new Document(1, 1, 'document text', false, false)))
      .toBeTruthy();
  }
  );
  it('should allow guests to read every Document', async () => {
    expect(await oso.isAllowed(new Guest(), 'read', new Document(1, 1, 'document text', false, false)))
      .toBeTruthy();
  });

  it('should allow all users to read every Document', async () => {
    expect(await oso.isAllowed(john, 'read', johnDocOne)).toBeTruthy();
    expect(await oso.isAllowed(alexandra, 'read', johnDocOne)).toBeTruthy();
  });

  it('should allow guests to "addDocumentComment" if document.allowsDocumentComment', async () => {
    expect(await oso.isAllowed(guest, actions.addDocumentComment, allPermissionsDoc)).toBeTruthy();
  });

  it ('should NOT allow guesets to "addDocumentComment" if ! document.allowsDocumentComment', async () => {
    expect(await oso.isAllowed(guest, actions.addDocumentComment, noPermissionsDoc)).toBeFalsy();
  });

  it('should allow guests to "addInlineComment" if document.allowsInlineComment', async () => {
    expect(await oso.isAllowed(guest, actions.addInlineComment, allPermissionsDoc)).toBeTruthy();
  });

  it( 'should NOT allow guests to "addInlineComment" if ! document.allowsInlineComment', async() => {
    expect(await oso.isAllowed(guest, actions.addInlineComment, noPermissionsDoc)).toBeFalsy();
  });
});