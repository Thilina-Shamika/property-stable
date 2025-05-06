'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { E164Number } from 'libphonenumber-js/types';

interface OffPlanProperty {
  _id: string;
  title: string;
  mainImage: string;
  handoverDate: string;
  price: string;
  location: string;
  developer: string;
  propertyType: string;
  description: string;
  beds: string;
  images: string[];
  paymentPlan: {
    downPayment: number;
    installment1: string;
    installment2: string;
  };
  projectNumber: string;
  dldPermitNumber: string;
  zoneName: string;
  reference: string;
  qrCode?: string;
}

interface PageParams {
  id: string;
}

export default function OffPlanPropertyClient({ params }: { params: PageParams }) {
  const [property, setProperty] = useState<OffPlanProperty | null>(null);
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
  }, [params.id]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/off-plan/${params.id}`);
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

  const handleImageClick = () => {
    setPhotoIndex(0);
    setIsOpen(true);
  };

  const getAllImages = () => {
    if (!property) return [];
    return property.images.map(src => ({ src }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ ...formData, phone });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center text-red-500">{error || 'Property not found'}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-[1200px]">
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/off-plan"
            className="text-[#393e46] hover:text-black flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Off-Plan Properties
          </Link>
        </div>

        {/* Two Column Layout - Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] p-8 mb-8">
          {/* Left Column */}
          <div className="flex items-center">
            <div>
              {/* Off Plan Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  Off Plan
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold text-black mb-4">
                {property.title.split('|').map((part, index) => (
                  <span key={index}>
                    {part.trim()}
                    {index < property.title.split('|').length - 1 && (
                      <span className="mx-2">|</span>
                    )}
                  </span>
                ))}
              </h1>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-8">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{property.beds} Bedroom {property.propertyType} for Sale in {property.location}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-[#393e46] text-white rounded-full hover:bg-gray-800 transition-colors text-center">
                  Register your interest
                </button>
                <button className="px-6 py-3 bg-white text-black border-2 border-black rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Brochure
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div 
              className="relative h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              <Image
                src={property.mainImage || '/placeholder.jpg'}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
              {/* Image Count and Map Buttons */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button 
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium flex items-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent lightbox from opening
                    handleImageClick();
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
                  onClick={(e) => e.stopPropagation()} // Prevent lightbox from opening
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Map
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - 8/12 */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Information Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">Key information</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-1">Price</p>
                  <p className="text-xl font-semibold">AED {property.price}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Down Payment</p>
                  <p className="text-xl font-semibold">{property.paymentPlan.downPayment}%</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Installment 1</p>
                  <p className="text-xl font-semibold">{property.paymentPlan.installment1}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Handover Date</p>
                  <p className="text-xl font-semibold">{property.handoverDate}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Property Type</p>
                  <p className="text-xl font-semibold">{property.propertyType}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Bedrooms</p>
                  <p className="text-xl font-semibold">{property.beds}</p>
                </div>
              </div>
            </div>

            {/* Master Developer & Project Name Section */}
            <div className="mt-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-[20px] p-6 border border-gray-100">
                  <div className="text-[15px] text-gray-500 mb-2">Master Developer</div>
                  <div className="text-[15px] font-medium">{property.developer}</div>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-gray-100">
                  <div className="text-[15px] text-gray-500 mb-2">Project Name</div>
                  <div className="text-[15px] font-medium">{property.title}</div>
                </div>
              </div>
            </div>

            {/* About this Project Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">About this Project</h2>
              <div className="text-gray-600">
                <p>{property.description}</p>
              </div>
            </div>

            {/* Payment Plan Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">Payment Plan</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-900 font-medium">1</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">INSTALLMENT_1</div>
                  <div className="text-[40px] font-semibold mb-2">{property.paymentPlan.installment1}</div>
                  <div className="text-gray-500">During Construction</div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-gray-900 font-medium">2</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">Installment 2</div>
                  <div className="text-[40px] font-semibold mb-2">{property.paymentPlan.installment2}</div>
                  <div className="text-gray-500">On Handover</div>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">Location</h2>
              <div className="flex items-start gap-2 mb-6">
                <svg className="w-5 h-5 mt-1 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="text-gray-900 font-medium">{property.location}</div>
                  <div className="text-gray-600">Dubai - United Arab Emirates</div>
                </div>
              </div>
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gray-100">
                {/* Map placeholder - will be replaced with Google Maps */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-gray-400">Map will be configured soon</div>
                </div>
              </div>
            </div>

            {/* Regulatory Information Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6">Regulatory information</h2>
              <div className="flex justify-between items-center gap-8">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-gray-600 mb-1">Reference</div>
                      <div className="text-gray-900 font-medium">{property.projectNumber}</div>
                    </div>
                    <div>
                      <div className="text-gray-600 mb-1">DLD Permit Number</div>
                      <div className="text-gray-900 font-medium">{property.dldPermitNumber}</div>
                    </div>
                  </div>
                </div>
                {property.qrCode && (
                  <div className="w-40 h-40">
                    <Image
                      src={property.qrCode}
                      alt="Property QR Code"
                      width={160}
                      height={160}
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - 4/12 */}
          <div className="lg:col-span-4 space-y-6 sticky top-24 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-3">ED Properties</h2>
              <p className="text-gray-600 text-sm mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
                <button className="flex items-center justify-center gap-2 bg-[#393e46] text-white py-3 px-4 rounded-xl hover:bg-gray-800 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Whatsapp
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
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
      </div>
    </main>
  );
} 