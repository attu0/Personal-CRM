const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/userModel'); // Adjust path if necessary

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback', // Must match the one in Google Cloud Console
      },
      async (accessToken, refreshToken, profile, done) => {
        // This function is called when a user successfully authenticates with Google.
        // 'profile' contains the user's Google profile information.
        
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          // We can add more fields like profile.photos[0].value for an avatar
        };

        try {
          // Check if the user already exists in our database
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // If user exists, just pass them along
            done(null, user);
          } else {
            // If user doesn't exist, create a new user in our database
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
          done(err, null);
        }
      }
    )
  );

  // These functions are used to save the user to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
  });
};
