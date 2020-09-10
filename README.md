## Introduction
_TODO:_
* Statement of purpose
* Introduction to problem domain

### Installation

_TODO:_ 
* how to install and run

### (Cursory review of demo code)
_TODO:_
1. Briefly explain Nest concepts of Modules, Controllers, Services, and Guards w/ links to Nest docs
1. Show relationships between base, document, users, and auth modules; explain that we'll review the oso module
    later
1. Browse `http://localhost:3000` to ensure app is working

## Authentication

Nestjs has [built-in support for authentication](https://docs.nestjs.com/techniques/authentication). We've implemented
the toy authentication mechanism (i.e.&mdash;do not use in production!) that validates the username and password 
supplied in the request body against a static set of users.

The [DocumentController](./src/document/document.controller.ts) uses the [LocalRejectingAuthGuard](src/auth/local-auth.guard.ts)
via the `@UseGuards(LocalAuthGuard)` decorator to protect paths that should only be accessible to authenticated users.

If you try to get documents with invalid user credentials:

    curl http://localhost:3000/document
    curl http://localhost:3000/document/1

you should receive an 401 Unauthorized error:

    {"statusCode":401,"message":"Unauthorized"}

If you try to get documents with valid user credentials, you will be granted access:
    
    curl -X GET http://localhost:3000/document/ -d '{"username": "john", "password": "changeme"}' -H "Content-Type: applicationjson"
    curl -X GET http://localhost:3000/document/1 -d '{"username": "john", "password": "changeme"}' -H "Content-Type: application/json"

## Authorization

If we want to go beyond simple authentication-based access controls, we must implement a richer authorization scheme.

To do so, we'll first update our authentication scheme to be more permissive. It will attempt to validate the supplied
credentials and resolve the appropriate user data for use later in the request. If credentials are not supplied or they
are invalid, the user remains a "guest", but is still allowed access to all of the paths under `/document`.

We will allow oso and the rules defined in our polar documents to determine access to actions and resources based on user
attributes the authentication scheme placed into the request. 

### Switch Implementation of Authentication Guard

In [DocumentController](./src/document/document.controller.ts), replace `LocalRejectingAuthGuard` with 
`LocalResolvingAuthGuard` in the `@UseGuards` decorator:

<pre><code>
    @UseGuards(OsoInstance)
    @UseGuards(LocalResolvingAuthGuard)
    @Controller('document')
    export class DocumentController {
</pre></code>

### Read Access is Now Authorized for Users *and* Guests

After nest has recompiled the code and restarted itself, _unauthenticated_ access won't be blocked. Instead, the
[`OsoInstance`](./src/oso/oso-instance.ts) and [`OsoGuard`](./src/oso/oso.guard.ts) will determine what is authorized 
based on the rules in [base.polar](./src/oso/base.polar) and [policy.polar](./src/oso/policy.polar). 

Access to the following URLs without valid credentials will be allowed:

    curl http://localhost:3000/document
    curl http://localhost:3000/document/1

### Write Access is Unauthorized for Guests

Access to creating a new document will be denied unless the user presents valid credentials. A POST to 
`/document/create` without valid credentials:

    curl -X POST http://localhost:3000/document/create
    
will yield a 403 response:

    {"statusCode":403,"message":"Forbidden resource","error":"Forbidden"}

However, access to creating a new document will be allowed if the user *does* present valid credentials:

    curl -X POST -H "Content-Type: application/json" http://localhost:3000/document/create -d '{ "username": "john", "password": "changeme", "document": "I am a nice new document", "allowsDocumentComment": true, "allowsInlineComment": true }'   

You will receive the id of the new document that was created. A request to retrieve all documents will show the new
document:

    curl http://localhost:3000/document

