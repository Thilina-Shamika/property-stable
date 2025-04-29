import useEmblaCarousel from 'embla-carousel-react';
import PropertyCard from './PropertyCard';
import { useEffect, useState } from 'react';

const properties = [
  {
    image: '/images/arabian.png',
    name: 'Creek Rise Tower',
    address: 'Dubai Creek Harbour',
    developer: 'Emaar Properties',
    price: 'From AED 1,200,000',
    handoverDate: 'Q4 2024'
  },
  {
    image: '/images/creek.png',
    name: 'Beach Mansion',
    address: 'Dubai Marina',
    developer: 'Select Group',
    price: 'From AED 2,500,000',
    handoverDate: 'Q2 2025'
  },
  {
    image: '/images/harbour.jpg',
    name: 'Palm View',
    address: 'Palm Jumeirah',
    developer: 'Nakheel',
    price: 'From AED 3,800,000',
    handoverDate: 'Q3 2024'
  },
  {
    image: '/images/heights.png',
    name: 'Downtown Views',
    address: 'Downtown Dubai',
    developer: 'Emaar Properties',
    price: 'From AED 2,100,000',
    handoverDate: 'Q1 2025'
  }
];

const PropertySlider = () => {
  const [emblaRef] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    dragFree: true
  });

  return (
    <div className="mt-16 -mx-4 sm:-mx-6">
      <div className="overflow-hidden px-4 sm:px-6" ref={emblaRef}>
        <div className="flex gap-4 md:gap-8">
          {properties.map((property, index) => (
            <div 
              className="flex-[0_0_calc(100%-2rem)] md:flex-[0_0_calc(31%-1rem)]" 
              key={index}
            >
              <PropertyCard {...property} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertySlider; 