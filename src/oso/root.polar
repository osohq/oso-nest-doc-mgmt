# policy

# Polyfill way to log all requests
#allow(actor, action, resource) if
#    console.log("allow( ", actor, ", ", action, ", ", resource, ")") = _
#    and false;

### Everyone can getHello
allow(_user, "getHello", "AppController");
allow("foo", "read", "bar");
allow(_user:User, "read", "bar");

### Roles from ownership
#role(user: User, "owner", base: Base) if
#    base.ownerId = user.id;

