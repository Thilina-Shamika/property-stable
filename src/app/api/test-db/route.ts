import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await connectDB();
    console.log('Database connection successful');
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to connect to database'
      },
      { status: 500 }
    );
  }
} 