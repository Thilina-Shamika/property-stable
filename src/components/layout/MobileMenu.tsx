'use client';

import Link from 'next/link';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-64 bg-[#1b2734] p-6">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-8 flex flex-col space-y-4">
          <Link 
            href="/buy" 
            className="text-white hover:text-white/80 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            BUY
          </Link>
          <Link 
            href="/rent" 
            className="text-white hover:text-white/80 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            RENT
          </Link>
          <Link 
            href="/commercial" 
            className="text-white hover:text-white/80 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            COMMERCIAL
          </Link>
          <Link 
            href="/off-plan" 
            className="text-white hover:text-white/80 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            OFF PLAN
          </Link>
          <Link 
            href="/communities" 
            className="text-white hover:text-white/80 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            COMMUNITIES
          </Link>
          <Link 
            href="/media-center" 
            className="text-white hover:text-white/80 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            MEDIA CENTER
          </Link>
          <Link 
            href="/list-property" 
            className="text-white hover:text-white/80 text-sm font-medium transition-colors"
            onClick={onClose}
          >
            LIST YOUR PROPERTY
          </Link>
          <Link 
            href="/contact" 
            className="bg-white text-[#1b2734] px-4 py-2 rounded text-sm font-medium hover:bg-white/90 transition-colors text-center"
            onClick={onClose}
          >
            CONTACT US
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu; 