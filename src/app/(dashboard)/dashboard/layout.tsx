import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/properties/buy/add">Add Buy Property</Link>
        <Link href="/dashboard/properties/rent/add">Add Rent Property</Link>
        <Link href="/dashboard/properties/commercial/add">Add Commercial Property</Link>
        <Link href="/dashboard/properties/off-plan/add">Add Off Plan</Link>
        <Link href="/dashboard/inquiries">Inquiries</Link>
        <Link href="/dashboard/property-requests">List Property Requests</Link>
      </nav>
      <main>{children}</main>
    </div>
  );
} 