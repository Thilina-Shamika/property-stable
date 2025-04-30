'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface Property {
  _id: string;
  title: string;
  location: string;
  completionDate: string;
  dldPermitNumber: string;
  mainImage: string;
  status: 'published' | 'draft';
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const [buyResponse, rentResponse, commercialResponse] = await Promise.all([
        fetch('/api/buy', { cache: 'no-store' }),
        fetch('/api/rent', { cache: 'no-store' }),
        fetch('/api/commercial', { cache: 'no-store' })
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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
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

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handover Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DLD Permit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-20 w-20 flex-shrink-0 relative">
                      <Image
                        src={property.mainImage}
                        alt={property.title}
                        fill
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {property.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {property.completionDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {property.dldPermitNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Switch
                    checked={property.status === 'published'}
                    onCheckedChange={() => handleStatusToggle(property._id, property.status)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <Link
                      href={`/admin/edit-off-plan/${property._id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={20} />
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
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