import express from 'express';
import MessageThread from '../model/messageschema.js';
const router = express.Router();

// Get chat history for a given friendshipId
const message_get= async (req, res) => {
  try {
    const { friendshipId } = req.params;
    
    const thread = await MessageThread.findOne({ friendshipId }).populate('messages.senderId', 'username email');

    if (!thread) {
        
      return res.status(404).json({ message: 'No messages found for this friendship.' });
    }

    res.status(200).json({ messages: thread.messages });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default message_get;
