#### Defines how a user can assume a particular role

### Roles from ownership

# User gets owner role from ownerId attribute
role(user: User, "owner", document: Document) if
    document.ownerId = user.id;

# User gets member role from project members
role(user: User, "member", project: Project) if
    project.isMember(user.id);

## Document roles from project roles
# User has a role for an document if they have the same
# role for the project
role(user: User, role, document: Document) if
    role(user, role, document.project);


## Role inheritance. Owner > Member > Guest

# User is a member of a Document if they are an owner  of that Document
role(user: User, "member", document: Document) if
    role(user, "owner", document);

#### Explicit Guest roles

# All users are a guest of all Documents
role(_user: User, "guest", _: Document);

# The "Guest" actor has "guest" role
role(_guest: Guest, "guest", _: Document);