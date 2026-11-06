'use client';

import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { PortfolioState, ComputedMetrics } from '@/lib/calc/types';
import { STATIC_FALLBACKS } from '@/lib/fallbacks/templates';

interface JargonSheetProps {
  term: string | null;
  portfolio: PortfolioState;
  metrics: ComputedMetrics;
  onClose: () => void;
}

export const JargonSheet: React.FC<JargonSheetProps> = ({
  term,
  portfolio,
  metrics,
  onClose,
}) => {
  if (!term) return null;

  const getPersonalizedExplanation = () => {
    switch (term.toUpperCase()) {
      case 'XIRR':
        return `XIRR (Extended Internal Rate of Return) measures annualized returns across dated cash flows. Because your SIP has run for only ${portfolio.instalments.length} months (${portfolio.instalments.length * 30} days), short-term price variations get annualized mathematically, which is why your XIRR currently looks like ${metrics.xirr}%. Over a 3 to 5-year horizon, XIRR stabilizes to reflect true compounding.`;
      case 'NAV':
        return `NAV (Net Asset Value) is the daily market price of one fund unit (currently ₹${portfolio.latestNav.toFixed(
          2
        )}). When NAV dips, your fixed ₹${portfolio.monthlyAmount} deposit buys more units for the same money.`;
      case 'UNITS':
        return `Units are fractions of the fund that you own permanently. You currently own ${metrics.totalUnits} units in your folio. Market valuation moves up and down daily, but your unit count never decreases unless you redeem them.`;
      case 'EXPENSERATIO':
        return STATIC_FALLBACKS.JARGON_DEFINITIONS.ExpenseRatio;
      case 'AUTOPAY':
        return STATIC_FALLBACKS.JARGON_DEFINITIONS.Autopay;
      default:
        return 'Mutual fund performance term.';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-surface-card rounded-t-3xl sm:rounded-2xl p-5 max-w-sm w-full shadow-xl border border-border-subtle space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-navy">
            <BookOpen size={16} className="text-primary-dark" />
            <h4 className="font-bold text-sm">{term} Explained</h4>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
          {getPersonalizedExplanation()}
        </p>

        <div className="pt-1">
          <button
            onClick={onClose}
            className="w-full bg-navy hover:bg-navy-dark text-white font-medium text-xs py-2.5 rounded-xl transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};

