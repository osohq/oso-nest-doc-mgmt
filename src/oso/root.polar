# policy

# Polyfill way to log all requests
allow(actor, action, resource) if
    console.log("allow( ", actor, ", ", action, ", ", resource, ")") = _
    and false;

### Everyone can getHello
allow(_user, "getHello", "AppController");


### Roles from ownership

# User gets owner role from ownerId attribute
role(user: User, "owner", project: Project) if
    project.ownerId = user.id;

# # Document roles from project roles
# User has a role for an document if they have the same
# role for the project
role(user: User, role, document: Document) if
    role(user, role, document.project);

## Role inheritance. Owner > Admin > Member > Guest

# User is an admin of a Project if they are the owner of that Project
role(user: User, "admin", project: Project) if
    role(user, "owner", project);

# User is a member of a Project if they are an admin of the project (transitively, all owners are members)
role(user: User, "member", project: Project) if
    role(user, "admin", project);

# User is an admin of a Document if they are an owner of that Document
role(user: User, "admin", document: Document) if
    role(user, "owner", document);

# User is a member of a Document if they are an admin of that Document
role(user: User, "member", document: Document) if
    role(user, "admin", document);

## Explicit membership role:
role(user: User, "member", project: Project) if
  project.isMember(user.id);

## Explicit Guest roles

# All users are a guest of all Documents
role(_user: User, "guest", _document: Document);

# The "Guest" actor has "guest" role
role(_guest: Guest, "guest", _document: Document);

## Permission groupings

# "Edit entities"
allow(user, action, document: Document) if
    action in [
        "editText",
        "createTags",
        "linkTags",
        "resolveComments",
        "delete",
        "rename",
        "changeVisibility",
        "modifyMetadata",
        "editTasks",
    ] and allow(user, "edit", document);

# "Edit projects"
allow(user, action, project: Project) if
    action in [
        "rename",
        "changeMembers",
        "changeMemberLevel",
    ] and allow(user, "edit", project);

# Administer entities
allow(user, action, document: Document) if
    action in [
        "changeMemberPermissionLevel",
        "deleteReplies",
        "changeProject",
        "deleteNotes"
    ] and allow(user, "edit", document);