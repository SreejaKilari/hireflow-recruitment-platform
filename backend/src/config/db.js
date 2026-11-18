require('dotenv').config();
const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  // Support both MONGODB_URI and MONGO_URI
  const mongoURI =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/hireflow';

  const isLocalHost = mongoURI.includes('127.0.0.1') || mongoURI.includes('localhost');

  try {
    const maskedURI = mongoURI.replace(/:([^:@]+)@/, ':****@');
    console.log(`[Database] Connecting to MongoDB: ${maskedURI}`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('[Database] MongoDB Connected successfully.');
  } catch (err) {
    console.warn(`[Database] Connection to primary URI failed: ${err.message}`);

    // If local MongoDB is down or memory DB is requested, fallback gracefully to in-memory server
    if (isLocalHost || process.env.USE_MEMORY_DB === 'true') {
      try {
        console.log('[Database] Starting In-Memory MongoDB Server fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const memURI = mongod.getUri();
        await mongoose.connect(memURI);
        console.log(`[Database] In-Memory MongoDB connected at: ${memURI}`);
        return;
      } catch (memErr) {
        console.error('[Database] In-Memory Mongo fallback failed:', memErr.message);
      }
    }

    console.error('[Database] Fatal MongoDB Connection Error:', err.message);
    throw err;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, disconnectDB };
