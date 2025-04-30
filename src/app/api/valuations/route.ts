import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Valuation } from '@/models/Valuation';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const valuation = new Valuation(data);
    await valuation.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/valuations:', error);
    return NextResponse.json(
      { error: 'Failed to submit valuation request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const valuations = await Valuation.find().sort({ createdAt: -1 });
    return NextResponse.json(valuations);
  } catch (error) {
    console.error('Error in GET /api/valuations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch valuations' },
      { status: 500 }
    );
  }
} 