import React from 'react';
import { ComputedMetrics } from '@/lib/calc/types';
import { formatINR } from '@/lib/utils/format';
import { AccessibleBadge } from '../shared/AccessibleBadge';

interface PortfolioSummaryProps {
  metrics: ComputedMetrics;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ metrics }) => {
  const { currentValue, totalInvested, absoluteReturn, returnPercentage, returnState } = metrics;

  // Simulated 1-day change based on recent NAV move
  const oneDayPercent = metrics.isDipState ? -0.42 : 0.35;
  const oneDayRupees = (currentValue * oneDayPercent) / 100;

  return (
    <div className="bg-surface-card rounded-2xl p-5 border border-border-subtle shadow-xs space-y-4">
      <div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Current Value
        </span>
        <div className="text-3xl font-extrabold text-navy tracking-tight mt-0.5">
          {formatINR(currentValue)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
        <div>
          <span className="text-xs text-gray-500">Total Invested</span>
          <div className="text-sm font-bold text-navy mt-1 h-6 flex items-center">
            {formatINR(totalInvested)}
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-500">Total Returns</span>
          <div className="mt-1 h-6 flex items-center">
            <AccessibleBadge
              amount={absoluteReturn}
              percentage={returnPercentage}
              state={returnState}
              size="sm"
              showLabel={false}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100/60">
        <span>1-Day Return</span>
        <AccessibleBadge
          amount={oneDayRupees}
          percentage={oneDayPercent}
          size="sm"
          showLabel={false}
        />
      </div>
    </div>
  );
};

