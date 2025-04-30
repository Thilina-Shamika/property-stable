import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 w-64 fixed h-full">
        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            Dashboard
          </Link>
          
          {/* Properties Section */}
          <div className="space-y-2">
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-600 uppercase">Properties</h3>
            
            {/* Off-Plan Properties */}
            <div className="border-l-2 border-gray-200 ml-2">
              <h4 className="px-4 py-2 text-sm font-medium text-gray-600">Off-Plan</h4>
              <div className="space-y-1 ml-2">
                <Link 
                  href="/dashboard/properties/off-plan/add" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Add New
                </Link>
                <Link 
                  href="/dashboard/properties/off-plan/manage" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Manage Properties
                </Link>
              </div>
            </div>

            {/* Buy Properties */}
            <div className="border-l-2 border-gray-200 ml-2">
              <h4 className="px-4 py-2 text-sm font-medium text-gray-600">Buy</h4>
              <div className="space-y-1 ml-2">
                <Link 
                  href="/dashboard/properties/buy/add" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Add New
                </Link>
                <Link 
                  href="/dashboard/properties/buy/manage" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Manage Properties
                </Link>
              </div>
            </div>

            {/* Rent Properties */}
            <div className="border-l-2 border-gray-200 ml-2">
              <h4 className="px-4 py-2 text-sm font-medium text-gray-600">Rent</h4>
              <div className="space-y-1 ml-2">
                <Link 
                  href="/dashboard/properties/rent/add" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Add New
                </Link>
                <Link 
                  href="/dashboard/properties/rent/manage" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Manage Properties
                </Link>
              </div>
            </div>

            {/* Commercial Properties */}
            <div className="border-l-2 border-gray-200 ml-2">
              <h4 className="px-4 py-2 text-sm font-medium text-gray-600">Commercial</h4>
              <div className="space-y-1 ml-2">
                <Link 
                  href="/dashboard/properties/commercial/add" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Add New
                </Link>
                <Link 
                  href="/dashboard/properties/commercial/manage" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Manage Properties
                </Link>
              </div>
            </div>
          </div>

          {/* Other Sections */}
          <div className="space-y-2">
            <h3 className="px-4 py-2 text-sm font-semibold text-gray-600 uppercase">Other</h3>
            <Link 
              href="/dashboard/inquiries" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Inquiries
            </Link>
            <Link 
              href="/dashboard/property-requests" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              Property Requests
            </Link>
          </div>
        </div>
      </nav>
      <main className="ml-64 p-6">{children}</main>
    </div>
  );
} 