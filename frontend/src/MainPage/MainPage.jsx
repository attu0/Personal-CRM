import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InfoCard from './InfoCard.jsx';

function MainPage() {
  const navigate = useNavigate();

  // --- Component States ---
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for the "Add New" modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    eventType: 'Birthday',
    date: '',
    notes: '',
    contact: {
      phone: '',
      email: '',
      whatsapp: '',
    },
  });

  // State for the "Edit" modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentReminder, setCurrentReminder] = useState(null);

  // --- Data Fetching ---
  const fetchReminders = async () => {
    setLoading(true);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get('/api/reminders', config);
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [navigate]);

  // --- CRUD Handlers ---
  const handleCreateReminder = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('/api/reminders', newReminder, config);
      setShowAddModal(false);
      setNewReminder({ 
        title: '', 
        eventType: 'Birthday', 
        date: '', 
        notes: '',
        contact: { phone: '', email: '', whatsapp: '' }
      });
      fetchReminders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reminder.');
    }
  };

  const handleUpdateReminder = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/reminders/${currentReminder._id}`, currentReminder, config);
      setShowEditModal(false);
      setCurrentReminder(null);
      fetchReminders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update reminder.');
    }
  };

  const handleDeleteReminder = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`/api/reminders/${id}`, config);
        fetchReminders();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete reminder.');
      }
    }
  };

  // --- Modal Control ---
  const openEditModal = (reminder) => {
    // Format date correctly for the input field
    const formattedReminder = {
        ...reminder,
        date: new Date(reminder.date).toISOString().split('T')[0]
    };
    setCurrentReminder(formattedReminder);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="container-fluid px-0">
        <div className="loading-skeleton" style={{ height: '200px', borderRadius: '1rem', margin: '2rem' }}></div>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="mt-3 text-muted">Loading your reminders...</h3>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container-fluid px-4 py-3">
        {/* Modern Header */}
        <div className="page-header text-center mb-5">
          <div className="container">
            <h1 className="page-title">Your Personal CRM</h1>
            <p className="page-subtitle">Manage your contacts and never miss important events</p>
          </div>
        </div>

        <div className="container">
          {/* Action Header */}
          <header className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-5">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: 'var(--text-light)' }}>Dashboard</h2>
              <p className="text-muted mb-0">Manage your reminders and contacts</p>
            </div>
            <button className="btn btn-primary btn-lg mt-3 mt-md-0" onClick={() => setShowAddModal(true)}>
              <i className="bi bi-plus-lg me-2"></i>
              Add New Reminder
            </button>
          </header>

          <main>
            {error && (
              <div className="alert alert-danger border-0 shadow-sm" style={{ borderRadius: '1rem' }}>
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
            {reminders.length > 0 ? (
              <div className="row row-cols-1 g-4">
                {reminders.map((reminder) => (
                  <div className="col" key={reminder._id}>
                    <InfoCard
                      reminder={reminder}
                      onEdit={openEditModal}
                      onDelete={handleDeleteReminder}
                    />
                  </div>
                ))}
              </div>
            ) : (
              !error && (
                <div className="text-center py-5">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                    <div className="card-body p-5">
                      <i className="bi bi-calendar-plus text-primary mb-3" style={{ fontSize: '3rem' }}></i>
                      <h3 className="card-title">No reminders yet</h3>
                      <p className="card-text text-muted">Start by adding your first reminder to keep track of important events and contacts.</p>
                      <button className="btn btn-primary btn-lg" onClick={() => setShowAddModal(true)}>
                        <i className="bi bi-plus-lg me-2"></i>
                        Create Your First Reminder
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </main>
        </div>
      </div>

      {/* Add New Reminder Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Add New Reminder</h5><button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button></div>
              <div className="modal-body">
                <form onSubmit={handleCreateReminder}>
                    {/* Form fields for adding */}
                    <input type="text" className="form-control mb-3" placeholder="Title" value={newReminder.title} onChange={(e) => setNewReminder({...newReminder, title: e.target.value})} required />
                    <select className="form-select mb-3" value={newReminder.eventType} onChange={(e) => setNewReminder({...newReminder, eventType: e.target.value})}>
                        <option>Birthday</option><option>Anniversary</option><option>Meeting</option><option>Follow-up</option><option>Custom</option>
                    </select>
                    <input type="date" className="form-control mb-3" value={newReminder.date} onChange={(e) => setNewReminder({...newReminder, date: e.target.value})} required />
                    <textarea className="form-control mb-3" placeholder="Notes (Optional)" value={newReminder.notes} onChange={(e) => setNewReminder({...newReminder, notes: e.target.value})}></textarea>
                    
                    {/* Contact Information Section */}
                    <h6 className="mb-2 text-muted">Contact Information (Optional)</h6>
                    <input 
                      type="tel" 
                      className="form-control mb-2" 
                      placeholder="Phone Number" 
                      value={newReminder.contact.phone} 
                      onChange={(e) => setNewReminder({...newReminder, contact: {...newReminder.contact, phone: e.target.value}})} 
                    />
                    <input 
                      type="tel" 
                      className="form-control mb-2" 
                      placeholder="WhatsApp Number (if different)" 
                      value={newReminder.contact.whatsapp} 
                      onChange={(e) => setNewReminder({...newReminder, contact: {...newReminder.contact, whatsapp: e.target.value}})} 
                    />
                    <input 
                      type="email" 
                      className="form-control mb-3" 
                      placeholder="Email Address" 
                      value={newReminder.contact.email} 
                      onChange={(e) => setNewReminder({...newReminder, contact: {...newReminder.contact, email: e.target.value}})} 
                    />
                    
                    <div className="d-grid mt-3"><button type="submit" className="btn btn-primary">Save Reminder</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reminder Modal */}
      {showEditModal && currentReminder && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Edit Reminder</h5><button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button></div>
              <div className="modal-body">
                <form onSubmit={handleUpdateReminder}>
                    {/* Form fields for editing */}
                    <input type="text" className="form-control mb-3" placeholder="Title" value={currentReminder.title} onChange={(e) => setCurrentReminder({...currentReminder, title: e.target.value})} required />
                    <select className="form-select mb-3" value={currentReminder.eventType} onChange={(e) => setCurrentReminder({...currentReminder, eventType: e.target.value})}>
                        <option>Birthday</option><option>Anniversary</option><option>Meeting</option><option>Follow-up</option><option>Custom</option>
                    </select>
                    <input type="date" className="form-control mb-3" value={currentReminder.date} onChange={(e) => setCurrentReminder({...currentReminder, date: e.target.value})} required />
                    <textarea className="form-control mb-3" placeholder="Notes (Optional)" value={currentReminder.notes} onChange={(e) => setCurrentReminder({...currentReminder, notes: e.target.value})}></textarea>
                    
                    {/* Contact Information Section */}
                    <h6 className="mb-2 text-muted">Contact Information (Optional)</h6>
                    <input 
                      type="tel" 
                      className="form-control mb-2" 
                      placeholder="Phone Number" 
                      value={currentReminder.contact?.phone || ''} 
                      onChange={(e) => setCurrentReminder({...currentReminder, contact: {...(currentReminder.contact || {}), phone: e.target.value}})} 
                    />
                    <input 
                      type="tel" 
                      className="form-control mb-2" 
                      placeholder="WhatsApp Number (if different)" 
                      value={currentReminder.contact?.whatsapp || ''} 
                      onChange={(e) => setCurrentReminder({...currentReminder, contact: {...(currentReminder.contact || {}), whatsapp: e.target.value}})} 
                    />
                    <input 
                      type="email" 
                      className="form-control mb-3" 
                      placeholder="Email Address" 
                      value={currentReminder.contact?.email || ''} 
                      onChange={(e) => setCurrentReminder({...currentReminder, contact: {...(currentReminder.contact || {}), email: e.target.value}})} 
                    />
                    
                    <div className="d-grid mt-3"><button type="submit" className="btn btn-primary">Update Reminder</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MainPage;
