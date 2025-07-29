import Friendship from "../model/friendshipSchema.js";
import mongoose from "mongoose";

export const findFriendship = async (req, res) => {
  try {
    const user1 = req.user.id;               // 🔑 Authenticated user's Mongo _id
    const user2 = req.body.userId;           // 👤 ID of the other user from frontend (card)

    console.log("🟢 Finding friendship between:");
    console.log("🔐 user1 (from token):", user1);
    console.log("👤 user2 (from card):", user2);

    if (user1 === user2) {
      console.warn("⚠️ Cannot find friendship with self");
      return res.status(400).json({ message: "Cannot find friendship with yourself." });
    }

    const u1Obj = new mongoose.Types.ObjectId(user1);
    const u2Obj = new mongoose.Types.ObjectId(user2);

    // Store in sorted order (smallest first)
    const [u1, u2] = u1Obj < u2Obj ? [u1Obj, u2Obj] : [u2Obj, u1Obj];
    console.log("📦 Ordered ObjectIds to query:", u1.toString(), u2.toString());

    const friendship = await Friendship.findOne({ user1: u1, user2: u2 });

    if (!friendship) {
      console.log("❌ Friendship not found in DB");
      return res.status(404).json({ message: "Friendship not found" });
    }

    console.log("✅ Friendship found:", friendship._id.toString());
    return res.status(200).json({ friendshipId: friendship._id });

  } catch (err) {
    console.error("❌ Error in findFriendship:", err);
    return res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};
