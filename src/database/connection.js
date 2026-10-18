
const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }

  await mongoose.connect(uri, {
    dbName: 'comp3123_assignment1',
    serverSelectionTimeoutMS: 10000
  });

  return mongoose.connection;
}

module.exports = connectDatabase;
