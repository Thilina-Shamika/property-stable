import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
} 