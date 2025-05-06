import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful' 
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('MongoDB connection test failed:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 