const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminderModel');
const { protect } = require('../middleware/authMiddleware');

// Generate a permanent contact collection link for the user
router.post('/generate-personal-link', protect, async (req, res) => {
  try {
    const User = require('../models/userModel');
    
    // Check if user already has a personal contact link
    let user = await User.findById(req.user._id);
    
    if (!user.personalContactToken) {
      // Generate a permanent unique token for this user
      const personalToken = require('crypto').randomBytes(32).toString('hex');
      user.personalContactToken = personalToken;
      await user.save();
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const personalContactLink = `${frontendUrl}/contact/${user.personalContactToken}`;

    res.json({
      personalContactLink,
      personalToken: user.personalContactToken,
      message: 'This is your permanent contact collection link'
    });
  } catch (error) {
    console.error('Error generating personal contact link:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle contact info submission via personal contact link
router.post('/submit-personal-contact/:personalToken', async (req, res) => {
  try {
    const { personalToken } = req.params;
    const { name, phone, email, whatsapp, countryCode, eventTitle, eventType, eventDate, notes } = req.body;

    const User = require('../models/userModel');
    
    // Find user by personal contact token
    const user = await User.findOne({ personalContactToken: personalToken });

    if (!user) {
      return res.status(404).json({ message: 'Invalid contact link' });
    }

    // Create a new reminder with the submitted contact information
    const newReminder = new Reminder({
      user: user._id,
      title: eventTitle || `${name}'s Contact`,
      eventType: eventType || 'Custom',
      date: eventDate ? new Date(eventDate) : new Date(),
      notes: notes || `Contact information collected via personal link`,
      contact: {
        name: name,
        phone: phone ? `${countryCode}${phone}` : '',
        email: email || '',
        whatsapp: whatsapp ? `${countryCode}${whatsapp}` : (phone ? `${countryCode}${phone}` : ''),
        countryCode: countryCode || '+91'
      },
      isCompleted: false
    });

    await newReminder.save();

    res.json({
      message: 'Contact information saved successfully!',
      contactName: name
    });
  } catch (error) {
    console.error('Error submitting personal contact info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details for personal contact link page
router.get('/personal-details/:personalToken', async (req, res) => {
  try {
    const { personalToken } = req.params;
    const User = require('../models/userModel');

    const user = await User.findOne({ personalContactToken: personalToken }).select('name email');

    if (!user) {
      return res.status(404).json({ message: 'Invalid contact link' });
    }

    res.json({
      userName: user.name,
      userEmail: user.email
    });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate a share link for collecting contact info
router.post('/generate-link/:reminderId', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.reminderId);
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Check if the reminder belongs to the current user
    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to access this reminder' });
    }

    // Generate a unique share token
    const shareToken = require('crypto').randomBytes(32).toString('hex');
    
    // Update reminder with share token and expiry (24 hours from now)
    reminder.shareToken = shareToken;
    reminder.shareTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await reminder.save();

    // Generate share link pointing to frontend, not backend
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const shareLink = `${frontendUrl}/share/${shareToken}`;

    res.json({
      shareLink,
      shareToken,
      expiresAt: reminder.shareTokenExpiry
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Handle contact info submission via share link
router.post('/submit-contact/:shareToken', async (req, res) => {
  try {
    const { shareToken } = req.params;
    const { name, phone, email, whatsapp, countryCode } = req.body;

    // Find reminder by share token
    const reminder = await Reminder.findOne({
      shareToken,
      shareTokenExpiry: { $gt: new Date() } // Check if token hasn't expired
    });

    if (!reminder) {
      return res.status(404).json({ message: 'Invalid or expired share link' });
    }

    // Update reminder with contact information
    reminder.contact = {
      name: name || reminder.title,
      phone: phone ? `${countryCode}${phone}` : '',
      email: email || '',
      whatsapp: whatsapp ? `${countryCode}${whatsapp}` : (phone ? `${countryCode}${phone}` : ''),
      countryCode: countryCode || '+91'
    };

    // Clear the share token after successful submission
    reminder.shareToken = undefined;
    reminder.shareTokenExpiry = undefined;

    await reminder.save();

    res.json({
      message: 'Contact information saved successfully!',
      reminderTitle: reminder.title
    });
  } catch (error) {
    console.error('Error submitting contact info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reminder details for share link page
router.get('/details/:shareToken', async (req, res) => {
  try {
    const { shareToken } = req.params;

    const reminder = await Reminder.findOne({
      shareToken,
      shareTokenExpiry: { $gt: new Date() }
    }).select('title eventType date notes');

    if (!reminder) {
      return res.status(404).json({ message: 'Invalid or expired share link' });
    }

    res.json({
      title: reminder.title,
      eventType: reminder.eventType,
      date: reminder.date,
      notes: reminder.notes
    });
  } catch (error) {
    console.error('Error getting reminder details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
