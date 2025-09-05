import React, { useEffect, useRef, useState } from 'react';
import { getSocket } from '../../utils/Socket';
import API from '../../utils/Axios';
import { v4 as uuidv4 } from 'uuid';

function UnifiedChatPage() {
  const [showRed, setShowRed] = useState(false);

  const [validFriends, setValidFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef();
  const messagesMapRef = useRef({});
  const user = JSON.parse(localStorage.getItem('user'));
  selectedUserRef.current = selectedUser;

  // Socket connection
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    if (socket.connected && user?.email) socket.emit('register', user.email);

    const handleReceiveMessage = (data) => {
      const { fromEmail, message: msg, friendshipId } = data;
      if (!messagesMapRef.current[friendshipId]) messagesMapRef.current[friendshipId] = [];
      messagesMapRef.current[friendshipId].push({ fromEmail, message: msg });

      if (friendshipId === selectedUserRef.current?.friendshipId) {
        setMessages(prev => [...prev, { fromEmail, message: msg }]);
      }
    };

    const handleConnect = () => setSocketConnected(true);
    const handleDisconnect = () => {
      setSocketConnected(false);
      setTimeout(() => window.location.reload(), 500);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [user]);

  // Auto scroll
  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  // Fetch friends and restore selected friend
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await API.get('/friends/get');
        const friends = res.data.friends || [];
        setValidFriends(friends);

        // Restore selected friend if page reloaded
        const savedFriendId = sessionStorage.getItem('selectedFriend');
        if (savedFriendId) {
          const savedFriend = friends.find(f => f._id === savedFriendId);
          if (savedFriend) setSelectedUser(savedFriend);
          sessionStorage.removeItem('selectedFriend');
        }
      } catch (err) {
        console.error('❌ Error fetching friends:', err.message);
      }
    };
    fetchFriends();
  }, []);

  const handleSelectUser = async (friend) => {
    // Save friend for reload
    sessionStorage.setItem('selectedFriend', friend._id);
    window.location.reload(); // Refresh to reload chat
  };

useEffect(() => {
  let timer;
  if (!socketConnected) {
    timer = setTimeout(() => setShowRed(true), 3000); // 3 seconds delay
  } else {
    setShowRed(false); // hide red if connected
  }
  return () => clearTimeout(timer);
}, [socketConnected]);
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    const socket = getSocket();
    if (!socket || !socket.connected) {
      alert('Connection lost. Please refresh.');
      return;
    }

    const friendshipId = selectedUser.friendshipId || uuidv4();
    const payload = {
      toEmail: selectedUser.email,
      fromEmail: user.email,
      message,
      friendshipId,
    };

    socket.emit('send-message', payload);

    const newMessage = { fromEmail: user.email, message };
    setMessages(prev => [...prev, newMessage]);
    if (!messagesMapRef.current[friendshipId]) messagesMapRef.current[friendshipId] = [];
    messagesMapRef.current[friendshipId].push(newMessage);

    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen pt-18 bg-gray-900 text-white">
      {/* Connection Status for desktop */}
      <div className={`hidden md:block fixed top-4 right-1 px-3 py-1 rounded text-sm z-50 ${socketConnected ? 'bg-green-600' : 'bg-red-600'}`}>
        {socketConnected ? '🟢 Connected' : showRed ? '🔴 Refresh the page' : ''}
      </div>

      {/* Mobile header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800 md:hidden">
        <button
          className="px-3 py-2 bg-gray-700 rounded hover:bg-gray-600"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          ☰
        </button>
        <span className="font-bold text-lg">
          {selectedUser ? selectedUser.name : 'Unified Chat'}
        </span>
        <div className={`px-3 py-1 rounded text-sm ${socketConnected ? 'bg-green-600' : 'bg-red-600'}`}>
          {socketConnected ? '🟢 Connected' : showRed ? '🔴 Refresh the page' : ''}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 p-4 overflow-y-auto transform transition-transform md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex md:flex-col`}
        >
          <h2 className="text-xl font-bold mb-4">Friends ({validFriends.length})</h2>
          {validFriends.length === 0 ? (
            <p className="text-gray-400">No friends found</p>
          ) : (
            <ul>
              {validFriends.map(friend => (
                <li
                  key={friend._id}
                  onClick={() => handleSelectUser(friend)}
                  className={`cursor-pointer py-3 px-3 rounded mb-2 hover:bg-gray-700 transition-colors ${selectedUser?._id === friend._id ? 'bg-gray-700 border-l-4 border-blue-500' : ''}`}
                >
                  <div className="font-medium">{friend.name}</div>
                  <div className="text-sm text-gray-400">{friend.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Chat area */}
        <div className="flex-1 flex flex-col ml-0 md:ml-64">
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {!selectedUser ? (
              <div className="text-center text-gray-400 mt-10">
                Select a friend to start chatting
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">No messages yet.</div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${msg.fromEmail === selectedUser.email ? 'bg-gray-600 text-left mr-auto' : 'bg-blue-600 text-right ml-auto'}`}
                >
                  <div className="text-xs opacity-70 mb-1">
                    {msg.fromEmail === user.email ? 'You' : selectedUser.name}
                  </div>
                  {msg.message}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="w-full p-2 border-t border-gray-700 bg-gray-800 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={selectedUser ? "Type a message..." : "Select a friend first..."}
              className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 w-full"
              disabled={!selectedUser || !socketConnected}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedUser || !socketConnected || !message.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnifiedChatPage;
