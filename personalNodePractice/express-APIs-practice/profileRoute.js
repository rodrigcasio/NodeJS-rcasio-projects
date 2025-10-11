
const express = require('express');
const axios = require('axios');

const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Profile Router] Requested at ${new Date().toISOString()}`);
    next();
});






