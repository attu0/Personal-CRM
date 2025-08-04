import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ContactCollectionPage() {
  const { shareToken } = useParams();
  const [reminderDetails, setReminderDetails] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
    countryCode: '+91'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch reminder details on page load
  useEffect(() => {
    const fetchReminderDetails = async () => {
      try {
        const response = await axios.get(`/api/share/details/${shareToken}`);
        setReminderDetails(response.data);
        setContactInfo(prev => ({ ...prev, name: response.data.title }));
      } catch (err) {
        setError('Invalid or expired link. Please contact the person who shared this link.');
      } finally {
        setLoading(false);
      }
    };

    fetchReminderDetails();
  }, [shareToken]);

  // Submit contact information
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactInfo.name || (!contactInfo.phone && !contactInfo.email)) {
      setError('Please provide at least your name and either phone number or email address.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(`/api/share/submit-contact/${shareToken}`, contactInfo);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-3">Loading...</h4>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card">
              <div className="card-body text-center p-5">
                <div className="text-success mb-4">
                  <i className="bi bi-check-circle display-1"></i>
                </div>
                <h2 className="text-success mb-3">Thank You!</h2>
                <p className="lead mb-4">
                  Your contact information has been saved successfully.
                </p>
                <p className="text-muted">
                  The person who shared this link will be able to contact you using the information you provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !reminderDetails) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card">
              <div className="card-body text-center p-5">
                <div className="text-danger mb-4">
                  <i className="bi bi-exclamation-triangle display-1"></i>
                </div>
                <h2 className="text-danger mb-3">Link Invalid</h2>
                <p className="lead mb-4">{error}</p>
                <p className="text-muted">
                  This link may have expired or been used already.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Share Your Contact Information
              </h4>
            </div>
            <div className="card-body p-4">
              {reminderDetails && (
                <div className="alert alert-info mb-4">
                  <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    Event Details
                  </h6>
                  <p className="mb-2">
                    <strong>{reminderDetails.title}</strong>
                  </p>
                  <p className="mb-2">
                    <small className="text-muted">
                      <i className="bi bi-tag me-1"></i>
                      {reminderDetails.eventType}
                    </small>
                  </p>
                  <p className="mb-0">
                    <small className="text-muted">
                      <i className="bi bi-calendar me-1"></i>
                      {new Date(reminderDetails.date).toLocaleDateString()}
                    </small>
                  </p>
                  {reminderDetails.notes && (
                    <p className="mb-0 mt-2">
                      <small className="text-muted">
                        <i className="bi bi-chat-dots me-1"></i>
                        {reminderDetails.notes}
                      </small>
                    </p>
                  )}
                </div>
              )}

              <p className="text-muted mb-4">
                Someone has requested your contact information for the event above. 
                Please fill in the details below to share your information.
              </p>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                    required
                  />
                </div>

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
                </div>

                <div className="mb-3">
                  <label htmlFor="whatsapp" className="form-label">WhatsApp Number</label>
                  <div className="input-group">
                    <span className="input-group-text">{contactInfo.countryCode}</span>
                    <input
                      type="tel"
                      className="form-control"
                      id="whatsapp"
                      placeholder="Leave empty to use phone number"
                      value={contactInfo.whatsapp}
                      onChange={(e) => setContactInfo({...contactInfo, whatsapp: e.target.value})}
                    />
                  </div>
                  <div className="form-text">Leave empty if same as phone number</div>
                </div>

                <div className="mb-4">
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

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Save Contact Information
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Your information is secure and will only be used to contact you about this event.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactCollectionPage;
