'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

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
}

export default function CommercialPropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<CommercialProperty | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

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
      <div className="pt-8 pb-8">
        <div className="container mx-auto px-4">
          <Link 
            href="/commercial"
            className="text-black hover:text-black flex items-center"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
          </div>

          {/* Right Column - 4/12 */}
          <div className="lg:col-span-4">
            {/* Right column content will be added later */}
          </div>
        </div>
      </div>
    </main>
  );
} 