import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/Axios';

function Navbar() {
  const navigate = useNavigate();
  const [trainNo, setTrainNo] = useState('');
  const [result, setResult] = useState(null);
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
      console.log(res.data);
    } catch (err) {
      console.error('API Error:', err);
    }
  };
  return (
    <div className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg flex justify-between items-center rounded-b-2xl">

      {/* 👈 Left Side: Logo + Search */}
      <div className="flex items-center gap-6  mt-2">
        {/* 🚄 Custom SVG Logo */}
        <div onClick={() => navigate('/')} className="w-20 h-10">
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

        {/* 🔍 Search Input */}
        <div className="relative">
          <input
            type="text"
            value={trainNo}
            onChange={(e) => setTrainNo(e.target.value)}
            placeholder="Enter train no..."
            className="px-4 py-2 w-64 rounded-xl bg-white/10 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 🔽 Dropdown list */}
          {result && result.length > 0 && (
            <ul className="absolute z-50 w-64 mt-2 bg-white text-black rounded-xl shadow-lg max-h-60 overflow-y-auto border border-gray-300">
              {result.map((train, index) => (
                <li
                  key={index}
                  onClick={() => {
                    navigate(`/traindetails?trainno=${train.train_no}`, {
                      state: train, // 👈 pass full train JSON
                    });
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

      {/* 👉 Right Side: Navigation Links */}
      <div className="flex gap-6 text-md text-white  font-medium">
        <Link to="/pnr" className="hover:text-blue-400 transition">PNR Check</Link>
        <Link to="/swaps" className="hover:text-blue-400 transition">Previous Swaps</Link>
        <Link to="/account" className="hover:text-blue-400 transition">Account</Link>
        <Link to="/chats" className="hover:text-blue-400 transition">Chats</Link>
      </div>
    </div>
  );
}

export default Navbar;
