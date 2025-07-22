import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Trainswap() {
    const { state } = useLocation();
    const { trainname, trainno, route } = state || {};

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [formData, setFormData] = useState({
        pnr: '',
        name: '',
        age: '',
        from: '',
        to: '',
        date: today,
        reason: '',
        seat: '',
        berth: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.pnr.length !== 10) {
            alert("PNR must be exactly 10 digits");
            return;
        }
        console.log('Swap Request:', { ...formData, trainname, trainno });
        // TODO: Send to backend API
    };

    return (
        <div className="min-h-screen pt-24 bg-gradient-to-br from-gray-900 to-black text-white px-6 py-10">
            <div className="max-w-3xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">Train Swap Request 🚄</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Train Name & No (Read Only) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Train Name</label>
                            <input
                                type="text"
                                value={trainname}
                                readOnly
                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Train No</label>
                            <input
                                type="text"
                                value={trainno}
                                readOnly
                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                            />
                        </div>

                    </div>

                    {/* PNR, Name, Age */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">PNR Number</label>
                            <input
                                type="text"
                                name="pnr"
                                value={formData.pnr}
                                onChange={handleChange}
                                placeholder="e.g. 1234567890"
                                required
                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                            />
                        </div>


                        <div>
                            <label className="block mb-1">Date of Journey</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                min={today} // 👈 this restricts past dates
                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">Age</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                placeholder="Age"
                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Passenger Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                                className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                            />
                        </div>
                    </div>

                    {/* From, To, Date */}
                    {/* From and To Station */}
                    {/* Seat No and Berth Preference */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Enter Coach Number and Seat Number</label>
                            <input
                                type="text"
                                name="seat"
                                value={formData.seat}
                                onChange={handleChange}
                                placeholder="e.g. B3 42"
                                className="w-full px-4 py-2 bg-gray-800 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-52 overflow-y-auto"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Berth Details</label>
                            <select
                                name="berth"
                                value={formData.berth}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-gray-800 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-52 overflow-y-autog"
                            >
                                <option value="" disabled>Select berth preference</option>
                                <option value="Lower">Lower</option>
                                <option value="Middle">Middle</option>
                                <option value="Upper">Upper</option>
                                <option value="Side Lower">Side Lower</option>
                                <option value="Side Upper">Side Upper</option>
                                <option value="No Preference">No Preference</option>
                            </select>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* From Station */}
                        <div>
                            <label className="block mb-1">From Station</label>
                            <select
                                name="from"
                                value={formData.from}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-gray-800 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-52 overflow-y-auto"
                            >
                                <option value="" disabled>Select departure station</option>
                                {route.map((station, idx) => (
                                    <option key={idx} value={station.station_name}>
                                        {station.station_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* To Station */}
                        <div>
                            <label className="block mb-1">To Station</label>
                            <select
                                name="to"
                                value={formData.to}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 bg-gray-800 text-white border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-52 overflow-y-auto"
                            >
                                <option value="" disabled>Select destination station</option>
                                {route.map((station, idx) => {
                                    const fromIndex = route.findIndex(s => s.station_name === formData.from);
                                    const currentIndex = idx;
                                    const isBeforeFrom = fromIndex !== -1 && currentIndex <= fromIndex;

                                    return (
                                        <option
                                            key={idx}
                                            value={station.station_name}
                                            disabled={isBeforeFrom}
                                            className={isBeforeFrom ? "bg-gray-700 text-gray-400" : ""}
                                        >
                                            {station.station_name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>


                    {/* Reason */}
                    <div>
                        <label className="block mb-1">Reason for Swap</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Mention if you want lower berth, change of coach, travel with friend, etc."
                            rows="3"
                            required
                            className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg transition-all duration-300"
                        >
                            📤 Submit Swap Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Trainswap;
