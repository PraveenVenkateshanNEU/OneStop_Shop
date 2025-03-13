const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = { id: user._id, email: user.email };
    const secret = process.env.JWT_SECRET || 'your_jwt_secret';
    const options = { expiresIn: '1h' };

    return jwt.sign(payload, secret, options);
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null; // Return null if verification fails
    }
};

module.exports = { generateToken, verifyToken };
