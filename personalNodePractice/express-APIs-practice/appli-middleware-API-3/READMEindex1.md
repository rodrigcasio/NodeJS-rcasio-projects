# ✍︎ Example of an **Express API** with `Application-level` and `Router-level` middleware

- `index.js`: Main application
- `shopRoute`: Router handler for `/shop`

In this API, we are introducing the concept of `Application-level middleware` and again.. the `Router-level middleware`. In the main application, we created an **Application-level** middleware to that works as **global gatekeeper**, it enforces security for set up steps for the entire application server.



## New Key Concepts learned

| New Concept | Role in this API | Why it is important|
|:---|:---|:---|
**Application level-middleware**| the function attached using `app.use()` in the `index.js`. It runs the **password check** : `req.query.password`, before any route is process.|In this case.. it acts as a **Global Gatekeeper**. It enforces security.. regardless of wether the user request `/` or `shop/fetch/posts`.. it will alwayas ask for a password|
|Middleware execution order| The App-level Middleware is placed **before** all `app.use('/shop', shopRouter)` and `app.get('/')` calls.| **Express is sequential**. This correct placements dictates the security checks (authentication) that must run before the routes or routers that are meant to protect|
|**Scoped router-level Middleware**| the function attached using `router.use((req, res, next) => { ... })` in `shopRoute.js`. it runs a **timestamp logging** (`[Shop Router] Requested at :.. *time*`)| This can be identified as **Scoped Logic**. It makes sures that this logging step of this **timestamp** happens only for request especifically realted for `/shop`, (e.g., `/shop , /shop/about/pencil/:id and /shop/fetch/posts`). This prevents unnecessary logs for the main '/' route|
|**Short Circuiting the Chain**| The App-level middleware uses `return res.status(402).send('The user cannot login, please enter password....')`| This is how the middleware **stops** the request. If the password is wrong, the middlware sends a response  and does not call `next()`, immediately halting the request and preventing access to the routes.|
