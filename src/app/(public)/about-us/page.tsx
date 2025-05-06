import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900">About Us Page</h1>
      </div>
      <Footer />
    </main>
  );
} 