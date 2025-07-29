import mongoose from 'mongoose';

const friendshipSchema = new mongoose.Schema({
  user1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'accepted'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Always store lower user ID as user1 to avoid duplicate reversed entries
friendshipSchema.pre('save', function (next) {
  if (this.user1.toString() > this.user2.toString()) {
    [this.user1, this.user2] = [this.user2, this.user1];
  }
  next();
});

friendshipSchema.index({ user1: 1, user2: 1 }, { unique: true });

export default mongoose.model('Friendship', friendshipSchema);
