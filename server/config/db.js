const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Simpler connection without SSL options
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;