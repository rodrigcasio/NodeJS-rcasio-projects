// handle the /item paths and including axios request

const express = require('express');
const axios = require('axios');

const router = express.Router();     // creating router instance 

// middleware example: this runs before every route in 'itemRouter'
router.use((req, res, next) => {
    console.log(`[Item Router] Request received at: ${new Date().toISOString()}`);
    next();
});

// matches GET requests to /item (it is mounted at /item in main app)
router.get('/', (req, res) => {
    res.send('You reached the Item home page.');
});

router.get('/about/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Information about item: ${userId}`);
});

// axios integrated (fetching posts from external API)
router.get('/fetch/posts', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json({
            message: 'Succesfully fetched posts via Axios!',
            data: response.data.slice(0, 5)         // returning only the first 5
        });
    } catch (err) {
        console.error(`Error fetching data:`, err.message);
        res.status(500).send(`Error fetching data from external API`);
    }
});

// export router instance
module.exports = router;

