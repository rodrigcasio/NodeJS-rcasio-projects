# Practice for `Token-Based-Authentication` with `express`

When using Token authentication, there are important features to keep in mind about where the data is stored:

- **Login Result**: Server sends a JWT in the **JSON** response.
- **User Data Storage**: The user **Data** `username`, `role` is stored inside the token itself (`const payload`) (the client holds the data)
- **Authentication Flow**: Client sends a **Token** in the **Authorization Header** -> Server **verifies** the token's signature -> Access is granted.

## 📂 Files 

1. `index.js` **Main server app**
2. `users-db.js` **Database simulation**

## 🆗 Simple Terms 

`Token-Based-Authentication` is like checking into a **members-only** club using a high-tech membership card..

1. **The Membership Card Creation (Login /POST)
    1. **Proving Identity**: Giving my name and password to the security desk (the /login route)

    2. **Verify and Create**: The security desk checks their records ( `users-db.js` ). If valid, they dont give a key... but they create an special, signed **Membership Card** (the JWT). This card contains your name and member status (`role`)

    3. **Secure signature**: They sign the card with a **secret stamp** (`SECRET_KEY`) that only the **club** owns. This stamp proves the card is real and hasn't been tampered with.

    4. **Receive the card**: The server gives you the JWT card. **You are responsable for carrying it.

2. **The Membership Card Check** ( acessing `GET` `/dashboard` )
    1. **Present the Card**: When you approach the VIP room door (the `/dashboard` route), you show your card in the **Authorization Header**.

    2. **The Gatekeeper**: The `verifyToken` middleware acts as the gatekeeper.

    3. **Check number 1: Is it real?**: The gatekeeper uses the club's secret stamp (`SECRET_KEY`) to verify the card's signature.
        - *If the stamp does not match, or the card is expired -> **403 Forbidden** (you have a card but it is **fake** or useless)
    
    4. **Check numeber 2: Who is it?**: If the signature is valid, the gatekeeper safely reads the information from the card (`req.user = decoded`).

    5. **Access Granted**: The gatekeeper says `next()`, allowing you inside the VIP room, and passes your user information to the main route handler, which can now say *Welcome...*.

## 🧩 Token Based Authentication Flow 🌀

Token-Based Authentication is like a digital passport system. When I log in, the server give me a **secure, signed token** instead of a traditional session cookie. Then It is a must to present this token to access protected resources ( in this case the `/dashboard` route )

1. **Authentication Step** (`POST/login`)

|Actor| Action | Code 
|:---|:---|:---|
|**Client**| Sends a **username** and **password** in the request body **POST**| `POST http://localhost:3000/login   Content-Type: application/json { ... }|
|**Server**| 1. Uses `findUser()` to check credentials in the `users-db.js` simulated database| `const user = findUser(username, password);`|
|**Server**| 2. If valid, creates a **Payload** ( a JavaScript object ) with user data like (`id`, `username`, `role`).| `const payload = { id: user.id, username: user.username, ... }`|
|**Server**| 3. Creates (in technical terms **signs**) the **JWT** using the `Payload`, the `SECRET_KEY`, and an expiration time| `const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })`|
|**Server**| 4. Sends the **JWT string** back in the JSON response.| `return res.status(200).json({ token: token ... });`|
|**Client**| Stores the received JWT (usually in local storage) `in this case we just copy it.. hehe`| |

2. **The Authorization Step** (`GET/dashboard`)

|Actor|Action| Code|
|:---|:---|:---|
|**Client**| Sends the request, placing the token in `Authorization` header prefixed by `Bearer` | `Authorization: Bearer **<the_JWT_TOKEN**`|
|**Server (middleware)** |1. The important `verifyToken` middleware intercepts the request| `app.get('/dashboard', verifyToken ...)`|
|**Server (middleware)**| 2. It extracts the **raw token string** from the header `Authorization`| `const token = authHeader && authHeader.split(' ')[1];`|
|**Server (middleware)**| 3. It **verifies** the token using the **SECRET_KEY**. This checks the signature, integrity and expiration.| `jwt.verify(token, SECRET_KEY, (err, decoded) => )`|
|**Server (middleware)**|4. If **valid**: The decoded user payload (`id`, `username`, `role`) is attached to the request object (`req.user`) and calls `next()`| `req.user = decoded; next();`|
|**Server Handler**| 5. The `/dashboard` route handlers receives the request, now containing the user data | `const user = req.user`|
|**Server Handler**| 6. Sends the personalized data/page back to the client | `res.status(200).json({ message: 'Welcome to the Dashboard ${user.username}!', role: user.role, userPayload: user })`|

(plus) **JWT Verification Failure Cases**

**If** token is invalid during Step `2`, the `jwt.verify` function returns an **err**

|Failure type| Status Code| Reason|
|:---|:---|:---|
|**Missing/No Token**| `401 Unauthorized`| The `Authorization` header was missing or empty|
|**Invalid/Expired Token**| `403 Forbidden`| The token was sent but either the **signature** was wrong, or the token is **expireed**|


## 🏛️ Code Structure 

## `index.js`

1. **Setting up tools needed for API**
    - 1.1 `jwt` this library is essential for creating (signing) and verifying (decoding) the actual JWTs
```js
const express = require('express');
const jwt = require('jsonwebtoken');
const { findUser } = require('./users-db');

const app = express();
const SECRET_KEY = 'my_super_secure_jwt_secret_key_7890';
```

2. **Middleware `verifyToken`**
*`verifyToken` middleware acts like a digital ID scanner, it receives the digital ID scan (`token`), scans it with the `SECRET_KEY`, and only if the card is authentic and not expired, does it allow the user to pass through to the `/dashboard`*

    | code | does |
    |:---|:---|
    |- **2.0** `const authHeader = req.headers['authorization'];`| When the client (like the `test-auth.http`) makes a request to a protected route (`/dashboard`), it **must** include the `Authorization` **header**. This is the common standard for passing **JWTs**. The value looks like this: `Bearer ayJAjssdaYHBajsdjfkas`|
    |- **2.1** `const token = authHeader && authHeader.split(' ')[1];`| This line does **two** things. 1. the `authHeader &&`: checks if the header even exists. If not `token` will be `undefined` |
    | ✔ | 2. `authHeader.split(' ')[1];`: The Header string is split at the space, creating an array `['Bearer', 'ayJAjssdaYHBajsdjfkas']`|
    | ✔ | 3. `[1]` Here we are selecting the **second element** (index 1), which is the **raw JWT** string itself. This is what the `**token**` variable holds|
    |Finally.. | **token will hold**: `const token = 'ayJAjssdaYHBajsdjfkasaskdkJSJDjksjKJDJSOBSIJ-3-sd-12-332';`|
    |--|---|
    |**2.2** `if (token == null) { return res.status(401).send({ message: 'Access Denied... }) }`| If the client didn't send the `Authorization` header, or if the header was formatted incorrectly ( or token is `undefined` or `null`), it stops the request and sends an **401 Unathorized** response, telling the client they failed to authenticate|
    |--|---|
    |**2.3** `jwt.verify(token, SECRET_KEY, (err, decoded) => { if (err) { return ... } else { req.user = decoded; next(); }})`| `jwt.verify(token, SECRET_KEY (err, decoded) => { ... })` This is where **jsonwebtoken** does **3 checks** simultaneously: | 
    |✔| 1. **Signature** It checks if the token was signed using the same **SECRET_KEY** the server knows.|
    |✔|2. **Integrity** Confirms if the **token** structure is correct|
    |✔|3. **Expiration** It checks if the `exp`(expiration time) inside the token is too old, it fails..|
    |--|---|
    |**2.4** `(err, decoded) => {...}`| This is the callback function.|
    |✔| This is the callbacks function's result: `err` will be present if any of the verifications checks **fails** (signature, expiration).`decoded`: if successfull.. this is the original **JavaScript Object (the payload)** we used to create the token at `/login`: `{ id: user.id, username: user.username, role: user.role }`|
    |--|---|
    |**2.5** `if (err) { return res.status(403).send({ message: ... })}`| If the verification fails, we send a **403 Forbidden** status ( meaning the token was sent but the **token** is invalid )|
    |✔| `req.user = decoded;` If the **token is valid** we take the decoded user data (`username, role, etc.`) and attach it to the `req` object. this is how the `/dashboard` **route** knows who the user is|
    |✔| FInally... `next();` : **express says**: This user authenticated and verified, move on to the next function in the chain `/dashboard` endpoint handler.|

```js
    const verifyToken = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) {
            return res.status(401).json({ message: 'Access Denied ❌. no token provided on Authorization header' });
        }
    
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token ⌛️' });
            }

            req.user = decoded;
            next();           
        });
    }
```
3. `app.post('/login', ..` route
*this route main goal is to **authenticate the user against the database and, if successfull, **generate and issue a JWT***
    |code|does|
    |:---|:---|
    |3.1 `const { username, password } = req.body` | **Destructures** the JSON body ( the request post that is JSON raw data is converted to a JavaScript Object by **express.json()**), to easly access the sumbited `username` and `password` values.|
    |--|---|
    |3.2 `const user = findUser(username, password);`| Calling the reusable function that is located in the database `users-db.js` simulation. **This is the authentication step.. If the **credentials match** (`request` and database `credentials`), **user** holds the full user **object**.. on the otherhand, it will be `undefined`.|
    |--|---|
    |3.4 `if (user ) {...}` | This block will only run if the database **lookup** successfully authenticated the **credentials** matching with the request|
    |--|---|
    |3.5 `const payload = { id: user.id, username: user.username, role: user.role };`| Defining the **JWT Payload**, `The data` (a JavaScript object) that will be stored inside the **token**. Taking non-sensitive details like `id`, `username` and `role` **from** the authenticated `const user` object.|
    |--|---|
    |3.6 `const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });`| **Generating the JWT** , here is the main call to the `jsonwebtoken` module...|
    |✔| 3.6.1. ` jwt.sign(payload `: The data to encode inside the token|
    |✔| 3.6.2. `SECRET_KEY`: The private key used to sign the token. The signature proves the token came from **this server**and has not been modified|
    |✔| 3.6.3. `{ expiresIn: '1h' }`: The option object sets the token automatically expire after **one hour**.|
    |--|---|
    |3.7 `return res.status(200).json({ message: 'Login Successful ✅. Token provided', ... });`| Sending a successful **200** OK reponse. `.json()` is used to make sure `express` sends a well-formed JSON response, automatically converting the **JavaScript Object** (`{ message: ' ... '}`) to a **JSON** string over the network.|
    |✔| **Finally**.. `token: token` This is the **most important part** of the response. The client receives this **JWT string (token)**. The client **MUST** then save this string and attach it to the `Authorization` header of all future responses.|
    |--|---|
    |3.8 `} else { ... }`| If the `const user = findUser(...)`| If `findUser()` returned **undefined**|
    |3.9 `res.status(401).send({ message: 'Could not log in ❌ Invalid username or password' });`| Sending a **401 Unauthorized response**. This tells the client the login failed due to **wrong** credentials placed in the **POST request JSON raw text**, without providing details on which credential (`username`, `password`) was wrong..  **(security purposes)**|
```js
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username, password);

    if (user) {
        const payload = { id: user.id, username: user.username, role: user.role };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login Successful ✅. Token provided',
            token: token
        });
    } else {
        res.status(401).json({ message: 'Could not log in ❌ Invalid username or password' });
    }
});
```

4.  `app.get('/dashboard', verifyToken, (req, res) => { ... })`
    - **This route can be known as the protected route**

|Code| Does|
|:---|:---|
|4.1 `app.get('/dashboard', verifyToken, (req, res) => { ... })`| Defines the route handler for **GET** HTTP request to the route `/dashboard`.**First it lists `verifyToken` before the main handler function.. This **tells** express: '`Run the **verifyToken** middleware frst`. If the middleware calls `next();`, it will proceed the function `(req, res)`|
|4.2 `const user = req.user;`| If it reaches this line, it means the `JTW` was successfully verified. The `verifyToken` stored the decoded payload (`{ id: 1, username: 'Rodrigo',  role: 'member }`) onto the **req** object. We can pull the data off the request for easy access |
|4.3 `if(!user) { .. } ` | While the middleware already handles errors, this provides a safety check. If for some reason, the user data is missing, ( or any internal logic error ocurred before `req.user` was set ) we stop and send an error |
|4.4 `return res.status(200).json({ message: 'Welcome to the Dashboard, ${user.username}', role: user.role, userPayload: user, });`| Sending a successful **200** OK messsage with personalized content |

```js
app.get('/dashboard', verifyToken, (req, res) => {
    const user = req.user;
    
    if (!user) {
        return res.status(500).json({ message: 'Internal Server Error: User data missing after verification' });
    }
    
    return res.status(200).json({
        message: `Welcome to the Dashboard ${user.username}`,
        role: user.role,
        userPayload: user
    });
});
```
5. `app.listen(PORT ...)` **Launch Server**

```js
app.listen(PORT, () => {
    console.log(`Token Server running on http://localhost:${PORT}`) ;
});
```

### `users-db.js` **Simulated User Database**
```js
const users = [
    { id: 1, username: 'Rodrigo', password: 'password123', role: 'member'},
    { id: 2, username: 'Admin', password: 'adminpassword', role: 'admin' }
];

const findUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
}

module.exports = { findUser };
```

## 🩻 Full Code 

### `index.js`

```js
const express = require('express');
const jwt = require('jsonwebtoken');
const { findUser } = require('./users-db');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'my_super_secure_jwt_secret_key_7890';

app.use(express.json());

// Middleware gatekeeper
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send({ message: 'Access Denied ❌. No token provided in Authorization header' });
    }

    jwt.verify(token.trim(), SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log('JWT Verification Failed:', err.message);
            return res.status(403).json({ message: 'Invalid or Expired Token ⌛️' });
        }   

        req.user = decoded;
        next();
    });
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username, password);

    if (user) {
        const payload = { id: user.id, username: user.username, role: user.role };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Successful Login ✅ Token provided',
            token: token
        });
    } else {
        res.status(401).json({ message: 'Could not Log in ❌ Invalid Username or Password' });
    }
});

app.get('/dashboard', verifyToken, (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(500).json({ message: 'Internal Server Error: User data missing after verification'})
    }

    return res.status(200).json({
        message: `Welcome to the Dashboard ${user.username}`,
        role: user.role,
        userPayload: user,
    }); 
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
```

### `users-db.js`

```js
const users = [
    { id: 1, username: 'Rodrigo', password: 'password123', role: 'member' },
    { id: 2, username: 'Admin', password: 'adminpassword', role: 'admin' }
];

const findUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
}

module.exports = { findUser };
```

### `test-auth.http`

```http
### 1. Attempting to access the guarded /dashboard (should fail: 401 Unauthorized)
GET http://localhost:3000/dashboard

### 2. Loggin in (Should be successful)
POST http://localhost:3000/login
Content-Type: application/json

{
    "username": "Rodrigo",
    "password": "password123"
}

### Important: To automatically capture the response token for the next request, it is needed a response handler
# IT does not work, PLEASE JUST COPY PASTE THE TOKEN Beside Bearer <token>
@t = {{ response.body.token }}

### 3. Accessing the protected Dashbaord with manually pasting the token
# The correct format: Authorization: Bearer <the_jwt_token_here>
# Here we added the full token provided
GET http://localhost:3000/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJSb2RyaWdvIiwicm9sZSI6Im1lbWJlciIsImlhdCI6MTc2MTAxMzE4NywiZXhwIjoxNzYxMDE2Nzg3fQ.A-QAI7nRO9yxYk2EP_1rEy52lQYzqpsbnDQZ2ZHXy5c

### 4. Attempt to access with an Invalid Token (Should fail: 403 Forbidden)
GET http://localhost:3000/dashboard
Authorization: Bearer invalidToken
```

@rodrigcasio