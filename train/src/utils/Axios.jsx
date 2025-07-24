
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 10000, // optional: 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && token !== 'null' && token !== 'undefined') {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Remove Authorization header completely if no valid token
    delete config.headers.Authorization;
  }

  return config;
});

export default API;
