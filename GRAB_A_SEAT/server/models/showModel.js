const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  theatreID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true,
  },
  movieID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  screenNumber: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // Store as YYYY-MM-DD format
    required: true,
  },
  startTime: {
    type: String, // Store as HH:MM format
    required: true,
  },
  price: {
    regular: {
      type: Number,
      required: true,
    },
    premium: {
      type: Number,
      required: true,
    }
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 120
  },
  availableSeats: {
    type: Number,
    required: true,
    default: function() {
      return this.totalSeats;
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Show', showSchema);