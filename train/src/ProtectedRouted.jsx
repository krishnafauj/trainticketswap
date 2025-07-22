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
    <div className='' >
      <Navbar />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedRoute;
