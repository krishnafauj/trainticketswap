import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

let socket = null;

export const connectSocket = () => {
  if (socket && socket.connected) {
    console.log('🔌 Socket already connected');
    return socket;
  }

  socket = io('https://trainticketswap.onrender.com', {
    path: '/api/socket.io',
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      socket.emit('register', user.email);
      console.log('📝 Registered user:', user.email);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  // Global event listener for notifications
 

  return socket;
};

export const getSocket = () => {
  if (!socket) return connectSocket();
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
