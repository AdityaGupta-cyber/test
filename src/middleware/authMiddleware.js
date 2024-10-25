const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'ADITYA_GUPTa';

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

const authenticateJwt = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            req.user = verifyToken(token)
        } catch (error) {
            return res.status(403).redirect("/");
        }
    } else {
        return res.status(401).render('error',{ message: 'Please Login again.' });
    }
    next();
};

module.exports = authenticateJwt;
