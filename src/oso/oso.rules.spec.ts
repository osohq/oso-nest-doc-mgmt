const {Oso} = require('oso');
const {getLogger} = require('log4js');
const logger = getLogger('oso.rules.test');
getLogger().level = 'info';

describe('oso.rules.test', () => {
  let oso;
  beforeEach(async () => {
    oso = new Oso();
    oso.registerClass(User);
    oso.registerClass(DocumentResource);
    await oso.loadFile(`${__dirname}/root.polar`);
    await oso.loadFile(`${__dirname}/policy.polar`);
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


});


class DocumentResource {
  constructor(id, baseId, document) {
  }
}

class User {
  constructor(id, username, password) {
  }
}

//
// test().then(() => {
//   logger.info('Test complete.');
// }).catch(e => console.error(e));