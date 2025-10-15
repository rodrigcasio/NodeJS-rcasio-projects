# Pratice for Session-Based-Authentication with `express`

##  🙋 Intro

`why`

This express application serves as a practice session, and getting my hands dirty in a example of **Session-Based Authentication** in using `express-session` dependency. By implementing the core logic across the server file and a `simulation` of a database with users credentials, `express-session` middleware uses secure cookies to maintain a user's logged-in session in multiple requests.

`flow`

This .md files demonstrates documentation outlining the lifecycle of a user session in a `Node.js Express Application`. The main goal is to clearly define the role of the key components needed, including the authentication middleware (`gatekeeper`), `/login` route that obtains the session `cookie`, and finally the `/logout` that destroys the session.

## ✔ Data Flow and Authentication Process in `simple terms`
**Functionality involved**:

| # | Code |
|:---|:---|
|1.| (REST POST request with JSON data) `POST http://localhost:3000/login Content-Type: application/json {    "username": 'Rodrigo", "password": "password123" }` |
|2.| `app.use(express.json())`|
|3.|`app.post('/login', (req, res) => { ... })`|

1. **Raw JSON Data Sent**: The `POST` request with the JSON block is the **raw JSON text** being sent over the network.

2. **Middleware Conversion**: The server notices the `POST` request, and the `app.use(express.json())` **middleware** intercepts the raw JSON text and converts it into a usable **JavaScript Object** stored in `req.body`.

3. **Destructuring & Extracting**: The `const { username, password } = req.body` used within the `app.post('/login', (req, res) => )`, uses **destructuring** to pull the values of the matching properties of the `POST` (`Rodrigo` , `password123`) out of the `req.body` object and assign them to local constans (`{ username, password }`).

4. **Database Lookup**: The local constants `{ username, password }`  are passed as arguments to `findUser(username, password)`, which performs the validation against the simulated database `users-db.js` ( which are placed these objects into an array named `users` )

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
    - `app.use(express.json());` this middleware **parses** JSON text.. meaning that handles the conversion of incoming JSON raw text from the `POST` `PUT` `PATCH` and converts this data into a JS object and makes it available in `req.body`.
    - *`express.json()` middleware reads this string (the data) and converts it into a usable **JavaScript Object (req.body)**  `{ username: 'Rorigo', password: 'password123' }`*
    - The raw JSON text was converted into a JavaScript object (req.body) by the middleware, and in the next step we use `descructuring` which simply extracts the values from that object.
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
        - 4.0 ` const { username, password } = req.body`. is a JavaScript operator that only works because `req.body` is a **JavaScript Object**
            - 4.0.1 It looks looks at the **JavaScript Object** stored in `req.body`.
            - 4.0.2 It creates two constants `username` and `password`.
            - 4.0.3 The names isnide the `{}` (username, password) **must match** the properties (keys) of the JavaScript object `req.body`.
        - 4.1 checking credentials.. (`user = findUser(...)`)
            -  4.1.1 Checks the credentials with the const variables `{ username, password }`, which holds the values from the response JavaScript Object `req.body`
        - 4.2 If `user` true...
            - 4.2.1 Creating custom properites `req.session.user = user.username` and `req.sesssion.role = user.role`. This action signals `express-session` middleware: **"This user is now authenticated, save this information please"**
            - 4.2.1 The server saves the state `user: 'Rodrigo', role: 'member'` in its memory (or session stored) AND THEN, sends the **Session ID Cookie** to the client. (*Important*) ( this req.session.user is later used in `isAuthentcated` middleware to confirm the user is logged in )
            - 4.2.2 Finally.. *Express magic (conversion)* express converts (technically serializes) this response `.send({ message: 'Login Succesful ✅', username: user.username })` into a **JSON string** and it adds an **HTTP header**: `Content-Type: application/json`
            - 4.2.3 Lastly..  (over the network): the server sends this **JSON string** back to the client (my REST Client `test-auth.http` or the browser), and it is the standard way to transmit structured data over the internet!!!.
        - 4.3 if `user` is false..
            - 4.3.1 Sends 

`simple terms`:
- **req.session** is like a locked box on the server where i keep the user's ID card (`username`) and their key to the building (`role`)
- The **Session ID Cookie** is the small key the user holds
- Everytime the user makes a request, they show the key (cookie), the server opens the box (req.session), and quickly checks the contents to confirm the users's identity and permisions.. in (`isAuthenticated` middleware)

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

`simple terms` :
- **req.session** is like a locked box on the server where i keep the user's ID card (`username`) and their key to the building (`role`)
- The **Session ID Cookie** is the small key the user holds
- Everytime the user makes a request, they show the key (cookie), the server opens the box (req.session), and quickly checks the contents to confirm the users's identity and permisions.. in (`isAuthenticated` middleware)
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

##  🏞️ FULL CODE

### `index.js`

```js
const express = require('express');
const session = require('express-session');
const { findUser } = require('./users-db.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(session({
    secret : 'my_super_secret_signing_key_12345',
    resave: false,
    saveUnintizilized: false
}));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username, password);

    if (user){
        req.session.user = user.username;
        req.session.role = user.role;
        
        res.status(200).send({ message: 'Login Successful ✅', username: user.username });
    } else {
        res.status(401).send({ message: 'Could not log in ❌ Invalid username or password' })
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err){
            return res.status(500).send({ message: 'Could not logout ❌' });
        }
        res.status(200).send({ message: 'Successful Logout ✔ Until Next Time 👋🏻' });
    });
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send({ message: 'Access Denied ❌. Please Log in first' });
    }
}

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`Welcome to the Protected Dashboard 🎛️ ${req.session.user}. Your role is ${req.session.role}! `);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Testa Login: POST to /login with JSON text { "username": "Rodrigo", "password": "password123" }`);
    console.log(`To access dashboard: GET http://localhost:${PORT}/dashboard`);
});
```

### `users-db.js`
```js
const users = [
    { id: 1, username: 'Rodrigo', password: 'password123', role: 'member' },
    { id: 2, username: 'admin', password: 'adminpassword', role: 'admin' }
];

const findUser = (username, password) => {
    return users.find(user => user.username === username && password === user.password);
}

module.exports = { findUser };
```

### `test-auth.http`
```http
# 1
GET http://localhost:3000/logout


GET http://localhost:3000/dashboard

POST http://localhost:3000/login
Content-Type: application/json

{
    "username": "Rodrigo",
    "password": "password123"
}

GET http://localhost:3000/dashboard

GET http://localhost:3000/logout

GET http://localhost:3000/dashboard
```

@rodrigcasio