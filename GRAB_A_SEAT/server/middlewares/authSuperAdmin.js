const User = require('../models/userModel');
const verifyToken = require('./verifyToken');

const authSuperAdmin = async (req, res, next) => {
  // First verify token & attach decoded info to req.user
  verifyToken(req, res, async () => {
    try {
      // req.user contains { id, role } from token payload
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Access denied. Super admins only.' });
      }

      req.user = user; // override with full user object
      next();

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = authSuperAdmin;