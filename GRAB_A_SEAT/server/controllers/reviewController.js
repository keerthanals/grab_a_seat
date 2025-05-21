const Review = require('../models/reviewModel');
const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');
const Movie = require('../models/movieModel');

// POST: Add review (only if user booked and show has passed)
const addReview = async (req, res) => {
  try {
    const userID = req.user._id;
    const { movieID, rating, comment } = req.body;

    // Validate input
    if (!movieID || !rating) {
      return res.status(400).json({ message: "Movie ID and rating are required" });
    }

    // Find if the user has any past booking for this movie
    const bookings = await Booking.find({ userID });

    let hasWatched = false;

    for (const booking of bookings) {
      const show = await Show.findById(booking.showID);
      if (show && show.movieID.toString() === movieID && new Date(show.showTime) < new Date()) {
        hasWatched = true;
        break;
      }
    }

    if (!hasWatched) {
      return res.status(403).json({ message: "You can only review movies you’ve watched" });
    }

    const review = new Review({
      userID,
      movieID,
      rating,
      comment
    });

    await review.save();
    res.status(201).json({ message: "Review submitted successfully", review });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET: Owner - view all reviews for a movie shown in their theatre
const getMovieReviewsByOwner = async (req, res) => {
  try {
    const ownerID = req.user._id;
    const { movieID } = req.params;

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

    const reviews = await Review.find({ movieID }).populate('userID', 'name');
    res.status(200).json({ reviews });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllReviewsByAdmin = async (req, res) => {
  try {
    const { movieID } = req.params;

    const reviews = await Review.find({ movieID })
      .populate('userID', 'name email')
      .populate('movieID', 'title');

    // Add theatre and show info by mapping showID -> theatre
    const detailedReviews = await Promise.all(reviews.map(async (review) => {
      const show = await Show.findById(review.showID).populate('theatreID', 'name location');
      return {
        reviewID: review._id,
        movieTitle: review.movieID.title,
        user: review.userID,
        rating: review.rating,
        comment: review.comment,
        theatre: show?.theatreID || null,
        showTime: show?.showTime || null,
        createdAt: review.createdAt,
      };
    }));

    res.status(200).json({ reviews: detailedReviews });

  } catch (error) {
    console.error('Error fetching admin movie reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE: Admin - delete inappropriate review
const deleteReview = async (req, res) => {
  try {
    const { reviewID } = req.params;
    const deleted = await Review.findByIdAndDelete(reviewID);

    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json({ message: "Review deleted" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addReview,
  getMovieReviewsByOwner,
  deleteReview,
  getAllReviewsByAdmin
};
