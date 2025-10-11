// main app (index.js)
// Example of  implementing using Application-level middleware
// (global gatekeeper for the API)
// and adding a router-level in ./shopRoute

const express = require('express');
const app = express();
const port = 3000;

const shopRouter = require('./shopRoute');

// app-level middleware     1. mouting the app-level middlerware FIRST
app.use((req, res, next) => {
    if (req.query.password !== "pwd1234"){
        return res.status(402).send('The user cannot login, please enter password in URL');
    }
    console.log(`Successfully entered the right password ✅`);
    console.log(`Time: ${new Date().toISOString()}`);
    next();
});

// 2. then mount the router, so the pwd check protects it
app.use('/shop', shopRouter);

//3. also protected !
app.get('/', (req, res) => {
    res.send('Welcome, you are in the main Home page ☻');
});

// must enter "/?password=pwd1234"
app.listen(port, () => {                
    console.log(`Server listening at: http://localhost:${port}`);
});
