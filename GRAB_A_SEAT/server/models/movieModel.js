const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String },
  language: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  poster: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
