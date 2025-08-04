const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    // Add googleId to store the user's unique Google ID
    googleId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Make the password field NOT required
    password: {
      type: String,
      required: false, // Changed from true
    },

    // --- Profile Fields ---
    profile: {
      birthday: { type: Date },
      anniversary: { type: Date },
      spouseName: { type: String },
      spouseBirthday: { type: Date },
      companyName: { type: String },
      incorporationDate: { type: Date },
      officeAddress: { type: String },
      socialLinks: {
        linkedin: { type: String },
        twitter: { type: String },
        instagram: { type: String },
      },
    },

    // --- Permissions Fields ---
    permissions: {
      googleContacts: { type: Boolean, default: false },
      googleCalendar: { type: Boolean, default: false },
      notifications: { type: Boolean, default: false },
    },

    // Personal contact collection link token
    personalContactToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
