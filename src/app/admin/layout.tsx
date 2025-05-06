'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/add-buy-property', label: 'Add Buy', icon: '🏠' },
    { href: '/admin/manage-buy-property', label: 'Manage Buy', icon: '📋' },
    { href: '/admin/add-commercial-property', label: 'Add Commercial', icon: '🏢' },
    { href: '/admin/manage-commercial', label: 'Manage Commercial', icon: '📋' },
    { href: '/admin/add-off-plan', label: 'Add Off-Plan', icon: '🏗️' },
    { href: '/admin/manage-off-plan', label: 'Manage Off-Plan', icon: '📋' },
    { href: '/admin/listed-properties', label: 'Listed Properties', icon: '📝' },
    { href: '/admin/mortgage-consulting', label: 'Mortgage Consulting', icon: '💰' },
    { href: '/admin/inquiries', label: 'Inquiries', icon: '📧' },
    { href: '/admin/property-requests', label: 'Property Requests', icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          </div>
          <nav className="p-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 mb-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
} 