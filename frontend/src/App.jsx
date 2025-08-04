import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Hero from './Hero/Hero.jsx';
import AuthPage from './AuthPage/AuthPage.jsx';
import GoogleAuthCallback from './AuthPage/GoogleAuthCallback.jsx';
import ProfilePage from './ProfilePage/ProfilePage.jsx';
import PermissionsPage from './Permissions/PermissionsPage.jsx';
import MainPage from './MainPage/MainPage.jsx';
import TodaysEvents from './TodaysEvents/TodaysEvents.jsx';
import ContactCollectionPage from './ContactCollection/ContactCollectionPage.jsx';
import PersonalContactPage from './ContactCollection/PersonalContactPage.jsx';

function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prevMode => !prevMode);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
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
            {userInfo && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/today">Today's Events</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center">
            {userInfo ? (
              <div className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle me-1"></i>
                  {userInfo.name}
                </a>
                <ul className={`dropdown-menu dropdown-menu-end ${isDarkMode ? 'dropdown-menu-dark' : ''}`}>
                  <li>
                    <Link className="dropdown-item" to="/today">
                      <i className="bi bi-calendar-day me-2 "></i>Today's Events
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/dashboard">
                      <i className="bi bi-kanban me-2"></i>Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-person-fill me-2"></i>Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button onClick={logoutHandler} className="dropdown-item"><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-secondary me-2">Login</Link>
                <Link to="/login" className="btn btn-primary me-3">Sign Up</Link>
              </>
            )}
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

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        <Route path="/today" element={<TodaysEvents />} />
        <Route path="/dashboard" element={<MainPage />} />
        <Route path="/share/:shareToken" element={<ContactCollectionPage />} />
        <Route path="/contact/:personalToken" element={<PersonalContactPage />} />
      </Routes>
    </>
  );
}

export default App;
