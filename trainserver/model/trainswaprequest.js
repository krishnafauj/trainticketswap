import mongoose from 'mongoose';

const trainSwapRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  train_no: {
    type: String,
    required: true
  },
  pnr: String,
  name: String,
  age: String,
  from: String,
  to: String,
  date: String,
  reason: String,
  to_statin: String,
  from_station: String,
  seat: String,
  berth: String,
  berth_pref: String,
  deletion_at: Date, // ✅ required for TTL to work
}, { timestamps: true });

// ✅ TTL index
trainSwapRequestSchema.index({ deletion_at: 1 }, { expireAfterSeconds: 0 });

export default function getSwapModelByTrainNo(trainno) {
  
  const bucket = String(trainno)[0]; // '1', '2', '3', ...
  const collectionName = `train_swap_requests_${bucket}`;

  if (mongoose.models[collectionName]) {
    return mongoose.model(collectionName);
  }

  return mongoose.model(collectionName, trainSwapRequestSchema, collectionName);
}
