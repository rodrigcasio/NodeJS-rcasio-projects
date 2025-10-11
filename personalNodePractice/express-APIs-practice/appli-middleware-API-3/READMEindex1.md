# ✍︎ Example of an **Express API** with `Application-level` and `Router-level` middleware

*Understanding how to implement Application-level middlewares*

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

## Techniques learned for this API
|Code| Concept|
|:---|:---|
|`app.use((req, res, next) => { ... })`|**Application-Level Middleware Definition**(acts as a global check)|
|`if (req.query.password !== 'pwd1234'){ return  res.status(402).send(...) }`| **Middleware short circuit** (blocking unauthorized requests)|
|**Placing the** `app.use((req, res, next) => { ... })` `middleware` **before** `app.use('/short', shopRouter)`| Importance of execution order. (Security before access)|

## Password relies on **query parameter** named `password`

When an user navigate to the server, lets say... to the **Home page** with `http://localhost:3000/?password=pwd1234`, the password is only recognized for this first request (typing the URL with password). When a URL is clicked  or typed a new path, the browser sends a **new**, entirely separate request** fo that new path, and the query parameter is lost.

### How to access the **Shop Route**
*Important*

To access the `/shop` route, or any other route protected by your Application-Level Middleware, it is a **must**! to include `?password=pwd1234` **query parameter in the URL for that specific route**

|Route to Access| URL to Type (Client Request)|
|:---|:---|
|**Main Home Page**|`http://localhost:3000/?password=pwd1234`|
|**Shop Home Page**|`http://localhost:3000/shop/?password=pwd1234`|
|**Pencil Detials**|`http://localhost:3000/shop/about/pencil/77?password=pwd1234`|
|**Fetch Posts**|`http://localhost:3000/shop/fetch/posts?password=pwd1234`|


## Code
### `index.js`
```js
const express = require('express');
const app = express();
const port = 3000;

const shopRouter = require('./shopRoute');

// app-level middleware     1. mouting the app-level middlerware FIRST
app.use((req, res, next) => {
    if (req.query.password !== "pwd1234"){
        return res.status(402).send('The user cannot login, please enter password in URL');
    }
    console.log(`Successfully entered the right password ✅`);
    console.log(`Time: ${new Date().toISOString()}`);
    next();
});

// 2. then mount the router, so the pwd check protects it
app.use('/shop', shopRouter);

//3. also protected !
app.get('/', (req, res) => {
    res.send('Welcome, you are in the main Home page ☻');
});

// must enter "/?password=pwd1234"
app.listen(port, () => {                
    console.log(`Server listening at: http://localhost:${port}`);
});
```

### `shopRoute.js`
```js
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Shop Router] Requested at: ${new Date().toISOString()}`);
    next();
});

router.get('/', (req, res) => {
    res.send('You reached the Shop Home page');
});

router.get('/about/pencil/:id', (req, res) => {
    pencilId = req.params.id;
    res.send(`Information about pencil ID: ${pencilId} ✏️`);
});

router.get('/fetch/posts', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json({
            message: "Succesfully fetch posts with axios!",
            data: response.data.slice(0, 3)
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;
```
@rodrigcasio