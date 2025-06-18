const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authUser = require('../middlewares/authUser');
const authAdmin = require('../middlewares/authAdmin');
const authOwner = require('../middlewares/authOwner');

// User creates a booking
router.post('/', authUser, bookingController.createBooking);

// User gets their own bookings
router.get('/user-bookings', authUser, bookingController.getUserBookings);

// User cancels their booking
router.patch('/:id/cancel', authUser, bookingController.cancelBooking);

// Admin gets all bookings
router.get('/all-bookings', authAdmin, bookingController.getAllBookings);

// Owner gets their theatre bookings
router.get('/owner-bookings', authUser, authOwner, bookingController.getOwnerBookings);

module.exports = router;