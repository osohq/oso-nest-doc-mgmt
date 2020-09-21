## Introduction

This demo app provides an example implementation of oso authorization in the context of NestJS, a popular
Node.js progressive framework

The tutorial below examines possible use-cases, including [RBAC](https://docs.osohq.com/using/examples/rbac.html) and 
[ABAC](https://docs.osohq.com/using/examples/abac.html) with concrete implementations.

The problem domain is a document management system that requires various kinds of access permissions in order to perform
certain actions documents. Those roles and permissions are described by rules written in Oso's policy language, 
[Polar](https://docs.osohq.com/using/polar-syntax.html) 

### Installation

1. Clone this repository and install dependencies:
    ```
    %> git clone https://github.com/oletizi/oso-nest-demo.git && cd oso-nest-demo && yarn install
    ```
    
1. Start the server:
    ```
    %> yarn run start
    ```
   
1. Make a test request:
    ```
    %> curl http://localhost:3000/
    Hello World!
    ```

### NestJS and the Demo App

[NestJS](https://docs.nestjs.com/) applications are built using [modules](https://docs.nestjs.com/modules) that (usually) 
specify a [controller](https://docs.nestjs.com/controllers) that handles incoming requests by calling out to various
["providers"](https://docs.nestjs.com/providers). Nest makes exensive use of [decoorators](https://docs.nestjs.com/custom-decorators)
to specify routing and other behavior. It also uses [dependency injection](https://docs.nestjs.com/fundamentals/custom-providers) 
and autowiring to build application objects and their relationships at runtime.

This demo app has five modules in addition to the main App module:

  1. [`AuthModule`](./src/auth/)&mdash;authenticates users and guards access to resources based on authentication.
  1. [`DocumentModule`](./src/document/)&mdash;provides access to user documents.
  1. [`OsoModule`](./src/oso/)&mdash;configures oso and provides resources for authorizing access to documents based on 
  users, projects, and document status.
  1. [`ProjectModule`](./src/project/)&mdash;manages "projects" that have user membership and contain user documents.  
  1. [`UsersModule`](./src/users/)&mdash;manages users.

## Authentication

Nestjs has [built-in support for authentication](https://docs.nestjs.com/techniques/authentication). We've implemented
the toy authentication mechanism from the NestJS docs (i.e.&mdash;do not use in production!) that validates the username 
and password supplied in the request body against a static set of users.

The [DocumentController](./src/document/document.controller.ts) uses two variations of authentication guard via the
`@UseGuards` decorator:

  1. [`LocalResolvingAuthGuard`](src/auth/local-auth.guard.ts). This guard is responsible for resolving a (possibly) valid
  user from the request credentials and populating the `Request.user` field with either the valid [`User`](src/users/entity/user.ts)
  object or a [`Guest`](src/users/entity/guest.ts) object:
  
    ```
      canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const credentials = resolveCredentials(context);
        this.logger.info('validating credentials...');
        return this.myStrategy.validate(credentials.username, credentials.password)
          .then((user) => {
            context.switchToHttp().getRequest().user = user;
            this.logger.info('validated user: ', user);
            return true;
          })
          // Unauthenticated users are still allowed access to the resource; but request.user remains Guest
          .catch(() => true);
      }
    ```
    
  The LocalResolvingAuthGuard is active on all methods of the [`DocumentController`](src/document/document.controller.ts)
  via the `@UseGuards` decorator above the `DocumentController` class declaration.
  
  1. [LocalRejectingAuthGuard](src/auth/local-auth.guard.ts). This guard blocks access to resources that require
  valid credentials. It is placed on [`DocumentController.create` and `DocumentController.edit`](src/document/document.controller.ts)

Using these two authentication guards, we allow all users AND guests access to the read-only resources:

    curl http://localhost:3000/document
    curl http://localhost:3000/document/1

while blocking unauthenticated users from resources that create or modify:

    curl -X POST http://localhost:3000/document/create -d '{"username": "john", "password": "changeme", "document": "Hello!", "projectId": 1}' -H "Content-Type: application/json" 
    curl -X POST http://localhost:3000/document/edit -d '{"username": "john", "password": "changeme", "documentId": 1, "document": "Updated text."}' -H "Content-Type: application/json"

## Authorization with oso

To add more flexible access controls, we implemented a richer authorization scheme using the [oso javascript library](https://www.npmjs.com/package/oso) and rules written in oso's policy language, [Polar](https://docs.osohq.com/using/polar-syntax.html).

* [OsoInstance](src/oso/oso-instance.ts) inherits from the Oso class in the oso javascript module. It configures the oso library to register our domain classes (`Guest`, `User`, `Document`, and `Project`) so they may be used in policy rules and loads and validates the files containing the Polar policy rules.
 
  `OsoInstance` is decorated with `@Injectable` so it may be used as a [NestJS Provider](https://docs.nestjs.com/fundamentals/custom-providers) and implements `canActivate` so it may be used as a [NestJS Guard](https://docs.nestjs.com/guards) to ensure an `OsoInstance` is available in the request for later use.
  
* [OsoGuard](src/oso/oso.guard.ts) is used to ensure that only actors with permission to take a specific action on a particular resource (e.g., User may edit Document).

* [root.polar](src/oso/root.polar) defines the various roles that will be used in [`policy.polar`](src/oso/policy.polar) for [role-based access control (RBAC)](https://docs.osohq.com/using/examples/rbac.html) and [attribute-based access control (ABAC)](https://docs.osohq.com/using/examples/abac.html)

* [policy.polar](src/oso/policy.polar) defines the rules for RBAC and ABAC.

### Roles

There are four roles defined in [root.polar](src/oso/root.polar), Owner, Admin, Member, Guest. Some roles are derived from inheritance:

```
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
```

The member role is explicitly defined for users who don't own a particular project or document:
```
### Roles from membership
role(user: User, "member", project: Project) if
  project.isMember(user.id);
```

The guest role is explicitly defined such that all actors are at least a guest:
```
## Explicit Guest roles

# All users are a guest of all Documents
role(_user: User, "guest", _document: Document);

# The "Guest" actor has "guest" role
role(_guest: Guest, "guest", _document: Document);
```

### Authorizing Read Access

Access to the following URLs for all users and guests *is* allowed:

    curl http://localhost:3000/document
    curl http://localhost:3000/document/1
    
But, only users who are members of a document's project may read documents flagged as
'memberOnly'.

[`DocumentController.findOne` and `DocumentController.findAll`](src/document/document.controller.ts) are passed an authorization function via [@Authorize](src/oso/oso.guard.ts), a [custom decorator](https://docs.nestjs.com/custom-decorators) defined in [`src/oso/oso.guard.ts`](src/oso/oso.guard.ts).

```
  @Get(':id')
  async findOne(@Param() param: any, @Authorize('read') authorize: any): Promise<string> {
    const document = await this.documentService.findOne(Number.parseInt(param.id));
    await authorize(document);
    return document ? document.document : undefined;
  }
```  

The authorization function passes the "actor", "action", and "resource" to the oso rules engine for authorization and throws an exception if not authorized. It resolves the actor (User or Guest) from the request, the action ("read") from the argument to the `@Authorize('read')` decorator, and is passed the resource (a specific Document object) by the caller.

#### Authorization Rules for Read Access

All guests have read access to a document if it isn't marked as `membersOnly` (from [policy.polar](src/oso/policy.polar)):
```
allow(user: Guest, "read", document: Document) if
    role(user, "guest", document) and
    not members_only(document);
```

Likewise, all users have at least a guest role for a particular document and have read
access if the document isn't flagged as `membersOnly`:
```
allow(user: User, "read", document:Document) if
    role(user, "guest", document) and
    not members_only(document);
```

All members have read access to documents:
```
allow(user: User, "read", document: Document) if
    role(user, "member", document);
```



### Write Access is Unauthorized for Guests

Access to creating a new document is denied unless the user presents valid credentials. A POST to 
`/document/create` without valid credentials:

    curl -X POST http://localhost:3000/document/create
    
will yield a 403 response:

    {"statusCode":403,"message":"Forbidden resource","error":"Forbidden"}

However, access to creating a new document is allowed if the user *does* present valid credentials:

    curl -X POST -H "Content-Type: application/json" http://localhost:3000/document/create -d '{ "username": "john", "password": "changeme", "document": "I am a nice new document", "allowsDocumentComment": true, "allowsInlineComment": true }'   

You will receive the id of the new document that was created. A request to retrieve all documents will show the new
document:

    curl http://localhost:3000/document

#### Decorators

The decorators on [`DocumentController.create()`](./src/document/document.controller.ts) set the `actor`, `action`, and
`resource` used by the `allow` declaration and pass them to the oso library for evaluation:

      @UseGuards(OsoGuard)
      @Action('create')
      @Resource('Document')
      @Post('create')
      async create(@Request() request, @Body() document: CreateDocumentDto): Promise<number> {
        document.baseId = request.user.id;
        return this.documentService.create(document);
      }

* The `@Action('create')` decorator sets the action to 'create' in the metadata context
* The `@Resource('Document')` decorator sets the resource to 'Document' in the metadata context
* The `@UseGuards(OsoGuard)` decorator retrieves the `user` object from the request context and resolves the `action` 
  and `resource` from the metadata context supplied by the @Action and @Resource decorators and passes them to
  `Oso.isAllowed()` which evaluates the actor, action, and resource against the polar rules to determine authorization.
  
#### Testing

_TODO:_
* Show how to test the rules by themselves
* Show how to implement end-to-end testing to ensure all the wiring is set up properly
