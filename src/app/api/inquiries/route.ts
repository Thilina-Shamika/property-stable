import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import PropertyInquiry from '@/models/PropertyInquiry';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    const inquiry = new PropertyInquiry(data);
    await inquiry.save();
    
    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error saving property inquiry:', error);
    return NextResponse.json(
      { error: 'Failed to save property inquiry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const inquiries = await PropertyInquiry.find()
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error('Error fetching property inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property inquiries' },
      { status: 500 }
    );
  }
} 