// Main app

const express = require('express');
const jwt  = require('jsonwebtoken');
const { findUser } = require('./users-db');

const app = express();
const PORT = 3000;

const SECRET_KEY = 'my_super_secure_jwt_secret_key_7890';

app.use(express.json());

// JWT verification middleware 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    const token = authheader && authheader.split('')[1];

    if(token == NULL){  // if token was provided at all
        return res.status(401).send({ message: 'Access Denied ❌. No token was provided in Autherization header.'});
    }
    
    // verifying if token is using secret key
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.send(403).send({ message: 'Invalid or expired token ⌛️'});
        }

        // token is valid. Store the decoded user payload on the request object
        req.user = decoded;
        next();
    });
}

// endpoint login
app.get('/login', (req, res) => {
    const { username, password } = req.body;
    const user = findUser(username, password);
    
    if (user) {

    }
});