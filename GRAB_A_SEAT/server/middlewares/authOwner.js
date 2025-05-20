const User = require('../models/userModel');
const verifyToken = require('./verifyToken'); // import your existing verifyToken middleware

const authOwner = async (req, res, next) => {
  // First, call verifyToken to verify JWT and populate req.user with decoded info
  verifyToken(req, res, async () => {
    try {
      // req.user has { id, role } from token
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role !== 'owner') {
        return res.status(403).json({ message: 'Access denied. Owners only.' });
      }

      req.user = user; // Attach full user object
      next();

    } catch (error) {
      console.error('authOwner error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = authOwner;
