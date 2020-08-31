# Oso Node.js Demo

## Blog Post Goals
1. Show how to integrate Oso into a popular JavaScript/TypeScript web framework
1. Highlight how lightweight the integration is
1. Demonstrate the power of Polar rule expressions
1. Provide a glimpse into the culture and mission of Oso
    1. Customer and solutions focus
        1. Office hours
    1. Thinking hard about the common challenges customers face when implementing authorization
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

    1. Can get a list of permissions from oso (oso.query_rule("allow", user, Variable("action", resource)). And return t\
hat list of permissions to the UI. So the logic stays in one place.

1. Describe customer closing remark: "it makes me just want to write the spec out in plain English because that's basically what the rules\
 are anyway"

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

## README Outline

This README document will contain the tutorial from the blog post, minus any editorializing: just dry technical docs.

## Notes
From Sam re: his conversation with customer that motivated the sample app:

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
