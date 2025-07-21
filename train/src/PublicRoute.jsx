// components/PublicRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;
  return email ? <Navigate to="/" replace /> : <Outlet  />;
};

export default PublicRoute;
