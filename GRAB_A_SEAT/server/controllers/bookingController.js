const Booking = require('../models/bookingModel');
const Show = require('../models/showModel');
const Theatre = require('../models/theatreModel');
const User = require('../models/userModel');

// User books a ticket
const createBooking = async (req, res) => {
  try {
    const userID = req.user._id;
    const { showtimeId, seats, totalAmount } = req.body;

    console.log('Creating booking:', { userID, showtimeId, seats, totalAmount });

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

    console.log('Booking created successfully:', booking._id);
    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User gets their own bookings
const getUserBookings = async (req, res) => {
  try {
    const userID = req.user._id;
    
    const bookings = await Booking.find({ userID })
      .populate('showID')
      .populate('theatreID');
    
    // Transform bookings to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      id: booking._id.toString(),
      userId: booking.userID.toString(),
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
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User cancels their booking
const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userID = req.user._id;
    
    const booking = await Booking.findOne({ _id: bookingId, userID }).populate('showID');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    // Restore available seats
    const show = await Show.findById(booking.showID._id);
    if (show) {
      show.availableSeats += booking.seats.length;
      await show.save();
    }
    
    console.log('Booking cancelled successfully:', bookingId);
    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error);
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
    console.error('Get all bookings error:', error);
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
    console.error('Get owner bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
  getOwnerBookings
};