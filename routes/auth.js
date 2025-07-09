const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// 🔐 Google OAuth login → always prompt account selection
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',      // ✅ force Google to ask every time
    accessType: 'offline',         // optional: gets refresh token
    responseType: 'code',          // recommended for OAuth2
  })
);

// 🔐 Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

// 📝 Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields required" });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔓 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
