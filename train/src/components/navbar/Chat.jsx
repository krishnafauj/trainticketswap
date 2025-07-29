import React, { useEffect, useState } from 'react';
import { getSocket } from '../../utils/Socket';
import API from '../../utils/Axios';

function Chat() {
  const [validFriends, setValidFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchFriendsAndValidate = async () => {
      try {
        const res = await API.get('/friends/get');
        const friends = res.data.friends || [];
        console.log("👥 Friend list received:", friends);

        const validations = await Promise.all(
          friends.map(async (friend) => {
            try {
              const frRes = await API.post('/friends/find', { userId: friend._id });
              return { ...friend, friendshipId: frRes.data.friendshipId };
            } catch (err) {
              return null;
            }
          })
        );

        const filtered = validations.filter(f => f !== null);
        setValidFriends(filtered);
        console.log("✅ Validated friends:", filtered);
      } catch (err) {
        console.error("❌ Error validating friends:", err.message);
      }
    };

    fetchFriendsAndValidate();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessage = ({ from, message }) => {
      setMessages(prev => [...prev, { from, message }]);
    };

    socket.on('receive-message', handleMessage);

    return () => {
      socket.off('receive-message', handleMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;
    const socket = getSocket();
    const user = JSON.parse(localStorage.getItem('user'));

    socket.emit('send-message', {
      toEmail: selectedUser.email,
      fromEmail: user.email,
      message,
    });

    setMessages(prev => [...prev, { from: 'You', message }]);
    setMessage('');
  };

  return (
    <div className="flex h-screen pt-20 bg-gray-900 text-white">
      {/* Left Sidebar - Friends List */}
      <div className="w-1/4 border-r border-gray-700 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Friends</h2>
        {validFriends.length === 0 ? (
          <p className="text-gray-400">No friends found</p>
        ) : (
          <ul>
            {validFriends.map((friend) => (
              <li
                key={friend._id}
                onClick={() => {
                  setSelectedUser(friend);
                  setMessages([]); // reset chat history
                }}
                className={`cursor-pointer py-2 px-3 rounded mb-2 hover:bg-gray-700 ${
                  selectedUser && selectedUser._id === friend._id ? 'bg-gray-700' : ''
                }`}
              >
                {friend.name}
              </li>
            ))}
          </ul>
        )}
      </div>

     
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-800 font-semibold text-lg">
          {selectedUser ? selectedUser.name : 'No conversation selected'}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {!selectedUser && (
            <div className="text-center text-gray-400 mt-10">
              Select a friend to start chatting
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold">{msg.from}:</span> {msg.message}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 outline-none"
            disabled={!selectedUser}
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
