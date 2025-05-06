import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PropertyInquiry from '@/models/PropertyInquiry';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const inquiry = new PropertyInquiry(data);
    await inquiry.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/property-inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to submit property inquiry' },
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