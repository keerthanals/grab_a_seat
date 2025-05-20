const jwt = require('jsonwebtoken');

const createToken = (id, role) => {
    try {
        return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
    } catch (error) {
        console.error('Token generation failed:', error);
    }
};

module.exports = createToken;
