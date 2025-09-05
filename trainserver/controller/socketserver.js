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
    console.log(`🔌 New client connected: ${socket.id}`);

    // 🔹 Register user
    socket.on('register', async (email) => {
      if (!email) return;
      onlineUsers.set(email, socket.id);
      console.log(`✅ Registered user: ${email} with socket ID: ${socket.id}`);
      socket.emit('registered', { email, socketId: socket.id });

      // 🔹 Deliver offline messages
      try {
        const offlineMessages = await OfflineMessage.find({ toEmail: email });
        console.log(`📨 Found ${offlineMessages.length} offline messages for ${email}`);

        offlineMessages.forEach(msg => {
          console.log(`➡️ Delivering offline message from ${msg.fromEmail} to ${email}`);
          socket.emit('receive-message', {
            fromEmail: msg.fromEmail,
            toEmail: msg.toEmail,
            message: msg.message,
            friendshipId: msg.friendshipId
          });
        });

        // Remove delivered offline messages
        await OfflineMessage.deleteMany({ toEmail: email });
        console.log(`🗑️ Cleared offline messages for ${email}`);
      } catch (err) {
        console.error("❌ Error delivering offline messages:", err);
      }
    });

    // 🔹 Send message
    socket.on('send-message', async ({ toEmail, fromEmail, message, friendshipId }) => {
      if (!toEmail || !fromEmail || !message || !friendshipId) return;
      console.log(`✉️ Sending message from ${fromEmail} to ${toEmail}: "${message}"`);

      const targetSocketId = onlineUsers.get(toEmail);

      if (targetSocketId) {
        console.log(`💬 User ${toEmail} is online. Sending message instantly.`);
        io.to(targetSocketId).emit('receive-message', {
          fromEmail,
          toEmail,
          message,
          friendshipId
        });

        socket.emit('message-sent', { toEmail, fromEmail, message, friendshipId, status: 'delivered' });
      } else {
        console.log(`📥 User ${toEmail} is offline. Saving message.`);
        try {
          await OfflineMessage.create({ friendshipId, fromEmail, toEmail, message });
          socket.emit('message-sent', { toEmail, fromEmail, message, friendshipId, status: 'offline' });
          console.log(`✅ Offline message saved for ${toEmail}`);
        } catch (err) {
          console.error("❌ Error saving offline message:", err);
        }
      }
    });

    // 🔹 Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
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
