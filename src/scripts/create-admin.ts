import { hash } from 'bcrypt';
import { connectToDatabase } from '../lib/mongodb';

export async function createAdminUser() {
  try {
    const { db } = await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ email: 'admin@realestate.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await hash('Admin@123', 12);
    
    await db.collection('users').insertOne({
      email: 'admin@realestate.com',
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      createdAt: new Date(),
    });

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error; // Re-throw to handle in the calling function
  }
}

// Run directly if this is the main script
if (require.main === module) {
  createAdminUser()
    .catch(error => {
      console.error('Failed to create admin user:', error);
      process.exit(1);
    });
} 