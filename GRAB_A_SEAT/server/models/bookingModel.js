const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showID: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
    theatreID: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true }, 
    seats: [{ type: String, required: true }], // Array of seat identifiers like ["A1", "A2"]
    price: { type: Number, required: true }, // Price per seat
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['confirmed', 'cancelled', 'pending'], 
        default: 'confirmed' 
    },
    bookingDate: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);