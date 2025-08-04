import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProfilePage() {
  const navigate = useNavigate();

  // State for all the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Nested state for the profile object
  const [profile, setProfile] = useState({
    birthday: '',
    anniversary: '',
    spouseName: '',
    companyName: '',
    incorporationDate: '',
    officeAddress: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      instagram: '',
    },
  });

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data when the component loads
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      navigate('/login'); // Redirect to login if not logged in
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('/api/users/profile', config);
        
        setName(data.name);
        setEmail(data.email);
        if (data.profile) {
            const formattedProfile = {
                ...data.profile,
                birthday: data.profile.birthday ? new Date(data.profile.birthday).toISOString().split('T')[0] : '',
                anniversary: data.profile.anniversary ? new Date(data.profile.anniversary).toISOString().split('T')[0] : '',
                incorporationDate: data.profile.incorporationDate ? new Date(data.profile.incorporationDate).toISOString().split('T')[0] : ''
            };
            setProfile(formattedProfile);
        }
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle changes in nested profile state
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  // Handle form submission to update profile
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const updateData = { name, email, profile };
        if(password) {
            updateData.password = password;
        }

        const { data } = await axios.put('/api/users/profile', updateData, config);

        localStorage.setItem('userInfo', JSON.stringify(data));
        setLoading(false);
        
        // ** Navigate to the permissions page on successful update **
        navigate('/permissions');

    } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile.');
        setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <form className="card p-4" onSubmit={submitHandler}>
            <h2 className="text-center mb-4">User Profile</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row g-3">
              {/* Personal Info */}
              <div className="col-md-6">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label htmlFor="birthday" className="form-label">Birthday</label>
                <input type="date" className="form-control" id="birthday" name="birthday" value={profile.birthday} onChange={handleProfileChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="anniversary" className="form-label">Anniversary</label>
                <input type="date" className="form-control" id="anniversary" name="anniversary" value={profile.anniversary} onChange={handleProfileChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="spouseName" className="form-label">Spouse Name</label>
                <input type="text" className="form-control" id="spouseName" name="spouseName" value={profile.spouseName} onChange={handleProfileChange} />
              </div>

              {/* Company Info */}
              <div className="col-12"><hr className="my-3" /></div>
              <div className="col-md-6">
                <label htmlFor="companyName" className="form-label">Company Name</label>
                <input type="text" className="form-control" id="companyName" name="companyName" value={profile.companyName} onChange={handleProfileChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="incorporationDate" className="form-label">Incorporation Date</label>
                <input type="date" className="form-control" id="incorporationDate" name="incorporationDate" value={profile.incorporationDate} onChange={handleProfileChange} />
              </div>

              {/* Social Links */}
              <div className="col-12"><hr className="my-3" /></div>
              <div className="col-md-4">
                <label htmlFor="linkedin" className="form-label">LinkedIn</label>
                <input type="url" className="form-control" id="linkedin" name="linkedin" value={profile.socialLinks.linkedin} onChange={handleSocialChange} />
              </div>
              <div className="col-md-4">
                <label htmlFor="twitter" className="form-label">Twitter</label>
                <input type="url" className="form-control" id="twitter" name="twitter" value={profile.socialLinks.twitter} onChange={handleSocialChange} />
              </div>
              <div className="col-md-4">
                <label htmlFor="instagram" className="form-label">Instagram</label>
                <input type="url" className="form-control" id="instagram" name="instagram" value={profile.socialLinks.instagram} onChange={handleSocialChange} />
              </div>

              {/* Password Update */}
              <div className="col-12"><hr className="my-3" /></div>
              <div className="col-md-6">
                <label htmlFor="password">New Password</label>
                <input type="password" id="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep unchanged" />
              </div>
              <div className="col-md-6">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input type="password" id="confirmPassword" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                {loading ? 'Saving...' : 'Save and Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
