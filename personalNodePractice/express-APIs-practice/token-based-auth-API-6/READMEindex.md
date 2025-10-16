# Practice for `Token-Based-Authentication` with `express`

When using Token authentication, there are important features to keep in mind about where the data is stored:

- **Login Result**: Server sends a JWT in the **JSON** response.
- **User Data Storage**: The user **Data** `username`, `role` is stored inside the token itself (`const payload`) (the client holds the data)
- **Authentication Flow**: Client sends a **Token** in the **Authorization Header** -> Server **verifies** the token's signature -> Access is granted.

## 📂 Files 

1. `index.js` **Main server app**
2. `users-db.js` **Database simulation**

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
    | code | does |
    |:---|:---|
    |- **2.0** `const authHeader = req.headers['authorization'];`| When the client (like the `test-auth.http`) makes a request to a protected route (`/dashboard`), it **must** include the `Authorization` **header**. This is the common standard for passing **JWTs**. The value looks like this: `Bearer ayJAjssdaYHBajsdjfkas`|
    |- **2.1** `const token = authHeader && authHeader.split(' ')[1];`| This line does **two** things. 1. the `authHeader &&`: checks if the header even exists. If not `token` will be `undefined` |
    | ✔ | 2. `authHeader.slice(' ')[1];`: The Header string is split at the space, creating an array `['Bearer', 'ayJAjssdaYHBajsdjfkas']`|
    | ✔ | 3. `[1]` Here we are selecting the **second element** (index 1), which is the **raw JWT** string itself. This is what the `**token**` variable holds|
    |Finally.. | **token will hold**: `const token = 'ayJAjssdaYHBajsdjfkasaskdkJSJDjksjKJDJSOBSIJ-3-sd-12-332';`|
    |--|---|
    |**2.2** `if (token == NULL ) { return res.status(401).send({ message: 'Access Denied... }) }`| If the client didn't send the `Authorization` header, or if the header was formatted incorrectly ( or token is `undefined` or `null`), it stops the request and sends an **401 Unathorized** response, telling the client they failed to authenticate|
    |--|---|
    |**2.3** `jwt.verify(token, SECRET_KEY, (err, decoded) => { if (err) { return ... } else { req.user = decoded; next(); }})`| `jwt.verify(token, SECRET_KEY (err, decoded) => { ... })` This is where **jsonwebtoken** does **3 checks** simultaneously: | 
    |✔| 1. **Signature** It checks if the token was signed using the same **SECRET_KEY** the server knows.|
    |✔|2. **Integrity** Confirms if the **token** structure is correct|
    |✔|3. **Expiration** It checks if the `exp`(expiration time) inside the token is too old, it fails..|
    |--|---|
    |**2.4** `(err, decoded) => {...}`| This is the callback function.|
    |✔| This is the callbacks function's result: `err` will be present if any of the verifications checks **fails** (signature, expiration).`decoded`: if successfull.. this is the original **JavaScript Object (the payload)** we used to create the token at `/login`: `{ id: user.id, username: user.username, role: user.role }`|
    |--|---|
    |**2.5** `if (err) { return res.status(403).send({ message: ... })}`| If the verification fails, we send a **401 Forbidden** status ( meaning the token was sent but the **token** is invalid )|
    |✔| `req.user = decoded;` If the **token is valid** we take the decoded user data (`username, role, etc.`) and attach it to the `req` object. this is how the `/dashboard` **route** knows who the user is|
    |✔| FInally... `next();` : **express says**: This user authenticated and verified, move on to the next function in the chain `/dashboard` endpoint handler.|
```js
    const verifyToken = (req, res, next) => {
        const authHeader = req.headers['Authorization'];
        
        const token = authHeader && authHeader.split(' ')[1];

        if(token == NULL){
            return res.status(401).send({ message: 'Access Denied ❌. no token provided on Authorization header' });
        }
    
        jwt.sign(token, SECRET_KEY, (err, decode) => {
            if (err) {
                return res.status(403).send({ message: 'Invalid or expired token ⌛️' });
            }

            req.user = decode;
            next();           
        });

    }
```


       
