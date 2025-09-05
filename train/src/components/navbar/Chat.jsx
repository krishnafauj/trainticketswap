import React, { useEffect, useRef, useState } from 'react';
import { getSocket } from '../../utils/Socket';
import API from '../../utils/Axios';
import { v4 as uuidv4 } from 'uuid';

function UnifiedChatPage() {
  const [validFriends, setValidFriends] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef();
  const messagesMapRef = useRef({}); // store messages per friendshipId

  const user = JSON.parse(localStorage.getItem('user'));
  selectedUserRef.current = selectedUser;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [messages]);

  // Fetch friends once
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await API.get('/friends/get');
        const friends = res.data.friends || [];
        setValidFriends(friends);
        
      } catch (err) {
        console.error('❌ [UnifiedChat] Error fetching friends:', err.message);
      }
    };
    fetchFriends();
  }, []);

  // Socket connection & message handling
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Register user if logged in
    const registerUser = () => {
      if (socket.connected && user?.email) {
        socket.emit('register', user.email);
    
      }
    };

    socket.on('connect', () => {
      setSocketConnected(true);
     
      registerUser();
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    // Receive messages
    const handleReceiveMessage = (data) => {
      const { fromEmail, toEmail, message: msg, friendshipId } = data;

      if (!messagesMapRef.current[friendshipId]) messagesMapRef.current[friendshipId] = [];
      messagesMapRef.current[friendshipId].push({ fromEmail, message: msg });

      if (friendshipId === selectedUserRef.current?.friendshipId) {
        setMessages(prev => [...prev, { fromEmail, message: msg }]);
      }
    };

    socket.on('receive-message', handleReceiveMessage);
    socket.onAny((event, data) => console.log('🔔 [UnifiedChat] Event received:', event));

    setTimeout(registerUser, 100);

    return () => {
      
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive-message', handleReceiveMessage);
      socket.offAny();
    };
  }, [user]);

  // Select friend
  const handleSelectUser = async (friend) => {
    setSelectedUser(friend);
    

    // Load messages from cache or API
    if (messagesMapRef.current[friend.friendshipId]) {
      setMessages(messagesMapRef.current[friend.friendshipId]);
      return;
    }

    try {
      const res = await API.get(`/messages/${friend.friendshipId}`);
      const fetchedMessages = res.data.messages.map(msg => ({
        fromEmail: msg.senderId._id === user._id ? user.email : friend.email,
        message: msg.message,
      }));
      messagesMapRef.current[friend.friendshipId] = fetchedMessages;
      setMessages(fetchedMessages);
     
    } catch (err) {
      console.error('❌ [UnifiedChat] Failed to load chat history:', err);
      setMessages([]);
    }
  };

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) {
      
      return;
    }

    const socket = getSocket();
    if (!socket || !socket.connected) {
      alert('Connection lost. Please refresh the page.');
      console.log('❌ [UnifiedChat] Cannot send: socket not connected');
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
    <div className="flex h-screen pt-20 bg-gray-900 text-white">
      {/* Connection Status */}
      <div className={`fixed top-16 right-4 px-3 py-1 rounded text-sm ${socketConnected ? 'bg-green-600' : 'bg-red-600'}`}>
        {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-700 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Friends ({validFriends.length})</h2>
        {validFriends.length === 0 ? (
          <p className="text-gray-400">No friends found</p>
        ) : (
          <ul>
            {validFriends.map(friend => (
              <li
                key={friend._id}
                onClick={() => handleSelectUser(friend)}
                className={`cursor-pointer py-3 px-3 rounded mb-2 hover:bg-gray-700 transition-colors ${
                  selectedUser?._id === friend._id ? 'bg-gray-700 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="font-medium">{friend.name}</div>
                <div className="text-sm text-gray-400">{friend.email}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-800 font-semibold text-lg">
          {selectedUser ? (
            <div>
              <span>{selectedUser.name}</span>
              <span className="text-sm text-gray-400 ml-2">({selectedUser.email})</span>
            </div>
          ) : 'No conversation selected'}
        </div>

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
                className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                  msg.fromEmail === selectedUser.email
                    ? 'bg-gray-600 text-left mr-auto'
                    : 'bg-blue-600 text-right ml-auto'
                }`}
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
        <div className="p-4 border-t border-gray-700 bg-gray-800 flex gap-2">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={selectedUser ? "Type a message..." : "Select a friend first..."}
            className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedUser || !socketConnected}
          />
          <button
            onClick={sendMessage}
            disabled={!selectedUser || !socketConnected || !message.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default UnifiedChatPage;
