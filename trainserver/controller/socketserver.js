import { Server } from "socket.io";
import OfflineMessage from "../model/offlineMesssage.js";

export default function initSocketServer(server) {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://trainticketswap.vercel.app'
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

    // 🔹 Register user
    socket.on('register', async (email) => {
      if (!email) return;
      onlineUsers.set(email, socket.id);
      console.log(`✅ User registered: ${email} with socket ID: ${socket.id}`);
      socket.emit('registered', { email, socketId: socket.id });

      try {
        const offlineMessages = await OfflineMessage.find({ toEmail: email });
        if (offlineMessages.length > 0) {
          console.log(`📨 Delivering ${offlineMessages.length} offline messages to ${email}`);
          offlineMessages.forEach(msg => {
            socket.emit('receive-message', {
              fromEmail: msg.fromEmail,
              toEmail: msg.toEmail,
              message: msg.message,
              friendshipId: msg.friendshipId
            });
          });

          // Remove delivered offline messages
          await OfflineMessage.deleteMany({ toEmail: email });
          console.log(`🗑️ Offline messages for ${email} deleted after delivery`);
        }
      } catch (err) {
        console.error("❌ Error delivering offline messages:", err);
      }
    });

    // 🔹 Send message
    socket.on('send-message', async ({ toEmail, fromEmail, message, friendshipId }) => {
      if (!toEmail || !fromEmail || !message || !friendshipId) return;

      const targetSocketId = onlineUsers.get(toEmail);

      if (targetSocketId) {
        // User online → send instantly
        io.to(targetSocketId).emit('receive-message', {
          fromEmail,
          toEmail,
          message,
          friendshipId
        });
        console.log(`📤 Message sent from ${fromEmail} to ${toEmail} (online)`);

        socket.emit('message-sent', { toEmail, fromEmail, message, friendshipId, status: 'delivered' });
      } else {
        // User offline → save message
        console.log(`📥 ${toEmail} is offline. Saving message from ${fromEmail}`);
        try {
          await OfflineMessage.create({ friendshipId, fromEmail, toEmail, message });
          console.log(`💾 Offline message stored for ${toEmail}`);
          socket.emit('message-sent', { toEmail, fromEmail, message, friendshipId, status: 'offline' });
        } catch (err) {
          console.error("❌ Error saving offline message:", err);
        }
      }
    });

    // 🔹 Disconnect
    socket.on('disconnect', () => {
      for (const [email, id] of onlineUsers.entries()) {
        if (id === socket.id) {
          onlineUsers.delete(email);
          console.log(`🗑️ Removed user ${email} from online users on disconnect`);
          break;
        }
      }
    });
  });

  return io;
}
