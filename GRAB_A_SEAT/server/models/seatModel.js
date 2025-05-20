const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    screen: { type: String, required: true },
    row: { type: String, required: true },
    number: { type: String, required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model('Seat', seatSchema);
