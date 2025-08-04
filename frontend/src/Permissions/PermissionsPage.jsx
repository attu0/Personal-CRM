import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PermissionsPage() {
  const navigate = useNavigate();

  // State to track which permissions have been granted (for UI feedback)
  const [permissions, setPermissions] = useState({
    googleContacts: false,
    googleCalendar: false,
    notifications: false,
  });

  // Handler to toggle a permission's state
  const handlePermissionToggle = (permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  // Handler for the final "Continue" button
  const handleContinue = () => {
    // In a real app, you would save these permission settings to the user's profile here.
    console.log('User granted permissions:', permissions);
    // Navigate to today's events page after setup is complete.
    navigate('/today');
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="card p-4 p-md-5 text-center">
            <h2 className="fw-bold mb-3">Connect Your Accounts</h2>
            <p className="lead text-muted mb-4">
              To get the most out of your Personal CRM, grant access to the following services. You can manage these permissions in your profile at any time.
            </p>

            <div className="list-group text-start">
              {/* Google Contacts Permission */}
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-google text-danger fs-4 me-3"></i>
                  <span className="fw-bold">Google Contacts</span>
                  <p className="mb-0 text-muted small">Sync your contacts to get birthday and anniversary reminders.</p>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    id="contactsSwitch"
                    checked={permissions.googleContacts}
                    onChange={() => handlePermissionToggle('googleContacts')}
                  />
                </div>
              </div>

              {/* Google Calendar Permission */}
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-calendar-event-fill text-primary fs-4 me-3"></i>
                  <span className="fw-bold">Google Calendar</span>
                   <p className="mb-0 text-muted small">Sync your calendar to see upcoming events and meetings.</p>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    id="calendarSwitch"
                    checked={permissions.googleCalendar}
                    onChange={() => handlePermissionToggle('googleCalendar')}
                  />
                </div>
              </div>

              {/* Notifications Permission */}
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-bell-fill text-warning fs-4 me-3"></i>
                  <span className="fw-bold">Push Notifications</span>
                   <p className="mb-0 text-muted small">Allow us to send you timely reminders for important events.</p>
                </div>
                <div className="form-check form-switch">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    role="switch" 
                    id="notificationsSwitch"
                    checked={permissions.notifications}
                    onChange={() => handlePermissionToggle('notifications')}
                  />
                </div>
              </div>
            </div>

            <div className="d-grid gap-2 mt-4">
               <button className="btn btn-primary btn-lg" onClick={handleContinue}>
                Continue to Dashboard
              </button>
              <button className="btn btn-link" onClick={() => navigate('/dashboard')}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PermissionsPage;
