const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true },
  duration: { type: Number, required: true }, 
  description: { type: String },
  language: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  rating: { type: String }, 
  trailerUrl: { type: String }, // ✅ For YouTube embed URL
  poster: { type: String }, // URL or file path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
