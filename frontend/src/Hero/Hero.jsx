import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="container col-xxl-8 px-4 py-5 text-center">
      <div className="py-5">
         <h1 className="display-4 fw-bold hero-gradient-text">Never Miss a Connection</h1>
        <p className="fs-5 lead my-4 text-dark">
          Your personal CRM to manage important dates and professional connections, all in one place.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
           <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3">Get Started</Link>
           <Link to="/today" className="btn btn-outline-primary btn-lg px-4">Today's Events</Link>
           <Link to="/dashboard" className="btn btn-outline-secondary btn-lg px-4">View Dashboard</Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;