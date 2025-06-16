const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');
const Movie = require('../models/movieModel');

const addMovie = async (req, res) => {
  try {
    console.log('Add movie request body:', req.body);
    console.log('Add movie file:', req.file);
    
    const { title, description, duration, genre, releaseDate, language, rating, trailerUrl } = req.body;
    const poster = req.file ? req.file.path : null;

    if (!title || !description || !duration || !genre || !releaseDate || !language) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Parse genre if it's a string
    let genreArray = genre;
    if (typeof genre === 'string') {
      genreArray = [genre];
    }

    const newMovie = new Movie({
      title,
      description,
      duration: parseInt(duration),
      genre: genreArray,
      releaseDate,
      language,
      rating: rating || 'PG-13',
      poster: poster || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
      trailerUrl: trailerUrl || ''
    });

    const savedMovie = await newMovie.save();
    console.log('Movie saved successfully:', savedMovie._id);
    
    res.status(201).json({ 
      message: 'Movie added successfully', 
      movie: savedMovie 
    });

  } catch (error) {
    console.error('Add movie error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create theatre (pending by default)
const createTheatre = async (req, res) => {
  try {
    console.log('Create theatre request body:', req.body);
    console.log('User creating theatre:', req.user._id);
    
    const { name, location, screenCount } = req.body;
    const ownerID = req.user._id;

    if (!name || !location || !screenCount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTheatre = new Theatre({
      name,
      location,
      totalScreens: parseInt(screenCount),
      ownerID,
      status: 'pending',
    });

    const savedTheatre = await newTheatre.save();
    console.log('Theatre saved successfully:', savedTheatre._id);
    
    res.status(201).json({ 
      message: "Theatre created, pending admin approval", 
      theatre: savedTheatre 
    });

  } catch (error) {
    console.error('Create theatre error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all theatres owned by logged-in owner
const getOwnerTheatres = async (req, res) => {
  try {
    const ownerID = req.user._id;
    console.log('Getting theatres for owner:', ownerID);
    
    const theatres = await Theatre.find({ ownerID });
    console.log('Owner theatres found:', theatres.length);
    
    // Transform the data to match frontend expectations
    const transformedTheatres = theatres.map(theatre => ({
      id: theatre._id.toString(),
      name: theatre.name,
      location: theatre.location,
      ownerId: theatre.ownerID.toString(),
      approved: theatre.status === 'approved',
      status: theatre.status,
      rejectionReason: theatre.rejectionReason,
      screens: Array.from({ length: theatre.totalScreens }, (_, i) => ({
        id: `screen-${i + 1}`,
        name: `Screen ${i + 1}`,
        seatLayout: {
          rows: 10,
          columns: 12,
          seatMap: generateSeatMap(10, 12)
        }
      })),
      createdAt: theatre.createdAt
    }));
    
    console.log('Transformed theatres:', transformedTheatres.map(t => ({
      id: t.id,
      name: t.name,
      ownerId: t.ownerId,
      approved: t.approved,
      status: t.status
    })));
    
    res.status(200).json({ theatres: transformedTheatres });
  } catch (error) {
    console.error('Get owner theatres error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Helper function to generate seat map
const generateSeatMap = (rows, columns) => {
  const seatMap = {};
  for (let row = 0; row < rows; row++) {
    const rowLabel = String.fromCharCode(65 + row); // A, B, C, etc.
    for (let col = 1; col <= columns; col++) {
      const seatId = `${rowLabel}${col}`;
      // Make some seats premium (last 3 rows)
      seatMap[seatId] = row >= rows - 3 ? 'premium' : 'regular';
    }
  }
  return seatMap;
};

const createShow = async (req, res) => {
  try {
    console.log('Create show request body:', req.body);
    console.log('User creating show:', req.user._id);
    
    const ownerID = req.user._id;
    const { movieId, theatreId, screenId, date, startTime, priceRegular, pricePremium } = req.body;

    // Validate input
    if (!theatreId || !movieId || !screenId || !date || !startTime || !priceRegular || !pricePremium) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check theatre ownership and approval
    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    if (theatre.ownerID.toString() !== ownerID.toString()) {
      return res.status(403).json({ message: 'You do not own this theatre' });
    }

    if (theatre.status !== 'approved') {
      return res.status(403).json({ message: 'Theatre is not approved yet' });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Extract screen number from screenId (e.g., "screen-1" -> 1)
    const screenNumber = parseInt(screenId.split('-')[1]);

    // Create show
    const newShow = new Show({
      theatreID: theatreId,
      movieID: movieId,
      screenNumber: screenNumber,
      date: date,
      startTime: startTime,
      price: {
        regular: parseFloat(priceRegular),
        premium: parseFloat(pricePremium)
      },
      totalSeats: 120,
      availableSeats: 120
    });

    const savedShow = await newShow.save();
    console.log('Show saved successfully:', savedShow._id);
    
    res.status(201).json({ 
      message: 'Show created successfully', 
      show: savedShow 
    });

  } catch (error) {
    console.error('Error creating show:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createShow,
  createTheatre,
  getOwnerTheatres, 
  addMovie,
};