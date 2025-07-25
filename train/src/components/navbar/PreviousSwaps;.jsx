import React, { useEffect, useState } from 'react';
import API from '../../utils/Axios';

function PreviousSwaps() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySwaps = async () => {
      try {
        const res = await API.get('/api/acccounts/swaphistory'); // Fix: Make sure backend route is correct
        const data = res.data.history || [];  // Fix: should be `history`, not `requests`
        setRequests(data);
        
      } catch (err) {
        console.error('❌ Failed to fetch previous swap requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMySwaps();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br  from-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-6xl  p-20 mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-10">
          🕓 Previous Swap Requests
        </h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-gray-400">No previous swap requests found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-blue-500/20 transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-green-400">
                    {req.name} ({req.age})
                  </h2>
                  <span className="text-sm text-gray-300">PNR: {req.pnr}</span>
                </div>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Train:</span>{' '}
                  ({req.train_no})
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Journey:</span>{' '}
                  {req.from} ➡️ {req.to} on {req.date}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium text-white">Berth:</span>{' '}
                  {req.berth} ({req.seat}) | Preference: {req.berth_pref}
                </p>
                <p className="text-sm text-blue-400 mt-2">
                  Reason: {req.reason}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PreviousSwaps;
