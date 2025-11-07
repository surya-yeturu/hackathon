import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsevo';
    
    // Validate connection string format
    if (mongoURI.includes('cluster.mongodb.net') && !mongoURI.includes('@')) {
      console.error('❌ Invalid MongoDB Atlas connection string!');
      console.error('   Make sure it includes username and password:');
      console.error('   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pulsevo');
      throw new Error('Invalid MongoDB connection string format');
    }
    
    // Removed deprecated options (useNewUrlParser, useUnifiedTopology)
    // These are no longer needed in mongoose 6+
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n📝 To fix this:');
    console.error('   1. Check your MONGODB_URI in backend/.env');
    console.error('   2. For MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/pulsevo');
    console.error('   3. For local MongoDB: mongodb://localhost:27017/pulsevo');
    console.error('   4. See backend/FIX_MONGODB_CONNECTION.md for detailed help\n');
    throw error;
  }
};

// If MongoDB is not available, we can use in-memory storage
export const useInMemoryStorage = process.env.MONGODB_URI === undefined || process.env.MONGODB_URI === '';

