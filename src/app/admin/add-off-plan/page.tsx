'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { XMarkIcon } from '@heroicons/react/24/outline';

const propertyTypes = [
  'Apartment',
  'Villa',
  'Townhouse',
  'Penthouse',
  'Duplex',
  'Studio',
  'Loft'
];

const indoorAmenities = [
  'Air Conditioning/Heating',
  'Fitness Center/Gym',
  'Sauna/Steam Room',
  'Library/Reading Room',
  'Conference Room',
  'Children\'s Playroom',
  'Parking Garage (Indoor)',
  'Walk-in Closets'
];

const outdoorAmenities = [
  'Garden or Landscaping',
  'Hot Tub/Jacuzzi',
  'Tennis Court',
  'Bike Racks',
  'Picnic Area'
];

const furnishingOptions = [
  'Fully Furnished',
  'Furnished',
  'Not Furnished'
];

type FormDataType = {
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
  handoverDate: string;
  developer: { name: string };
  title: string;
  projectNumber: string;
  installment1: string;
  installment2: string;
  [key: string]: any; // allow string indexing for dynamic/nested fields
};

export default function AddOffPlanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    propertyType: '',
    price: '',
    name: '',
    location: '',
    beds: '',
    baths: '',
    sqft: '',
    description: '',
    indoorAmenities: [],
    outdoorAmenities: [],
    furnishing: '',
    reference: '',
    zoneName: '',
    dldPermitNumber: '',
    handoverDate: '',
    developer: { name: '' },
    title: '',
    projectNumber: '',
    installment1: '',
    installment2: ''
  });

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
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'indoorAmenities' | 'outdoorAmenities') => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'developer') {
          formDataToSend.append('developer', value.name); // flatten developer
        } else if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (typeof value === 'object' && value !== null) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });
      images.forEach((image) => {
        formDataToSend.append('images[]', image);
      });
      if (qrCode) {
        formDataToSend.append('qrCode', qrCode);
      }
      const response = await fetch('/api/off-plan', {
        method: 'POST',
        body: formDataToSend
      });
      if (!response.ok) {
        throw new Error('Failed to create property');
      }
      toast.success('Property created successfully');
      router.push('/admin/manage-off-plan');
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Failed to create property');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
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
                value={formData.installment1 || ''}
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
                value={formData.installment2 || ''}
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
            <div
              {...getQrRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
            >
              <input {...getQrInputProps()} />
              {qrCode ? (
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(qrCode)}
                    alt="QR Code"
                    width={100}
                    height={100}
                    className="mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setQrCode(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Drag and drop QR code image here, or click to select</p>
              )}
            </div>
          </div>
        </section>

        {/* Property Images */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Property Images</h2>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400"
            >
              <input {...getInputProps()} />
              <p className="text-sm text-gray-500">Drag and drop property images here, or click to select</p>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Property image ${index + 1}`}
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
        </section>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-6 py-2 rounded-lg transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? 'Adding Property...' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
} 