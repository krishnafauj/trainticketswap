import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const chatRoomSchema = new mongoose.Schema({
  user_1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user_2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  train_no: String,
  date: String,
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ChatRoom', chatRoomSchema);
