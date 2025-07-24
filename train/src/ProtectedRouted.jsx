import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { usePageTracking } from './utils/UserPageTracking';
import CookieConsentBanner from './components/navbar/CookieConsentBanner';

function ProtectedRoute() {
  const navigate = useNavigate();
  usePageTracking();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;
    if (!email) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='' >
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <CookieConsentBanner />
    </div>
  );
}

export default ProtectedRoute;
