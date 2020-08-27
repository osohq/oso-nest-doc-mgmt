# Oso Node.js Demo

## Goals
1. Show how to integrate Oso into a popular JavaScript/TypeScript web framework
1. Highlight how lightweight the integration is
1. Demonstrate the power of Polar rule expressions

## Possible Outline

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
* This is outline is just a proposal. Happy to discuss any mods or other directions.
* There are pros and cons to using an existing framework and TypeScript. 
    * Pros:
        * TypeScript is what all the cool kids are doing
        * It looks like less of a toy when the demo lives in a "real" web app.
        * It doubles as an integration guide for that particular framework
    * Cons:
        * Not everyone uses TypeScript
        * The framework code adds noise that makes it a little more difficult to separate what Oso does from what the
        framework does.  
