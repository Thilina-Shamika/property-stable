import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { CommercialProperty } from '@/models/CommercialProperty';
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
    console.log('Fetching property with ID:', params.id);
    
    const property = await CommercialProperty.findById(params.id);
    
    if (!property) {
      console.log('Property not found with ID:', params.id);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    console.log('Property found:', property);
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
    console.log('Updating property with ID:', params.id);

    const formData = await request.formData();
    console.log('Received form data for update');

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'property');
    await mkdir(uploadsDir, { recursive: true });
    console.log('Created uploads directory');

    // Process new images
    const newImagePaths = [];
    for (let i = 0; formData.get(`images[${i}]`); i++) {
      const imageUrl = formData.get(`images[${i}]`);
      if (imageUrl && typeof imageUrl === 'string') {
        newImagePaths.push(imageUrl);
      }
    }
    console.log('Processed new images:', newImagePaths);

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

    // Get existing property to handle image cleanup
    const existingProperty = await CommercialProperty.findById(params.id);
    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Prepare property data
    const propertyData = {
      propertyType: formData.get('propertyType'),
      price: formData.get('price'),
      sqft: formData.get('sqft'),
      name: formData.get('name'),
      location: formData.get('location'),
      description: formData.get('description'),
      reference: formData.get('reference'),
      zoneName: formData.get('zoneName'),
      dldPermitNumber: formData.get('dldPermitNumber'),
      images: newImagePaths.length > 0 ? newImagePaths : existingProperty.images,
      qrCodeImage: qrCodePath || existingProperty.qrCodeImage,
    };

    // Update property
    const updatedProperty = await CommercialProperty.findByIdAndUpdate(
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

    // Clean up old images if new ones were uploaded
    if (newImagePaths.length > 0) {
      for (const oldImage of existingProperty.images) {
        const oldImagePath = path.join(process.cwd(), 'public', oldImage);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
    }

    // Clean up old QR code if new one was uploaded
    if (qrCodePath && existingProperty.qrCodeImage) {
      const oldQrCodePath = path.join(process.cwd(), 'public', existingProperty.qrCodeImage);
      try {
        await fs.unlink(oldQrCodePath);
      } catch (error) {
        console.error('Error deleting old QR code:', error);
      }
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
    console.log('Deleting property with ID:', params.id);

    const property = await CommercialProperty.findById(params.id);
    
    if (!property) {
      console.log('Property not found with ID:', params.id);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Delete associated images
    for (const image of property.images) {
      const imagePath = path.join(process.cwd(), 'public', image);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Delete QR code if exists
    if (property.qrCodeImage) {
      const qrCodePath = path.join(process.cwd(), 'public', property.qrCodeImage);
      try {
        await fs.unlink(qrCodePath);
      } catch (error) {
        console.error('Error deleting QR code:', error);
      }
    }

    // Delete property from database
    await CommercialProperty.findByIdAndDelete(params.id);
    console.log('Property deleted successfully');

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
} 