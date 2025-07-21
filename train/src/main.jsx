import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './security/Login.jsx';
import ProtectedRoute from './ProtectedRouted.jsx';
import Signup from './security/Signup.jsx';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <div className="min-h-screen  w-screen  overflow-hidden bg-gradient-to-br from-gray-900 to-black">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<App />} />
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />

        </Routes>
      </div>
    </StrictMode>
  </BrowserRouter>
);