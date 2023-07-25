# Ultimate Guide to User Authorization with Identity Platform

The ultimate guide that can be found HERE (LINK) explains all concepts needed
for you to implement the full user authentication and
role-based authorization (a.k.a RBAC) using Google Identity Platform.

The code in this repository is fully functional; you can use it to construct the
full flow.


## Flow

[img here]

1. User signs up (or in) via the web client
2. Google Identity Platform (GIP) verifies the request and triggers blocking functions
3. Blocking functions assign the role (admin or user) based on the email address
4. If the user is an admin, they’ll be redirected to the Admin page
5. If an unauthorized user comes straight to the Admin page →
6. redirect them Home
7. A request is made against the backend route
8. The route triggers the Auth middleware
9. The Auth middleware verifies the user against GIP
10. If the user exists, the Authz (authorization) middleware is called
11. If the user’s role is sufficient to continue, the handler is triggered
12. Handler responds

## Repo Structure

- client-js - Vanilla JS client code for "Sign in with Google" (called `auth-google`) and "Sign in with Email / Password" (called `auth-email`)
- client-react-next - React JS client code for "Sign in with Google" (called `auth-google`) and "Sign in with Email / Password" (called `auth-email`)
- blocking-functions - Node JS function code and unit tests. The function can be deployed to GCP using (see `package.json` scripts)
- middleware-go - Golang backend with auth and authz middlewares
- middleware-node - Node backend with auth and authz middlewares

### Running

- client code can by run simply by `npm i` in the appropriate folder and then `npm run dev` or by using live-server (in the Vanilla JS case)
- blocking function code cannot be run locally but the unit tests can be run by `npm i` first and then `npm run test`
- middleware Go code can be run by `docker-compose up` in its folder
- middleware Node code can be run by `docker-compose up` in its folder
