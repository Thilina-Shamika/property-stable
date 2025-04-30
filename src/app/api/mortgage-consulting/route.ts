import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MortgageConsulting from '@/models/MortgageConsulting';

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    const mortgageConsulting = new MortgageConsulting(data);
    await mortgageConsulting.save();
    
    return NextResponse.json({ success: true, data: mortgageConsulting });
  } catch (error) {
    console.error('Error saving mortgage consulting request:', error);
    return NextResponse.json(
      { error: 'Failed to save mortgage consulting request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const submissions = await MortgageConsulting.find().sort({ createdAt: -1 });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching mortgage consulting submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mortgage consulting submissions' },
      { status: 500 }
    );
  }
} 