// Example of using Application-level middleware

const express = require('express');
const app = express();
const port = 3000;

const shopRouter = require('./shopRoute');

app.use('/shop', shopRouter);

// app-level middleware 
app.use((req, res, next) => {
    if (req.query.password !== 'psw1234'){
        return res.status(402).send('The user cannot login ');
    }
    console.log(`Time: ${new Date.now()}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome, you are in the main Home page');
});

app.listen(port, () => {
    console.log(`Server listening at: http://localport:${port}`);
});