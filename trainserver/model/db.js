import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URIUser);

    const trainConnection = mongoose.createConnection(process.env.URITrain);

    // ❗ Wait for the train DB to connect before returning it
    await new Promise((resolve, reject) => {
      trainConnection.on('connected', () => {
        resolve();
      });
      trainConnection.on('error', (err) => {
        console.error('❌ Train DB connection error:', err);
        reject(err);
      });
    });

    return { trainConnection };
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB;
