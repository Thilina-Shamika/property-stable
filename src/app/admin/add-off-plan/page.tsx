'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadFiles } from '@/lib/utils/fileUpload';
import { z } from "zod";
import { offPlanFormSchema } from "@/lib/validations/offPlanSchema";

type OffPlanFormData = z.infer<typeof offPlanFormSchema>;

interface FormData {
  title: string;
  propertyType: string;
  price: string;
  priceRange: {
    min: number;
    max: number;
  };
  paymentPlan: {
    downPayment: number;
    installment1: string;
    installment2: string;
  };
  completionDate: string;
  handoverDate: string;
  description: string;
  developer: {
    name: string;
  };
  location: string;
  projectNumber: string;
  dldPermitNumber: string;
  mainImage: string;
  images: string[];
  qrCode?: string;
}

export default function AddOffPlanPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    propertyType: 'Apartment',
    price: '',
    priceRange: {
      min: 0,
      max: 0
    },
    paymentPlan: {
      downPayment: 0,
      installment1: '',
      installment2: ''
    },
    completionDate: '',
    handoverDate: '',
    description: '',
    developer: {
      name: ''
    },
    location: '',
    projectNumber: '',
    dldPermitNumber: '',
    mainImage: '',
    images: []
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [qrCodeFile, setQRCodeFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev: FormData) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (files: File[]) => {
    setImageFiles(prev => [...prev, ...files]);
  };

  const handleQRCodeChange = (files: File[]) => {
    if (files.length > 0) {
      setQRCodeFile(files[0]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload images first
      let imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          imageUrls = await uploadFiles(imageFiles, 'property');
          console.log('Images uploaded successfully:', imageUrls);
        } catch (error) {
          console.error('Error uploading images:', error);
          throw new Error('Failed to upload images');
        }
      }

      // Upload QR code if exists
      let qrCodeUrl = '';
      if (qrCodeFile) {
        try {
          const [uploadedQrCode] = await uploadFiles([qrCodeFile], 'qrcode');
          qrCodeUrl = uploadedQrCode;
          console.log('QR code uploaded successfully:', qrCodeUrl);
        } catch (error) {
          console.error('Error uploading QR code:', error);
          throw new Error('Failed to upload QR code');
        }
      }

      // Prepare the final data
      const finalData = {
        ...formData,
        images: imageUrls,
        qrCode: qrCodeUrl,
      };

      console.log('Submitting form data:', finalData);

      // Send to API
      const response = await fetch('/api/off-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create property');
      }

      console.log('Property created successfully:', responseData);

      // Show success message
      alert('Property created successfully!');

      // Redirect to properties list
      router.push('/admin/properties');
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'Failed to create property');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Add Off-Plan Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Key Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Key Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (AED)
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installment 1
              </label>
              <input
                type="text"
                name="paymentPlan.installment1"
                value={formData.paymentPlan.installment1}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installment 2
              </label>
              <input
                type="text"
                name="paymentPlan.installment2"
                value={formData.paymentPlan.installment2}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Handover Date
              </label>
              <input
                type="text"
                name="handoverDate"
                value={formData.handoverDate}
                onChange={handleInputChange}
                placeholder="e.g., Q4 2025"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Developer Info */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Developer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Master Developer
              </label>
              <input
                type="text"
                name="developer.name"
                value={formData.developer.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* About Project */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">About Project</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* Location */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location Details
            </label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
            />
          </div>
        </section>

        {/* Regulatory Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Regulatory Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference
              </label>
              <input
                type="text"
                name="projectNumber"
                value={formData.projectNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DLD Permit Number
              </label>
              <input
                type="text"
                name="dldPermitNumber"
                value={formData.dldPermitNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              QR Code
            </label>
            <ImageUpload
              onImageChange={handleQRCodeChange}
              maxImages={1}
              existingImages={formData.qrCode ? [formData.qrCode] : []}
            />
          </div>
        </section>

        {/* Property Images */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Property Images</h2>
          <ImageUpload
            onImageChange={handleImageChange}
            maxImages={10}
            existingImages={formData.images}
            onRemoveImage={handleRemoveImage}
          />
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-lg transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
} 