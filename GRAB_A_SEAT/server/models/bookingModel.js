const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showID: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    theatreID: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true }, 
    seats: [{ type: String, required: true }], // Simpler representation for seat numbers
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
