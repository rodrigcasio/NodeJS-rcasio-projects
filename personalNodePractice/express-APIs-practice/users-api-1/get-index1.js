// This is an example of creating an Express API which follows REST architecural style and becomes a RESTful API
// 2. Added a middleware chain example

const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

app.get('/', (req, res) => {
    res.send('Hello everyone!, This is an Express Server!');
})

app.get('/fetch-users', async (req , res) => {
    try {
        const response = await axios.get('http://jsonplaceholder.typicode.com/users');        // Axios automatically runs JSON.parse() on the received text
        console.log(`Data fetched successfully ✅`);
        res.json(response.data);              // here is not necessary to use  JSON.parse(response.data)
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});

// middleware function
const logger = (req, res, next) => {        
    console.log(`Request received for ${req.url}`);
    next();     // passes control to the next function
}

app.get('/fetch-users2', logger, async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        res.json(response.data);
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
})

app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});