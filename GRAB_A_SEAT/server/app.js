const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3001;
const connectDB = require('./config/db');
const router = require('./routes/index');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true,                
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to DB, server not started.');
    process.exit(1); // Stop process if DB fails
  });
