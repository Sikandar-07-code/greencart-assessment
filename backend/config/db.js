import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'greencart' });
    console.log('📦 Connected to MongoDB');
  } catch (err) {
    console.error('Mongo error:', err.message);
    process.exit(1);
  }
};
