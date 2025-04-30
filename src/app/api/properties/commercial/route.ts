import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CommercialProperty } from '@/models/CommercialProperty';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database successfully');

    const formData = await request.formData();
    console.log('Received form data:', Object.fromEntries(formData.entries()));

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'property');
    await mkdir(uploadsDir, { recursive: true });
    console.log('Created uploads directory');

    // Process images
    const imagePaths = [];
    for (let i = 0; formData.get(`images[${i}]`); i++) {
      const imageUrl = formData.get(`images[${i}]`) as string;
      if (imageUrl) {
        imagePaths.push(imageUrl);
      }
    }
    console.log('Processed images:', imagePaths);

    // Process QR code
    const qrCodeUrl = formData.get('qrCode') as string;
    console.log('QR code URL:', qrCodeUrl);

    // Prepare property data
    const propertyData = {
      propertyType: formData.get('propertyType'),
      price: formData.get('price'),
      sqft: formData.get('sqft'),
      name: formData.get('name'),
      location: formData.get('location'),
      description: formData.get('description'),
      reference: formData.get('reference') || '',
      zoneName: formData.get('zoneName') || '',
      dldPermitNumber: formData.get('dldPermitNumber') || '',
      images: imagePaths,
      qrCodeImage: qrCodeUrl || '',
      createdAt: new Date()
    };

    console.log('Property data to be saved:', propertyData);

    // Validate required fields
    const requiredFields = ['propertyType', 'price', 'sqft', 'name', 'location', 'description'];
    for (const field of requiredFields) {
      if (!propertyData[field as keyof typeof propertyData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create and save property
    const property = await CommercialProperty.create(propertyData);
    console.log('Property created successfully:', property);
    
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating commercial property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create commercial property' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';
    
    const properties = await CommercialProperty.find()
      .sort({ createdAt: -1 })
      .limit(showAll ? 0 : 10);
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching commercial properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commercial properties' },
      { status: 500 }
    );
  }
} 