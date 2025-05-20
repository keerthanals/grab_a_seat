const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authAdmin = require('../middlewares/authAdmin');



// Approve or reject theatre
router.patch('/theatres/:id', authAdmin, adminController.approveRejectTheatre);

// Optional: Get all theatres (admin)
router.get('/theatre-list', authAdmin, adminController.getAllTheatres);

// Optional: Get all movies (admin)
router.get('/movie-list', authAdmin, adminController.getAllMovies);

module.exports = router;
