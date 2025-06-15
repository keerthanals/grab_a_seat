const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const User = require('../models/userModel');

// Approve or Reject Theatre
const approveRejectTheatre = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    console.log('Theatre approval request:', { theatreId, action, rejectionReason });

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    console.log('Theatre found:', theatre.name);

    if (action === 'approve') {
      theatre.status = 'approved';
      theatre.rejectionReason = '';
      theatre.approvedBy = req.user._id;
    } else {
      theatre.status = 'rejected';
      theatre.rejectionReason = rejectionReason || 'No reason provided';
    }

    await theatre.save();
    console.log('Theatre status updated to:', theatre.status);

    res.status(200).json({ 
      message: `Theatre ${action}d successfully`, 
      theatre: {
        id: theatre._id.toString(),
        name: theatre.name,
        status: theatre.status,
        rejectionReason: theatre.rejectionReason
      }
    });

  } catch (error) {
    console.error('Theatre approval error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve or Reject Admin User
const approveRejectAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    console.log('Admin approval request:', { userId, action, rejectionReason });

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

    console.log('Admin user found:', user.name);

    if (action === 'approve') {
      user.status = 'active';
      user.approvedBy = req.user._id;
      user.rejectionReason = '';
    } else {
      user.status = 'rejected';
      user.rejectionReason = rejectionReason || 'No reason provided';
    }

    await user.save();
    console.log('Admin status updated to:', user.status);

    res.status(200).json({ 
      message: `Admin ${action}d successfully`, 
      user: { 
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        status: user.status,
        rejectionReason: user.rejectionReason
      }
    });

  } catch (error) {
    console.error('Admin approval error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get pending admin requests
const getPendingAdmins = async (req, res) => {
  try {
    console.log('Fetching pending admins...');
    
    const pendingAdmins = await User.find({ 
      role: 'admin', 
      status: 'pending' 
    }).select('-password');
    
    console.log('Pending admins found:', pendingAdmins.length);
    console.log('Pending admins data:', pendingAdmins.map(admin => ({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      status: admin.status
    })));
    
    res.status(200).json({ pendingAdmins });
  } catch (error) {
    console.error('Get pending admins error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all theatres (for admin dashboard)
const getAllTheatres = async (req, res) => {
  try {
    console.log('Fetching all theatres...');
    
    const theatres = await Theatre.find().populate('ownerID', 'name email');
    
    console.log('Raw theatres found:', theatres.length);
    
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
    
    console.log('Transformed theatres:', transformedTheatres.length);
    console.log('Pending theatres:', transformedTheatres.filter(t => !t.approved).length);
    
    res.status(200).json({ theatres: transformedTheatres });
  } catch (error) {
    console.error('Get all theatres error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    console.log('Fetching all movies...');
    
    const movies = await Movie.find();
    
    console.log('Raw movies found:', movies.length);
    
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
    
    console.log('Transformed movies:', transformedMovies.length);
    
    res.status(200).json({ movies: transformedMovies });
  } catch (error) {
    console.error('Get all movies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    console.log('Fetching all users...');
    
    const users = await User.find().select('-password');
    
    console.log('Users found:', users.length);
    console.log('User roles breakdown:', {
      admin: users.filter(u => u.role === 'admin').length,
      owner: users.filter(u => u.role === 'owner').length,
      user: users.filter(u => u.role === 'user').length
    });
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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