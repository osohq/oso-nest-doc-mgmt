# policy

# Polyfill way to log all requests
allow(actor, action, resource) if
    console.log("allow( ", actor, ", ", action, ", ", resource, ")") = _
    and false;

### Everyone can getHello
allow(_user, "getHello", "AppController");


### Roles from ownership

# User gets owner role from ownerId attribute
role(user: User, "owner", base: Base) if
    base.ownerId = user.id;

# # Document roles from base roles
# User has a role for an document if they have the same
# role for the base
role(user: User, role, document: Document) if
    role(user, role, document.base());

## Role inheritance. Owner > Admin > Member > Guest

# User is an admin of a Base if they are the owner of that Base
role(user: User, "admin", base: Base) if
    role(user, "owner", base);

# User is a member of a Base if they are an admin of the base (transitively, all owners are members)
role(user: User, "member", base: Base) if
    role(user, "admin", base);

# User is an admin of a Document if they are an owner of that Document
role(user: User, "admin", document: Document) if
    role(user, "owner", document);

# User is a member of a Document if they are an admin of that Document
role(user: User, "member", document: Document) if
    role(user, "admin", document);

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

# "Edit bases"
allow(user, action, base: Base) if
    action in [
        "rename",
        "changeMembers",
        "changeMemberLevel",
    ] and allow(user, "edit", base);

# Administer entities
allow(user, action, document: Document) if
    action in [
        "changeMemberPermissionLevel",
        "deleteReplies",
        "changeBase",
        "deleteNotes"
    ] and allow(user, "edit", document);