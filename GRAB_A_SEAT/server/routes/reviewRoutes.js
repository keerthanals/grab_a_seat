const express = require('express');
const router = express.Router();
const {
  addReview,
  getMovieReviewsByOwner,
  deleteReview,
  getAllReviewsByAdmin,
  getAllReviews,
} = require('../controllers/reviewController');

const authAdmin = require('../middlewares/authAdmin');
const authUser = require('../middlewares/authUser');
const authOwner = require('../middlewares/authOwner');

// 1. User adds a review (only if they've booked and watched)
router.post('/', authUser, addReview);

// 2. Owner views all reviews for a movie shown in their theatre
router.get('/owner/:movieID', authOwner, getMovieReviewsByOwner);

// 3. Admin deletes a review
router.delete('/admin/:reviewID', authAdmin, deleteReview);

// 4. Admin gets all reviews for a movie
router.get('/admin/:movieID', getAllReviewsByAdmin);

// 5. Public endpoint to get all reviews for a movie
router.get('/movie/:movieID', getAllReviews);

module.exports = router;