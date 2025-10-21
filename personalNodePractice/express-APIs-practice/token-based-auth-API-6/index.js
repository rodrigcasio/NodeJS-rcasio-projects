// Main app

const express = require('express');
const jwt  = require('jsonwebtoken');
const { findUser } = require('./users-db');

const app = express();
const PORT = 3000;

const SECRET_KEY = 'my_super_secure_jwt_secret_key_7890';

app.use(express.json());

// JWT verification middleware 
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const cleanToken = token ? token.trim() : null;

    // Diagnostic to solve issue with FORBIDDEN error 
    console.log('--- VERIFICATION ATTEMPT --- ');
    console.log('Secret Key length:', SECRET_KEY.length);
    console.log('Token Received (Bearer):', authHeader);
    console.log('Clean Token length', cleanToken ? cleanToken.length : null);

    if (cleanToken == null) {
        return res.status(401).send({ message: 'Access Denied ❌. Not token provided on Authorization header.' });
    }

    jwt.verify(cleanToken, SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(`JWT Verification Failed: ${err.message}`);
            return res.status(403).send({ message: 'Invalid or expired token ⌛️' });
        }
        
        req.user = decoded;
        next();
    });
}

app.post('/login', (req, res) => {
    console.log('Received login body', req.body);       // quick diagnostic 

    const { username, password } = req.body;
    const user = findUser(username, password);

    if (user) {
        const payload = { id: user.id, username: user.username, role: user.role };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login Successful ✅. Token provided ⚘.',
            token: token
        });
    } else {
        res.status(401).send({ message: 'Could not log in ❌ Invalid username or password' });
    }
});

app.get('/dashboard', verifyToken, (req, res) => {
    const user = req.user;
    
    if (!user) {
        return res.status(500).json({ message: 'Internal Server Error: User data is missing after verification.'});
    }
    
    return res.status(200).json({
        message: `Welcome to the Dashboard ${user.username}`,
        role: user.role,
        userPayload: user
    });
});

app.listen(PORT, () => {
    console.log(`Token Server running on http://localhost:${PORT}`);
});