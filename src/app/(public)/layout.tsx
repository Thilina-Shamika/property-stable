import React from 'react';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
} 