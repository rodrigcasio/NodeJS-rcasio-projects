const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { findUserEmail } = require('./user-database');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'my_passwordlesss_secret_key_123';

const codeStore = {};

app.use(express.json());

// helper functions
const generateSecureCode = () => {
    return crypto.randomBytes(3).readUIntBE(0, 3).toString().padStart(6, '0').slice(-6);
}

const sendEmail = (email, code) => {
    console.log(`\n=======================`);
    console.log(`   Simualted Email Sent `);
    console.log(`   to: ${email}`);
    console.log(`   Verification Code: ${code} (Expires in 5 minutes)`);
    console.log(`========================\n`);
}

