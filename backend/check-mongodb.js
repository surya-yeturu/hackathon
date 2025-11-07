import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function checkConnection() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pulsevo';
  
  console.log('Testing MongoDB connection...');
  console.log('Connection string:', mongoURI.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connection successful!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\nCommon issues:');
    console.error('1. Wrong connection string format');
    console.error('2. Incorrect username/password');
    console.error('3. IP not whitelisted (for Atlas)');
    console.error('4. MongoDB service not running (for local)');
    process.exit(1);
  }
}

checkConnection();

