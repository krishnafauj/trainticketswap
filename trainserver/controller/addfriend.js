import Friendship from '../model/friendshipSchema.js';
import mongoose from 'mongoose';

const addFriend = async (req, res) => {
  try {
    const user1 = req.user.id;  // ✅ Use consistent field: id from JWT
    const user2 = req.body.userId;


    if (user1 === user2) {
      return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }

    const u1Obj = new mongoose.Types.ObjectId(user1);
    const u2Obj = new mongoose.Types.ObjectId(user2);

    const [u1, u2] = u1Obj < u2Obj ? [u1Obj, u2Obj] : [u2Obj, u1Obj];
    console.log( u1.toString(), u2.toString());

    const existing = await Friendship.findOne({ user1: u1, user2: u2 });

    if (existing) {
     
      return res.status(200).json({ message: 'Already friends' });
    }

    await Friendship.create({ user1: u1, user2: u2, status: 'accepted' });

    return res.status(201).json({ message: 'Friend added' });

  } catch (err) {
  
    return res.status(500).json({
      message: 'Error adding friend',
      error: err.message,
    });
  }
};

export default addFriend;
