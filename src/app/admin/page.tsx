'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  offPlanCount: number;
  buyCount: number;
  rentCount: number;
  commercialCount: number;
  inquiryCount: number;
  requestCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    offPlanCount: 0,
    buyCount: 0,
    rentCount: 0,
    commercialCount: 0,
    inquiryCount: 0,
    requestCount: 0,
  });

  useEffect(() => {
    // TODO: Fetch actual stats from the API
    const fetchStats = async () => {
      try {
        // Placeholder for API calls
        setStats({
          offPlanCount: 12,
          buyCount: 45,
          rentCount: 30,
          commercialCount: 15,
          inquiryCount: 8,
          requestCount: 5,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  const quickLinks = [
    { href: '/admin/add-buy-property', label: 'Add Buy Property', icon: '🏠', color: 'bg-green-500' },
    { href: '/admin/add-rent-property', label: 'Add Rent Property', icon: '🔑', color: 'bg-yellow-500' },
    { href: '/admin/add-commercial-property', label: 'Add Commercial Property', icon: '🏢', color: 'bg-purple-500' },
  ];

  const statCards = [
    { label: 'Buy Properties', value: stats.buyCount, color: 'bg-green-100 text-green-800' },
    { label: 'Rent Properties', value: stats.rentCount, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Commercial Properties', value: stats.commercialCount, color: 'bg-purple-100 text-purple-800' },
    { label: 'Total Inquiries', value: stats.inquiryCount, color: 'bg-pink-100 text-pink-800' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className={`p-6 rounded-lg ${stat.color}`}>
            <h2 className="text-2xl font-bold">{stat.value}</h2>
            <p className="text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{action.icon}</span>
              <span>{action.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 