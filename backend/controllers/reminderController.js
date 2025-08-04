const Reminder = require('../models/reminderModel');

/**
 * @desc    Get all reminders for the logged-in user
 * @route   GET /api/reminders
 * @access  Private
 */
const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id }).sort({ date: 1 });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new reminder
 * @route   POST /api/reminders
 * @access  Private
 */
const createReminder = async (req, res) => {
  const { title, eventType, date, notes } = req.body;

  if (!title || !eventType || !date) {
    return res.status(400).json({ message: 'Title, event type, and date are required' });
  }

  try {
    const reminder = await Reminder.create({
      user: req.user._id,
      title,
      eventType,
      date,
      notes,
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update a reminder
 * @route   PUT /api/reminders/:id
 * @access  Private
 */
const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Check if the reminder belongs to the logged-in user
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this reminder' });
    }

    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedReminder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Delete a reminder
 * @route   DELETE /api/reminders/:id
 * @access  Private
 */
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Check if the reminder belongs to the logged-in user
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this reminder' });
    }

    await Reminder.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get a single reminder
 * @route   GET /api/reminders/:id
 * @access  Private
 */
const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Check if the reminder belongs to the logged-in user
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this reminder' });
    }

    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getReminderById,
};
