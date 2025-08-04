import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AuthPage() {
  // State to toggle between Login and Sign Up forms
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for loading indicators and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Handler for the email/password form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLoginMode && !name) {
      setError('Name is required for signing up.');
      setLoading(false);
      return;
    }
    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      let response;

      if (isLoginMode) {
        response = await axios.post(
          'http://localhost:5000/api/users/login',
          { email, password },
          config
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/users',
          { name, email, password },
          config
        );
      }

      localStorage.setItem('userInfo', JSON.stringify(response.data));
      setLoading(false);
      
      if (isLoginMode) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }

    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card p-4">
            <h2 className="text-center mb-4 fw-bold">{isLoginMode ? 'Login' : 'Sign Up'}</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            
            {/* Email/Password Form */}
            <form onSubmit={submitHandler}>
              {!isLoginMode && (
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameInput"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  id="emailInput"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="passwordInput"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted">OR</span>
                <hr className="flex-grow-1" />
            </div>

            {/* Google Login Button */}
            <div className="d-grid">
                <a className="btn btn-outline-secondary" href="http://localhost:5000/api/auth/google" role="button">
                    <i className="bi bi-google me-2"></i>
                    Continue with Google
                </a>
            </div>

            {/* Toggle between modes */}
            <div className="mt-3 text-center">
              <button
                className="btn btn-link"
                onClick={() => setIsLoginMode(!isLoginMode)}
              >
                {isLoginMode ? 'Need an account? Sign Up' : 'Have an account? Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
