import Friendship from "../model/friendshipSchema.js";
import mongoose from "mongoose";

export const findFriendship = async (req, res) => {

  const userA = req.body.userId;
  
  const userB = req.user.id;
 
  if (!userA || !userB) {
    console.error("❌ Missing user IDs in request");
    return res.status(400).json({ error: 'Both user IDs are required' });
  }

  try {
    const objectIdA = new mongoose.Types.ObjectId(userA);
    const objectIdB = new mongoose.Types.ObjectId(userB);


    const friendship = await Friendship.findOne({
      $or: [
        { user1: objectIdA, user2: objectIdB },
        { user1: objectIdB, user2: objectIdA }
      ]
    });

  

    if (!friendship) {
    
      return res.status(404).json({ message: 'No friendship found' });
    }

 

    res.status(200).json(friendship);
  } catch (error) {
    
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};
