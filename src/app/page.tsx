'use client';

import Hero from '@/components/home/Hero';
import Header from '@/components/layout/Header';
import PremiumProjects from '@/components/home/PremiumProjects';
import Mortgage from '@/components/home/Mortgage';
import LatestLaunches from '@/components/home/LatestLaunches';
import FullWidthSection from '@/components/home/FullWidthSection';
import Counter from '@/components/home/Counter';
import HomeForm from '@/components/home/HomeForm';

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <PremiumProjects />
      <Mortgage />
      <LatestLaunches />
      <FullWidthSection />
      <Counter />
      <HomeForm />
    </main>
  );
} 