const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');

// Add Movie
const addMovie = async (req, res) => {
  try {
    const { title, description, duration, genre, releaseDate } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({ message: 'Title, description, and duration are required' });
    }

    const newMovie = new Movie({
      title,
      description,
      duration,
      genre,
      releaseDate,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: savedMovie });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or Reject Theatre
const approveRejectTheatre = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    theatre.status = status;
    theatre.rejectionReason = status === 'rejected' ? rejectionReason || '' : '';
    await theatre.save();

    res.status(200).json({ message: `Theatre ${status}`, theatre });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: Get all theatres (for admin dashboard)
const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().populate('ownerID', 'name email');
    res.status(200).json({ theatres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Optional: Get all movies (for admin dashboard)
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({ movies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addMovie,
  approveRejectTheatre,
  getAllTheatres,
  getAllMovies,
};
