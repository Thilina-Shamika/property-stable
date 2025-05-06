import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { OffPlanProperty } from '@/models/OffPlanProperty';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const formData = await request.formData();

    // Handle images
    const uploadsDir = require('path').join(process.cwd(), 'public', 'uploads', 'property');
    await require('fs/promises').mkdir(uploadsDir, { recursive: true });

    // New images
    const imageFiles = formData.getAll('images[]') as File[];
    let imageUrls: string[] = [];
    if (imageFiles && imageFiles.length > 0) {
      imageUrls = await Promise.all(
        imageFiles.map(async (file) => {
          if (!(file instanceof File)) return '';
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filename = `${Date.now()}-${file.name}`;
          const filepath = require('path').join(uploadsDir, filename);
          await require('fs/promises').writeFile(filepath, buffer);
          return `/uploads/property/${filename}`;
        })
      );
    }
    // Existing images
    const existingImages = formData.getAll('existingImages[]') as string[];
    const allImages = [...(existingImages || []), ...(imageUrls || [])].filter(Boolean);

    // Handle QR code
    let qrCodePath = '';
    const qrCode = formData.get('qrCode');
    if (qrCode instanceof File) {
      const buffer = Buffer.from(await qrCode.arrayBuffer());
      const filename = `${Date.now()}-${qrCode.name}`;
      const filepath = require('path').join(uploadsDir, filename);
      await require('fs/promises').writeFile(filepath, buffer);
      qrCodePath = `/uploads/property/${filename}`;
    } else if (formData.get('existingQrCode')) {
      qrCodePath = formData.get('existingQrCode') as string;
    }

    // Validate required paymentPlan fields
    const installment1 = formData.get('installment1');
    const installment2 = formData.get('installment2');
    if (!installment1 || !installment2) {
      return NextResponse.json(
        { error: 'Installment 1 and Installment 2 are required.' },
        { status: 400 }
      );
    }

    // Build update object
    const update: Record<string, any> = {
      title: formData.get('title') || '',
      propertyType: formData.get('propertyType') || 'Apartment',
      beds: formData.get('beds') || '',
      price: formData.get('price') || '',
      priceRange: { min: 0, max: 0 },
      paymentPlan: {
        downPayment: 0,
        installment1,
        installment2
      },
      completionDate: formData.get('completionDate') || '',
      handoverDate: formData.get('handoverDate') || '',
      description: formData.get('description') || '',
      developer: formData.get('developer') || '',
      location: formData.get('location') || '',
      projectNumber: formData.get('projectNumber') || '',
      dldPermitNumber: formData.get('dldPermitNumber') || '',
      mainImage: allImages[0] || '',
      qrCode: qrCodePath,
      images: allImages,
      status: 'draft',
    };

    const property = await OffPlanProperty.findByIdAndUpdate(
      params.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update property' },
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

    const property = await OffPlanProperty.findByIdAndDelete(params.id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete property' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const property = await OffPlanProperty.findById(params.id);

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