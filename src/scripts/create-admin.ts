import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function createAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    // Check if admin already exists
    console.log('Checking if admin user exists...');
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = new User({
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      name: 'Admin User',
    });

    await adminUser.save();
    console.log('Admin user created successfully with:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createAdminUser(); 