const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');
const Movie = require('../models/movieModel');

// POST: User - add a review for a movie
const addReview = async (req, res) => {
  try {
    const userID = req.user._id;
    const { movieId, rating, comment } = req.body;

    console.log('Add review request:', { userID, movieId, rating, comment });

    // Validate input
    if (!movieId || !rating) {
      return res.status(400).json({ message: "Movie ID and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    // Optional: check if already reviewed
    const existingReview = await Review.findOne({ userID, movieID: movieId });
    if (existingReview) {
      return res.status(409).json({ message: "You have already reviewed this movie" });
    }

    const review = new Review({
      userID,
      movieID: movieId,
      rating: parseInt(rating),
      comment: comment || ''
    });

    const savedReview = await review.save();
    console.log('Review saved successfully:', savedReview._id);

    // Populate user data for response
    const populatedReview = await Review.findById(savedReview._id).populate('userID', 'name email');

    res.status(201).json({ 
      message: "Review submitted successfully", 
      review: {
        _id: populatedReview._id,
        movieID: populatedReview.movieID,
        userID: populatedReview.userID,
        rating: populatedReview.rating,
        comment: populatedReview.comment,
        createdAt: populatedReview.createdAt
      }
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET: Owner - view all reviews for a movie shown in their theatre
const getMovieReviewsByOwner = async (req, res) => {
  try {
    const ownerID = req.user._id;
    const { movieID } = req.params;

    console.log('Get owner movie reviews:', { ownerID, movieID });

    // Check if this owner had any show of this movie
    const theatres = await Theatre.find({ ownerID });
    const theatreIDs = theatres.map(t => t._id);

    const shows = await Show.find({
      theatreID: { $in: theatreIDs },
      movieID
    });

    if (shows.length === 0) {
      return res.status(403).json({ message: "You have no shows for this movie" });
    }

    const reviews = await Review.find({ movieID }).populate('userID', 'name email');
    
    console.log('Owner reviews found:', reviews.length);
    res.status(200).json({ reviews });

  } catch (error) {
    console.error('Get owner movie reviews error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET: Admin - get all reviews for a movie
const getAllReviewsByAdmin = async (req, res) => {
  try {
    const { movieID } = req.params;

    console.log('Get admin movie reviews for movie:', movieID);

    const reviews = await Review.find({ movieID })
      .populate('userID', 'name email')
      .populate('movieID', 'title')
      .sort({ createdAt: -1 });

    console.log('Admin reviews found:', reviews.length);

    // Transform reviews for frontend
    const transformedReviews = reviews.map(review => ({
      _id: review._id,
      movieID: review.movieID,
      userID: review.userID,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt
    }));

    res.status(200).json({ reviews: transformedReviews });

  } catch (error) {
    console.error('Error fetching admin movie reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE: Admin - delete inappropriate review
const deleteReview = async (req, res) => {
  try {
    const { reviewID } = req.params;
    
    console.log('Delete review request:', reviewID);
    
    const deleted = await Review.findByIdAndDelete(reviewID);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    console.log('Review deleted successfully:', reviewID);
    res.status(200).json({ message: "Review deleted successfully" });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addReview,
  getMovieReviewsByOwner,
  deleteReview,
  getAllReviewsByAdmin
};