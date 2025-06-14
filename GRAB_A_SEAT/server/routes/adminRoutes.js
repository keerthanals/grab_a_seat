const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authAdmin = require('../middlewares/authAdmin');

// Approve or reject theatre
router.patch('/theatres/:id', authAdmin, adminController.approveRejectTheatre);

// Approve or reject admin user
router.patch('/users/:id', authAdmin, adminController.approveRejectAdmin);

// Get pending admin requests
router.get('/pending-admins', authAdmin, adminController.getPendingAdmins);

// Get all users
router.get('/users', authAdmin, adminController.getAllUsers);

// Get all theatres (admin)
router.get('/theatre-list', authAdmin, adminController.getAllTheatres);

// Get all movies (admin)
router.get('/movie-list', authAdmin, adminController.getAllMovies);

module.exports = router;