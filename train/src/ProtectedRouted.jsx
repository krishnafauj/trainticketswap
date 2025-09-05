import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { usePageTracking } from './utils/UserPageTracking';
import CookieConsentBanner from './components/navbar/CookieConsentBanner';
import { Toaster, toast } from 'react-hot-toast';
import { connectSocket, getSocket } from './utils/Socket';

function ProtectedRoute() {
  const navigate = useNavigate();
  const [socketConnected, setSocketConnected] = useState(false);

  usePageTracking();

  // 1️⃣ Socket connection setup
  useEffect(() => {
    const socket = connectSocket();
  
    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => setSocketConnected(false);
  
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
  
    // Use 'receive-message' directly instead of onAny
    socket.on('receive-message', (data) => {
      console.log('📩 receive-message data:', data);
      toast(`📩 New message from ${data.fromEmail || 'Unknown'}: ${data.message}`, {
        icon: '💬',
        position: 'top-right',
        duration: 4000,
      });
    });
  
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive-message');
    };
  }, []);
  
  // 3️⃣ Auth check
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="">
      {/* Global toaster for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Navbar */}
      <Navbar />

      {/* Connection status */}
      

      {/* Page content */}
      <main className="">
        <Outlet />
      </main>

      {/* Cookie consent */}
      <CookieConsentBanner />
    </div>
  );
}

export default ProtectedRoute;
