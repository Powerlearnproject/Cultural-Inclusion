import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log('⚠️  No MongoDB URI found. Running in demo mode without database.');
      return;
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.log('⚠️  MongoDB connection failed. Running in demo mode without database.');
    console.log('💡 For full functionality, set up MongoDB Atlas or install MongoDB locally');
  }
};
