// models/userSwapHistory.js
import mongoose from 'mongoose';

const userSwapHistorySchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    swap_requests: [
      {
        swap_request_id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        train_no: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        created_at: {
          type: Date,
          default: Date.now,
        },
      }
    ]
  });
  
  export default mongoose.model('userswaphistories', userSwapHistorySchema);
  