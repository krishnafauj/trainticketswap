import { Server } from "socket.io";

export default function initSocketServer(server) {
  const allowedOrigins = [
    'http://localhost:5173',  // local development
    'https://trainticketswap.vercel.app'  // Vercel deployment
  ];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    },
    path: '/api/socket.io',
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    

    socket.on('register', (email) => {
      if (!email) return;
      onlineUsers.set(email, socket.id);
      
      // Send confirmation back to user
      socket.emit('registered', { email, socketId: socket.id });
    });

    socket.on('send-message', ({ toEmail, fromEmail, message, friendshipId }) => {
      
      
      if (!toEmail || !fromEmail || !message || !friendshipId) {
       
        return;
      }
      
      const targetSocketId = onlineUsers.get(toEmail);
      
      if (targetSocketId) {
        // 🚨 FIX: Send consistent field names
        io.to(targetSocketId).emit('receive-message', {
          fromEmail,    // ← Changed from 'from' to 'fromEmail'
          toEmail,      // ← Added toEmail
          message,
          friendshipId,
        });
      
        
        // Also send confirmation to sender
        socket.emit('message-sent', {
          toEmail,
          fromEmail,
          message,
          friendshipId,
          status: 'delivered'
        });
      } else {
        // Send offline status to sender
        socket.emit('message-sent', {
          toEmail,
          fromEmail,
          message,
          friendshipId,
          status: 'offline'
        });
      }
    });

    socket.on('disconnect', () => {
      for (const [email, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(email);
          console.log(`🗑️ Removed user ${email} from online users`);
          break;
        }
      }
    });
  });

  return io;
}