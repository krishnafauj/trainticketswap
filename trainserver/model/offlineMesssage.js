import mongoose from 'mongoose';

const offlineMessageSchema = new mongoose.Schema({
  friendshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Friendship', required: true },
  fromEmail: { type: String, required: true },
  toEmail: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('OfflineMessage', offlineMessageSchema);
