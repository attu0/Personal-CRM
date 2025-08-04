const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: ['Birthday', 'Anniversary', 'Meeting', 'Follow-up', 'Custom'],
      default: 'Custom',
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    // Contact Information
    contact: {
      name: { type: String },
      countryCode: { type: String, default: '+91' },
      phone: { type: String },
      email: { type: String },
      whatsapp: { type: String }, // Can be same as phone or different
    },
    // Share link functionality
    shareToken: { type: String },
    shareTokenExpiry: { type: Date },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
