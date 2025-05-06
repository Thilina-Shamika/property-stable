import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Valuation } from '@/models/Valuation';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const valuation = await Valuation.findByIdAndDelete(params.id);
    
    if (!valuation) {
      return NextResponse.json(
        { error: 'Valuation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/valuations/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete valuation' },
      { status: 500 }
    );
  }
} 