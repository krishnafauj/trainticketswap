import React, { useState } from "react";

const App = () => {
  const [pnr, setPnr] = useState("");
  const [value, setvalue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPNRStatus = async () => {
    if (pnr.length !== 10) {
      setError("Please enter a valid 10-digit PNR");
      return;
    }

    setLoading(true);
    setError("");
    setvalue(null);

    try {
      const response = await fetch(
        `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnr}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": "a6f209590dmshd4bb7ffc25dd195p17c58ajsnc8fea5eff501",
            "x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com",
          },
        }
      );
      const result = await response.json();

      if (result?.success) {
        setvalue(result.data);
      } else {
        setError("PNR not found or API error.");
      }
    } catch (err) {
      console.error(err);
      setError("Network/API Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br  from-gray-900 overflow-hidden to-black text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          🚆 IRCTC PNR Status
        </h1>

        <div className="flex gap-4 justify-center mb-6">
          <input
            type="text"
            maxLength={10}
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            placeholder="Enter 10-digit PNR"
            className="px-4 py-2 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={fetchPNRStatus}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Get Status
          </button>
        </div>

        {loading && <p className="text-center text-blue-300">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {value && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Info label="PNR" value={value.pnrNumber} />
              <Info label="Train" value={`${value.trainNumber} - ${value.trainName}`} />
              <Info label="From" value={value.boardingPoint} />
              <Info label="To" value={value.reservationUpto} />
              <Info label="Journey Date" value={value.dateOfJourney} />
              <Info label="Journey End" value={value.arrivalDate} />
              <Info label="Class" value={value.journeyClass} />
              <Info label="Fare" value={`₹${value.ticketFare}`} />
              <Info label="Quota" value={value.quota} />
              <Info label="Chart Status" value={value.chartStatus} />
            </div>

            <h2 className="text-xl font-bold text-blue-300 mb-3">🧍 Passenger Details</h2>
            {value.passengerList?.map((p, i) => (
              <div
                key={i}
                className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl mb-4"
              >
                <p className="text-lg font-semibold">Passenger {i + 1}</p>
                <p className="text-sm">Booking Status: {p.bookingStatus}</p>
                <p className="text-sm">Current Status: {p.currentStatus}</p>
                <p className="text-sm">Status Detail: {p.currentStatusDetails || "N/A"}</p>
                {p.currentStatus.startsWith("CNF") && (
                  <p className="text-sm font-bold text-green-400 mt-1">
                    ✅ Confirmed Seat: {p.currentStatus.split(" ")[1]}{" "}
                    {p.currentStatus.split(" ")[2]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 🔧 Reusable info block component
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-white/60">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default App;
