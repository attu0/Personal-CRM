const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const protect = async (req, res, next) => {
  let token;

  // Check if the token is sent in the headers and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 1. Get token from header (e.g., "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user by the ID from the token and attach it to the request object
      // We exclude the password field from being returned
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Move on to the next function (the actual route controller)
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect };
