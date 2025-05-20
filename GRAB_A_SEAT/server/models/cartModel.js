const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [Object], required: true },
    showID: { type: mongoose.Schema.Types.ObjectId, required: true },
    price: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
