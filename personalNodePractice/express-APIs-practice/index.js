// Example of Error-handling middlewares
// if placed 1 in /user/1.. throws error with error-handling middleware

const express = require('express');
const app = express();
const port = 3000;

const profileRouter = require('./profileRoute');

// app-level middleware 
app.use('/user/:id', (req, res, next) => {
    if (req.params.id === 1) {
        throw new Error('Trying to access admin login');
    } else {
        console.log('Successfully entered regular user ID');
        console.log(`Time ${new Date().toISOString()}`);

        next();      // moves to the next middleware
    }
});

// error-handling middleware, executes if /user/1 placed
app.use((err, req, res, next) => {
    if (err !== null) {
        res.status(500).send(err.toString());
    } else{
        next();
    }
});

app.use('/profile', profileRouter);

app.get('/user/:id', (req, res) => {
    res.send(`Hello User ID: ${req.params.id}`);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});








/*  cant this be possible.. instead o writing two app.use(()) ?
app.use('/user/:id', (err, req, res, next) => {
    if (req.params.id === 1) {
        throw new Error('Trying to access admin login');
        res.status(500).send(err.toString());
    } else {
        next();
    }
});
*/