// Example of a session-based-authentication with express
// Main express server  (setting up session middleware and authentication route)

// 1
const express = require('express');
const express = require('express-session');
const { findUser }= require('./users-db');

const app = express();
const PORT = 3000;

// 2
app.use(express.json());            // middleware allowing express to read incoming JSON data from posts req (like login forms)

// 3
app.use(session({
    secret: 'my_super_secret_signing_key_12345',
    resave: false,
    saveUninitialized: false
}));

//4.  (post endpoint, [handling login attempts])
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = findUser(username, password);

    if (user){
        req.session.user = username;
        req.session.role = user.role;
        
        res.status(200).send({ message: 'Loggin successful ✅', username: user.username });     // are we sending responses as JSON messages ?
    } else {
        res.status(401).send({ message: 'Invalid username or password.'});
    }
});

//4.1 (get endpoint, [handling logout])
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err){
            return res.status(500).send({ message: 'Could not logout ❌'});
        }
        res.status(200).send({message: 'Successful logout!. Until nextime 👋🏻'});
    });
});

