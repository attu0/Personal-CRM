const mongoose = require('mongoose');

const connectDB = async () => {
  // Check if the MONGO_URI is loaded correctly from the .env file
  if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in .env file.');
    process.exit(1);
  }

  console.log('Attempting to connect to MongoDB...');
  
  try {
    // Attempt to connect to the MongoDB cluster
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the specific error to help with debugging
    console.error('MongoDB connection FAILED.');
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;