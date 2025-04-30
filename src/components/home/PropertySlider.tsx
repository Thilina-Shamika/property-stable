'use client';

import useEmblaCarousel from 'embla-carousel-react';
import PropertyCard from './PropertyCard';
import { useEffect, useState } from 'react';

interface Property {
  _id: string;
  mainImage: string;
  title: string;
  projectName: string;
  masterDeveloper: string;
  price: string;
  handoverDate: string;
}

const PropertySlider = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    dragFree: true
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/off-plan');
        if (!response.ok) throw new Error('Failed to fetch properties');
        const data = await response.json();
        console.log('Fetched properties:', data); // Debug log
        
        // Filter only published properties
        const publishedProperties = data.filter((prop: any) => prop.status === 'published');
        console.log('Published properties:', publishedProperties); // Debug log
        
        setProperties(publishedProperties);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (properties.length === 0) {
    return null;
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
              <PropertyCard
                image={property.mainImage}
                name={property.title}
                address={property.projectName}
                developer={property.masterDeveloper}
                price={property.price}
                handoverDate={property.handoverDate}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertySlider; 