import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function TrainDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const train = location.state;

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() - 4); // 4 days earlier

    const formatDate = (date) => date.toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(formatDate(today));
    const [swapRequests, setSwapRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!train || !selectedDate) return;

        const fetchSwaps = async () => {
            setLoading(true);
            try {
              const res = await API.get('/trainswap/train', {
                params: {
                  train_no: train.train_no,
                  date: selectedDate,
                },
              });
              setSwapRequests(res.data?.requests || []);
            } catch (error) {
              console.error('Failed to fetch swap requests:', error.response?.data || error.message);
              setSwapRequests([]);
            } finally {
              setLoading(false);
            }
          };

        fetchSwaps();
    }, [selectedDate, train]);

    if (!train) return <div className="text-white p-6">No train data found</div>;

    return (
        <div className="max-w-screen min-h-screen pt-20 items-center bg-gradient-to-br from-gray-900 to-black text-white p-6 overflow-x-hidden">
            <h1 className="text-3xl font-bold text-center">
                {train.train_name} ({train.train_no})
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* 🚉 LEFT: Train Route Visual */}
                <div className="bg-white/10 rounded-2xl p-6 shadow-md border border-white/20">
                    <h2 className="text-xl font-semibold mb-4 text-center text-blue-400">Train Route</h2>
                    <div className="flex flex-col items-start space-y-6 relative ml-6">
                        <div className="absolute left-1.5 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-blue-500" />
                        {train.route.map((station, index) => (
                            <div key={index} className="relative pl-6">
                                <div className="absolute left-[-24px] top-1 w-3 h-3 bg-blue-400 rounded-full shadow-md"></div>
                                <p className="text-lg font-medium">{station.station_name}</p>
                                <p className="text-sm text-gray-300">
                                    🕓 {station.arrival} → {station.departure} | 📍 {station.station_code}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 📦 RIGHT: Swap Request Section */}
                <div className="bg-white/10 rounded-2xl h-full p-6 shadow-md border border-white/20 flex flex-col gap-6">
                    {/* Swap Button */}
                    <div className="flex items-center gap-4">
                        <p className="text-purple-400 font-medium">Have a seat you're willing to swap?</p>
                        <button
                            onClick={() => {
                                navigate('/traindetails/trainswap', {
                                    state: {
                                        trainname: train.train_name,
                                        trainno: train.train_no,
                                        route: train.route,
                                    },
                                });
                            }}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-700 rounded-xl text-white font-semibold shadow hover:shadow-lg hover:from-blue-600 hover:to-purple-800 transition-all"
                        >
                            🚉 Submit Request
                        </button>
                    </div>

                    {/* 🔍 Date Input */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <label className="text-sm text-white">Select Journey Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={formatDate(minDate)}   // 👈 allows 4 days before today
                            // 👈 optional: restrict to today or earlier
                            className="px-4 py-2 bg-gray-800 text-white border border-white/30 rounded-lg"
                        />

                    </div>

                    {/* Swap Requests */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2 text-green-400">Seat Swap Requests</h2>
                        {loading ? (
                            <p className="text-gray-300">Loading requests...</p>
                        ) : swapRequests.length === 0 ? (
                            <p className="text-gray-300"> 📅 Please try selecting a previous date — this train may have long route swaps on earlier days.</p>
                        ) : (
                            <div className="space-y-3">
                                {swapRequests.map((req, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-800 p-4 rounded-lg border border-white/10 shadow"
                                    >
                                        <p className="text-white font-semibold">{req.name} ({req.age} yrs)</p>
                                        <p className="text-sm text-gray-300">
                                            {req.from} ➡️ {req.to} | Seat: {req.seat} | Berth: {req.berth}
                                        </p>
                                        <p className="text-sm text-blue-400 mt-1">Reason: {req.reason}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 🔗 API Info */}
                    <div>
                        <h2 className="text-xl font-semibold mb-2">API Endpoint</h2>
                        <p className="text-sm text-gray-400">
                            GET `/api/swaps?train_no={train.train_no}&date={selectedDate}`
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrainDetails;
