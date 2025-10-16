# Practice for `Token-Based-Authentication` with `express`

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