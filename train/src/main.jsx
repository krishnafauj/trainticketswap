import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Pnrsearch from './components/navbar/Pnr.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './security/Login.jsx';
import ProtectedRoute from './ProtectedRouted.jsx';
import Signup from './security/Signup.jsx';
import PublicRoute from './PublicRoute.jsx';
import Home from './components/navbar/Home.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import TrainDetails from './components/navbar/Traindetails.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <div className="min-h-screen  w-screen overflow-hidden bg-gradient-to-br from-gray-600 via-black-700 to-black">
        <Routes>
          <Route element={<ProtectedRoute  />}>
            <Route path='/pnr' element={<Pnrsearch />} />
            <Route path='/' element={<Home />} />
            <Route path='/traindetails' element={<TrainDetails />} />
          </Route>
          <Route element={<PublicRoute />}>
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Route>

        </Routes>
      </div>
    </StrictMode>
  </BrowserRouter>
);