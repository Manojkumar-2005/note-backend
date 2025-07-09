const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 🔐 Google login route
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// 🔄 Google callback
router.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login',
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    // Redirect with token to frontend
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

module.exports = router;
