const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');

// User books a ticket
const createBooking = async (req, res) => {
  try {
    const userID = req.user._id;
    const { showtimeId, seats, totalAmount } = req.body;

    const show = await Show.findById(showtimeId);
    if (!show) return res.status(404).json({ message: 'Show not found' });

    // Check if enough seats are available
    if (show.availableSeats < seats.length) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const booking = new Booking({
      userID,
      showID: showtimeId,
      theatreID: show.theatreID,
      seats,
      price: totalAmount / seats.length, // Calculate price per seat
      totalAmount,
      status: 'confirmed'
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
    
    // Transform bookings to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      userId: booking.userID._id.toString(),
      userName: booking.userID.name,
      userEmail: booking.userID.email,
      showtimeId: booking.showID._id.toString(),
      theatreId: booking.theatreID._id.toString(),
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      status: booking.status || 'confirmed',
      bookingDate: booking.bookingDate,
      createdAt: booking.createdAt
    }));
    
    res.status(200).json({ bookings: transformedBookings });
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
      .populate('showID')
      .populate('theatreID');

    // Transform bookings to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      userId: booking.userID._id.toString(),
      userName: booking.userID.name,
      userEmail: booking.userID.email,
      showtimeId: booking.showID._id.toString(),
      theatreId: booking.theatreID._id.toString(),
      seats: booking.seats,
      totalAmount: booking.totalAmount,
      status: booking.status || 'confirmed',
      bookingDate: booking.bookingDate,
      createdAt: booking.createdAt
    }));

    res.status(200).json({ bookings: transformedBookings });
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