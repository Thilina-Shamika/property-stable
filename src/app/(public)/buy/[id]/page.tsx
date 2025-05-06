'use client';

import { useState, useEffect, use } from 'react';
import { E164Number } from 'libphonenumber-js/types';
import Link from 'next/link';
import Image from 'next/image';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { ShowerHead } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BuyProperty {
  _id: string;
  name: string;
  images: string[];
  price: string;
  location: string;
  propertyType: string;
  beds: string;
  baths: string;
  area: string;
  reference: string;
  description: string;
  features: string[];
  amenities: string[];
  zoneName: string;
  dldPermitNumber: string;
  qrCode?: string;
  developer?: string;
  completionDate?: string;
  paymentPlan?: {
    downPayment: number;
    installment1: string;
    installment2: string;
  };
}

interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

export default function BuyPropertyClient({ params }: PageParams) {
  const resolvedParams = use(params);
  const [property, setProperty] = useState<BuyProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectName: ''
  });

  useEffect(() => {
    fetchProperty();
  }, [resolvedParams.id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/buy/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch property');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/property-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone,
          projectName: formData.projectName,
          propertyId: resolvedParams.id,
          propertyType: 'buy',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        projectName: ''
      });
      setPhone(undefined);
      
      toast.success(`Thank you for your interest in ${property?.name || 'this property'}! We will contact you shortly.`, {
        duration: 5000,
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast.error('Failed to register your interest. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return null;
  }

  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 pt-22 pb-8 max-w-7xl mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="text-[#393e46] cursor-pointer hover:text-black flex items-center mb-6"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </button>

        {/* Image Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[300px] lg:h-[500px] mb-6 lg:mb-8">
          {/* Main large image - takes up 3 columns on desktop */}
          <div 
            className="col-span-1 lg:col-span-3 relative rounded-xl overflow-hidden cursor-pointer h-full"
            onClick={() => {
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={property.images[0] || '/placeholder.jpg'}
              alt={property.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 flex flex-col sm:flex-row gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(0);
                  setLightboxOpen(true);
                }}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {property.images.length} photos
              </button>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.location + ', Dubai, UAE')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2 shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map
              </a>
            </div>
          </div>

          {/* Right side vertical images - hidden on mobile */}
          <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
            {property.images.slice(1, 3).map((image, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => {
                  setLightboxIndex(index + 1);
                  setLightboxOpen(true);
                }}
              >
                <Image
                  src={image}
                  alt={`${property.name} - Image ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column - 8/12 */}
          <div className="lg:col-span-8 space-y-6">
            {/* First Section */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100">
              <div className="inline-block px-4 py-2 bg-[#EEF2FF] text-[#4F46E5] rounded-full text-[13px] font-medium mb-4">
                {property.propertyType}
              </div>

              <h1 className="text-2xl lg:text-[32px] font-bold mb-2">
                AED {property.price}
              </h1>

              <h2 className="text-[15px] text-gray-600 mb-2">
                {property.beds} Bedrooms | Great Investment | {property.reference}
              </h2>

              <p className="text-[15px] text-gray-500 mb-6">
                {property.location}
              </p>

              <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-[15px] text-gray-600">{property.beds} Beds</span>
                </div>

                <div className="flex items-center gap-2">
                  <ShowerHead className="w-5 h-5 text-gray-400" />
                  <span className="text-[15px] text-gray-600">{property.baths} Baths</span>
                </div>

                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-[15px] text-gray-600">{property.area} sq.ft</span>
                </div>
              </div>
            </div>

            {/* Property Description Section */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-[24px] font-bold mb-6">
                Property Description
              </h2>

              {/* Agent Info */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[15px] text-gray-600">Agent: Jack Bystram</span>
                <a 
                  href="tel:+9759256422" 
                  className="text-[15px] text-blue-600 hover:underline"
                >
                  +975 9256 4229
                </a>
              </div>

              {/* Description Text */}
              <div className="space-y-4 text-[15px] text-gray-600">
                <p>{property.description}</p>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-[24px] font-bold mb-6">
                Location
              </h2>

              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-[15px] font-medium text-gray-900">{property.location}</p>
                  <p className="text-[15px] text-gray-500">Dubai - United Arab Emirates</p>
                </div>
              </div>
            </div>

            {/* Indoor Amenities Section */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-[24px] font-bold mb-6">
                Indoor Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Air Conditioning/Heating',
                  'Fitness Center/Gym',
                  'Sauna/Steam Room',
                  'Library/Reading Room',
                  'Conference Room',
                  'Children\'s Playroom',
                  'Parking Garage (Indoor)',
                  'Walk-in Closets'
                ].map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 px-4 py-2 rounded-full text-[15px] text-gray-600"
                  >
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Outdoor Amenities Section */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-[24px] font-bold mb-6">
                Outdoor Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Garden or Landscaping',
                  'Hot Tub/Jacuzzi',
                  'Tennis Court',
                  'Bike Racks',
                  'Picnic Area'
                ].map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 px-4 py-2 rounded-full text-[15px] text-gray-600"
                  >
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Furnishing Section */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-[24px] font-bold mb-6">
                Furnishing
              </h2>
              <div className="flex flex-wrap gap-2">
                <div className="bg-gray-50 px-4 py-2 rounded-full text-[15px] text-gray-600">
                  Furnished
                </div>
              </div>
            </div>

            {/* Regulatory Information Section */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-gray-100">
              <h2 className="text-xl lg:text-[24px] font-bold mb-6">
                Regulatory information
              </h2>
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-600 mb-1">Reference</div>
                    <div className="text-[15px]">{property.reference}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">Zone name</div>
                    <div className="text-[15px]">{property.zoneName}</div>
                  </div>
                  <div>
                    <div className="text-gray-600 mb-1">DLD Permit Number</div>
                    <div className="text-[15px]">{property.dldPermitNumber}</div>
                  </div>
                </div>
                {property.qrCode && (
                  <div className="w-32 h-32">
                    <Image
                      src={property.qrCode}
                      alt="Property QR Code"
                      width={128}
                      height={128}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 4/12 */}
          <div className="lg:col-span-4">
            {/* ED Properties Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-3">ED Properties</h2>
              <p className="text-gray-600 text-sm mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Whatsapp
                </button>
              </div>
            </div>

            {/* Mortgage Calculator Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Need a mortgage?</h2>
              <Link 
                href="/mortgage-calculator"
                className="w-full bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center text-sm"
              >
                Try Our Calculator
              </Link>
            </div>

            {/* Registration Form - Sticky */}
            <div className="hidden lg:block sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                <h2 className="text-xl font-bold mb-6">Register your interest</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="AE"
                      value={phone}
                      onChange={setPhone}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                    <div className="text-xs text-gray-500 mt-1">Selected: UAE (+971) • Format: (123) 456-7890</div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      placeholder="Project name"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors mt-6"
                  >
                    Submit Details
                  </button>
                </form>
              </div>
            </div>

            {/* Mobile Registration Form - Fixed bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50">
              <button
                onClick={() => document.getElementById('mobileForm')?.classList.remove('hidden')}
                className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Register Interest
              </button>
            </div>

            {/* Mobile Form Modal */}
            <div 
              id="mobileForm"
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 hidden"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  document.getElementById('mobileForm')?.classList.add('hidden');
                }
              }}
            >
              <div className="bg-white rounded-t-2xl p-6 absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Register your interest</h2>
                  <button
                    onClick={() => document.getElementById('mobileForm')?.classList.add('hidden')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="AE"
                      value={phone}
                      onChange={setPhone}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                    <div className="text-xs text-gray-500 mt-1">Selected: UAE (+971) • Format: (123) 456-7890</div>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      placeholder="Project name"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors mt-6"
                  >
                    Submit Details
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={property.images.map(image => ({ src: image }))}
        index={lightboxIndex}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(10px)' },
        }}
      />
    </main>
  );
} 