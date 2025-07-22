import React from "react";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user ? user.name : "Guest";

  return (
    <div className="min-h-screen  flex items-center bg-gradient-to-br from-gray-900 to-black text-white  ">
      <div className="max-w-7xl mx-auto">
        {/* Greeting */}
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-16">Hi, {name} 👋</h1>

        {/* Side-by-side layout */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-10">
          {/* Left Side: Steps */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-white mb-4">🚆 Part 1: Steps to Use the Platform</h2>
            <div className="space-y-4 text-xl text-gray-300  leading-relaxed">
              <p><strong>1.</strong> Use the search bar above to enter your train number.</p>
              <p><strong>2.</strong> The system checks which dataset to use based on train number range.</p>
              <p><strong>3.</strong> See swap requests available for that train.</p>
              <p><strong>4.</strong> Review details: name, seat, status, swap preference.</p>
              <p><strong>5.</strong> If the train number is invalid, you’ll be notified gracefully.</p>
            </div>
          </div>

          {/* Right Side: Short Points (Centered) */}
          <div className="flex flex-col justify-center space-y-4 text-gray-300 text-base leading-relaxed">
            <h2 className="text-2xl font-semibold text-white mb-4">💬 Key Features</h2>
            <p>• Message users directly — no phone numbers needed.</p>
            <p>• All chats are secure and saved for 5 days.</p>
            <p>• Easily respond to requests from the results screen.</p>
            <p>• Quick PNR check available on the dashboard.</p>
            <p>• Everything is private, anonymous, and efficient.</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-20 align-bottom text-center text-sm text-gray-500">
          Haven’t searched yet? Use the search bar to begin exploring train swaps.
        </div>
      </div>
    </div>
  );
}

export default Home;
