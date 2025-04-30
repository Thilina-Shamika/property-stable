'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface BuyProperty {
  _id: string;
  name: string;
  propertyType: string;
  price: string;
  location: string;
  beds: string;
  baths: string;
  sqft: string;
  images: string[];
  createdAt: string;
}

export default function ManageBuyPropertyPage() {
  const [properties, setProperties] = useState<BuyProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof BuyProperty>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/properties/buy?showAll=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch properties: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched properties:', data); // Debug log
      
      if (!Array.isArray(data)) {
        setProperties([]);
        return;
      }
      
      const sortedData = data.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setProperties(sortedData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/properties/buy/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete property');
      }
      
      setProperties(prev => prev.filter(prop => prop._id !== id));
      alert('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete property');
    }
  };

  const handleRefresh = () => {
    fetchProperties();
  };

  const handleSort = (field: keyof BuyProperty) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedProperties = properties
    .filter(property => 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.propertyType?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  if (isLoading) {
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
        <h1 className="text-2xl font-bold">Manage Buy Properties</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th 
                className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('propertyType')}
              >
                Type {sortField === 'propertyType' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('location')}
              >
                Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProperties.map((property) => (
              <tr key={property._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">
                  {property.images && property.images[0] && (
                    <div className="relative w-16 h-16">
                      <Image
                        src={property.images[0]}
                        alt={property.name}
                        width={64}
                        height={64}
                        className="object-cover rounded"
                        onError={(e) => {
                          console.error('Error loading image:', property.images[0]);
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 border-b">{property.name}</td>
                <td className="px-6 py-4 border-b">{property.propertyType}</td>
                <td className="px-6 py-4 border-b">{property.price}</td>
                <td className="px-6 py-4 border-b">{property.location}</td>
                <td className="px-6 py-4 border-b">
                  <div className="flex gap-2">
                    <Link href={`/admin/edit-buy-property/${property._id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(property._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 