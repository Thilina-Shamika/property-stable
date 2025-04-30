import connectDB from '../lib/db';
import { Connection } from 'mongoose';

async function testConnection() {
  try {
    const connection = await connectDB();
    
    if (!connection.db) {
      throw new Error('Database not initialized');
    }
    
    // List all collections
    const collections = await connection.db.listCollections().toArray();
    console.log('\nAvailable collections:', collections.map(c => c.name));
    
    // Close the connection
    await connection.close();
    console.log('\nConnection closed successfully');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testConnection().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 