import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || '', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('Successfully connected to MongoDB!');
    
    // Create a test database
    const db = mongoose.connection;
    console.log('Database name:', db.name);
    
    // List all collections
    const collections = await db.listCollections();
    console.log('Collections:', collections);
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

testConnection();
