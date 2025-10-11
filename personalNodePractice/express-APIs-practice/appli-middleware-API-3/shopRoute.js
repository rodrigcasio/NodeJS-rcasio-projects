// shop route.
// handling /shop

const express = require('express');
const axios = require('axios');

const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Shop Router] Requested at: ${new Date().toISOString()}`);
    next();
});

router.get('/', (req, res) => {
    res.send('You reached the Shop Home page');
});

router.get('/about/pencil/:id', (req, res) => {
    pencilId = req.params.id;
    res.send(`Information about pencil ID: ${pencilId} ✏️`);
});

router.get('/fetch/posts', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json({
            message: "Succesfully fetch posts with axios!",
            data: response.data.slice(0, 3)
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;