// src/utils/tokenUtils.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'ADITYA_GUPTa';

function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
        expiresIn: '1h',
    });
}

module.exports = { generateToken };
