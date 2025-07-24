import React, { useState } from 'react';
import API from '../utils/Axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/login', {
        email,
        password,
      });

      const { token, user, message } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

    
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-600 via-black-700 to-black flex items-center justify-center">
      <div className="w-full max-w-md mx-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-white block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="text-white block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            Login
          </button>
        </form>
        <p  className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <span
            onClick=  {() => navigate('/signup')}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
