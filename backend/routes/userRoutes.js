const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Private routes (protected by the 'protect' middleware)
router
  .route('/profile')
  .get(protect, getUserProfile) // GET request to /api/users/profile
  .put(protect, updateUserProfile); // PUT request to /api/users/profile

module.exports = router;
