'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface Valuation {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  listingType: string;
  propertyAddress: string;
  createdAt: string;
}

export default function ListedPropertiesPage() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchValuations();
  }, []);

  const fetchValuations = async () => {
    try {
      const response = await fetch('/api/valuations');
      if (!response.ok) {
        throw new Error('Failed to fetch valuations');
      }
      const data = await response.json();
      setValuations(data);
    } catch (error) {
      console.error('Error fetching valuations:', error);
      setError('Failed to load valuations');
    } finally {
      setIsLoading(false);
    }
  };

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
          onClick={fetchValuations}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Listed Properties</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Listing Type
              </th>
              <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property Address
              </th>
            </tr>
          </thead>
          <tbody>
            {valuations.map((valuation) => (
              <tr key={valuation._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">
                  {format(new Date(valuation.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 border-b">{valuation.name}</td>
                <td className="px-6 py-4 border-b">{valuation.email}</td>
                <td className="px-6 py-4 border-b">{valuation.mobile}</td>
                <td className="px-6 py-4 border-b">{valuation.listingType}</td>
                <td className="px-6 py-4 border-b">{valuation.propertyAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 