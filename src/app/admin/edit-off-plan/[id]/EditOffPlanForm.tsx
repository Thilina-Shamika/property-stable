'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { uploadFiles } from '@/lib/utils/fileUpload';
import { z } from "zod";
import { offPlanFormSchema } from "@/lib/validations/offPlanSchema";

type OffPlanFormData = z.infer<typeof offPlanFormSchema>;

interface FormData {
  title: string;
  propertyType: string;
  beds: string;
  price: string;
  installment1: string;
  installment2: string;
  handoverDate: string;
  description: string;
  developer: string;
  location: string;
  projectNumber: string;
  dldPermitNumber: string;
  mainImage: string;
  images: string[];
  qrCode?: string;
}

interface EditOffPlanFormProps {
  id: string;
}

export default function EditOffPlanForm({ id }: EditOffPlanFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingQrCode, setExistingQrCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/off-plan/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      
      const data = await response.json();
      setFormData({
        ...data,
        installment1: data.paymentPlan?.installment1 || '',
        installment2: data.paymentPlan?.installment2 || '',
      });
      setImagePreview(data.mainImage || '');
      setExistingImages(data.images);
      setExistingQrCode(data.qrCode || null);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleImageUpload = (files: File[]) => {
    if (files.length > 0) {
      setImageFiles(files);
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeQrCode = () => {
    setQrCode(null);
  };

  const removeExistingQrCode = () => {
    setExistingQrCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    try {
      setIsSubmitting(true);
      setError(null);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images' || key === 'mainImage' || key === 'qrCode') return; // handled below
        formDataToSend.append(key, value || '');
      });
      // Images
      imageFiles.forEach((image) => {
        formDataToSend.append('images[]', image);
      });
      // Existing images (if any)
      existingImages.forEach((img) => {
        formDataToSend.append('existingImages[]', img);
      });
      // QR code
      if (qrCode) {
        formDataToSend.append('qrCode', qrCode);
      }
      // Existing QR code (if any)
      if (existingQrCode) {
        formDataToSend.append('existingQrCode', existingQrCode);
      }
      const response = await fetch(`/api/off-plan/${id}`, {
        method: 'PATCH',
        body: formDataToSend
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update property');
      }
      router.push('/admin/manage-off-plan');
    } catch (error) {
      console.error('Error updating property:', error);
      setError(error instanceof Error ? error.message : 'Failed to update property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !formData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error || 'Property not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold mb-8">Edit Off-Plan Property</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Key Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Key Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Duplex">Duplex</option>
                <option value="Plot">Plot</option>
                <option value="Land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Beds
              </label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleInputChange}
                min="0"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-primary"
                required
              />
            </div>

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
                name="installment1"
                value={formData.installment1}
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
                name="installment2"
                value={formData.installment2}
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
                name="developer"
                value={formData.developer}
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
              onImageChange={handleImageUpload}
              maxImages={1}
              existingImages={formData.qrCode ? [formData.qrCode] : []}
            />
          </div>
        </section>

        {/* Property Images */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Property Images</h2>
          <ImageUpload
            onImageChange={handleImageUpload}
            maxImages={10}
            existingImages={existingImages}
            onRemoveImage={(index) => setExistingImages(prev => prev.filter((_, i) => i !== index))}
          />
          {imagePreview && (
            <div className="mt-2 relative h-40 w-full">
              <Image
                src={imagePreview || '/images/placeholder.jpg'}
                alt="Property preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-lg transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Updating Property...' : 'Update Property'}
          </button>
        </div>
      </form>
    </div>
  );
} 