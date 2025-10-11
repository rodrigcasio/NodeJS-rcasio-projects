// /profile router is independent
// Code order : Setup -> Middlewares -> Routes (endpoints) -> Error Handler -> Export module

const express = require('express');
const axios = require('axios');

const router = express.Router();

// 1. === Router-level middlewares ===

// 1- Notification Router-level Middleware (runs first)
router.use((req, res, next) => {
    console.log(`[Profile Router] Requested at ${new Date().toISOString()}`);
    next();
});

// 1.1 === Scoped level middleware ===
//Middleware Checking User ID (throws error if user places /profile/1)
router.use('/:id', (req, res, next) => {
    if (req.params.id == 1){
        throw new Error('You are no allowed to check the profile of admin! ❌');
    } else {
        console.log(`Successfully entered regular user ID profile ✅`);
        console.log(`Time: ${new Date().toISOString()}`);
        next(); 
    }
});

// 2. === Final Routes (endpoints) ===

router.get('/', (req, res) => {
    res.send(`🏠 Welcome to the Profile Home Page. Access your profile with your '/profile/# ID number 📋`);
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
        console.log(err.message);      // logging failure locally for debugging
        console.log('Error fetching data!');

        return next(err);    // passing the error obj to the error handler middleware
    }     
});

// 3. === Router-Level Error Middleware ===

// The final catch-all errors for this router (/profile)
router.use((err, req, res, next) => {
    if (err !== null){
        res.status(500).send(`[Local route error Handler] Error: ${err.toString()}`);
    } else {
        next();
    }
});

// 4. === export module ===
module.exports = router;






