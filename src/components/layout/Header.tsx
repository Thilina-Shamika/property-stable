'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { colors } from '@/constants/theme';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getHeaderStyle = () => {
    if (isHomePage) {
      return isScrolled
        ? 'bg-[#1b2734]/80 backdrop-blur-md'
        : 'bg-transparent';
    }
    return 'bg-[#4a4f5a]/80 backdrop-blur-md';
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${getHeaderStyle()}`}>
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.webp"
                alt="Elite Destination Property"
                width={180}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                href="/buy" 
                className="text-white hover:text-white/80 text-sm font-medium transition-colors"
              >
                BUY
              </Link>
              <Link 
                href="/commercial" 
                className="text-white hover:text-white/80 text-sm font-medium transition-colors"
              >
                COMMERCIAL
              </Link>
              <Link 
                href="/off-plan" 
                className="text-white hover:text-white/80 text-sm font-medium transition-colors"
              >
                OFF PLAN
              </Link>
              <Link 
                href="/communities" 
                className="text-white hover:text-white/80 text-sm font-medium transition-colors"
              >
                COMMUNITIES
              </Link>
              <Link 
                href="/media-center" 
                className="text-white hover:text-white/80 text-sm font-medium transition-colors"
              >
                MEDIA CENTER
              </Link>
              <Link 
                href="/list-property" 
                className="text-white hover:text-white/80 text-sm font-medium transition-colors"
              >
                LIST YOUR PROPERTY
              </Link>
              <Link 
                href="/contact" 
                className="bg-white text-[#1b2734] px-4 py-2 rounded text-sm font-medium hover:bg-white/90 transition-colors"
              >
                CONTACT US
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Header; 