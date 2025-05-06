'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    buyCount: 0,
    commercialCount: 0,
    inquiryCount: 0,
    mortgageCount: 0,
    propertyRequestCount: 0,
    listedPropertiesCount: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [buyRes, commercialRes, inquiriesRes, mortgageRes, propertyReqRes, listedPropsRes] = await Promise.all([
          fetch('/api/properties/buy?showAll=true'),
          fetch('/api/properties/commercial?showAll=true'),
          fetch('/api/property-inquiries'),
          fetch('/api/mortgage-consulting'),
          fetch('/api/property-inquiries'), // property requests use same endpoint
          fetch('/api/valuations'),
        ]);
        const [buy, commercial, inquiries, mortgage, propertyReq, listedProps] = await Promise.all([
          buyRes.json(),
          commercialRes.json(),
          inquiriesRes.json(),
          mortgageRes.json(),
          propertyReqRes.json(),
          listedPropsRes.json(),
        ]);
        setStats({
          buyCount: Array.isArray(buy) ? buy.length : 0,
          commercialCount: Array.isArray(commercial) ? commercial.length : 0,
          inquiryCount: Array.isArray(inquiries) ? inquiries.length : 0,
          mortgageCount: Array.isArray(mortgage) ? mortgage.length : 0,
          propertyRequestCount: Array.isArray(propertyReq) ? propertyReq.length : 0,
          listedPropertiesCount: Array.isArray(listedProps) ? listedProps.length : 0,
          loading: false,
        });
      } catch (error) {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Buy Properties',
      value: stats.buyCount,
      color: 'bg-green-100 text-green-800',
      href: '/admin/manage-buy-property',
    },
    {
      label: 'Commercial Properties',
      value: stats.commercialCount,
      color: 'bg-purple-100 text-purple-800',
      href: '/admin/manage-commercial',
    },
    {
      label: 'Total Inquiries',
      value: stats.inquiryCount,
      color: 'bg-pink-100 text-pink-800',
      href: '/admin/inquiries',
    },
    {
      label: 'Mortgage Requests',
      value: stats.mortgageCount,
      color: 'bg-blue-100 text-blue-800',
      href: '/admin/mortgage-consulting',
    },
    {
      label: 'Property Requests',
      value: stats.propertyRequestCount,
      color: 'bg-yellow-100 text-yellow-800',
      href: '/admin/property-requests',
    },
    {
      label: 'Listed Properties',
      value: stats.listedPropertiesCount,
      color: 'bg-orange-100 text-gray-800',
      href: '/admin/listed-properties',
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.href}>
            <div className={`p-6 rounded-lg cursor-pointer hover:shadow-md transition ${stat.color}`}>
              <h2 className="text-2xl font-bold">{stat.value}</h2>
              <p className="text-sm">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 