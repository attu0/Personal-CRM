import React, { useState } from 'react';
import axios from 'axios';

// Now accepts onEdit and onDelete functions as props
function InfoCard({ reminder, onEdit, onDelete }) {
  const [generatingLink, setGeneratingLink] = useState(false);
  // Helper to determine the icon based on event type
  const getIconClass = (eventType) => {
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

  // Contact action handlers
  const handlePhoneCall = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`, '_self');
    }
  };

  const handleWhatsApp = (whatsappNumber) => {
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
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
      
      // Copy share link to clipboard
      navigator.clipboard.writeText(shareLink).then(() => {
        // Show success notification with share link info
        const notification = document.createElement('div');
        notification.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show position-fixed" 
               style="top: 20px; right: 20px; z-index: 9999; max-width: 400px;">
            <i class="bi bi-link-45deg me-2"></i>
            <strong>Share Link Generated!</strong><br>
            <small>Link copied to clipboard. Share it with <strong>${reminder.title}</strong> to collect their contact information.</small>
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
      alert('Failed to generate share link. Please try again.');
    } finally {
      setGeneratingLink(false);
    }
  };

  return (
    <div className={`card info-card h-100 ${reminder.isCompleted ? 'opacity-75' : ''}`}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          {/* Event Icon with Emoji */}
          <div className="flex-shrink-0 me-4 text-center">
            <div className="event-icon-container">
              <i className={`bi ${getIconClass(reminder.eventType)} fs-1 ${
                reminder.eventType === 'Birthday' ? 'birthday-icon' : 
                reminder.eventType === 'Anniversary' ? 'anniversary-icon' : ''
              }`}></i>
              <div className="event-emoji">
                {getEventEmoji(reminder.eventType)}
              </div>
            </div>
          </div>

          {/* Name and Event Type */}
          <div className="flex-grow-1">
            <h5 className="card-title mb-1 fw-bold">{reminder.title}</h5>
            <p className="card-text mb-0">{reminder.eventType}</p>
            <small className="text-muted">{new Date(reminder.date).toLocaleDateString()}</small>
            
            {/* Contact Information Display */}
            {(reminder.contact?.phone || reminder.contact?.email) && (
              <div className="mt-2">
                {reminder.contact.phone && (
                  <small className="text-muted d-block">
                    <i className="bi bi-telephone me-1"></i>
                    {reminder.contact.phone}
                  </small>
                )}
                {reminder.contact.email && (
                  <small className="text-muted d-block">
                    <i className="bi bi-envelope me-1"></i>
                    {reminder.contact.email}
                  </small>
                )}
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="d-flex flex-column gap-2 ms-3">
            {/* Contact Actions - Show if contact info exists */}
            {(reminder.contact?.phone || reminder.contact?.email || reminder.contact?.whatsapp) ? (
              <>
                {reminder.contact?.phone && (
                  <button 
                    onClick={() => handlePhoneCall(reminder.contact.phone)}
                    className="btn btn-sm btn-outline-success rounded-circle lh-1 p-2" 
                    title="Make a phone call"
                  >
                    <i className="bi bi-telephone-fill"></i>
                  </button>
                )}
                
                {(reminder.contact?.whatsapp || reminder.contact?.phone) && (
                  <button 
                    onClick={() => handleWhatsApp(reminder.contact.whatsapp || reminder.contact.phone)}
                    className="btn btn-sm rounded-circle lh-1 p-2" 
                    title="Open WhatsApp"
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366', color: 'white' }}
                  >
                    <i className="bi bi-whatsapp"></i>
                  </button>
                )}
                
                {reminder.contact?.email && (
                  <button 
                    onClick={() => handleEmail(reminder.contact.email)}
                    className="btn btn-sm btn-outline-primary rounded-circle lh-1 p-2" 
                    title="Send an email"
                  >
                    <i className="bi bi-envelope-fill"></i>
                  </button>
                )}
              </>
            ) : (
              <small className="text-muted text-center px-2">
                <i className="bi bi-info-circle me-1"></i>
                No contact info
              </small>
            )}
            
            {/* Always show Edit, Delete, and Share Link */}
            <hr className="my-1" />
            <button 
              onClick={() => generateShareLink(reminder)} 
              className="btn btn-sm btn-outline-warning rounded-circle lh-1 p-2" 
              title="Generate share link to collect contact info"
              disabled={generatingLink}
            >
              {generatingLink ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                <i className="bi bi-link-45deg"></i>
              )}
            </button>
            <button onClick={() => onEdit(reminder)} className="btn btn-sm btn-outline-secondary rounded-circle lh-1 p-2" title="Edit">
              <i className="bi bi-pencil-fill"></i>
            </button>
            <button onClick={() => onDelete(reminder._id)} className="btn btn-sm btn-outline-danger rounded-circle lh-1 p-2" title="Delete">
              <i className="bi bi-trash-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoCard;
