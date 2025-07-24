import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🧹 Clear auth token
    console.log("request")
    localStorage.removeItem('token'); // change key if needed
    localStorage.removeItem('user')
    navigate('/login');
  };
  
  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition"
    >
      🔓 Logout
    </button>
  );
}

export default LogoutButton;
