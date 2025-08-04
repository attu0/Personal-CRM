import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function GoogleAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Get the search parameters from the URL
    const params = new URLSearchParams(location.search);
    const userInfoParam = params.get('userInfo');

    if (userInfoParam) {
      try {
        // 2. Decode and parse the user info object
        const userInfo = JSON.parse(decodeURIComponent(userInfoParam));
        
        // 3. Save the user info to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 4. Redirect to the dashboard
        navigate('/dashboard');
        window.location.reload(); // Force a reload to update the navbar
      } catch (error) {
        console.error('Failed to parse user info from URL', error);
        // If there's an error, send the user back to the login page
        navigate('/login');
      }
    } else {
      // If no user info is found, redirect to login
      navigate('/login');
    }
  }, [location, navigate]);

  // This page doesn't need to render anything visible
  return <div>Loading...</div>;
}

export default GoogleAuthCallback;
