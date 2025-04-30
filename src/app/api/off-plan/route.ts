import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { OffPlanProperty } from '@/models/OffPlanProperty';

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB();

    // Parse the request body
    const data = await request.json();
    
    // Log the received data
    console.log('Received data:', data);

    // Prepare the property data
    const propertyData = {
      title: data.title || '',
      propertyType: data.propertyType || 'Apartment',
      price: data.price || '',
      priceRange: {
        min: 0,
        max: 0
      },
      paymentPlan: {
        downPayment: 0,
        installment1: data.paymentPlan?.installment1 || '',
        installment2: data.paymentPlan?.installment2 || ''
      },
      completionDate: '',
      handoverDate: data.handoverDate || '',
      description: data.description || '',
      developer: data.developer?.name || '',
      location: data.location || '',
      projectNumber: data.projectNumber || '',
      dldPermitNumber: data.dldPermitNumber || '',
      mainImage: data.images?.[0] || '',
      qrCode: data.qrCode || '',
      images: data.images || [],
      status: 'draft'
    };

    console.log('Prepared property data:', propertyData);

    // Create new property
    const property = new OffPlanProperty(propertyData);

    // Save the property
    const savedProperty = await property.save();
    console.log('Property saved successfully:', savedProperty);

    return NextResponse.json(savedProperty, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/off-plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create property' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';

    // If showAll is true, return all properties, otherwise only published ones
    const query = showAll ? {} : { status: 'published' };
    
    console.log('Fetching properties with query:', query);
    const properties = await OffPlanProperty.find(query).sort({ createdAt: -1 });
    console.log('Fetched properties:', properties.length);
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error in GET /api/off-plan:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch properties' },
      { status: 500 }
    );
  }
} 