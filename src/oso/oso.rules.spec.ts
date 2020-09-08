import { Document } from '../document/entity/document';
import { User } from '../users/entity/user';
import { OsoInstance } from './oso-instance';

const {getLogger} = require('log4js');
const logger = getLogger('oso.rules.spec');
getLogger().level = 'info';

describe('oso.rules.test', () => {
  let oso;
  beforeEach(async () => {
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
    expect(await oso.isAllowed(new User(1, 'john', 'changeme'), 'read', 'bar')).toBeTruthy();
  });

  it('should allow user "testuser" to read document.id = 1', async () => {
    expect(await oso.isAllowed(new User(1, 'testuser', 'changeme'),
      'read', new Document(1, 1, 'document text')))
      .toBeTruthy();
  }
  );

});