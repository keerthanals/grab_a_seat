const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const User = require('../models/userModel');

// Approve or Reject Theatre
const approveRejectTheatre = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const { action } = req.body; // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    if (action === 'approve') {
      theatre.status = 'approved';
      theatre.rejectionReason = '';
    } else {
      theatre.status = 'rejected';
      theatre.rejectionReason = req.body.rejectionReason || 'No reason provided';
    }

    await theatre.save();

    res.status(200).json({ message: `Theatre ${action}d successfully`, theatre });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve or Reject Admin User
const approveRejectAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }

    if (action === 'approve') {
      user.status = 'active';
      user.approvedBy = req.user._id;
      user.rejectionReason = '';
    } else {
      user.status = 'rejected';
      user.rejectionReason = rejectionReason || 'No reason provided';
    }

    await user.save();

    res.status(200).json({ message: `Admin ${action}d successfully`, user: { ...user.toObject(), password: undefined } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get pending admin requests
const getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.find({ 
      role: 'admin', 
      status: 'pending' 
    }).select('-password');
    
    res.status(200).json({ pendingAdmins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all theatres (for admin dashboard)
const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().populate('ownerID', 'name email');
    
    // Transform the data to match frontend expectations
    const transformedTheatres = theatres.map(theatre => ({
      id: theatre._id.toString(),
      name: theatre.name,
      location: theatre.location,
      ownerId: theatre.ownerID._id.toString(),
      ownerName: theatre.ownerID.name,
      ownerEmail: theatre.ownerID.email,
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
    
    res.status(200).json({ theatres: transformedTheatres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
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

// Get all movies (for admin dashboard)
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    
    // Transform the data to match frontend expectations
    const transformedMovies = movies.map(movie => ({
      id: movie._id.toString(),
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genre: Array.isArray(movie.genre) ? movie.genre : [movie.genre],
      rating: movie.rating || 'PG-13',
      releaseDate: movie.releaseDate,
      poster: movie.poster || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
      trailerUrl: movie.trailerUrl,
      language: movie.language || 'English',
      createdAt: movie.createdAt
    }));
    
    res.status(200).json({ movies: transformedMovies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  approveRejectTheatre,
  approveRejectAdmin,
  getPendingAdmins,
  getAllTheatres,
  getAllMovies,
  getAllUsers,
};