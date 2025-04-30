'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { XMarkIcon } from '@heroicons/react/24/outline';

const propertyTypes = [
  'Office',
  'Retail',
  'Warehouse',
  'Industrial',
  'Shop',
  'Restaurant',
  'Hotel',
  'Mixed Use'
];

interface EditCommercialPropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCommercialPropertyPage({ params }: EditCommercialPropertyPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingQrCode, setExistingQrCode] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    propertyType: '',
    sqft: '',
    name: '',
    location: '',
    description: '',
    reference: '',
    zoneName: '',
    dldPermitNumber: '',
    price: ''
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      console.log('Fetching property with ID:', id);
      const response = await fetch(`/api/properties/commercial/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to fetch property');
      }
      
      const data = await response.json();
      console.log('Received property data:', data);
      
      setFormData({
        propertyType: data.propertyType,
        sqft: data.sqft,
        name: data.name,
        location: data.location,
        description: data.description,
        reference: data.reference || '',
        zoneName: data.zoneName || '',
        dldPermitNumber: data.dldPermitNumber || '',
        price: data.price || ''
      });
      
      setExistingImages(data.images || []);
      setExistingQrCode(data.qrCodeImage || null);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchProperty:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch property');
      router.push('/admin/manage-commercial');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    onDrop: (acceptedFiles) => {
      setImages(prev => [...prev, ...acceptedFiles]);
    }
  });

  const { getRootProps: getQrRootProps, getInputProps: getQrInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setQrCode(acceptedFiles[0]);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeQrCode = () => {
    setQrCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Append new images
      images.forEach((image, index) => {
        formDataToSend.append(`images[${index}]`, image);
      });

      // Append existing images
      existingImages.forEach((image) => {
        formDataToSend.append('existingImages[]', image);
      });

      // Append QR code if exists
      if (qrCode) {
        formDataToSend.append('qrCode', qrCode);
      }

      // Append existing QR code if exists
      if (existingQrCode) {
        formDataToSend.append('existingQrCode', existingQrCode);
      }

      const response = await fetch(`/api/properties/commercial/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to update property');
      }

      toast.success('Commercial property updated successfully');
      router.push('/admin/manage-commercial');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Commercial Property</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  >
                    <option value="">Select Property Type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (AED) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price in AED"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Square Feet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    placeholder="Enter square feet"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter property name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter location"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">About Property</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Enter property description"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  required
                />
              </div>
            </div>

            {/* Regulatory Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Regulatory Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="Enter reference number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone Name
                  </label>
                  <input
                    type="text"
                    name="zoneName"
                    value={formData.zoneName}
                    onChange={handleInputChange}
                    placeholder="Enter zone name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
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
                    placeholder="Enter DLD permit number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QR Code Image
                  </label>
                  <div
                    {...getQrRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
                  >
                    <input {...getQrInputProps()} />
                    <p className="text-sm text-gray-500">Drop QR code image here, or click to select</p>
                  </div>
                  {existingQrCode && !qrCode && (
                    <div className="mt-2 relative inline-block">
                      <Image
                        src={existingQrCode}
                        alt="QR Code"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setExistingQrCode(null)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {qrCode && (
                    <div className="mt-2 relative inline-block">
                      <Image
                        src={URL.createObjectURL(qrCode)}
                        alt="QR Code"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeQrCode}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Property Images */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Property Images</h2>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
              >
                <input {...getInputProps()} />
                <p className="text-sm text-gray-500">Drag and drop property images here, or click to select</p>
              </div>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={image}
                        alt={`Property image ${index + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* New Images */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`New property image ${index + 1}`}
                        width={200}
                        height={200}
                        className="rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Updating...' : 'Update Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 