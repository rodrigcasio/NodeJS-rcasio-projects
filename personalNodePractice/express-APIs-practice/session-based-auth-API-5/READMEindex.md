# Pratice for Session-Based-Authentication with `express`

##  🙋 Intro

`why`

This express application serves as a practice session, and getting my hands dirty in a example of **Session-Based Authentication** in using `express-session` dependency. By implementing the core logic across the server file and a `simulation` of a database with users credentials, `express-session` middleware uses secure cookies to maintain a user's logged-in session in multiple requests.

`flow`

This .md files demonstrates documentation outlining the lifecycle of a user session in a `Node.js Express Application`. The main goal is to clearly define the role of the key components needed, including the authentication middleware (`gatekeeper`), `/login` route that obtains the session `cookie`, and finally the `/logout` that destroys the session.

## Files 📂

`/session-based-auth-API-5/index.js` **Main Server Application**
`/session-based-auth-API-5/users-db.js` **Simulated user database**
`/session-based-auth-API-5/test-auth.http` **HTTP REQUEST TESTER**

## 🏛️ Code Structure Order

It is important to follow this order to let `express-session` the needed logic and functionality for the server to run properly

### 📄 `users-db.js` **Simulated User Database**

1. **Creating Data Storage**
    - This array is simulating a **database** holding users credentials
```js
const users = [
    { id: 1, username: 'Rodrigo', password: 'password123', role: 'member' },
    { id: 2, username: 'admin', password: 'adminpassword', role: 'admin' }
];
```

2. **Creating Finder Function**
    - This function allows to check if the credentials provided in the `POST` HTTP request match any stored user.
```js
const findUser = (username, password)=> {
    return users.find(user => user.username === username && user.password === password);
}
```
3. *Exporting the function**
    - Making the `findUser` function available to the main server `index.js`
```js
module.exports = { findUser };
```

###  📄 `index.js` **Main Express Server**
   - Setting up session with middlewares and authentication routes

1. **Importing Core Dependecies and the simulated dababase function**

```js
const express = require('express');
const session = require('express-session');

const app = express();
const PORT = 3000;
const { findUser } = require('./users-db.js');
```

2. **Creating Middleware for Handling Request Body and Session**
    - `app.use(express.jso());` *Allows Express to read incoming JSON data from POST request ( like login form)
```js
app.use(express.json());
```
3. **Setting up the `Session` Configuration `Middleware`**
    - `secret` secures the session ID cookie. Must be a secret, random string
    - Using `resave: false` this is a common practice which do not saves if not modified the session
    - Finally.. `saveUninitialized: false`, only create a session upon successful login
```js
app.use(session({
    secret: 'my_super_secret_signing_key_12345',
    resave: false,
    saveUninitialized: false,
}));
```

4. **Set up `/login` Endpoint (POST)**
    - This code handles the login attempt
        - 4.1 checking credentials.. (`user = findUser(...)`)
        - 4.2 If `user` true.. sets the session properties, (`req.session.user = user.username`) this makes the server remember the user
        - 4.3 Sending a successful or failure JSON Response
```js
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username, password);

    if (user) {
        req.session.user = user.username;
        req.session.role = user.role;
        
        res.status(200).send({ message: 'Loggin successful ✅', username: user.username });
    } else {
        res.status(401).send({ message: 'Invalid username or password ❌' });
    }
})
```

5. **Creating `/logout/` Endpoint GET (ending session)**
    - `req.session.destroy` destroys session securely
```js
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send({ message: 'Could not logout ❌'});
        }
        res.status(200).send({ message: 'Sucessful Logout!. Until nextime 👋🏻' });
    });
});
```
6. **Authentication Middleware** *the gatekeeper*
    - *this middleware `isAuthenticated` will be placed in the endpoint `/dashboard` to secure the GET request 
    - `if (req.session.user) {` Checks if the server remembers the user (via the session cookie)
    - `next();` if user is logged in.. it moves on and allows access... if not `Access Denied...`.
```js
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send({ message: 'Access Denied 🔴. Please log in first' });
    }
}
```
7. **Protected Endpoint, The dashboard guarded by the `isAunthenticated` middleware**
    - It will run first the `isAuthenticated` middleware to make sure the server remembers a user logged in with their `session ID`.
    - If the code runs `res.send(...)`.. the **user** is authenticated!
```js
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome to the Protected Dashboard, ${req.session.user}! Your role is ${req.session.role}. ✏️`);
});
```
8. **Launching Server, starting the application**
    - Testing the Server, we can make the request via the `test-auth.http` HTTP tester
```js
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```
### Finally the 📄 `test-auth.http` 

*This is a dedicated HTTP Client*
*This is order is appropiate for testing the server endpoints and the middlewares used for the `express-session`

1. **Clearing any existing session** `(Optional)` *but good practice*
```http
GET http://localhost:3000/logout
```

2. **Attempting to access the guarded `/dashboard`** *( should failed since i havnt logged in )*
```http
GET http://localhost:3000/dashboard
```

3. **Successfully loggin in** `a POST request with JSON body`
    - This request sets the session cookie in your client.
```http
POST http://localhost:3000/login
Content-Type: application/json

{
    "username": "Rodrigo",
    "password": "password123"
}
```

4. **Accessing the `protected` Dashboard** *should succeed since already logged in*
    - *Important*: The client automatically sends the cookie set in step 3
```http
GET http://localhost:3000/dashboard
```

5. **`Logout`** *Destroying the session cookie on the server*
```http
GET http://localhost:3000/logout
```

6. Finally... **Attempting to GET `/dashboard` endpoint.** *( Access denied  `401`. logged out )*
```http
GET http://localhost:3000/dashboard
```

@rodrigcasio