const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./passport'); // passport strategy setup

dotenv.config();

const app = express(); // ✅ initialize express first

// ✅ Middleware setup
app.use(cors({
  origin: 'http://localhost:5173', // frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// ✅ Register routes — add this here
app.use('/api/auth', require('./routes/auth')); // ← 🔥 this line
app.use('/api/notes', require('./routes/notes'));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
