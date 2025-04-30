import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BuyProperty } from '@/models/BuyProperty';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

type PropertyData = {
  propertyType: string;
  price: string;
  name: string;
  location: string;
  beds: string;
  baths: string;
  sqft: string;
  description: string;
  indoorAmenities: string[];
  outdoorAmenities: string[];
  furnishing: string;
  reference: string;
  zoneName: string;
  dldPermitNumber: string;
  images: string[];
  qrCode: string;
  status: 'draft' | 'published';
};

export async function POST(request: Request) {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database successfully');

    const formData = await request.formData();
    console.log('Received form data');
    
    // Handle file uploads
    const images: string[] = [];
    let qrCode = '';

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads/property');
    await mkdir(uploadDir, { recursive: true });
    console.log('Created upload directory');

    // Process images
    for (let i = 0; formData.get(`images[${i}]`); i++) {
      const file = formData.get(`images[${i}]`) as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        images.push(`/uploads/property/${filename}`);
        console.log('Processed image:', filename);
      }
    }

    // Process QR code
    const qrFile = formData.get('qrCode') as File;
    if (qrFile) {
      const bytes = await qrFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${qrFile.name}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      qrCode = `/uploads/property/${filename}`;
      console.log('Processed QR code:', filename);
    }

    // Prepare property data
    const propertyData: PropertyData = {
      propertyType: formData.get('propertyType') as string,
      price: formData.get('price') as string,
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      beds: formData.get('beds') as string,
      baths: formData.get('baths') as string,
      sqft: formData.get('sqft') as string,
      description: formData.get('description') as string,
      indoorAmenities: JSON.parse(formData.get('indoorAmenities') as string || '[]'),
      outdoorAmenities: JSON.parse(formData.get('outdoorAmenities') as string || '[]'),
      furnishing: formData.get('furnishing') as string,
      reference: formData.get('reference') as string,
      zoneName: formData.get('zoneName') as string,
      dldPermitNumber: formData.get('dldPermitNumber') as string,
      images,
      qrCode,
      status: 'draft'
    };

    console.log('Prepared property data:', propertyData);

    // Validate required fields
    const requiredFields = [
      'propertyType', 'price', 'name', 'location', 'beds', 
      'baths', 'sqft', 'description', 'furnishing', 'reference',
      'zoneName', 'dldPermitNumber'
    ] as const;
    
    const missingFields = requiredFields.filter(field => !propertyData[field as keyof PropertyData]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create new property
    const property = new BuyProperty(propertyData);

    // Save the property
    const savedProperty = await property.save();
    console.log('Property saved successfully:', savedProperty);

    return NextResponse.json(savedProperty, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/properties/buy:', error);
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

    const query = showAll ? {} : { status: 'published' };
    const properties = await BuyProperty.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching buy properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buy properties' },
      { status: 500 }
    );
  }
} 