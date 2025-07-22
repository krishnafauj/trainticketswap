import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../utils/Axios';

function Navbar() {
  const navigate = useNavigate();
  const [trainNo, setTrainNo] = useState('');
  const [result, setResult] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Scroll direction logic
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY < 50) {
        setShowNavbar(true);
      } else if (window.scrollY > lastScrollY) {
        setShowNavbar(false); // scrolling down
      } else {
        setShowNavbar(true); // scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (trainNo.trim() !== '') {
        fetchTrain(trainNo);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [trainNo]);

  const fetchTrain = async (number) => {
    try {
      const res = await API.get(`/train?trainQuery=${number}`);
      setResult(res.data);
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  return (

    <div className={`fixed top-0 left-0  p-5  w-full z-50 transition-all duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* 👈 Logo + Search */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="w-20 h-10 cursor-pointer">
            <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#4CAF50", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#2196F3", stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <rect width="200" height="200" fill="#f0f0f0" rx="20" />
              <path d="M50 80 H150 V120 H50 Z" fill="url(#gradient)" stroke="#333" strokeWidth="2" />
              <path d="M50 100 H150" stroke="#fff" strokeWidth="4" strokeDasharray="8,8" />
              <circle cx="60" cy="90" r="10" fill="#FF5722" />
              <circle cx="140" cy="110" r="10" fill="#FF5722" />
              <path d="M70 90 Q100 70 130 110" fill="none" stroke="#FF5722" strokeWidth="3" strokeLinecap="round" />
              <path d="M130 90 Q100 130 70 110" fill="none" stroke="#FF5722" strokeWidth="3" strokeLinecap="round" />
              <text x="100" y="160" fontFamily="Arial" fontSize="20" fill="#333" textAnchor="middle">SeatSwap</text>
            </svg>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
              placeholder="Enter train no..."
              className="px-4 py-2 w-full rounded-xl bg-white/10 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Dropdown */}
            {result && result.length > 0 && (
              <ul className="absolute z-50 w-full mt-2 bg-white text-black rounded-xl shadow-lg max-h-60 overflow-y-auto border border-gray-300">
                {result.map((train, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      navigate(`/traindetails?trainno=${train.train_no}`, { state: train });
                      setResult([]);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {train.train_no} — {train.train_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 👉 Right Side Navigation */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-md text-white font-medium w-full md:w-auto">
          <Link to="/pnr" className="hover:text-blue-400 transition">PNR Check</Link>
          <Link to="/swaps" className="hover:text-blue-400 transition">Previous Swaps</Link>
          <Link to="/account" className="hover:text-blue-400 transition">Account</Link>
          <Link to="/chats" className="hover:text-blue-400 transition">Chats</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
