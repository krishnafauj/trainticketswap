import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/Axios';

function Chat() {
  const [validFriends, setValidFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriendsAndValidate = async () => {
      try {
        const token = localStorage.getItem('token');

        console.log("🔍 Step 1: Fetching friend list...");
        const friendListRes = await API.get('/friends/get');
        const friends = friendListRes.data.friends || [];
        console.log("👥 Friend list received:", friends);

        const validated = [];

        for (let friend of friends) {
          try {
            console.log("🔁 Validating friendship with:", friend._id);

            const friendshipRes = await API.post(
              '/friends/find',
              { userId: friend._id },
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            validated.push({
              ...friend,
              friendshipId: friendshipRes.data.friendshipId,
            });

            console.log("✅ Friendship confirmed with:", friend._id);
          } catch (e) {
            console.warn("❌ Friendship not found with:", friend._id);
            // Skip this friend if no valid friendship
          }
        }

        setValidFriends(validated);
      } catch (err) {
        console.error("❌ Error validating friends:", err.message);
      }
    };

    fetchFriendsAndValidate();
  }, []);

  return (
    <div className="bg-gray-900 p-10 text-white h-screen">
      <h1 className="text-2xl font-bold mb-4">Select a friend to chat</h1>

      {validFriends.length === 0 ? (
        <p className="text-gray-400">No valid friends found.</p>
      ) : (
        validFriends.map((friend) => (
          <div
            key={friend._id}
            className="p-3 bg-gray-800 rounded mb-3 cursor-pointer hover:bg-gray-700"
            onClick={() =>
              navigate('/chat-room', {
                state: {
                  friendshipId: friend.friendshipId,
                  otherUser: {
                    _id: friend._id,
                    name: friend.name,
                    email: friend.email,
                  },
                },
              })
            }
          >
            <div className="font-semibold">{friend.name}</div>
            <div className="text-sm text-gray-400">{friend.email}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default Chat;
