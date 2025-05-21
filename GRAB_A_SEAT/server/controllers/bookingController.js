const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');

// User books a ticket
const createBooking = async (req, res) => {
  try {
    const userID = req.user._id;
    const { showID, seats, price, totalAmount } = req.body;

    const show = await Show.findById(showID);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    const booking = new Booking({
      userID,
      showID,
      theatreID: show.theatreID,
      seats,
      price,
      totalAmount
    });

    await booking.save();

    // Reduce available seats
    show.availableSeats -= seats.length;
    await show.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: View all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userID', 'name email')
      .populate('showID')
      .populate('theatreID');
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Owner: View bookings for their theatres
const getOwnerBookings = async (req, res) => {
  try {
    const ownerID = req.user._id;

    const theatres = await Theatre.find({ ownerID });
    const theatreIDs = theatres.map(t => t._id);

    const bookings = await Booking.find({ theatreID: { $in: theatreIDs } })
      .populate('userID', 'name email')
      .populate('showID');

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getOwnerBookings
};
