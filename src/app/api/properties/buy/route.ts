import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BuyProperty } from '@/models/BuyProperty';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import { join } from 'path';

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

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'property');
    await mkdir(uploadsDir, { recursive: true });
    console.log('Created uploads directory');

    // Process images
    const imageFiles = formData.getAll('images[]') as File[];
    console.log('Received images:', imageFiles.length);
    
    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      );
    }

    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        if (!(file instanceof File)) {
          throw new Error('Invalid file type');
        }
        
        try {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filename = `${Date.now()}-${file.name}`;
          const filepath = join(uploadsDir, filename);
          await writeFile(filepath, buffer);
          return `/uploads/property/${filename}`;
        } catch (error) {
          console.error('Error processing image:', error);
          throw new Error(`Failed to process image: ${file.name}`);
        }
      })
    ).catch(error => {
      console.error('Error processing images:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to process images' },
        { status: 500 }
      );
    });

    if (imageUrls instanceof NextResponse) {
      return imageUrls;
    }

    // Process QR code
    let qrCodePath = '';
    const qrCode = formData.get('qrCode');
    if (qrCode instanceof File) {
      const buffer = Buffer.from(await qrCode.arrayBuffer());
      const filename = `${Date.now()}-${qrCode.name}`;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      qrCodePath = `/uploads/property/${filename}`;
    }
    console.log('Processed QR code');

    // Prepare property data
    const propertyData = {
      propertyType: formData.get('propertyType'),
      price: formData.get('price'),
      name: formData.get('name'),
      location: formData.get('location'),
      beds: formData.get('beds'),
      baths: formData.get('baths'),
      sqft: formData.get('sqft'),
      description: formData.get('description'),
      indoorAmenities: JSON.parse(formData.get('indoorAmenities') as string),
      outdoorAmenities: JSON.parse(formData.get('outdoorAmenities') as string),
      furnishing: formData.get('furnishing'),
      reference: formData.get('reference'),
      zoneName: formData.get('zoneName'),
      dldPermitNumber: formData.get('dldPermitNumber'),
      images: imageUrls,
      qrCode: qrCodePath,
      status: 'draft'
    } as const;

    // Validate required fields
    const requiredFields = ['propertyType', 'price', 'name', 'location', 'beds', 'baths', 'sqft'] as const;
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save to database
    const property = new BuyProperty(propertyData);
    await property.save();
    console.log('Saved property to database');

    return NextResponse.json({ success: true, property });
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