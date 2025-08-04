const express = require('express');
const passport = require('passport');
const router = express.Router();
const generateToken = require('../utils/generateToken'); // Import the token generator

// @desc    Auth with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    // On successful authentication, req.user is available.
    // We create a user object to be stored in localStorage, similar to email login.
    const userInfo = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      token: generateToken(req.user._id), // Generate a JWT for the user
    };

    // Redirect to a special frontend route, passing the user info as a query parameter.
    // We stringify and encode it to make it URL-safe.
    res.redirect(`http://localhost:5173/auth/google/callback?userInfo=${encodeURIComponent(JSON.stringify(userInfo))}`);
  }
);

// @desc    Logout user
// @route   GET /api/auth/logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('http://localhost:5173/');
  });
});


module.exports = router;
