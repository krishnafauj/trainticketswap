import axios from 'axios';

// Automatically detect environment
const isLocalhost = window.location.hostname === 'localhost';

// Set base URL dynamically
const API = axios.create({
  baseURL: isLocalhost
    ? 'http://localhost:3000/api'                             // 👉 Local backend
    : 'https://trainticketswap.onrender.com/api',             // 👉 Render backend
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to each request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
