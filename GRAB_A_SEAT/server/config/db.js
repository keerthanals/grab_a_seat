const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGODB_URI from env:", process.env.MONGODB_URI); 
    console.log('JWT_SECRET:', process.env.JWT_SECRET_KEY);

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is undefined. Check your .env file.");
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI); 

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
