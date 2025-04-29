'use client';

import Hero from '@/components/home/Hero';
import Header from '@/components/layout/Header';
import PremiumProjects from '@/components/home/PremiumProjects';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <PremiumProjects />
    </main>
  );
} 