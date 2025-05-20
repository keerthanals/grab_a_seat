const Theatre = require('../models/theatreModel');

// Owner: Create theatre (status defaults to 'pending')
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

// Admin: Approve or reject theatre
const updateTheatreStatus = async (req, res) => {
  try {
    const theatreId = req.params.id;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    theatre.status = status;
    theatre.rejectionReason = status === 'rejected' ? rejectionReason || '' : '';
    await theatre.save();

    res.status(200).json({ message: `Theatre ${status}`, theatre });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Owner: Get all theatres owned by logged-in owner
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

module.exports = {
  createTheatre,
  updateTheatreStatus,
  getOwnerTheatres,
};
