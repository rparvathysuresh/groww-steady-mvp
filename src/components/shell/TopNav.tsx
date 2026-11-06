'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, RotateCcw, User } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';
import { useSessionStore } from '@/lib/store/sessionStore';

interface TopNavProps {
  title?: string;
  showBack?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ title, showBack }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { portfolio, resetDemo } = useSessionStore();

  const isFundDetail = pathname.startsWith('/sip/');
  const shouldShowBack = showBack !== undefined ? showBack : isFundDetail;

  return (
    <header className="w-full bg-surface-card border-b border-border-subtle px-4 py-3 flex items-center justify-between sticky top-[29px] z-40">
      <div className="flex items-center gap-3">
        {shouldShowBack ? (
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 text-gray-600 hover:text-navy rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
        ) : null}

        <div>
          {title ? (
            <h1 className="text-base font-semibold text-navy leading-tight">{title}</h1>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary-dark tracking-tight">
                {APP_CONFIG.WORDMARK}
              </span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                Mutual Funds
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Reset Demo State Button */}
        <button
          onClick={() => {
            resetDemo();
            alert('Session state reset to baseline.');
          }}
          title="Reset demo session"
          className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-navy px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>

        {/* Persona Pill */}
        <Link
          href="/"
          title="Switch Scenario Persona"
          className="flex items-center gap-1 text-xs font-medium text-navy bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full transition-colors"
        >
          <User size={12} className="text-primary-dark" />
          <span className="max-w-[70px] truncate">{portfolio.personaName}</span>
        </Link>
      </div>
    </header>
  );
};

