const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');

const createShow = async (req, res) => {
  try {
    const ownerID = req.user._id;
    const { theatreID, movieID, screenNumber, showTime, totalSeats } = req.body;

    // Validate input
    if (!theatreID || !movieID || !screenNumber || !showTime || !totalSeats) {
      return res.status(400).json({ message: 'All fields are required' });
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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createShow,
};
