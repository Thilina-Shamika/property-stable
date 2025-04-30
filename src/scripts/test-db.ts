import { connectToDatabase } from '../lib/mongodb';

async function testConnection() {
  try {
    console.log('Testing MongoDB Atlas connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI?.replace(
      /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
      'mongodb+srv://[username]:[password]@'
    ));
    
    const { db } = await connectToDatabase();
    
    // Test the connection
    const collections = await db.listCollections().toArray();
    console.log('\nAvailable collections:', collections.map(c => c.name));
    
    // Check users collection
    const users = await db.collection('users').find().toArray();
    console.log('\nUsers in database:', users.length);
    if (users.length > 0) {
      console.log('User emails:', users.map(user => user.email));
    } else {
      console.log('No users found in the database. Will attempt to create admin user...');
      
      // Import and run create-admin script
      const { createAdminUser } = await import('./create-admin');
      await createAdminUser();
    }
    
    console.log('\nConnection test completed successfully');
  } catch (error) {
    console.error('\nDatabase connection error:', error);
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND')) {
        console.error('Could not reach MongoDB Atlas. Please check your internet connection.');
      } else if (error.message.includes('Authentication failed')) {
        console.error('Authentication failed. Please check your MongoDB Atlas username and password.');
      } else if (error.message.includes('Invalid connection string')) {
        console.error('Invalid MongoDB connection string. Please check your MONGODB_URI format.');
      }
    }
  }
}

testConnection(); 