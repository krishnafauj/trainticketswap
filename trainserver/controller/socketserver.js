import { Server } from "socket.io";

export default function initSocketServer(server) {
  const allowedOrigins = [
    'http://localhost:5173',  // local dev
    'https://trainticketswap.vercel.app/' // Vercel frontend
  ];
  
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
    },
    path: '/api/socket.io',
  });

  const onlineUsers = new Map();
  io.on('connection', (socket) => {
    socket.on('register', (email) => {
      console.log("connection build");
      onlineUsers.set(email, socket.id);
    });

    socket.on('send-message', ({ toEmail, fromEmail, message }) => {
      const targetSocketId = onlineUsers.get(toEmail);
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive-message', {
          from: fromEmail,
          message,
        });
      } else {
        console.log(`User ${toEmail} is offline. Store message for later.`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // Remove user from onlineUsers map
      for (const [email, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(email);
          break;
        }
      }
    });
  });

  return io;
}
