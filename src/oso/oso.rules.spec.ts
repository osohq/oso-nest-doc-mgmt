import { Document } from '../document/entity/document';
import { User } from '../users/entity/user';
import { Guest } from '../users/entity/guest';
import { OsoInstance } from './oso-instance';
import { Project } from '../project/project.service';

const {getLogger} = require('log4js');
const logger = getLogger('oso.rules.spec');
getLogger().level = 'info';

describe('oso.rules.test', () => {
  let guest: Guest;
  let john: User, alexandra: User, misha: User;
  let project: Project;
  let allPermissionsDoc: Document, noPermissionsDoc: Document, johnDocOne: Document, johnDocTwo: Document,
    alexandraDocOne: Document;
  let oso: OsoInstance;
  const actions = {
    edit: 'edit',
  };
  beforeEach(async () => {
    const projectId = 1;
    guest = new Guest();
    john = new User(1, 'john', 'pass');
    alexandra = new User(2, 'alexandra', 'pass');
    misha = new User(3, 'misha', 'pass');

    // create a project owned by alexandra
    project = new Project('A', projectId, alexandra.id);
    project.addMember(john.id);
    expect(project.getMembers()).toContain(alexandra.id);
    expect(project.getMembers()).toContain(john.id);
    expect(project.getMembers()).not.toContain(misha.id);

    //allPermissionsDoc = new Document(100, alexandra, project, 'I am a document with all comments allowed');
    johnDocOne = new Document(1, john, project, 'I am a document owned by john b/c my baseId is john\'s user id.');
    johnDocTwo = new Document(2, john, project, 'I am also a document owned by john.');
    alexandraDocOne = new Document(3, alexandra, project, 'I am a document owned by alexandra');
    oso = new OsoInstance();
    await oso.initialized();
  });

  it('should not allow by default', async () => {
    expect(await oso.isAllowed('no', 'matching', 'rule')).toEqual(false);
  });

  it('should allow something super basic', async () => {
    const isAllowed = await oso.isAllowed('foo', 'read', 'bar');
    expect(isAllowed).toEqual(true);
  });

  it('should allow any User to read any "bar"', async () => {
    expect(await oso.isAllowed(john, 'read', 'bar')).toEqual(true);
  });

  it('should allow user "testuser" to read document.id = 1', async () => {
    expect(await oso.isAllowed(new User(1, 'testuser', 'changeme'),
      'read', new Document(1, john, project, 'document text')))
      .toEqual(true);
  }
  );
  it('should allow guests to read every Document', async () => {
    expect(await oso.isAllowed(new Guest(), 'read', new Document(1, john, project, 'document text')))
      .toEqual(true);
  });

  it('should allow all users to read every Document', async () => {
    expect(await oso.isAllowed(john, 'read', johnDocOne)).toEqual(true);
    expect(await oso.isAllowed(alexandra, 'read', johnDocOne)).toEqual(true);
  });

  it('should only allow users to edit the resource "Document"', async () => {
    expect(await oso.isAllowed(alexandra, actions.edit, Document.name)).toEqual(true);
    expect(await oso.isAllowed(john, actions.edit, Document.name)).toEqual(true);
    expect(await oso.isAllowed(guest, actions.edit, Document.name)).toEqual(false);
  });

  it('should allow members to edit documents', async () => {
    expect(await oso.isAllowed(alexandra, actions.edit, alexandraDocOne)).toEqual(true);
    expect(await oso.isAllowed(john, actions.edit, alexandraDocOne)).toEqual(true);
  });

  it('should NOT allow non-members to edit documents', async() => {
    expect(await oso.isAllowed(misha, actions.edit, alexandraDocOne)).toEqual(false);
  });
});