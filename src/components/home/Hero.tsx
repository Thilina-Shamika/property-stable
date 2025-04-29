'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const Hero = () => {
  const [activeTab, setActiveTab] = useState('buy');

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero_bg.jpeg"
          alt="Luxury Real Estate"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
          quality={100}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-8 text-white">
            {/* First row */}
            <div className="w-full max-w-3xl p-6">
            </div>
            {/* Second row - Header */}
            <div className="w-full max-w-3xl p-6 text-center">
              <h1 className="text-[45px] font-bold text-white leading-tight">
                Journey To Your Perfect<br />
                Real Estate Deal
              </h1>
              <p className="mt-4 text-sm text-white/80 max-w-2xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            {/* Third row - Search Filters */}
            <div className="w-full max-w-6xl">
              {/* Tabs */}
              <div className="flex bg-[#f5f5f5] rounded-t-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`px-8 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'buy'
                      ? 'bg-white text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setActiveTab('rent')}
                  className={`px-8 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'rent'
                      ? 'bg-white text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  RENT
                </button>
                <button
                  onClick={() => setActiveTab('commercial')}
                  className={`px-8 py-4 text-sm font-medium transition-colors ${
                    activeTab === 'commercial'
                      ? 'bg-white text-gray-800'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  COMMERCIAL
                </button>
                <Link
                  href="/off-plan"
                  className="px-8 py-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  OFF PLAN
                </Link>
                <Link
                  href="/list-property"
                  className="px-8 py-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  LIST YOUR PROPERTY
                </Link>
              </div>

              {/* Filter Section */}
              <div className="bg-white rounded-b-lg p-4 flex items-center gap-4">
                <select className="flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none">
                  <option value="">Select Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="penthouse">Penthouse</option>
                </select>

                <select className="flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none">
                  <option value="">Select Bedrooms</option>
                  <option value="studio">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>

                <select className="flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none">
                  <option value="">Select Min Price</option>
                  <option value="100000">100,000</option>
                  <option value="200000">200,000</option>
                  <option value="500000">500,000</option>
                  <option value="1000000">1,000,000</option>
                </select>

                <select className="flex-1 px-4 py-3 bg-transparent text-gray-600 text-sm focus:outline-none">
                  <option value="">Select Max Price</option>
                  <option value="200000">200,000</option>
                  <option value="500000">500,000</option>
                  <option value="1000000">1,000,000</option>
                  <option value="2000000">2,000,000+</option>
                </select>

                <button className="px-8 py-3 bg-[#1b2734] text-white rounded-full font-medium text-sm hover:bg-[#2c3e50] transition-colors">
                  SEARCH PROPERTIES
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 