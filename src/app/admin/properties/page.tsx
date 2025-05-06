'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Property {
  _id: string;
  name: string;
  propertyType: string;
  price: string;
  location: string;
  images: string[];
}

interface Properties {
  buy: Property[];
  rent: Property[];
  commercial: Property[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Properties>({
    buy: [],
    rent: [],
    commercial: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const [buyResponse, rentResponse, commercialResponse] = await Promise.all([
        fetch('/api/properties/buy?showAll=true', { cache: 'no-store' }),
        fetch('/api/properties/rent?showAll=true', { cache: 'no-store' }),
        fetch('/api/properties/commercial?showAll=true', { cache: 'no-store' })
      ]);

      const [buyProperties, rentProperties, commercialProperties] = await Promise.all([
        buyResponse.json(),
        rentResponse.json(),
        commercialResponse.json()
      ]);

      setProperties({
        buy: buyProperties,
        rent: rentProperties,
        commercial: commercialProperties,
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      const response = await fetch(`/api/off-plan/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      // Refresh the properties list
      fetchProperties();
    } catch (err) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const response = await fetch(`/api/off-plan/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update property status');
      }

      // Update the local state
      setProperties(properties.map(property => 
        property._id === id 
          ? { ...property, status: newStatus as 'published' | 'draft' }
          : property
      ));
    } catch (err) {
      console.error('Error updating property status:', err);
      alert('Failed to update property status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <button
          onClick={fetchProperties}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <div className="space-x-4">
          <Link
            href="/admin/add-buy-property"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Add Buy Property
          </Link>
          <Link
            href="/admin/add-rent-property"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Add Rent Property
          </Link>
          <Link
            href="/admin/add-commercial-property"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Add Commercial Property
          </Link>
        </div>
      </div>

      {/* Buy Properties Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Buy Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.buy.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48 w-full">
                {property.images && property.images[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', property.images[0]);
                      e.currentTarget.src = '/images/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-1">{property.propertyType}</p>
                <p className="text-gray-600 mb-1">{property.location}</p>
                <p className="text-gray-600 font-semibold">{property.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rent Properties Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Rent Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.rent.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48 w-full">
                {property.images && property.images[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', property.images[0]);
                      e.currentTarget.src = '/images/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-1">{property.propertyType}</p>
                <p className="text-gray-600 mb-1">{property.location}</p>
                <p className="text-gray-600 font-semibold">{property.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commercial Properties Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Commercial Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.commercial.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-48 w-full">
                {property.images && property.images[0] ? (
                  <Image
                    src={property.images[0]}
                    alt={property.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      console.error('Error loading image:', property.images[0]);
                      e.currentTarget.src = '/images/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-1">{property.propertyType}</p>
                <p className="text-gray-600 mb-1">{property.location}</p>
                <p className="text-gray-600 font-semibold">{property.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 