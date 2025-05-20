const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authUser = require('../middlewares/authUser');
const authOwner = require('../middlewares/authOwner');

// Create show (owner only)
router.post('/shows', authUser, authOwner, ownerController.createShow);

module.exports = router;
