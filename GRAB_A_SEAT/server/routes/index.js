const express = require('express');
const router = express.Router();

const userRouter = require('./userRoutes');
router.use('/user', userRouter);  // /api/user

const adminRouter = require('./adminRoutes');
router.use('/admin', adminRouter);  // /api/admin

const theatreRouter = require('./theatreRoutes');
router.use('/theatre', theatreRouter);  // /api/theatre




module.exports = router;