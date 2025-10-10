# Creating an API to handle different **routes** with **routing**
In this practice, I created a **RESTful server** that directs HTTP GET request to the right module which are Routes for specific endpoints. 

It's main purpose is to **organize and manage endpoints** while acting as a **proxy** for external data.

- `index.js`: **Main Application**
- `itemRouter`: **Router for /item**
- `userRouter`: **Router for /user**

## Simple understanding
This server is an organized switchboard that directs incoming requests to the correct **module** `itemRoute.js` or `userRoute.js`. For specific requests such as : `item/fetch/posts` `item/about/:id`  or in **userRoute** : `user/:userId`, handles the logic job of fetching, processing, and formating data from an **external** API (jsonplaceholder API)

## Following **Modular Roating**

| feature | Explanation |
| :--- | :---|
|**Modular Routing** |This Express API practice, it uses `express.Router()` to separate endpoints into dedicated files (`itemRoute.js` and `userRoute.js`). |
| **API Proxy** | The server utilizes **Axios** to make an outbound `GET` request to the **external API** `Jsonplaceholder` API. It then receives the data, formats it into a custom JSON structure (an JavaScript object, like an envelope with `message` and `data` properties), and returns it to the client.|
|**Key endpoints**| `/item/about/:id`(**handling URL Parameters**) and `/item/fetch/posts/`(**for making external API call**)|

## `index.js` 📄

This file is the **entry point** and the **central traffic director** for the entire server. Handling the initial setup and delegates request to `itemRouter.js` and `userRouter.js`

|Code| Concept | Explanation |
|:---|:---|:---|
|`const itemRouter = require('/.itemRoute)` `const userRouter = require('./userRoute')`|Module Import | Importing the custom route handler (`userRoute` and `itemRoute`) **defined in separated files|
|`app.use('./user', userRouter); app.use('/item', itemRouter)`| Mounting Router | **Attaches** the `userRouter` to the main application `app`. Any requests starting with path `/user` is delegated to the `userRoute.js` file for processing. Same goes for the `/item` is delegated to the `itemRoute.js`|
|`app.listen(port () => { ... })`| Server initialization | Starts the main Express server, binding it to the specified port|

## `itemRoute.js` 📄

This file define the specific endpoints and logic for the base path `/item`.

|Code| Concept | Explanation |
|:---|:---|:---|
|`const router = express.Router()`| Router Instance | Creates a local **router** object which will hold all the endpoints of this module `itemRoute.js`|
|`router.use((req, res, next) => { ... })` |Router Level **Middleware**| Defines middleware that applies **only** to routes defined within this specific router file (e.g., only requests starting with `/item`)|
|`router.get('/' (req, res) => { ... })`|Relative Routing| Defines `GET` request for the path **relative** to where the router is mounted. If mounted at `/item` this is accessed in `http://localhost:3000/item`|
|`router.get('/about/:id', (req, res) => { const userId = req.params.id; res.send('Information about item ${userId}')})`| Route Parameters| the `:` defines a **dynamic segment** of the URL. The value of the segment is accessible with `req.params` (as seen in the code: `req.params.id`)|
|`router.get('/fetch/posts', (req, res) => { ... })`| Fetching data from external API | It uses **Axios** to make -> **Outbound Request**:The server makes a request to the external API and waits for the data (asynchronously).
|`res.json({ messsage: '...', data: response.data})`| Standardized Response | Creates an `envelope` object to send data. This is a common API design practice to provide consistency (status message) along with the actual data payload|

## `userRoute.js` 📄

This file manages the requests for the path base `/user`.
- This router is **mounted** on the `/user` path in the `index.js` file. all the routes defined here are **relative** to that base.

|Code Line| Effective URL | Purpose|
|:---|:---|:---|
|`router.get('/', ...)`|`http://localhost:3000/user`| This is the **Home Page** for the user section. It's often used to return a list of all users |
|`router.get('/:userId', ...)`|`http://localhost:3000/4`| This defines a **dynamic endpoint**. The `:userId` part is a **route parameter** that captures the number or ID (e.g., 5) This is how you request specific resources(like users's profile) instead of the whole collection|
|`req.params.userId`| **Accessing Parameters** | Within the function, the value of the dynamic segment (4) is retrieved from the request object using `req.params.userId`.|

## Code


### `index.js` The main control center

```js
// Main application
const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./userRoute');  // importing route modules
const itemRouter = require('./itemRoute');

app.use('/item', itemRouter);       // attach the routers to specific base paths
app.use('/user', userRouter);

// Base route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Modular Express Server');
});

// start server
app.listen(port, () => {
    console.log(`Modular Express server listening at http://localhost:${port}`);
});




```

### `itemRoute.js` The **Item manager**

```js
const express = require('express');
const axios = require('axios');

const router = express.Router();     // creating router instance 

// middleware example: this runs before every route in 'itemRouter'
router.use((req, res, next) => {
    console.log(`[Item Router] Request received at: ${new Date().toISOString()}`);
    next();
});

router.get('/', (req, res) => {
    res.send('You reached the Item home page.');
});

router.get('/about/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Information about item: ${userId}`);
});

router.get('/fetch/posts', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json({
            message: 'Succesfully fetched posts via Axios!',
            data: response.data.slice(0, 5)         // returning only the first 5
        });
    } catch (err) {
        console.error(`Error fetching data:`, err.message);
        res.status(500).send(`Error fetching data from external API`);
    }
});

// export router instance
module.exports = router;
```

### `userRoute.js` The **user manager**
```js

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`You reached the User home page`);
});

router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    // quicknote : if wanted to fetch data user from external API here, we would put Axios call here, similar to the itemRouter
    res.send(`Fething details for User ID: ${userId}`);
});

module.exports = router;
```

@rodrigcasio