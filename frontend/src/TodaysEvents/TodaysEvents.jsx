import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function TodaysEvents() {
  const navigate = useNavigate();
  const [todaysReminders, setTodaysReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [contactInfo, setContactInfo] = useState({ phone: '', email: '', whatsapp: '', countryCode: '+91' });
  const [savingContact, setSavingContact] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [personalLink, setPersonalLink] = useState('');
  const [generatingPersonalLink, setGeneratingPersonalLink] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Fetch today's reminders
  const fetchTodaysReminders = async () => {
    setLoading(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      navigate('/login');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/reminders', config);
      
      // Filter reminders for today
      const today = getTodayDate();
      const todaysEvents = data.filter(reminder => {
        const reminderDate = new Date(reminder.date).toISOString().split('T')[0];
        return reminderDate === today;
      })
      .sort((a, b) => {
        // Sort by completion status first (incomplete tasks first)
        if (a.isCompleted && !b.isCompleted) return 1;
        if (!a.isCompleted && b.isCompleted) return -1;
        // Then sort by date/time for tasks with same completion status
        return new Date(a.date) - new Date(b.date);
      });
      
      console.log('Today\'s events with contact info (sorted):', todaysEvents); // Debug log
      setTodaysReminders(Array.isArray(todaysEvents) ? todaysEvents : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch today\'s reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysReminders();
  }, [navigate]);

  // Helper function to get icon based on event type
  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'Birthday':
        return 'bi-balloon-heart-fill text-primary';
      case 'Anniversary':
        return 'bi-heart-fill text-danger';
      case 'Meeting':
        return 'bi-people-fill text-success';
      case 'Follow-up':
        return 'bi-chat-dots-fill text-info';
      default:
        return 'bi-calendar-heart-fill text-warning';
    }
  };

  // Helper to get emoji for event type
  const getEventEmoji = (eventType) => {
    switch (eventType) {
      case 'Birthday':
        return '🎂';
      case 'Anniversary':
        return '💖';
      case 'Meeting':
        return '🤝';
      case 'Follow-up':
        return '📞';
      default:
        return '⭐';
    }
  };

  // Quick mark as completed
  const markAsCompleted = async (reminderId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/reminders/${reminderId}`, { isCompleted: true }, config);
      fetchTodaysReminders(); // Refresh the list
    } catch (err) {
      setError('Failed to mark reminder as completed.');
    }
  };

  // Contact action handlers
  const handlePhoneCall = (phoneNumber) => {
    console.log('Phone call attempt:', phoneNumber); // Debug log
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    } else {
      alert('No phone number available. Please add contact information first.');
    }
  };

  const handleWhatsAppSimple = (whatsappNumber, eventType, eventTitle) => {
    console.log('WhatsApp Simple attempt:', whatsappNumber);
    if (whatsappNumber) {
      let cleanNumber = whatsappNumber.replace(/\D/g, '');
      let finalNumber = cleanNumber;
      
      if (cleanNumber.length < 10) {
        alert('Please enter a valid phone number');
        return;
      }
      
      // Generate a shorter, simpler message that WhatsApp is more likely to accept
      const name = eventTitle.replace(/birthday|anniversary|meeting|follow-up/gi, '').trim();
      let simpleMessage = '';
      
      switch (eventType) {
        case 'Birthday':
          simpleMessage = `🎉 Happy Birthday ${name}! 🎂 Wishing you many happy returns of this special day! Hope you have a wonderful celebration! 🥳`;
          break;
        case 'Anniversary':
          simpleMessage = `💕 Happy Anniversary ${name}! 🥂 Wishing you both continued love and happiness. Here's to many more beautiful years together! 🎉`;
          break;
        case 'Meeting':
          simpleMessage = `👋 Hi ${name}! Hope you're well. Looking forward to our meeting today. Please let me know if you have any questions. 📅`;
          break;
        case 'Follow-up':
          simpleMessage = `Hi ${name}! 👋 Hope you're doing great. Following up on our previous conversation. Would love to hear your thoughts! 😊`;
          break;
        default:
          simpleMessage = `Hi ${name}! 👋 Hope you're having a great day. Just wanted to reach out and connect with you. 😊`;
      }
      
      // Copy to clipboard and open WhatsApp
      navigator.clipboard.writeText(simpleMessage).then(() => {
        console.log('Simple message copied');
      });
      
      const encodedMessage = encodeURIComponent(simpleMessage);
      const whatsappUrl = `https://wa.me/${finalNumber}?text=${encodedMessage}`;
      
      console.log('Simple WhatsApp URL:', whatsappUrl);
      window.open(whatsappUrl, '_blank');
    } else {
      alert('No WhatsApp number available. Please add contact information first.');
    }
  };

  const handleWhatsApp = (whatsappNumber, eventType, eventTitle) => {
    console.log('WhatsApp attempt:', whatsappNumber); // Debug log
    if (whatsappNumber) {
      // Remove any non-digit characters and country code symbols
      let cleanNumber = whatsappNumber.replace(/\D/g, '');
      
      // The number should already be formatted with country code from our save function
      // But let's ensure it's properly formatted for WhatsApp
      let finalNumber = cleanNumber;
      
      // Validate the number length
      if (cleanNumber.length < 10) {
        alert('Please enter a valid phone number');
        return;
      }
      
      // Generate greeting message based on event type
      let greetingMessage = '';
      const name = eventTitle.replace(/birthday|anniversary|meeting|follow-up/gi, '').trim();
      
      switch (eventType) {
        case 'Birthday':
          greetingMessage = `🎉✨ Happy Birthday ${name}! ✨🎉

🎂 Wishing you many many happy returns of this special day! 

May this new year of your life bring you:
🌟 Endless joy and happiness
🎁 Amazing surprises and blessings  
💖 Love from all who care about you
🚀 Success in everything you do

Hope your birthday is as wonderful as you are! 

Celebrate and enjoy your special day! 🥳🎈

With warmest birthday wishes! 💝`;
          break;
        case 'Anniversary':
          greetingMessage = `💕✨ Happy Anniversary ${name}! ✨💕

🥂 Congratulations on another beautiful year together!

Wishing you both:
💖 Continued love and understanding
😊 More laughter and joy
🌹 Romance that never fades
🤝 Stronger bond with each passing day

May your love story continue to inspire everyone around you!

Here's to many more years of happiness together! 🎉

With love and best wishes! 💐`;
          break;
        case 'Meeting':
          greetingMessage = `👋 Hello ${name}!

Hope you're having a great day! 😊

I wanted to connect with you regarding our meeting scheduled for today. 

📅 Looking forward to our discussion and hearing your valuable insights!

Please let me know if you need to reschedule or have any questions before we meet.

Thank you for your time! �

Best regards! ✨`;
          break;
        case 'Follow-up':
          greetingMessage = `Hi ${name}! 👋

Hope you're doing wonderful! 😊

I wanted to follow up on our previous conversation and see how things are progressing on your end.

💭 Would love to hear your thoughts and any updates you might have!

Please feel free to share any questions or concerns you may have.

Looking forward to hearing from you! 🌟

Best regards! ✨`;
          break;
        default:
          greetingMessage = `Hi ${name}! 👋

Hope you're having a fantastic day! 😊

Just wanted to reach out and connect with you. 

🌟 Hope everything is going well on your side!

Please let me know if there's anything I can help you with or if you'd like to catch up.

Would love to hear from you! �

Best wishes! ✨`;
      }
      
      // Encode the message for URL - using proper encoding
      const encodedMessage = encodeURIComponent(greetingMessage);
      
      // Log the full URL for debugging
      const whatsappUrl = `https://wa.me/${finalNumber}?text=${encodedMessage}`;
      console.log('WhatsApp URL:', whatsappUrl);
      console.log('Original message:', greetingMessage);
      console.log('Encoded message length:', encodedMessage.length);
      
      // Copy message to clipboard for easy pasting
      navigator.clipboard.writeText(greetingMessage).then(() => {
        console.log('Message copied to clipboard successfully');
        // Show a temporary notification
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show position-fixed" 
               style="top: 20px; right: 20px; z-index: 9999; max-width: 350px;">
            <i class="bi bi-clipboard-check me-2"></i>
            <strong>Message Copied & WhatsApp Opened!</strong><br>
            <small>The greeting message has been copied to your clipboard. If WhatsApp doesn't show the message, paste it manually.</small>
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Auto remove notification after 6 seconds
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 6000);
      }).catch(err => {
        console.error('Failed to copy message to clipboard:', err);
        // Fallback: show message in alert
        alert('Message ready to copy:\n\n' + greetingMessage);
      });
      
      // Open WhatsApp with a small delay to ensure clipboard copy completes
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 100);
    } else {
      alert('No WhatsApp number available. Please add contact information first.');
    }
  };

  // Generate personal contact collection link (one-time setup)
  const generatePersonalLink = async () => {
    setGeneratingPersonalLink(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const response = await axios.post('/api/share/generate-personal-link', {}, config);
      
      const personalContactLink = response.data.personalContactLink;
      setPersonalLink(personalContactLink);
      
      // Copy personal link to clipboard
      navigator.clipboard.writeText(personalContactLink).then(() => {
        // Show success notification with personal link info
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div class="alert alert-info alert-dismissible fade show position-fixed" 
               style="top: 20px; right: 20px; z-index: 9999; max-width: 450px;">
            <i class="bi bi-person-lines-fill me-2"></i>
            <strong>Personal Contact Link Generated!</strong><br>
            <small>This is your permanent link. Share it with anyone to collect their contact information automatically.</small>
            <div class="mt-2 p-2 bg-light rounded">
              <small class="text-muted font-monospace">${personalContactLink}</small>
            </div>
            <div class="mt-2">
              <small class="text-success">✓ Link copied to clipboard</small>
            </div>
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Auto remove notification after 10 seconds
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 10000);
      }).catch(err => {
        console.error('Failed to copy personal link:', err);
        alert('Personal contact link generated:\n\n' + personalContactLink);
      });
      
    } catch (err) {
      console.error('Error generating personal link:', err);
      setError('Failed to generate personal contact link. Please try again.');
    } finally {
      setGeneratingPersonalLink(false);
    }
  };

  // Generate share link for collecting contact info
  const generateShareLink = async (reminder) => {
    setGeneratingLink(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const response = await axios.post(`/api/share/generate-link/${reminder._id}`, {}, config);
      
      const shareLink = response.data.shareLink;
      setShareLink(shareLink);
      
      // Copy share link to clipboard
      navigator.clipboard.writeText(shareLink).then(() => {
        // Show success notification with share link info
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show position-fixed" 
               style="top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
            <i class="bi bi-link-45deg me-2"></i>
            <strong>Share Link Generated!</strong><br>
            <small>The link has been copied to your clipboard. Share it with <strong>${reminder.title}</strong> to collect their contact information.</small>
            <div class="mt-2 p-2 bg-light rounded">
              <small class="text-muted font-monospace">${shareLink}</small>
            </div>
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Auto remove notification after 8 seconds
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 8000);
      }).catch(err => {
        console.error('Failed to copy share link:', err);
        alert('Share link generated:\n\n' + shareLink);
      });
      
    } catch (err) {
      console.error('Error generating share link:', err);
      setError('Failed to generate share link. Please try again.');
    } finally {
      setGeneratingLink(false);
    }
  };

  // Copy greeting message to clipboard
  const copyGreetingMessage = (eventType, eventTitle) => {
    // Generate the same greeting message as WhatsApp
    let greetingMessage = '';
    const name = eventTitle.replace(/birthday|anniversary|meeting|follow-up/gi, '').trim();
    
      switch (eventType) {
        case 'Birthday':
          greetingMessage = `🎉 Happy Birthday ${name}! �

Wishing you many many happy returns of this special day!

May this new year bring you:
🌟 Endless joy and happiness
🎁 Amazing surprises and blessings
💖 Love from all who care about you
🚀 Success in everything you do

Hope your birthday is as wonderful as you are!

Celebrate and enjoy your special day! 🥳

With warmest birthday wishes! 💝`;
          break;
        case 'Anniversary':
          greetingMessage = `💕 Happy Anniversary ${name}! 🥂

Congratulations on another beautiful year together!

Wishing you both:
💖 Continued love and understanding
😊 More laughter and joy
🌹 Romance that never fades
🤝 Stronger bond with each passing day

May your love story continue to inspire everyone!

Here's to many more years of happiness together! 🎉

With love and best wishes! 💐`;
          break;
        case 'Meeting':
          greetingMessage = `👋 Hello ${name}!

Hope you're having a great day! 😊

I wanted to connect with you regarding our meeting scheduled for today.

📅 Looking forward to our discussion and hearing your valuable insights!

Please let me know if you need to reschedule or have any questions.

Thank you for your time! 🙏

Best regards! ✨`;
          break;
        case 'Follow-up':
          greetingMessage = `Hi ${name}! 👋

Hope you're doing wonderful! 😊

I wanted to follow up on our previous conversation and see how things are progressing.

💭 Would love to hear your thoughts and any updates you might have!

Please feel free to share any questions or concerns.

Looking forward to hearing from you! 🌟

Best regards! ✨`;
          break;
        default:
          greetingMessage = `Hi ${name}! 👋

Hope you're having a fantastic day! 😊

Just wanted to reach out and connect with you.

🌟 Hope everything is going well on your side!

Please let me know if there's anything I can help you with.

Would love to hear from you! 💫

Best wishes! ✨`;
      }    // Copy to clipboard
    navigator.clipboard.writeText(greetingMessage).then(() => {
      // Show success notification
      const notification = document.createElement('div');
      notification.innerHTML = `
        <div class="alert alert-info alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999; max-width: 350px;">
          <i class="bi bi-clipboard-check me-2"></i>
          <strong>Message Copied!</strong><br>
          <small>You can now paste this greeting message anywhere you want.</small>
          <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Auto remove notification after 4 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 4000);
    }).catch(err => {
      console.error('Failed to copy message to clipboard:', err);
      alert('Message ready to copy:\n\n' + greetingMessage);
    });
  };

  const handleEmail = (email, eventType, eventTitle) => {
    console.log('Email attempt:', email); // Debug log
    if (email) {
      // Generate subject and body based on event type
      let subject = '';
      let body = '';
      const name = eventTitle.replace(/birthday|anniversary|meeting|follow-up/gi, '').trim();
      
      switch (eventType) {
        case 'Birthday':
          subject = `🎉 Happy Birthday, ${name}!`;
          body = `Dear ${name},\n\nWish you many many happy returns of this day! 🎂\n\nHope your special day is filled with joy, laughter, and wonderful memories. May this new year of your life bring you endless happiness and success!\n\nWith warm birthday wishes,\n[Your Name]`;
          break;
        case 'Anniversary':
          subject = `💕 Happy Anniversary, ${name}!`;
          body = `Dear ${name},\n\nHappy Anniversary! 🥂\n\nWishing you both continued love, happiness, and many more beautiful years together. May your bond grow stronger with each passing year!\n\nWith love and best wishes,\n[Your Name]`;
          break;
        case 'Meeting':
          subject = `📅 Meeting Follow-up - ${name}`;
          body = `Hi ${name},\n\nHope you're doing well!\n\nI wanted to reach out regarding our meeting today. Please let me know if you have any questions or if there's anything specific you'd like to discuss.\n\nLooking forward to our conversation!\n\nBest regards,\n[Your Name]`;
          break;
        case 'Follow-up':
          subject = `Follow-up - ${name}`;
          body = `Hi ${name},\n\nHope you're having a great day!\n\nJust following up on our previous conversation. I'd love to hear your thoughts and see how things are progressing on your end.\n\nPlease feel free to reach out if you have any questions or updates to share.\n\nBest regards,\n[Your Name]`;
          break;
        default:
          subject = `Hello, ${name}!`;
          body = `Hi ${name},\n\nHope you're doing well!\n\nJust wanted to reach out and connect with you. Please let me know if there's anything I can help you with.\n\nBest regards,\n[Your Name]`;
      }
      
      // Encode the subject and body for URL
      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);
      
      window.open(`mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`, '_self');
    } else {
      alert('No email address available. Please add contact information first.');
    }
  };

  // Open contact modal to add contact info
  const openAddContactModal = (reminder) => {
    setSelectedReminder(reminder);
    setContactInfo({
      phone: reminder.contact?.phone || '',
      email: reminder.contact?.email || '',
      whatsapp: reminder.contact?.whatsapp || '',
      countryCode: reminder.contact?.countryCode || '+91'
    });
    setShowContactModal(true);
  };

  // Save contact information
  const saveContactInfo = async () => {
    if (!selectedReminder) return;
    
    setSavingContact(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // Format phone numbers with country code
      const formattedContact = {
        countryCode: contactInfo.countryCode,
        phone: contactInfo.phone ? `${contactInfo.countryCode}${contactInfo.phone}` : '',
        email: contactInfo.email,
        whatsapp: contactInfo.whatsapp ? `${contactInfo.countryCode}${contactInfo.whatsapp}` : (contactInfo.phone ? `${contactInfo.countryCode}${contactInfo.phone}` : '')
      };
      
      const updateData = {
        ...selectedReminder,
        contact: formattedContact
      };
      
      console.log('Saving contact info:', updateData); // Debug log
      
      const response = await axios.put(`/api/reminders/${selectedReminder._id}`, updateData, config);
      
      console.log('Contact info saved successfully:', response.data); // Debug log
      
      setShowContactModal(false);
      setSelectedReminder(null);
      setContactInfo({ phone: '', email: '', whatsapp: '', countryCode: '+91' });
      
      // Refresh the list to show updated contact info
      await fetchTodaysReminders();
    } catch (err) {
      console.error('Error saving contact info:', err);
      setError('Failed to update contact information.');
    } finally {
      setSavingContact(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-3">Loading today's events...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-3">
      {/* Modern Header */}
      <div className="page-header text-center mb-5">
        <div className="container">
          <h1 className="page-title">
            <i className="bi bi-calendar-day me-3"></i>
            Today's Events
          </h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <div className="container">
        {/* Action Header */}
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-5">
          <div>
            <h2 className="fw-bold mb-1" style={{ color: 'var(--text-light)' }}>Daily Overview</h2>
            <p className="text-muted mb-0">Manage today's important events and contacts</p>
          </div>
          <div className="d-flex flex-wrap gap-2 mt-3 mt-md-0">
            <button 
              onClick={generatePersonalLink}
              className="btn btn-outline-success"
              disabled={generatingPersonalLink}
              title="Generate your permanent contact collection link"
            >
              {generatingPersonalLink ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="bi bi-person-lines-fill me-2"></i>
                  My Contact Link
                </>
              )}
            </button>
            <Link to="/dashboard" className="btn btn-outline-primary">
              <i className="bi bi-kanban me-2"></i>
              Full Dashboard
            </Link>
            <Link to="/dashboard" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Add New Event
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-danger border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Today's Events */}
      <div className="row">
        <div className="col">
          {todaysReminders.length > 0 ? (
            <>
              <div className="row g-4">
                {todaysReminders.map((reminder) => (
                  <div className="col-12 col-md-6 col-lg-4" key={reminder._id}>
                    <div className={`card info-card h-100 ${reminder.isCompleted ? 'opacity-75' : ''}`}>
                      <div className="card-body">
                        <div className="d-flex align-items-start">
                          {/* Event Icon with Emoji */}
                          <div className="flex-shrink-0 me-3 text-center">
                            <div className="event-icon-container">
                              <i className={`bi ${getEventIcon(reminder.eventType)} fs-2 ${
                                reminder.eventType === 'Birthday' ? 'birthday-icon' : 
                                reminder.eventType === 'Anniversary' ? 'anniversary-icon' : ''
                              }`}></i>
                              <div className="event-emoji" style={{ fontSize: '0.9rem' }}>
                                {getEventEmoji(reminder.eventType)}
                              </div>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-grow-1">
                            <h5 className={`card-title mb-1 ${reminder.isCompleted ? 'text-decoration-line-through' : ''}`}>
                              {reminder.title}
                            </h5>
                            <p className="card-text text-muted mb-2">
                              <small>
                                <i className="bi bi-tag me-1"></i>
                                {reminder.eventType}
                              </small>
                            </p>
                            {reminder.notes && (
                              <p className="card-text small text-muted mb-2">
                                <i className="bi bi-chat-dots me-1"></i>
                                {reminder.notes}
                              </p>
                            )}
                            
                            {/* Contact Information Display */}
                            <div className="mb-2">
                              {reminder.contact?.name && (
                                <small className="text-info me-3 d-block">
                                  <i className="bi bi-person-fill me-1"></i>
                                  {reminder.contact.name}
                                </small>
                              )}
                              {reminder.contact?.phone && (
                                <small className="text-success me-3">
                                  <i className="bi bi-telephone-fill me-1"></i>
                                  {reminder.contact.phone}
                                </small>
                              )}
                              {reminder.contact?.email && (
                                <small className="text-primary me-3">
                                  <i className="bi bi-envelope-fill me-1"></i>
                                  {reminder.contact.email}
                                </small>
                              )}
                              {reminder.contact?.whatsapp && reminder.contact.whatsapp !== reminder.contact?.phone && (
                                <small className="text-success me-3">
                                  <i className="bi bi-whatsapp me-1"></i>
                                  {reminder.contact.whatsapp}
                                </small>
                              )}
                              {!reminder.contact?.phone && !reminder.contact?.email && !reminder.contact?.whatsapp && (
                                <small className="text-warning">
                                  <i className="bi bi-exclamation-triangle me-1"></i>
                                  No contact info available
                                </small>
                              )}
                            </div>
                            {/* Action Buttons - Clean and simplified layout */}
                            <div className="d-flex flex-wrap gap-2 mt-3">
                              {/* Always show contact action buttons */}
                              <button 
                                onClick={() => handlePhoneCall(reminder.contact?.phone)}
                                className={`btn btn-sm ${reminder.contact?.phone ? 'btn-success contact-btn-active' : 'btn-outline-secondary'}`}
                                title={reminder.contact?.phone ? `Call ${reminder.contact.phone}` : 'Add phone number to enable calling'}
                              >
                                <i className="bi bi-telephone-fill me-1"></i>
                                Call
                              </button>
                              
                              <button 
                                onClick={() => handleWhatsAppSimple(reminder.contact?.whatsapp || reminder.contact?.phone, reminder.eventType, reminder.title)}
                                className={`btn btn-sm text-white ${(reminder.contact?.whatsapp || reminder.contact?.phone) ? 'contact-btn-whatsapp-active' : ''}`}
                                title={reminder.contact?.whatsapp || reminder.contact?.phone ? `WhatsApp ${reminder.contact.whatsapp || reminder.contact.phone}` : 'Add WhatsApp number to enable messaging'}
                                style={{ 
                                  backgroundColor: (reminder.contact?.whatsapp || reminder.contact?.phone) ? '#25D366' : '#6c757d', 
                                  borderColor: (reminder.contact?.whatsapp || reminder.contact?.phone) ? '#25D366' : '#6c757d' 
                                }}
                              >
                                <i className="bi bi-whatsapp me-1"></i>
                                WhatsApp
                              </button>
                              
                              <button 
                                onClick={() => handleEmail(reminder.contact?.email, reminder.eventType, reminder.title)}
                                className={`btn btn-sm ${reminder.contact?.email ? 'btn-primary contact-btn-email-active' : 'btn-outline-secondary'}`}
                                title={reminder.contact?.email ? `Email ${reminder.contact.email}` : 'Add email address to enable emailing'}
                              >
                                <i className="bi bi-envelope-fill me-1"></i>
                                Email
                              </button>
                              
                              {/* Add Contact Info button if no contact info exists */}
                              {!reminder.contact?.phone && !reminder.contact?.email && !reminder.contact?.whatsapp && (
                                <button 
                                  onClick={() => openAddContactModal(reminder)}
                                  className="btn btn-sm btn-info"
                                  title="Add contact information"
                                >
                                  <i className="bi bi-person-plus me-1"></i>
                                  Add Contact
                                </button>
                              )}
                              

                              {/* Additional Actions - Smaller buttons */}
                              <div className="ms-auto d-flex gap-1">
                                <button 
                                  onClick={() => markAsCompleted(reminder._id)}
                                  className="btn btn-sm btn-outline-success"
                                  title="Mark as completed"
                                >
                                  <i className="bi bi-check-lg"></i>
                                </button>
                                <Link 
                                  to="/dashboard" 
                                  className="btn btn-sm btn-outline-secondary"
                                  title="Edit in dashboard"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="row mt-5">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body text-center">
                      <h5 className="card-title">Today's Summary</h5>
                      <div className="row">
                        <div className="col-6 col-md-3">
                          <div className="text-primary">
                            <i className="bi bi-calendar-check fs-1"></i>
                            <h6 className="mt-2">Total Events</h6>
                            <h4>{todaysReminders.length}</h4>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-success">
                            <i className="bi bi-check-circle fs-1"></i>
                            <h6 className="mt-2">Completed</h6>
                            <h4>{todaysReminders.filter(r => r.isCompleted).length}</h4>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-warning">
                            <i className="bi bi-clock fs-1"></i>
                            <h6 className="mt-2">Pending</h6>
                            <h4>{todaysReminders.filter(r => !r.isCompleted).length}</h4>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="text-info">
                            <i className="bi bi-calendar-plus fs-1"></i>
                            <h6 className="mt-2">
                              <Link to="/dashboard" className="text-decoration-none">
                                Add More
                              </Link>
                            </h6>
                            <Link to="/dashboard" className="btn btn-sm btn-info text-white">
                              <i className="bi bi-plus"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Events Today */
            <div className="text-center">
              <div className="card p-5">
                <div className="card-body">
                  <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
                  <h3 className="text-muted mb-3">No events scheduled for today!</h3>
                  <p className="text-muted mb-4">
                    Looks like you have a free day. Why not add some events or check your upcoming schedule?
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to="/dashboard" className="btn btn-primary btn-lg">
                      <i className="bi bi-plus-lg me-2"></i>
                      Add New Event
                    </Link>
                    <Link to="/dashboard" className="btn btn-outline-secondary btn-lg">
                      <i className="bi bi-calendar3 me-2"></i>
                      View All Events
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Contact Info Modal */}
      {showContactModal && selectedReminder && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Contact Information</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowContactModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="fw-bold mb-3">{selectedReminder.title}</h6>
                
                {/* Country Code Selection */}
                <div className="mb-3">
                  <label htmlFor="countryCode" className="form-label">Country Code</label>
                  <select
                    className="form-select"
                    id="countryCode"
                    value={contactInfo.countryCode}
                    onChange={(e) => setContactInfo({...contactInfo, countryCode: e.target.value})}
                  >
                    <option value="+91">🇮🇳 India (+91)</option>
                    <option value="+1">🇺🇸 USA (+1)</option>
                    <option value="+44">🇬🇧 UK (+44)</option>
                    <option value="+61">🇦🇺 Australia (+61)</option>
                    <option value="+81">🇯🇵 Japan (+81)</option>
                    <option value="+49">🇩🇪 Germany (+49)</option>
                    <option value="+33">🇫🇷 France (+33)</option>
                    <option value="+86">🇨🇳 China (+86)</option>
                    <option value="+971">🇦🇪 UAE (+971)</option>
                    <option value="+65">🇸🇬 Singapore (+65)</option>
                    <option value="+60">🇲🇾 Malaysia (+60)</option>
                    <option value="+66">🇹🇭 Thailand (+66)</option>
                    <option value="+92">🇵🇰 Pakistan (+92)</option>
                    <option value="+880">🇧🇩 Bangladesh (+880)</option>
                    <option value="+94">🇱🇰 Sri Lanka (+94)</option>
                  </select>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text">{contactInfo.countryCode}</span>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="1234567890"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    />
                  </div>
                  <div className="form-text">Enter number without country code</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="whatsapp" className="form-label">WhatsApp Number</label>
                  <div className="input-group">
                    <span className="input-group-text">{contactInfo.countryCode}</span>
                    <input
                      type="tel"
                      className="form-control"
                      id="whatsapp"
                      placeholder="1234567890 (leave empty to use phone number)"
                      value={contactInfo.whatsapp}
                      onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                    />
                  </div>
                  <div className="form-text">Leave empty to use the phone number for WhatsApp</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="example@email.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowContactModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={saveContactInfo}
                  disabled={savingContact}
                >
                  {savingContact ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Contact Info'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Custom styles for contact buttons */}
      <style jsx>{`
        .contact-btn-active {
          opacity: 1;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .contact-btn-active:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .btn-outline-secondary {
          opacity: 0.6;
          cursor: default;
        }

        .btn-outline-secondary:hover {
          opacity: 0.8;
        }

        .contact-btn-whatsapp-active:hover {
          background-color: #1da851 !important;
          border-color: #1da851 !important;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(37, 211, 102, 0.3);
        }

        .contact-btn-email-active:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(13, 110, 253, 0.3);
        }
      `}</style>
      </div>
    </div>
  );
}

export default TodaysEvents;
