// API with Examples of Error-handling middlewares
// 1. error handler mw app-level example with /users/:id
// 2. error handler mw router-level example /profile/:id

// best practice order : 
// Setup -> Global Middleware -> Routers -> Routes -> Error Handlers -> Launch

// if placed 1 in /user/1.. throws error with error-handling middleware

const express = require('express');
const app = express();
const port = 3000;

const profileRouter = require('./profileRoute');

// 1. ==== Application-level middlewares (global checks)

//global logger
app.use((req, res, next) => {
    console.log(`[Main App] Requested at ${new Date().toISOString()}`);
    next();
});

//User ID Security Check (throw error if id is 1)
app.use('/user/:id', (req, res, next) => {
    if (req.params.id == 1) {
        throw new Error('Trying to access admin login ❌. You dont have access to this user ID');
    } else {
        console.log('Successfully entered regular user ID');
        console.log(`Time ${new Date().toISOString()}`);

        next();      // moves to the next mw or finishes the chain
    }
});

// 2. ==== Routers (Modular Routing )

//mounts the independent /profile router
app.use('/profile', profileRouter);


// 3. ==== Final Routes (Specific Endpoints)

// Main Home Page Route
app.get('/', (req, res) => {
    res.send('🏡 Welcome to this Express Server. This is the Main Home Page👋🏻.\n 📝 Please write your "/user/#" ID number to access their Profile');
});

// User ID Route (runs after the security check)
app.get('/user/:id', (req, res) => {
    res.send(`✅ 🙋 Hello User ID: ${req.params.id}\n Access your profile with 'profile/#id' `);
});

// 4. ==== Global error handler (the final safety net)

// App-level Error Middleware (catches errors thrown anywhere above)
app.use((err, req, res, next) => {
    if (err !== null) {
        res.status(500).send(err.toString());
    } else{
        next();
    }
});

// 5. ==== Server Launch
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});