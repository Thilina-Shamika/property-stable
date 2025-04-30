import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BuyProperty } from '@/models/BuyProperty';
import { writeFile } from 'fs/promises';
import path from 'path';
import { mkdir } from 'fs/promises';
import fs from 'fs/promises';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const property = await BuyProperty.findById(params.id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const existingImages = JSON.parse(formData.get('existingImages') as string || '[]');
    const existingQrCode = formData.get('existingQrCode') as string;
    
    // Handle file uploads
    const images: string[] = [...existingImages];
    let qrCode = existingQrCode;

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads/property');
    await mkdir(uploadDir, { recursive: true });

    // Process new images
    for (let i = 0; formData.get(`images[${i}]`); i++) {
      const file = formData.get(`images[${i}]`) as File;
      if (file) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        images.push(`/uploads/property/${filename}`);
      }
    }

    // Process new QR code
    const qrFile = formData.get('qrCode') as File;
    if (qrFile) {
      const bytes = await qrFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${qrFile.name}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      qrCode = `/uploads/property/${filename}`;
    }

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
      indoorAmenities: JSON.parse(formData.get('indoorAmenities') as string || '[]'),
      outdoorAmenities: JSON.parse(formData.get('outdoorAmenities') as string || '[]'),
      furnishing: formData.get('furnishing'),
      reference: formData.get('reference'),
      zoneName: formData.get('zoneName'),
      dldPermitNumber: formData.get('dldPermitNumber'),
      images,
      qrCode
    };

    // Update property
    const updatedProperty = await BuyProperty.findByIdAndUpdate(
      params.id,
      propertyData,
      { new: true }
    );

    if (!updatedProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const property = await BuyProperty.findById(params.id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Delete associated images
    if (property.images) {
      for (const imagePath of property.images) {
        try {
          const fullPath = path.join(process.cwd(), 'public', imagePath);
          await fs.unlink(fullPath);
        } catch (error) {
          console.error('Error deleting image file:', error);
        }
      }
    }

    // Delete QR code if exists
    if (property.qrCode) {
      try {
        const fullPath = path.join(process.cwd(), 'public', property.qrCode);
        await fs.unlink(fullPath);
      } catch (error) {
        console.error('Error deleting QR code file:', error);
      }
    }

    await BuyProperty.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
} 