const express = require('express');
const router = express.Router();
const authUser = require('../middlewares/authUser');
const authOwner = require('../middlewares/authOwner');
const ownerController = require('../controllers/ownerController');
const upload = require('../middlewares/upload');

// Owner creates theatre request - Use authUser first, then authOwner
router.post('/', authUser, ownerController.createTheatre);

// Updated for file upload [add movie] - Use authOwner directly since it includes authUser functionality
router.post('/movies', authOwner, upload.single('poster'), ownerController.addMovie);

// Owner fetches own theatres - Use authUser first, then authOwner
router.get('/my-theatres', authUser, ownerController.getOwnerTheatres);

// Create show (owner only) - Use authUser first, then authOwner
router.post('/shows', authUser, ownerController.createShow);

// Get owner shows - Use authUser first, then authOwner
router.get('/shows', authUser, ownerController.getOwnerShows);

// Update show (owner only) - Use authUser first, then authOwner
router.patch('/shows/:id', authUser, ownerController.updateShow);

// Delete show (owner only) - Use authUser first, then authOwner
router.delete('/shows/:id', authUser, ownerController.deleteShow);

module.exports = router;