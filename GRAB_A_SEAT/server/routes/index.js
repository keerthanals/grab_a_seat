const express = require('express');
const router = express.Router();

const userRouter = require('./userRoutes');
router.use('/user', userRouter);  // /api/user

const adminRouter = require('./adminRoutes');
router.use('/admin', adminRouter);  // /api/admin

const ownerRouter = require('./ownerRoutes');
router.use('/owner', ownerRouter);  // /api/owner

const bookingRouter = require('./bookingRoutes');
router.use('/bookings', bookingRouter);  // /api/bookings

const reviewRouter = require('./reviewRoutes');
router.use('/reviews', reviewRouter);  // /api/reviews

module.exports = router;