// Main application

const express = require('express');
const app = express();
const port = 3000;

const userRouter = require('./userRoute');  // importing route modules
const itemRouter = require('./itemRoute');

app.use('/item', itemRouter);       // attach the routers to specific base paths
app.use('/user', userRouter);

// Base route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Modular Express Server');
});

// start server
app.listen(port, () => {
    console.log(`Modular Express server listening at https://localhost:${port}`);
});


