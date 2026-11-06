'use client';

import React from 'react';
import { MobileFrame } from '@/components/shell/MobileFrame';
import { PortfolioSummary } from '@/components/dashboard/PortfolioSummary';
import { SteadyViewLite } from '@/components/dashboard/SteadyViewLite';
import { ActiveSIPCard } from '@/components/dashboard/ActiveSIPCard';
import { useSessionStore } from '@/lib/store/sessionStore';
import { computePortfolioMetrics } from '@/lib/calc/engine';
import { APP_CONFIG } from '@/lib/config';

export default function DashboardPage() {
  const { portfolio } = useSessionStore();
  const metrics = computePortfolioMetrics(portfolio);

  return (
    <MobileFrame>
      <div className="p-4 space-y-4">
        {/* Top greeting & scenario persona pill */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 font-medium">Welcome back,</span>
            <h1 className="text-lg font-bold text-navy">{portfolio.personaName}</h1>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-light text-primary-dark border border-primary/20">
            {portfolio.scenarioName.split(':')[0]}
          </span>
        </div>

        {/* 1. Main Portfolio Valuation Card */}
        <PortfolioSummary metrics={metrics} />

        {/* 2. Steady View Lite: Deposits vs Market breakdown */}
        <SteadyViewLite metrics={metrics} monthsInvested={portfolio.instalments.length} />

        {/* 3. Active SIP Card */}
        <ActiveSIPCard portfolio={portfolio} metrics={metrics} />

        {/* Standing Legal Disclaimer */}
        <footer className="pt-4 text-center">
          <p className="text-[10px] text-gray-400 leading-normal px-2">
            {APP_CONFIG.STANDING_DISCLOSURE}
          </p>
        </footer>
      </div>
    </MobileFrame>
  );
}

