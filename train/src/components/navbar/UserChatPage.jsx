import React, { useEffect, useState } from 'react';
import { getSocket } from '../../utils/Socket';

function UserChatPage({ selectedUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleMessage = ({ from, message }) => {
      setMessages((prev) => [...prev, { from, message }]);
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
      toEmail: selectedUser,
      fromEmail: user.email,
      message,
    });

    setMessages((prev) => [...prev, { from: 'You', message }]);
    setMessage('');
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-gray-900">
      <div className="p-4 border-b border-gray-700 bg-gray-800 font-semibold text-lg">
        {selectedUser || 'No conversation selected'}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
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
  );
}

export default UserChatPage;
