'use client';

import Hero from '@/components/home/Hero';
import PremiumProjects from '@/components/home/PremiumProjects';
import Mortgage from '@/components/home/Mortgage';
import LatestLaunches from '@/components/home/LatestLaunches';
import FullWidthSection from '@/components/home/FullWidthSection';
import Counter from '@/components/home/Counter';
import HomeForm from '@/components/home/HomeForm';
import MediaCenter from '@/components/home/MediaCenter';

export default function Home() {
  return (
    <main>
      <Hero />
      <PremiumProjects />
      <Mortgage />
      <LatestLaunches />
      <FullWidthSection />
      <Counter />
      <HomeForm />
      <MediaCenter />
    </main>
  );
} 