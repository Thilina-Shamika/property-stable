import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PropertyInquiry from '@/models/PropertyInquiry';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Log the incoming data for debugging
    console.log('Received inquiry data:', data);

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.propertyId || !data.propertyType) {
      console.error('Missing required fields:', data);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create and save the inquiry
    const inquiry = new PropertyInquiry(data);
    await inquiry.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log the full error for debugging
    console.error('Error in POST /api/property-inquiries:', error);
    
    // Check if it's a validation error
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }

    // Check if it's a duplicate key error
    if (error instanceof Error && error.name === 'MongoServerError' && (error as any).code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate entry' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit property inquiry: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const inquiries = await PropertyInquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error in GET /api/property-inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property inquiries' },
      { status: 500 }
    );
  }
} 