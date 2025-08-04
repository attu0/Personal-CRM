import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  // Get user info from localStorage to determine login state
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  // State to manage the theme
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  // Effect to apply the theme class to the body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const logoutHandler = () => {
    // Remove user info from storage
    localStorage.removeItem('userInfo');
    // Redirect to the login page and refresh to update navbar
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-person-lines-fill me-2"></i>
          Personal CRM
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            {userInfo && ( // Only show Dashboard if user is logged in
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {userInfo ? (
              // --- Show dropdown menu if user IS logged in ---
              <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle me-1"></i>
                  {userInfo.name}
                </a>
                <ul className={`dropdown-menu dropdown-menu-end ${isDarkMode ? 'dropdown-menu-dark' : ''}`}>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person-fill me-2"></i>Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={logoutHandler} className="dropdown-item">
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // --- Show these links if user IS NOT logged in ---
              <>
                <Link to="/login" className="btn btn-outline-secondary me-2">Login</Link>
                <Link to="/login" className="btn btn-primary me-3">Sign Up</Link>
              </>
            )}
            
            {/* Theme toggle button is outside the user auth logic */}
            <div className="ms-3">
              <button onClick={toggleTheme} className="btn btn-outline-secondary rounded-circle p-2 lh-1">
                <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
