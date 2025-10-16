// Main app

const express = require('express');
const jwt  = require('jsonwebtoken');
const { findUser } = require('./users-db');

const app = express();
const PORT = 3000;

const SECRET_KEY = 'my_super_secure_jwt_secret_key_7890';

app.use(express.json());

// JWT verification middleware 