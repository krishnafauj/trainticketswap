import React, { useEffect, useState } from 'react';
import ChatPage from './UserChatPage';
import { connectSocket, getSocket } from '../../utils/Socket';

function Chat() {
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    connectSocket();
  }, []);

  const users = [...Array(10)].map((_, i) => `user${i + 1}@example.com`);

  return (
    <div className="flex h-screen pt-20 bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-[320px] border-r border-gray-700 bg-gray-800 flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">Chats</div>
        <div className="p-2">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {users.map((email, i) => (
            <div
              key={i}
              onClick={() => setSelectedUser(email)}
              className="p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
            >
              <div className="font-semibold">{email}</div>
              <div className="text-sm text-gray-400">Click to chat</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <ChatPage selectedUser={selectedUser} />
    </div>
  );
}

export default Chat;
