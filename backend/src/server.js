const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { connectDB } = require('./config/db');
const User = require('./models/User');
const seedDatabase = require('./utils/seedData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is currently empty (e.g. initial run or in-memory)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is currently empty. Auto-seeding initial development data...');
      await seedDatabase();
    }

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 HireFlow Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 API listening at: http://localhost:${PORT}`);
      console.log(`🩺 Health check at:  http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
