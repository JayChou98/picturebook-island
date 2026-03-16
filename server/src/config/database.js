import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI environment variable is not defined');
      console.error('Please set MONGODB_URI in your environment variables');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.error('💡 Possible causes:');
      console.error('   - MONGODB_URI contains placeholder values (e.g., cluster0.xxxxx)');
      console.error('   - MongoDB Atlas cluster hostname is incorrect');
      console.error('   - Network connectivity issues');
      console.error('');
      console.error('💡 Solution:');
      console.error('   1. Get the correct connection string from MongoDB Atlas');
      console.error('   2. Update MONGODB_URI environment variable in Render');
      console.error('   3. Ensure Network Access allows all IPs (0.0.0.0/0)');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Possible causes:');
      console.error('   - Username or password is incorrect');
      console.error('   - User does not have access to this database');
      console.error('');
      console.error('💡 Solution:');
      console.error('   1. Verify username and password in connection string');
      console.error('   2. Check Database Access in MongoDB Atlas');
    } else {
      console.error('💡 Full error details:', error);
    }
    
    // Don't exit in production to allow Render to retry
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;