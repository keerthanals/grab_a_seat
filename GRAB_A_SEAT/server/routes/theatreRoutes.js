const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');
const authUser = require('../middlewares/authUser');
const authAdmin = require('../middlewares/authAdmin');
const checkOwner = require('../middlewares/authOwner');

// Owner creates theatre request
router.post('/', authUser, checkOwner, theatreController.createTheatre);

// Admin approves or rejects theatre
router.patch('/approve/:id', authAdmin, theatreController.updateTheatreStatus);

// Owner fetches own theatres
router.get('/my-theatres', authUser, checkOwner, theatreController.getOwnerTheatres);

module.exports = router;
