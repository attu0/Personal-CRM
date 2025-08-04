const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getReminderById,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

// All reminder routes are protected
router.route('/')
  .get(protect, getReminders)
  .post(protect, createReminder);

router.route('/:id')
  .get(protect, getReminderById)
  .put(protect, updateReminder)
  .delete(protect, deleteReminder);

module.exports = router;
