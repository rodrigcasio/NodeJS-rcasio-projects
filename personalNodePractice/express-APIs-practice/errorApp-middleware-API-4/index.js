// Examples of Error-handling middlewares
// 1. error handler mw app-level example with /users/:id
// 2. error handler mw router-level example /profile/:id

// if placed 1 in /user/1.. throws error with error-handling middleware

const express = require('express');
const app = express();
const port = 3000;

const profileRouter = require('./profileRoute');

// mounts idenpendently  (freely using /profile/:id)
app.use('/profile', profileRouter);

// - 1st middleware (executes this log when accessing main http://localhost:3000)
app.use((req, res, next) => {
    console.log(`[Main App] Requested at ${new Date().toISOString()}`);
    next();
});

// response:
app.get('/', (req, res) => {
    res.send('🏡 Welcome to this Express Server. This is the Main Home Page👋🏻.\n 📝 Please write your "/user/#" ID number to access their Profile');
});

// 2nd app-level middleware, attached to the 1st Error-handler middleware
app.use('/user/:id', (req, res, next) => {
    if (req.params.id == 1) {
        throw new Error('Trying to access admin login ❌. You dont have access to this user ID');
    } else {
        console.log('Successfully entered regular user ID');
        console.log(`Time ${new Date().toISOString()}`);

        next();      // moves to the next mw or finishes the chain
    }
});

// - 1st  error-handling middleware, executes if /user/1 placed
app.use((err, req, res, next) => {
    if (err !== null) {
        res.status(500).send(err.toString());
    } else{
        next();
    }
});

app.get('/user/:id', (req, res) => {
    res.send(`✅ 🙋 Hello User ID: ${req.params.id}\n Access your profile with 'profile/#id' `);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});