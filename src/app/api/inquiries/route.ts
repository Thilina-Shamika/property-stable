import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectToDatabase();

    const inquiry = await Inquiry.create({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Inquiry submitted successfully', inquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting inquiry:', error);
    return NextResponse.json(
      { message: 'Failed to submit inquiry', error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    return NextResponse.json(inquiries);
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { message: 'Failed to fetch inquiries', error: error.message },
      { status: 500 }
    );
  }
} 