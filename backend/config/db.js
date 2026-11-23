const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout if Mongo isn't running
    });
    isMongoConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`[DB Notice] MongoDB connection not established (${error.message}).`);
    console.log(`[DB Notice] Switched to Built-in High-Performance Local JSON Database Engine.`);
    console.log(`[DB Notice] (All CRUD, Auth, and Analytics fully function out-of-the-box!)`);
    return false;
  }
};

const getDBStatus = () => ({
  isMongoConnected,
  type: isMongoConnected ? 'MongoDB (Mongoose)' : 'Embedded Local JSON Database',
});

module.exports = { connectDB, getDBStatus };
