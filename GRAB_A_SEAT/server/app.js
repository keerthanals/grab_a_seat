const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT
const connectDB = require('./config/db');
const router = require('./routes/index');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.json());
app.use('/api', router);
app.use(cookieParser());

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
