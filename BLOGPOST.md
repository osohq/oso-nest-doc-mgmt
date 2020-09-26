
# Adding authorization to a JavaScript/TypeScript app with oso

With the recent addition of [JavaScript and TypeScript support](https://www.osohq.com/post/release-0-5-0) we've [built a demo app](https://github.com/oletizi/oso-nest-demo) in (NestJS)[https://nestjs.com/] to provide a practical example of building oso for authorization into a popular JavaScript web framework.

The demo was inspired by an [office-hours conversation](link to info about office hours) Sam had with an oso user about how to express the authorization model of their document management app with oso. In addition to showing how ot use the oso JavaScript package, it also highlights some useful oso concepts, Including [role hierarchies](https://www.osohq.com/post/building-the-github-authorization-model-using-oso), [RBAC](https://docs.osohq.com/using/examples/rbac.html) and [ABAC](https://docs.osohq.com/using/examples/abac.html), and the value of injecting authorization as a cross-cutting concern rather than intertwining them explicitly into application and business logic.

## Installation


1. Clone the demo and install dependencies:
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

## NestJS and the Demo App

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


## TODO: Try stufff

## Roles

There are four roles defined in [root.polar](src/oso/root.polar): Owner, Admin, Member, and Guest. 

Some roles are derived from inheritance:

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

The member role is explicitly defined for users who don't inherit the membership role:
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

## Role-based authorization

Using role-based authorization, we can allow or deny access to reading or writing all documents based on a user's role. In the following Polar rules, we grant all members read and write access to documents:

This rule grants "create" privileges to all authenticated users:  

```
allow(_user: User, "create", "Document");
```

We require the elevated role of "member" to grant read access to a particular document:

```
allow(user: User, "read", document: Document) if
    role(user, "member", document);
```

We require the further elevated role of "admin" to delete a document:

```
allow(user: User, "delete", document: Document) if
    role(user, "admin", document);
```

And, we allow users with the "owner" role full privileges on a document:

```
allow(user: User, _, document: Document) if
    role(user, "owner", document);
```

## From RBAC to ABAC: why roles aren't enough

For some of the rules we want to express, roles-based access works well. However, they don't always allow the richness of expression we might want. In Sam's office-hours conversation that inspired this demo, the developer of the app in question wanted to be able to restrict access to certain operations based on attributes of a particular document. For example, some documents should be visible to everyone, while others should only be visible to members of the project that the document belongs to.

Without changing any code, it's possible to add finer-grained policies like this with a few lines of Polar.

This rule allows the unauthenticated users (Guests) to read a document if and only if the *document* does not have the 'members_only' attribute:

```
allow(user: Guest, "read", document: Document) if
    role(user, "guest", document) and
    not members_only(document);
``` 

Likewise, authenticated users are allowed to read a "members only" document only if they are a "member" of the document:

```
allow(user: User, "read", document:Document) if
    role(user, "guest", document) and
    not members_only(document);
``` 

We think that expressing such rules based on attributes of a particular object is simple and maintainable in Polar in a way that would be much more difficult otherwise.

## Extensibility and separation of concerns







---

## OUTLINE
### Introduction
1. Describe "office hours" discussion w/ customer to ground the narrative & motiviation of the tutorial. Also 
advertise the existence of office hours 
1. Customer problem domain
    1. Document management system
    1. Overlay role-based CRUD access controls as a cross-cutting/orthogonal concern

### Prepare local demo instance
1. Clone, build, and run project; browse relevant local URLs

### Cursory review of demo code
1. Briefly explain Nest concepts of Modules, Controllers, Services, and Guards w/ links to Nest docs
1. Show relationships between base, document, users, and auth modules; explain that we'll review the oso module
    later
1. Browse `http://localhost:3000` to ensure app is working
    
### Review authenticated document view flow
1. Browse guest-viewable documents
1. Go through login flow, then browse all documents to show no authorization (beyond authenticated or not)

### Why roles aren't enough
Briefly describe conversation w/ customer about roles.

1. Consider the requirements that Admins may delete any comment while users may delete only their own comments
1. These aren't fully expressible as roles, but imagine if there was a pluggable policy engine that let you express 
authorization rules almost as fluently as english. Luckily, such a thing exists; enter Oso.
1. Brief introduction to Polar w/ links to documentation for more info.

### Add Oso
1. Steps to integrate the oso module & guards into the app. At this point, there should be no policy restrictions; those
will be added in later steps.
1. Add policy rules to restrict "update" and "delete" authorization to document owners only.
1. Explain: You don't need to tell it how to work out who can do what.

    1. https://github.com/oletizi/oso-nest-demo/blob/da2006515fd8634c31ffb3004870e53b62ac9ff6/src/oso/root.polar#L21
    1. Can user do XYZ → user is owner of base + document is in base + document owners can do anything:

        https://github.com/oletizi/oso-nest-demo/blob/master/src/oso/policy.polar#L38
        
        1. oso does all of these deductions so you don't have to write that code

1. Extensibility: adding a superuser is as simple as updating the policy rules
    1. Add rule for Admin user to allow update and delete of any document

1. Extensibility: imagine a future requirement that adds an "organization" entity such that membership in an organization
automatically confers authorization to documents (or, any future asset type that extends the Base module) owned
by that organization.
    1. The model is extensible: later we might want organizations that can be owners of bases:
        * Same two lines:
    
              role(user: User, role, base: Base) if
                role(user, role, base.organization()); 

1. Structure permissions by grouping as concerns

    1. https://github.com/oletizi/oso-nest-demo/blob/master/src/oso/root.polar#L40-L52
    1. Easy way to manage permission groupings
    1. Describe customer aha moment: "so if I wanted to have custom roles, I just need to make sure it returns a list of roles and it 
    would just work"

1. Flexible/extensible: what if I wanted to, e.g. hide the delete button if the user doesn't have access

    1. Can get a list of permissions from oso (oso.query_rule("allow", user, Variable("action", resource)). And return 
    that list of permissions to the UI. So the logic stays in one place.

1. Describe customer closing remark: "it makes me just want to write the spec out in plain English because that's 
basically what the rules are anyway"

### Outro: 
Brief recap of what we've accomplished & the benefits of using Oso
1. Easy to integrate
1. Powerful, elegant way to describe authorization rules
1. Separation of concerns
1. Flexibility and extensibility
1. Help from the experts is always available

### Calls to Action
1. Download and try Oso in your own app
1. Sign up for office hours
1. Join the slack channel