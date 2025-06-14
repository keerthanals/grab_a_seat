const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  totalScreens: { type: Number, required: true },

  // Owner reference (User with role 'owner')
  ownerID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // Approval status managed by admin
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  // Optional rejection reason for clarity
  rejectionReason: {
    type: String,
    default: ''
  },

  // Approved by which admin
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Theatre', theatreSchema);