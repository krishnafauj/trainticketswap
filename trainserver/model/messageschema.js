import mongoose from 'mongoose';

// Single message entry (no _id for each message)
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const messageThreadSchema = new mongoose.Schema({
  friendshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Friendship',
    required: true,
    unique: true
  },
  messages: [messageSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MessageThread', messageThreadSchema);
