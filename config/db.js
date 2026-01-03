
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/login-system');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Some error occurred:', error);
    
  }
};

module.exports = connectDB;

