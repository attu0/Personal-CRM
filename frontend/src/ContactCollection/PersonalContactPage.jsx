import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PersonalContactPage() {
  const { personalToken } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
    countryCode: '+91',
    eventTitle: '',
    eventType: 'Custom',
    eventDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch user details on page load
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/share/personal-details/${personalToken}`);
        setUserDetails(response.data);
      } catch (err) {
        setError('Invalid contact link. Please contact the person who shared this link.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [personalToken]);

  // Submit contact information
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contactInfo.name || (!contactInfo.phone && !contactInfo.email)) {
      setError('Please provide at least your name and either phone number or email address.');
      return;
    }

    if (!contactInfo.eventTitle) {
      setError('Please provide a title/reason for this contact.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await axios.post(`/api/share/submit-personal-contact/${personalToken}`, contactInfo);
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
                  {userDetails?.userName} will be able to contact you using the information you provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !userDetails) {
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
                  This link may be invalid or corrupted.
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
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Share Your Contact Information
              </h4>
            </div>
            <div className="card-body p-4">
              {userDetails && (
                <div className="alert alert-success mb-4">
                  <h6 className="alert-heading">
                    <i className="bi bi-person-circle me-2"></i>
                    Contact Request From
                  </h6>
                  <p className="mb-2">
                    <strong>{userDetails.userName}</strong>
                  </p>
                  {userDetails.userEmail && (
                    <p className="mb-0">
                      <small className="text-muted">
                        <i className="bi bi-envelope me-1"></i>
                        {userDetails.userEmail}
                      </small>
                    </p>
                  )}
                </div>
              )}

              <p className="text-muted mb-4">
                Please fill in your contact details and specify the reason for sharing your information.
              </p>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Your Name *</label>
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
                  <label htmlFor="eventTitle" className="form-label">Reason/Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="eventTitle"
                    placeholder="e.g., Birthday invitation, Business meeting, etc."
                    value={contactInfo.eventTitle}
                    onChange={(e) => setContactInfo({...contactInfo, eventTitle: e.target.value})}
                    required
                  />
                  <div className="form-text">Why are you sharing your contact information?</div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="eventType" className="form-label">Category</label>
                    <select
                      className="form-select"
                      id="eventType"
                      value={contactInfo.eventType}
                      onChange={(e) => setContactInfo({...contactInfo, eventType: e.target.value})}
                    >
                      <option value="Custom">Custom</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Follow-up">Follow-up</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="eventDate" className="form-label">Date (Optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      id="eventDate"
                      value={contactInfo.eventDate}
                      onChange={(e) => setContactInfo({...contactInfo, eventDate: e.target.value})}
                    />
                  </div>
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

                <div className="mb-4">
                  <label htmlFor="notes" className="form-label">Additional Notes (Optional)</label>
                  <textarea
                    className="form-control"
                    id="notes"
                    rows="3"
                    placeholder="Any additional information or special instructions..."
                    value={contactInfo.notes}
                    onChange={(e) => setContactInfo({...contactInfo, notes: e.target.value})}
                  />
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
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
                        Save My Contact Information
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Your information is secure and will only be used by {userDetails?.userName} to contact you.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalContactPage;
