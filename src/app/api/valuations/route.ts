import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Valuation } from '@/models/Valuation';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connection successful');
    
    console.log('Fetching valuations...');
    const valuations = await Valuation.find().sort({ createdAt: -1 });
    console.log(`Found ${valuations.length} valuations`);
    
    // Convert MongoDB documents to plain objects
    const plainValuations = valuations.map(v => ({
      _id: v._id.toString(),
      name: v.name,
      email: v.email,
      mobile: v.mobile,
      listingType: v.listingType,
      propertyAddress: v.propertyAddress,
      createdAt: v.createdAt.toISOString()
    }));
    
    return NextResponse.json(plainValuations);
  } catch (error) {
    console.error('Error in GET /api/valuations:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to fetch valuations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connection successful');
    
    const data = await request.json();
    console.log('Received data:', data);
    
    const valuation = new Valuation(data);
    await valuation.save();
    console.log('Saved valuation successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/valuations:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to submit valuation request' },
      { status: 500 }
    );
  }
} 