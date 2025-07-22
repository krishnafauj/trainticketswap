import { useLocation, useNavigate } from 'react-router-dom';

function TrainDetails() {
    const location = useLocation();
    const train = location.state;

    if (!train) return <div className="text-white p-6">No train data found</div>;
    const navigate = useNavigate();
    return (
        <div className=" max-w-screen min-h-screen pt-20 items-center bg-gradient-to-br from-gray-900 to-black text-white p-6 overflow-x-hidden">
            <h1 className="text-3xl font-bold text-center">
                {train.train_name} ({train.train_no})

            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* 🚉 LEFT: Train Route Visual */}
                <div className="bg-white/10 rounded-2xl p-6 shadow-md border border-white/20">
                    <h2 className="text-xl font-semibold mb-4 text-center text-blue-400">Train Route</h2>
                    <div className="flex flex-col items-start space-y-6 relative ml-6">
                        {/* Vertical dotted line */}
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


                    <div>
                        <div className='flex items-center'>
                            <p className='text-purple-400 '>
                                Have a seat you're willing to swap?
                            </p>
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
                                className="px-4 py-2 rounded-xl ml-3 bg-gradient-to-r from-blue-500 to-purple-700 text-white font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
                            >
                                click here
                            </button>
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-green-400">Seat Swap Requests</h2>
                        <div className="text-sm text-gray-300">
                            {/* 🔁 You will fetch & map real data here */}
                            <p className="mb-2">• No active requests yet.</p>
                            <p className="mb-2">• Add logic here to list requests based on this train.</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2 ">API Integration</h2>
                        <p className="text-sm text-gray-300">
                            👉 You can call `/api/swaps?train_no=${train.train_no}` to get swap requests.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrainDetails;
