const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser');
const authAdmin = require('../middlewares/authAdmin');
const authOwner = require('../middlewares/authOwner');
const ownerController = require('../controllers/ownerController');
const upload = require('../middlewares/upload');

// Owner creates theatre request
router.post('/', authUser, authOwner, ownerController.createTheatre);

// Updated for file upload [add movie]
router.post('/movies', authOwner, upload.single('poster'), ownerController.addMovie);

// Owner fetches own theatres
router.get('/my-theatres', authUser, authOwner, ownerController.getOwnerTheatres);

// Create show (owner only)
router.post('/shows', authUser, authOwner, ownerController.createShow);

// Get owner shows
router.get('/shows', authUser, authOwner, ownerController.getOwnerShows);

// Update show (owner only)
router.patch('/shows/:id', authUser, authOwner, ownerController.updateShow);

// Delete show (owner only)
router.delete('/shows/:id', authUser, authOwner, ownerController.deleteShow);

module.exports = router;