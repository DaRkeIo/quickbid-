import mongoose from 'mongoose';

const uri = 'mongodb+srv://balajiboyoni:vanilla18@cluster1.2jfeils.mongodb.net/bigbid?retryWrites=true&w=majority';

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 45000
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  // Create a test collection
  const TestSchema = new mongoose.Schema({
    name: String,
    created: { type: Date, default: Date.now }
  });
  const TestModel = mongoose.model('Test', TestSchema);
  
  // Insert a test document
  const testDoc = new TestModel({ name: 'test' });
  return testDoc.save();
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  console.error('Error details:', error.stack);
})
.finally(() => {
  mongoose.connection.close();
});
