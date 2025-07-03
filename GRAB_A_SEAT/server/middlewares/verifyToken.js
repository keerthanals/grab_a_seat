const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    console.log('Auth header:', authHeader);

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        console.log('Token extracted:', token ? 'Token present' : 'No token');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log('Token decoded successfully:', { id: decoded.id, role: decoded.role });
            req.user = decoded; // attach user info to request
            return next();
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    } else {
        console.log('No authorization header or invalid format');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
};

module.exports = verifyToken;