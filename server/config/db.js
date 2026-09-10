import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/WEBCRAFT');
    console.log(`[MongoDB] Connected successfully to WEBCRAFT Database: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Error connecting to database: ${error.message}`);
    // Do not crash server process if MongoDB service is initially offline, but log warning
    return null;
  }
};
