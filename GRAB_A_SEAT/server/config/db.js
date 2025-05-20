const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    
    console.log("MONGODB_URI from env:", process.env.MONGODB_URI); 
    console.log('JWT_SECRET:', process.env.JWT_SECRET_KEY);
    

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is undefined. Check environment variable.");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB connected successfully to grabaseat in cloud");
  } catch (error) {
    console.error("DB connection error:", error);
  }
};

module.exports = connectDB;