#### Guest rules

allow(user: User, "read", document: Document) if
    role(user, "guest", document);

allow(user: User, "addDocumentComment", document: Document) if
    role(user, "guest", document) and
    document.allowsDocumentComment;

allow(user: User, "addInlineComment", document: Document) if
    role(user, "guest", document) and
    document.allowsInlineComment;

### Member permissions

allow(user: User, "read", document: Document) if
    role(user, "member", document);

allow(user: User, "addDocumentComment", document: Document) if
    role(user, "member", document);

allow(user: User, "addInlineComment", document: Document) if
    role(user, "member", document);

allow(user: User, "edit", document: Document) if
    role(user, "member", document);

### Admin-specific permissions

allow(user: User, "edit", base: Base) if
    role(user, "admin", base);

### Owner permissions

allow(user: User, _, base: Base) if
    role(user, "owner", base);

allow(user: User, _, document: Document) if
    role(user, "owner", document);

### Example of other policies

# All users can delete notes they created
allow(user: User, "delete", note) if
    user.id = note.createdBy;

# But only admins can delete notes generally.
allow(user: User, "delete", note) if
    role(user, "admin", note);

