import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { usePageTracking } from './utils/UserPageTracking';
import CookieConsentBanner from './components/navbar/CookieConsentBanner';
import { Toaster } from 'react-hot-toast';
import { connectSocket } from './utils/Socket';
function ProtectedRoute() {
  useEffect(() => {
    connectSocket(); // connects once when app loads
  }, []);
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
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <main className="">
        <Outlet />
      </main>
      <CookieConsentBanner />
    </div>
  );
}

export default ProtectedRoute;
