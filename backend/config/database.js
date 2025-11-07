import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsevo';
    
    // Removed deprecated options (useNewUrlParser, useUnifiedTopology)
    // These are no longer needed in mongoose 6+
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// If MongoDB is not available, we can use in-memory storage
export const useInMemoryStorage = process.env.MONGODB_URI === undefined || process.env.MONGODB_URI === '';

