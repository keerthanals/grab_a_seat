const express = require('express');
const router = express.Router();

const userRouter = require('./userRoutes');
router.use('/user', userRouter);  // /api/user

const adminRouter = require('./adminRoutes');
router.use('/admin', adminRouter);  // /api/admin

const theatreRouter = require('./ownerRoutes');
router.use('/theatre', theatreRouter);  // /api/theatre

const bookingRouter = require('./bookingRoutes');
router.use('/booking', bookingRouter);  // /api/booking

const reviewRouter = require('./reviewRoutes');
router.use('/review', reviewRouter);  // /api/review




module.exports = router;