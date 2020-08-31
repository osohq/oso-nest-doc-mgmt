# Oso Node.js Demo

## Blog Post Goals
1. Show how to integrate Oso into a popular JavaScript/TypeScript web framework
1. Highlight how lightweight the integration is
1. Demonstrate the power of Polar rule expressions
1. Provide a glimpse into the culture and mission of Oso
    1. Customer and solutions focus
        1. Office hours
    1. Something about thinking hard about the common challenges customers face when implementing authentication
        1. To provide an elegant solution 
        1. That is broadly applicable
        1. Easy to reason about
        1. Easy to manage
        1. Easy to extend
        1. So the customer doesn't have to think hard about it        

## Nest Demo Repository Goals
1. Provide a step-by-step tutorial for integrating Oso into a popular JavaScript/TypeScript web framework
1. Serve as a concrete example implementation of Oso in JavaScript/TypeScript

## Blog Post Outline/Treatment

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
    below
1. Browse relevant urls to show 
    
### Review authenticated document view flow
1. Browse guest-viewable documents
1. Go through login flow, then browse all documents to show no authorization (beyond authenticated or not)

### Why roles aren't enough
1. Admins can delete comments, users can delete their own comments
1. These aren't fully expressible as roles, but imagine if there was a pluggable policy engine that let you express 
authorization policy almost as fluently as english. Luckily, such a thing exists; enter Oso:

    https://github.com/oletizi/oso-nest-demo/blob/master/src/oso/policy.polar#L43-L49

### Add Oso
1. Steps to integrate the oso module & guards into the app. At this point, there should be no policy restrictions
1. Add policy rules to restrict update and delete authorization to document owners only
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
    1. Aha moment: "so if I wanted to have custom roles, I just need to make sure it returns a list of roles and it 
    would just work"

1. Flexible/extensible: what if I wanted to, e.g. hide the delete button if the user doesn't have access

    1. Can get a list of permissions from oso (oso.query_rule("allow", user, Variable("action", resource)). And return t\
hat list of permissions to the UI. So the logic stays in one place.

1. Closing remark: "it makes me just want to write the spec out in plain English because that's basically what the rules\
 are anyway"

### Call to Action
1. Download and try Oso in your own app
1. Sign up for office hours

## README Outline

1. Setup
    1. Install and run instructions
    1. _(Potentially demonstrate authentication and review authentication code to show what's available out of the box in 
    Nest via Passport.)_
1. Show authenticated document view flow
    1. Browse guest-viewable documents
    1. Go through login flow, then browse all documents to show no authorization (beyond authenticated or not)
    1. _Potentially review document controller and service code for context_
1. Add Oso
    1. Review oso module code in `src/oso/*`
    1. Review `root.polar`
    1. Show code snippets used to add Oso injections, etc. to enable Oso guards and authorization
1. Add more document view rules
    1. Add Polar rule(s)  to `policy.polar` to restrict view access of private documents to document owner
    1. Browse to show private documents are only visible to owner
1. Add document edit rules
    1. Add Polar rule(s) to `policy.polar` to restrict update & delete privileges to document owner
    1. Browse to show new update and delete restrictions
1. Add document comment rules
    1. add Polar rule(s) to restrict 'add comment' privileges to members and 'edit comment' privileges to comment owner
    1. Browse to show new comment privilege restrictions
1. Add administrator rules
    1. Add Polar rule(s) to grant update & delete access to administrator for documents and comments
    1. Browse to show superuser privileges 

## Notes
From Sam re his conversation with customer that motivated the sample app:

* Why roles aren't enough
    * Admins can delete comments, users can delete their own comments
    * These aren't fully expressible as roles, but they are as policy:
        
        https://github.com/oletizi/oso-nest-demo/blob/master/src/oso/policy.polar#L43-L49

* You don't need to tell it how to work out who can do what.

    * https://github.com/oletizi/oso-nest-demo/blob/da2006515fd8634c31ffb3004870e53b62ac9ff6/src/oso/root.polar#L21
    * Can user do XYZ → user is owner of base + document is in base + document owners can do anything: 
    
        https://github.com/oletizi/oso-nest-demo/blob/master/src/oso/policy.polar#L38
        * oso does all of these deductions so you dont have to write that code

* The model is extensible: later we might want organizations that can be owners of bases:
    * Same two lines:

          role(user: User, role, base: Base) if
            role(user, role, base.organization());

* Structure permissions by grouping as concerns

    * https://github.com/oletizi/oso-nest-demo/blob/master/src/oso/root.polar#L40-L52
    * Easy way to manage permission groupings
    * Aha moment: "so if I wanted to have custom roles, I just need to make sure it returns a list of roles and it would just work"

* Flexible/extensible: what if I wanted to, e.g. hide the delete button if the user doesn't have access

    * Can get a list of permissions from oso (oso.query_rule("allow", user, Variable("action", resource)). And return that list of permissions to the UI. So the logic stays in one place.

* Closing remark: "it makes me just want to write the spec out in plain English because that's basically what the rules are anyway"