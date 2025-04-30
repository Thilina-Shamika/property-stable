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

    // Validate required fields
    const requiredFields = ['title', 'propertyType', 'beds', 'price', 'description', 'handoverDate', 'developer', 'location', 'projectNumber'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Prepare the property data
    const propertyData = {
      title: data.title || '',
      propertyType: data.propertyType || 'Apartment',
      beds: data.beds || '',
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
    await connectDB();
    console.log('Connected to database successfully');

    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';
    console.log('Fetching properties with showAll:', showAll);

    const query = showAll ? {} : { status: 'published' };
    const properties = await OffPlanProperty.find(query)
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Number of properties found:', properties.length);
    console.log('First property sample:', properties[0] ? {
      title: properties[0].title,
      status: properties[0].status,
      mainImage: properties[0].mainImage
    } : 'No properties found');

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching off-plan properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch off-plan properties' },
      { status: 500 }
    );
  }
} 