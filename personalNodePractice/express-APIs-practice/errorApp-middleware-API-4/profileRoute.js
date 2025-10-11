// /profile router is independent

const express = require('express');
const axios = require('axios');

const router = express.Router();

// 1. notification router-level middleware
router.use((req, res, next) => {
    console.log(`[Profile Router] Requested at ${new Date().toISOString()}`);
    next();
});

router.get('/', (req, res) => {
    res.send(`🏠 Welcome to the Profile Home Page. Access your profile with your '/profile/# ID number 📋`);
});

// 2. router-level middlware checking user id number other than admin.. which is 1
router.use('/:id', (req, res, next) => {
    if (req.params.id == 1){
        throw new Error('You are no allowed to check the profile of admin! ❌');
    } else {
        console.log(`Successfully entered regular user ID profile ✅`);
        console.log(`Time: ${new Date().toISOString()}`);
        next(); 
    }
});

// error handler middleware, which catches the error thrown!
router.use((err, req, res, next) => {
    if (err !== null){
        res.status(500).send(err.toString());
    } else {
        next();
    }
});

router.get('/:id', (req, res) => {
    res.send(`📂 ✅ You reached the Profile home page of user ID: ${req.params.id} 🧍`);
});

router.get('/fetch/friends', async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json({
            message: "Successfuly fetched friends info",
            data: response.data.slice(0, 3)
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Error fetching friends data');
    }
});

module.exports = router;






