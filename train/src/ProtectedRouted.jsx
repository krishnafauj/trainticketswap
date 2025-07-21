import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      navigate('/login');
    }
  }, [navigate]);

  return <Outlet />;
}

export default ProtectedRoute;
