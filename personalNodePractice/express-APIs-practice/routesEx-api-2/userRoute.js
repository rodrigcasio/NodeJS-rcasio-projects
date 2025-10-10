// module that handles the routes with /user

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(`You reached the User home page`);
});

router.get('/:userId', (req, res) => {
    const userId = req.params.userId;
    // quicknote : if wanted to fetch data user from external API here, we would put Axios call here, similar to the itemRouter
    res.send(`Fething details for User ID: ${userId}`);
});

module.exports = router;