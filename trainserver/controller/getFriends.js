import Friendship from '../model/friendshipSchema.js';
import User from '../model/user.js';
import mongoose from 'mongoose';

export const getFriends = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find all accepted friendships
    const friendships = await Friendship.find({
      $or: [{ user1: userObjectId }, { user2: userObjectId }],
      status: 'accepted'
    });

    // Map friend user IDs and keep track of friendshipId
    const friendMappings = friendships.map(f => {
      const friendId = f.user1.equals(userObjectId) ? f.user2 : f.user1;
      return { friendId, friendshipId: f._id };
    });

    const friendIds = friendMappings.map(f => f.friendId);

    // Fetch friend details
    const friends = await User.find({ _id: { $in: friendIds } }).select('_id name email');

    // Attach friendshipId to friend data
    const friendsWithFriendshipId = friends.map(friend => {
      const mapping = friendMappings.find(m => m.friendId.equals(friend._id));
      return {
        ...friend.toObject(),
        friendshipId: mapping ? mapping.friendshipId : null
      };
    });

    return res.status(200).json({ friends: friendsWithFriendshipId });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
