import mongoose from 'mongoose';

const swapGroupSchema = new mongoose.Schema({
  uvid: {
    type: String,
    required: true,
    unique: true
  },
  train_no: {
    type: String,
    required: true
  },
  request_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  ]
}, { timestamps: true });

export default mongoose.model('SwapGroup', swapGroupSchema);
