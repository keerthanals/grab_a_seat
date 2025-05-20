const User = require('../models/userModel');
const verifyToken = require('./verifyToken'); // Your existing token verification middleware

const authUser = (req, res, next) => {
  // First verify the token and set req.user with decoded info
  verifyToken(req, res, async () => {
    try {
      // req.user contains decoded token payload (id, role)
      const user = await User.findById(req.user.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user; // Attach full user object
      next();

    } catch (error) {
      console.error('authUser error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};

module.exports = authUser;
