'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { E164Number } from 'libphonenumber-js/types';
import { toast } from 'react-hot-toast';

interface CommercialProperty {
  _id: string;
  name: string;
  images: string[];
  price: string;
  location: string;
  propertyType: string;
  sqft: string;
  description: string;
  reference: string;
  bedrooms: string;
  bathrooms: string;
  qrCodeImage?: string;
}

export default function CommercialPropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<CommercialProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectName: ''
  });

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/properties/commercial/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to load property. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (index: number = 0) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  const getAllImages = () => {
    if (!property) return [];
    return property.images.map(src => ({ src }));
  };

  // Add form handling functions
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
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone,
          projectName: formData.projectName,
          propertyId: id,
          propertyType: 'commercial',
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

  if (isLoading) {
    return (
      <main>
        <Header />
        <div>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <Header />
        <div>{error}</div>
      </main>
    );
  }

  if (!property) {
    return (
      <main>
        <Header />
        <div>Property not found</div>
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="pt-22 pb-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/commercial"
            className="text-[#393e46] hover:text-black flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Commercial Properties
          </Link>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[300px] lg:h-[500px]">
          {/* Main large image - takes up 3 columns */}
          <div 
            className="col-span-1 lg:col-span-3 relative rounded-xl overflow-hidden cursor-pointer h-full"
            onClick={() => handleImageClick(0)}
          >
            <Image
              src={property.images[0] || '/placeholder.jpg'}
              alt={property.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button 
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleImageClick(0);
                }}
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
                className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Map
              </a>
            </div>
          </div>

          {/* Right column with 2 smaller images */}
          <div className="col-span-1 flex flex-col gap-4 h-full">
            {property.images.slice(1, 3).map((image, index) => (
              <div 
                key={index}
                className="relative h-[calc(50%-8px)] rounded-xl overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(index + 1)}
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
      </div>

      {/* Lightbox */}
      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={getAllImages()}
        index={photoIndex}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />

      {/* Property Details Section */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 pb-8 lg:grid-cols-12 gap-8">
          {/* Left Column - 8/12 */}
          <div className="lg:col-span-8">
            {/* Property Type Label */}
            

            {/* Price and Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="inline-block bg-blue-50 text-blue-700 rounded-full px-3 py-1 text-sm font-medium mb-4">
              {property.propertyType}
            </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AED {property.price}
              </h1>
              <p className="text-[15px] text-gray-700 mb-2">{property.name}</p>
              <p className="text-gray-600 mb-6">
                {property.location} | {property.reference}
              </p>

              <div className="flex flex-wrap items-center gap-4 lg:gap-8">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  <span className="text-[15px] text-gray-600">{property.sqft} sq.ft</span>
                </div>
              </div>
            </div>

            {/* About Property Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Regulatory Information Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Regulatory Information</h2>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Information Column */}
                <div className="lg:col-span-4 space-y-4">
                  <div>
                    <p className="text-gray-500 mb-1">Reference</p>
                    <p className="text-gray-900">{property.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Zone name</p>
                    <p className="text-gray-900">{property.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">DLD Permit Number</p>
                    <p className="text-gray-900">{property.reference}</p>
                  </div>
                </div>
                {/* QR Code Column */}
                <div className="lg:col-span-1 flex justify-center lg:justify-end items-start">
                  {property.qrCodeImage ? (
                    <Image
                      src={property.qrCodeImage}
                      alt="Property QR Code"
                      width={120}
                      height={120}
                      className=""
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">No QR Code</span>
                    </div>
                  )}
                </div>
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
    </main>
  );
} 