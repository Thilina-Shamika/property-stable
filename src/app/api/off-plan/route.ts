import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { OffPlanProperty } from '@/models/OffPlanProperty';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'property');
    await mkdir(uploadsDir, { recursive: true });

    // Process images
    const imageFiles = formData.getAll('images[]') as File[];
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
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(uploadsDir, filename);
        await writeFile(filepath, buffer);
        return `/uploads/property/${filename}`;
      })
    );

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

    // Prepare property data
    const propertyData: Record<string, any> = {
      title: formData.get('title') || '',
      propertyType: formData.get('propertyType') || 'Apartment',
      beds: formData.get('beds') || '',
      price: formData.get('price') || '',
      priceRange: { min: 0, max: 0 },
      paymentPlan: {
        downPayment: 0,
        installment1: formData.get('installment1') || '',
        installment2: formData.get('installment2') || ''
      },
      completionDate: formData.get('completionDate') || '',
      handoverDate: formData.get('handoverDate') || '',
      description: formData.get('description') || '',
      developer: formData.get('developer') || '',
      location: formData.get('location') || '',
      projectNumber: formData.get('projectNumber') || '',
      dldPermitNumber: formData.get('dldPermitNumber') || '',
      mainImage: imageUrls[0] || '',
      qrCode: qrCodePath,
      images: imageUrls,
      status: 'draft',
    };

    // Validate required fields
    const requiredFields = ['title', 'propertyType', 'beds', 'price', 'description', 'handoverDate', 'developer', 'location', 'projectNumber'];
    const missingFields = requiredFields.filter(field => !propertyData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Create and save property
    const property = new OffPlanProperty(propertyData);
    const savedProperty = await property.save();
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
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';
    const query = showAll ? {} : { status: 'published' };
    const properties = await OffPlanProperty.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching off-plan properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch off-plan properties' },
      { status: 500 }
    );
  }
} 