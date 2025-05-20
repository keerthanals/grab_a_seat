const express = require('express');
const userRouter = express.Router();
const {register} = require('../controllers/userController');
const {login} = require('../controllers/userController');
const {profile} = require('../controllers/userController');
const {logout} = require('../controllers/userController');
const {updateProfile} = require('../controllers/userController');
const {deleteUser} = require('../controllers/userController');
const authUser = require('../middlewares/authUser');
const authAdmin = require('../middlewares/authAdmin');
const checkOwner = require('../middlewares/authOwner');
const verifyToken = require('../middlewares/verifyToken');



//signup
//  /api/user/register
userRouter.post('/register', register);

//login
//  /api/user/login
userRouter.post('/login', login);


//logout
userRouter.get('/logout', logout);

//profile
userRouter.get('/profile', authUser, profile);

//update profile
userRouter.patch('/profile-update', authUser, updateProfile);


//delete profile
userRouter.delete('/delete/:userId',authAdmin,deleteUser);

module.exports = userRouter;