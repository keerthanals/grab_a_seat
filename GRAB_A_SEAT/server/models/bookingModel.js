const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [Object], required: true },
    showID: { type: mongoose.Schema.Types.ObjectId, required: true },
    seats: { type: [Object], required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
