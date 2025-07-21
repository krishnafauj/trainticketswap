import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // only if you're using React Router
import API from '../utils/Axios';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post('/signup', {
        name,
        email,
        password,
      });

      alert(res.data.message || 'Signup successful');
      navigate('/login'); // ✅ redirect after success
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-black-700 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create Account</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-white block mb-2 text-sm font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="text-white block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-white block mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <a href="/login" className="text-blue-400 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
