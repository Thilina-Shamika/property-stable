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

export default function AddBuyPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    propertyType: '',
    price: '',
    name: '',
    location: '',
    beds: '',
    baths: '',
    sqft: '',
    description: '',
    indoorAmenities: [] as string[],
    outdoorAmenities: [] as string[],
    furnishing: '',
    reference: '',
    zoneName: '',
    dldPermitNumber: ''
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      
      // Append all form data
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images[]', image);
      });

      // Append QR code if exists
      if (qrCode) {
        formDataToSend.append('qrCode', qrCode);
      }

      const response = await fetch('/api/properties/buy', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to create property');
      }

      toast.success('Property created successfully');
      router.push('/admin/properties');
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Add Buy Property</h1>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beds <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    placeholder="Enter number of beds"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Baths <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    placeholder="Enter number of baths"
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
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Description</h2>
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

            {/* Amenities Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Indoor Amenities</h3>
                  <div className="space-y-2">
                    {indoorAmenities.map(amenity => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`indoor-${amenity}`}
                          value={amenity}
                          checked={formData.indoorAmenities.includes(amenity)}
                          onChange={(e) => handleCheckboxChange(e, 'indoorAmenities')}
                          className="h-4 w-4 text-black focus:ring-black/5 border-gray-300 rounded"
                        />
                        <label htmlFor={`indoor-${amenity}`} className="ml-2 text-sm text-gray-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Outdoor Amenities</h3>
                  <div className="space-y-2">
                    {outdoorAmenities.map(amenity => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`outdoor-${amenity}`}
                          value={amenity}
                          checked={formData.outdoorAmenities.includes(amenity)}
                          onChange={(e) => handleCheckboxChange(e, 'outdoorAmenities')}
                          className="h-4 w-4 text-black focus:ring-black/5 border-gray-300 rounded"
                        />
                        <label htmlFor={`outdoor-${amenity}`} className="ml-2 text-sm text-gray-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Furnishing Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Furnishing</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Furnishing Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="furnishing"
                  value={formData.furnishing}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                  required
                >
                  <option value="">Select Furnishing Type</option>
                  {furnishingOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Regulatory Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Regulatory Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    placeholder="Enter reference number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zone Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zoneName"
                    value={formData.zoneName}
                    onChange={handleInputChange}
                    placeholder="Enter zone name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DLD Permit Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dldPermitNumber"
                    value={formData.dldPermitNumber}
                    onChange={handleInputChange}
                    placeholder="Enter DLD permit number"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    required
                  />
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
              </div>
            </div>

            {/* Property Images Section */}
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

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Creating...' : 'Create Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 