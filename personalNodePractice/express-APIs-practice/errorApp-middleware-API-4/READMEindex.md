# Express API practice with **Error-handling Middlewares** in `Application-Level` and `Router-Level`

`index.js` (**Main Application**)
`profileRoute.js`(**/profile router**)

In this **express API**, it is shown a organized and modular way to implement **error-handlers middlewares** at `application-level` and `route-level`. This API was built with the purpose of introducing modularity using middlewares for a server-application that delegates for '/profile' route.

## 🏛️ Code Structure   (modular structure for `Express API`)
### `index.js`

*Setup -> Global Middleware -> Routers -> Routes -> Error Handlers -> Launch*

1. **Setup and Initialization**
    - Defining the required modules, creating a main `app` instance.
```js
const express = require('express');
const app = express();
const port = 3000;

const profileRouter = require('./profileRoute');
```

2.  **Application-Level Middleware**
    - Middleware appplied to all paths. Including logging and global security checks 

```js
app.use((req, res, next) => {
    console.log(`[Main App] Requested at: ${new Date().toISOString()}`);
    next();
});

app.use('/user/:id', (req, res, next) => {
    if (req.params.id == 1){
        throw new Error('Trying to access admin login ❌. You dont have access to this user ID');
    } else {
        console.log(`Successfully entered regular ID user`);
        console.log(`Time: ${new Date().toISOString()}`);
        next();
    }
});
```

3. **Routers (Modular Mounting)**
    - Attaching all modular router files (`profileRouter.js`) to their paths. Mounting here the independent `/profile` router.
```js
app.use('/profile', profileRouter);
```
4. **Final Routes**
    - Defining any specific endpoints that belong directly to the main application (`/` home route)

```js
app.get('/', (req, res) => {
    res.send(`🏡 Welcome to this Express Server. This is the Main Home Page👋🏻.\n 📝 Please write your "/user/#" ID number to access their Profile`);
});

app.get('/user/:id', (req, res) => {
    res.send(`🙋 Hello user ID: ${req.params.id}. Access you profile with '/profile/#' ID number`);
});

```

5. **Global Error-Handler (Application-level Error-handler Middleware)**
    - Define the 4 final-argument error handler. **Must be the last `app.use()` call**.
```js
app.use((err, req, res, next) => {
    if (err !== null){
        res.status(500).send(err.toString());
    } else {
        next();
    }
})
```
6. **Server Launch**
    - Bind the application to a network port `3000`, starting the server process.
```js
app.listen(port () => {
    console.log(`Server listened at: http://localhost:${port}`);
});
```

### `profileRoute.js`

1. **Setup & Initialization**
    - Define the required modules and create the **Route instance**
```js
const express = require('express');
const axios = require('axios');

const router = express.Router();
```
2. **Router-Level Middleware**
    - Middleware applied to **All** subsequent paths after `/profile`, (here an example of universal logging for `/profile`).
```js
router.use((req, res, next) => {
    console.log(`[Profile Router] Requested at: ${new Date().toISOString()}`);
    next();
});
```

2. 1 **Scoped Conditional Middleware**
    - Middleware applied to **specific path pattern** (`/:id`) that may modify the request or throw an error.
```js
router.use('/:id', (req, res) => {
    if (req.params.id == 1){
        throw new Error(`You are not allowed to check the profile admin ❌.`);
    } else {
        console.log(`Successfully entered regular user ID profile ✅`);
        console.log(`Time: ${new Date().toISOString()}`);
        next();
    }
});
```

3. **Final Routes**
    - Define all the specific paths (`GET`, `POST` etc..) [in this case only `GET` **for now*] that send the final response to the client.

```js
router.get('/', (req, res) => {
    res.send(`🏠 Welcome to the Profile Home Page. Access your profile with your '/profile/# ID number 📋`);
});

router.get('/fetch/friends', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json({
            message: "Successfully fetched friends info",
            data: response.data.slice(0, 3);
        });
    } catch (err) {
        console.log(err.message);
        console.log('Error fetching data');
        next(err);      // passing the error object to the error handler
    }
});
```
4. **Local Error Handler (Router-Level Error handler middleware)**
    - Define the 4 argument error handler. **Must be the last `router.use()` call** to catch errors thrown in step `3` and `4`.
```js
router.use((err, req, res, next) => {
    if (err !== null){
        res.status(500).send(`[Local Route Error Handler] Error: ${err.toString()}`);
    } else {
        next();
    }
});
```
5. **Module Export**
    - Making the configured router available for the main application (`index.js`) to mount.
```js
module.exports = router;
```

## 📄 Code (commented)

### `index.js`

```js
// API with Examples of Error-handling middlewares
// 1. error handler mw app-level example with /users/:id
// 2. error handler mw router-level example /profile/:id

// best practice order : 
// Setup -> Global Middleware -> Routers -> Routes -> Error Handlers -> Launch

// if placed 1 in /user/1.. throws error with error-handling middleware

const express = require('express');
const app = express();
const port = 3000;

const profileRouter = require('./profileRoute');

// 1. ==== Application-level middlewares (global checks)

//global logger
app.use((req, res, next) => {
    console.log(`[Main App] Requested at ${new Date().toISOString()}`);
    next();
});

//User ID Security Check (throw error if id is 1)
app.use('/user/:id', (req, res, next) => {
    if (req.params.id == 1) {
        throw new Error('Trying to access admin login ❌. You dont have access to this user ID');
    } else {
        console.log('Successfully entered regular user ID');
        console.log(`Time ${new Date().toISOString()}`);

        next();      // moves to the next mw or finishes the chain
    }
});

// 2. ==== Routers (Modular Routing )

//mounts the independent /profile router
app.use('/profile', profileRouter);


// 3. ==== Final Routes (Specific Endpoints)

// Main Home Page Route
app.get('/', (req, res) => {
    res.send('🏡 Welcome to this Express Server. This is the Main Home Page👋🏻.\n 📝 Please write your "/user/#" ID number to access their Profile');
});

// User ID Route (runs after the security check)
app.get('/user/:id', (req, res) => {
    res.send(`✅ 🙋 Hello User ID: ${req.params.id}\n Access your profile with 'profile/#id' `);
});

// 4. ==== Global error handler (the final safety net)

// App-level Error Middleware (catches errors thrown anywhere above)
app.use((err, req, res, next) => {
    if (err !== null) {
        res.status(500).send(err.toString());
    } else{
        next();
    }
});

// 5. ==== Server Launch
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
```

### `profileRoute.js`

```js
// /profile router is independent
// Code order : Setup -> Middlewares -> Routes (endpoints) -> Error Handler -> Export module

const express = require('express');
const axios = require('axios');

const router = express.Router();

// 1. === Router-level middlewares ===

// 1- Notification Router-level Middleware (runs first)
router.use((req, res, next) => {
    console.log(`[Profile Router] Requested at ${new Date().toISOString()}`);
    next();
});

// 1.1 === Scoped level middleware ===
//Middleware Checking User ID (throws error if user places /profile/1)
router.use('/:id', (req, res, next) => {
    if (req.params.id == 1){
        throw new Error('You are no allowed to check the profile of admin! ❌');
    } else {
        console.log(`Successfully entered regular user ID profile ✅`);
        console.log(`Time: ${new Date().toISOString()}`);
        next(); 
    }
});

// 2. === Final Routes (endpoints) ===

router.get('/', (req, res) => {
    res.send(`🏠 Welcome to the Profile Home Page. Access your profile with your '/profile/# ID number 📋`);
});

router.get('/:id', (req, res) => {
    res.send(`📂 ✅ You reached the Profile home page of user ID: ${req.params.id} 🧍`);
});

router.get('/fetch/friends', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json({
            message: "Successfuly fetched friends info",
            data: response.data.slice(0, 3)
        });
    } catch (err) {
        console.log(err.message);      // logging failure locally for debugging
        console.log('Error fetching data!');

        return next(err);    // passing the error obj to the error handler middleware
    }     
});

// 3. === Router-Level Error Middleware ===

// The final catch-all errors for this router (/profile)
router.use((err, req, res, next) => {
    if (err !== null){
        res.status(500).send(`[Local route error Handler] Error: ${err.toString()}`);
    } else {
        next();
    }
});

// 4. === export module ===
module.exports = router;
```

@rodrigcasio