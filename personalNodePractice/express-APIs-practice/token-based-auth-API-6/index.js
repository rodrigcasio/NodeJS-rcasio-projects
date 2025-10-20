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

    if (token == null) {
        return res.status(401).send({ message: 'Access Denied ❌. Not token provided on Authorization header.' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(403).send({ message: 'Invalid or expired token ⌛️' });
        }
        
        req.user = decoded;
        next();
    });
}

app.post('/login', (req, res) => {
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