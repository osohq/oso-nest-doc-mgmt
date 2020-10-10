######## Permissions #######

### Everyone can getHello
allow(_user, "getHello", "App");


# Logged in users have all model-level document permissions
allow(_user: User, _, "Document");

# Anyone has the potential to read documents
allow(_, "read", "Document");

# But guests can only read public docs
allow(user, "read", document: Document) if
    role(user, "guest", document)
    and not members_only(document);

# Documents are members only if the membersOnly flag is set
members_only(document: Document) if document.membersOnly;


# Members can read + update
allow(user, action, document: Document) if
    role(user, "member", document)
    and document_actions(action, permission)
    and permission in ["read", "update"];

# Can create if they are the document owner and
# they are at least a member of the project
allow(user: User, "create", document) if
    document.ownerId = user.id
    and role(user, "member", ProjectService.findOne(document.projectId));

# Owners can delete
allow(user: User, "delete", document: Document) if
    role(user, "owner", document);


####### Action mappings #######

document_actions(action, "read") if
    action in [
        "findOne",
        "findAll",
        "read",
    ];

document_actions(action, "update") if
    action in [
        "edit",
    ];
