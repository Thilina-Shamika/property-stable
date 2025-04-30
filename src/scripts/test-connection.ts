import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  console.log('Testing connection...');
  console.log('MongoDB URI:', uri?.replace(
    /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
    'mongodb+srv://[username]:[password]@'
  ));

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db();
    await db.command({ ping: 1 });
    
    console.log('Successfully connected to MongoDB!');
    
    const collections = await db.listCollections().toArray();
    console.log('\nAvailable collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('\nConnection closed successfully');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

testConnection(); 