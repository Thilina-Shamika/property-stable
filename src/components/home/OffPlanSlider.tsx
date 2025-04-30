'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';

interface OffPlanProperty {
  _id: string;
  title: string;
  propertyType: string;
  price: string;
  mainImage: string;
  location: string;
  developer: string;
  handoverDate: string;
  status: 'draft' | 'published';
}

const OffPlanSlider = () => {
  const [properties, setProperties] = useState<OffPlanProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    dragFree: true
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('Fetching properties...');
        const response = await fetch('/api/off-plan?showAll=true');
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(errorData.error || 'Failed to fetch properties');
        }
        
        const data = await response.json();
        console.log('Raw API Response:', data);
        console.log('Number of properties:', data.length);
        console.log('Properties status:', data.map((p: any) => p.status));
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }
        
        setProperties(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch properties');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No off-plan properties available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 -mx-4 sm:-mx-6">
      <div className="overflow-hidden px-4 sm:px-6" ref={emblaRef}>
        <div className="flex gap-4 md:gap-8">
          {properties.map((property) => (
            <div 
              className="flex-[0_0_calc(100%-2rem)] md:flex-[0_0_calc(31%-1rem)]" 
              key={property._id}
            >
              <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* Image Container */}
                <div className="relative h-[240px] w-full">
                  <Image
                    src={property.mainImage || '/placeholder.jpg'}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                {/* Content Container */}
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-900">{property.title}</h3>
                  <p className="text-sm text-gray-600">{property.location}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Developer:</span>
                      <span className="text-sm text-gray-900 ml-2">{property.developer}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Price:</span>
                      <span className="text-sm text-gray-900 ml-2">{property.price}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">Handover:</span>
                      <span className="text-sm text-gray-900 ml-2">{property.handoverDate}</span>
                    </div>
                  </div>

                  <Link 
                    href={`/off-plan/${property._id}`}
                    className="block w-full mt-4 px-6 py-2.5 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffPlanSlider; 