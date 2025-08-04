// Sample reminder data with contact information for testing
// This is just for reference - you can use this data when creating reminders through the UI

const sampleReminders = [
  {
    title: "John's Birthday",
    eventType: "Birthday",
    date: "2025-08-02", // Today's date
    notes: "Buy cake and plan surprise party",
    contact: {
      phone: "+1234567890",
      email: "john@example.com",
      whatsapp: "+1234567890"
    }
  },
  {
    title: "Meeting with Sarah",
    eventType: "Meeting",
    date: "2025-08-02", // Today's date
    notes: "Discuss project timeline and deliverables",
    contact: {
      phone: "+1987654321",
      email: "sarah@company.com",
      whatsapp: "+1987654321"
    }
  },
  {
    title: "Anniversary Reminder",
    eventType: "Anniversary",
    date: "2025-08-02", // Today's date
    notes: "Book restaurant reservation",
    contact: {
      phone: "+1122334455",
      email: "spouse@example.com"
    }
  },
  {
    title: "Follow-up Call",
    eventType: "Follow-up",
    date: "2025-08-02", // Today's date
    notes: "Check on project status",
    contact: {
      phone: "+1555666777",
      whatsapp: "+1555666777"
    }
  }
];

// Instructions for testing:
// 1. Start your backend and frontend servers
// 2. Register/login to your application
// 3. Go to Dashboard and create reminders using the above data
// 4. Navigate to "Today's Events" to see the contact action buttons
// 5. Test the Call, WhatsApp, and Email functionality

module.exports = sampleReminders;
