const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');
const Movie = require('../models/movieModel');

const addMovie = async (req, res) => {
  try {
    const { title, description, duration, genre, releaseDate, language } = req.body;
    const poster = req.file ? req.file.path : null;

    if (!title || !description || !duration || !genre || !releaseDate || !language) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMovie = new Movie({
      title,
      description,
      duration,
      genre,
      releaseDate,
      language,
      poster,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ message: 'Movie added successfully', movie: savedMovie });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Create theatre (pending by default)
const createTheatre = async (req, res) => {
  try {
    const { name, location, totalScreens } = req.body;
    const ownerID = req.user._id;

    if (!name || !location || !totalScreens) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTheatre = new Theatre({
      name,
      location,
      totalScreens,
      ownerID,
      status: 'pending',
    });

    const savedTheatre = await newTheatre.save();
    res.status(201).json({ message: "Theatre created, pending admin approval", theatre: savedTheatre });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all theatres owned by logged-in owner
const getOwnerTheatres = async (req, res) => {
  try {
    const ownerID = req.user._id;
    const theatres = await Theatre.find({ ownerID });
    res.status(200).json({ theatres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const createShow = async (req, res) => {
  try {
    const ownerID = req.user._id;
    const { theatreID, movieID, screenNumber, showTime, totalSeats } = req.body;

    // Validate input
    if (!theatreID || !movieID || !screenNumber || !showTime || !totalSeats) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate showTime format
    if (isNaN(new Date(showTime).getTime())) {
      return res.status(400).json({ message: 'Invalid show time format' });
    }

    // Check theatre ownership and approval
    const theatre = await Theatre.findById(theatreID);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    if (theatre.ownerID.toString() !== ownerID.toString()) {
      return res.status(403).json({ message: 'You do not own this theatre' });
    }

    if (theatre.status !== 'approved') {
      return res.status(403).json({ message: 'Theatre is not approved yet' });
    }

    // Create show with availableSeats = totalSeats
    const newShow = new Show({
      theatreID,
      movieID,
      screenNumber,
      showTime,
      totalSeats,
      availableSeats: totalSeats,
    });

    const savedShow = await newShow.save();
    res.status(201).json({ message: 'Show created successfully', show: savedShow });

  } catch (error) {
    console.error('Error creating show:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createShow,
  createTheatre,
  getOwnerTheatres, 
  addMovie,
  
};
