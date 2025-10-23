const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { findUserEmail } = require('./user-database');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'my_passwordlesss_secret_key_123';

const codeStore = {};   // in-memory storage (for temporary verification codes) 

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

app.post('/request-access', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
    }

    const user = findUserEmail(email);

    if (!user) {                                               // to decieve hackers (security step, using fake code)
        sendEmail(email, 'fake_code');
        return res.status(200).json({
            message: `Verification code successfully sent to ${email}. Check your console`
        });
    }

    const code = generateSecureCode();
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 min in mls
    
    codeStore[email] = {
        code,
        expires: expiresAt,
        userId: user.id,
        userRole: user.role
    };
    
    sendEmail(email, code);

    return res.status(200).json({
        message: `Verification code successfully sent to ${email}. Check your console`,
    });
});

app.post('/verify-code', (req, res) => {
    const { code, email } = req.body;

    if (!code || !email) {
        return res.status(400).json({ message: 'Email and verification code are required.' });
    }

    const storedData = codeStore[email];  
    
    // security checks:
    if (!storedData) {   // 1
        return res.status(401).json({ message: 'Invalid code or access request'});
    }
    
    if (Date.now() > storedData.expires) {  // 2
        delete codeStore[email];  // clear expired code
        return res.status(401).json({ message: 'Code expired. Please request a new code' });
    }
    
    if (storedData.code === code) {     // 3
        delete codeStore[email];    

        const payload = {
            id: storedData.id,
            email: email,
            role: storedData.userRole
        };

        const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({
            message: 'Verification successful. Access Token provided',
            token: accessToken,
            user: payload
        });
    } else {
        res.status(401).json({ message: 'Invalid code or acess request' });
    }
});

app.get('/dashboard', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied ❌. Token required.' });
    }

    jwt.verify(token.trim(), SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or Expired Token ⌛️' });
        }
        
        return res.status(200).json({
            message: `Welcome to the Dashboard ${decoded.email}. Your User ID is ${decoded.userId}.`,
            access_level: decoded.role,
            token_payload: decoded
        });
    });
});

app.listen(PORT, () => {
    console.log(`Passwordless Server running at http://localhost:${PORT}`);
    console.log(`Available ENDPOINTS: POST '/request-access', POST '/verify-token', GET '/dashboard'`);
});