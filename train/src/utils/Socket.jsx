import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
  if (socket && socket.connected) return;

  socket = io('http://localhost:3000', {
    path: '/api/socket.io',
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.email) {
      socket.emit('register', user.email);
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
};

export const getSocket = () => socket;
