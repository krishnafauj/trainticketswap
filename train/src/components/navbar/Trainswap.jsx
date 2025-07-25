import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../../utils/Axios';

function Trainswap() {
  const navigate= useNavigate();
  const { state } = useLocation();
  const { trainname, trainno, route } = state || {};

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    pnr: '',
    name: '',
    age: '',
    from: '',
    to: '',
    date: today,
    reason: '',
    to_statin: '',
    from_station: '',
    seat: '',
    berth: '',
    berth_pref: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "from") {
      const station = route.find(s => s.station_name === value);
      setFormData({
        ...formData,
        from: value,
        from_station: station?.departure || '',
      });
    } else if (name === "to") {
      const station = route.find(s => s.station_name === value);
      setFormData({
        ...formData,
        to: value,
        to_statin: station?.arrival || '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.pnr.length !== 10) {
      alert("PNR must be exactly 10 digits");
      return;
    }

    const requestData = {
      ...formData,
      trainname,
      train_no: trainno 
    };

    try {
      console.log('Sending request with data:', requestData);
      const response = await API.post('/api/trainswap', requestData);
      const data = response.data; // ✅ no .json()
      alert('request submitted')
      navigate('/')

    } catch (error) {
      console.error('Error during API call:', error.response?.data || error.message);
    }
    

  };

  return (
    <div className="min-h-screen pt-18 bg-gradient-to-br from-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto bg-white/10 border border-white/20 rounded-2xl p-10 shadow-2xl backdrop-blur-md">
        <h1 className="text-4xl font-bold text-center mb-10 text-blue-400">Train Swap Request 🚄</h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">Train Name</label>
              <input type="text" value={trainname} readOnly className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">Train No</label>
              <input type="text" value={trainno} readOnly className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">PNR Number</label>
              <input type="text" name="pnr" value={formData.pnr} onChange={handleChange} required placeholder="e.g. 1234567890" className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">Date of Journey</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required min={today} className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">Passenger Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your name" className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block mb-1">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required placeholder="Age" className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">Coach & Seat No.</label>
              <input type="text" name="seat" value={formData.seat} onChange={handleChange} required placeholder="e.g. B2 32" className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white" />
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">Your Birth </label>
              <select name="berth" value={formData.berth} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white">
                <option value="" disabled>Select Your Berth </option>
                <option value="Lower">Lower</option>
                <option value="Middle">Middle</option>
                <option value="Upper">Upper</option>
                <option value="Side Lower">Side Lower</option>
                <option value="Side Upper">Side Upper</option>
                
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block mb-1">Your Birth Preference </label>
              <select name="berth_pref" value={formData.berth_pref} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white">
                <option value="" disabled>Select Your Berth </option>
                <option value="Lower">Lower</option>
                <option value="Middle">Middle</option>
                <option value="Upper">Upper</option>
                <option value="Side Lower">Side Lower</option>
                <option value="Side Upper">Side Upper</option>
                <option value="No Preference">No Preference</option>
              </select>
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">From Station</label>
              <select name="from" value={formData.from} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white max-h-52 overflow-y-auto">
                <option value="" disabled>Select departure station</option>
                {route.map((station, idx) => (
                  <option key={idx} value={station.station_name}>
                    {station.station_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[300px]">
              <label className="block mb-1">To Station</label>
              <select name="to" value={formData.to} onChange={handleChange} required className="w-full px-4 py-2 bg-gray-800 border border-white/30 rounded-lg text-white max-h-52 overflow-y-auto">
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
                      className={isBeforeFrom ? 'bg-gray-700 text-gray-400' : ''}
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
            <textarea name="reason" value={formData.reason} onChange={handleChange} rows="3" required placeholder="e.g. Traveling with friend, prefer lower berth..." className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white" />
          </div>

          {/* Submit */}
          <div className="text-center">
            <button type="submit" className="px-10 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-xl font-semibold text-white shadow-lg transition-all duration-300">
              📤 Submit Swap Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Trainswap;
