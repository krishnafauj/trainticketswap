import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
function ProtectedRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;
    if (!email) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen p-4 text-white">
      <Navbar />
      <main className=" max-w-screen m-4">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedRoute;
