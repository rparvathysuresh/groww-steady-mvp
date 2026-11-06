'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LineChart, PieChart, Compass, User } from 'lucide-react';
import { useSessionStore } from '@/lib/store/sessionStore';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { showInactiveNotice } = useSessionStore();

  const isMutualFundsActive = pathname.startsWith('/app') || pathname.startsWith('/sip');

  const handleInactiveTab = (tabName: string) => {
    showInactiveNotice(tabName);
  };

  return (
    <nav
      data-testid="bottom-nav"
      className="w-full bg-surface-card border-t border-border-subtle sticky bottom-0 z-40 max-w-mobile-frame mx-auto"
      aria-label="App Navigation"
    >
      <div className="grid grid-cols-4 h-14">
        {/* Stocks Tab (Out of prototype) */}
        <button
          onClick={() => handleInactiveTab('Stocks')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <LineChart size={18} />
          <span className="text-[10px] font-medium">Stocks</span>
        </button>

        {/* Mutual Funds Tab (Active Prototype Focus) */}
        <Link
          href="/app"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isMutualFundsActive ? 'text-primary-dark font-semibold' : 'text-gray-500 hover:text-navy'
          }`}
        >
          <PieChart size={18} className={isMutualFundsActive ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px]">Mutual Funds</span>
        </Link>

        {/* Explore Tab (Out of prototype) */}
        <button
          onClick={() => handleInactiveTab('Explore')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Compass size={18} />
          <span className="text-[10px] font-medium">Explore</span>
        </button>

        {/* Profile Tab (Out of prototype) */}
        <button
          onClick={() => handleInactiveTab('Profile')}
          className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <User size={18} />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};

