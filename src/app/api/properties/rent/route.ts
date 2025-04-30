import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { RentProperty } from '@/models/RentProperty';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';
    
    const properties = await RentProperty.find()
      .sort({ createdAt: -1 })
      .limit(showAll ? 0 : 10);
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching rent properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rent properties' },
      { status: 500 }
    );
  }
} 