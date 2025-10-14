// Example of a session-based-authentication with express
// Main express server  (setting up session middleware and authentication route)

// 1
const express = require('express');
const session = require('express-session');
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

    if (user) {
        req.session.user = user.username;
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

// 5. Protected dashboard endpoints 
// middleware function  to check if the user is authenticated ( this will be used in the next endpoint '/dashboard' )
const isAuthenticated = (req, res, next) => {
    if (req.session.user){
        next();
    } else {
        res.status(401).send({ message: 'Access denied ❌. Please log in first'});
    }
}

//5.1
// GET endpoint for the dashboard ( protected by isAuthenticated middleware )
app.get('/dashboard', isAuthenticated, (req, res) => { 
    res.send(`Welcome to the protected dashboard, ${req.session.user}! Your role is: ${req.session.role}.`);
});

//6 Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Test Login: POST to /login with { "username": "user", "password": "password" }`);
    console.log(`Test Access: GET http://localhost:${PORT}/dashboard`);
});
