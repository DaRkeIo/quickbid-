import mongoose from 'mongoose';

async function testMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 45000
    });
    console.log('Successfully connected to MongoDB!');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

testMongoConnection();
