const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authAdmin = require('../middlewares/authAdmin');

// Add movie
router.post('/movies', authAdmin, adminController.addMovie);

// Approve or reject theatre
router.patch('/theatres/:id', authAdmin, adminController.approveRejectTheatre);

// Optional: Get all theatres (admin)
router.get('/theatres', authAdmin, adminController.getAllTheatres);

// Optional: Get all movies (admin)
router.get('/movies', authAdmin, adminController.getAllMovies);

module.exports = router;
