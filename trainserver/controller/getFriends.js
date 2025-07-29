import Friendship from '../model/friendshipSchema.js';
import User from '../model/user.js';
import mongoose from 'mongoose';
export const getFriends = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.user_id;

    console.log("🔍 Using userId:", userId, typeof userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("❌ Invalid ObjectId received:", userId);
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("🔍 Fetching friends for user:", userObjectId);

    const friendships = await Friendship.find({
      $or: [{ user1: userObjectId }, { user2: userObjectId }],
      status: 'accepted'
    });

    console.log("🔗 Friendships found:");
    friendships.forEach((f, i) => {
      console.log(`  ${i + 1}. [${f.user1}] ⇄ [${f.user2}]`);
    });

    const friendIds = friendships.map(f =>
      f.user1.equals(userObjectId) ? f.user2 : f.user1
    );

    console.log("📦 Extracted friend ObjectIds:", friendIds);

    const friends = await User.find({ _id: { $in: friendIds } }).select('_id name email');

    console.log("✅ Final friends fetched:");
    friends.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.name} (${f.email})`);
    });

    return res.status(200).json({ friends });
  } catch (err) {
    console.error("❌ Error fetching friends:", err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
