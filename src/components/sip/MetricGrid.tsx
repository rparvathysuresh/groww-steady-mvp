import React from 'react';
import { ComputedMetrics } from '@/lib/calc/types';
import { formatINR } from '@/lib/utils/format';
import { AccessibleBadge } from '../shared/AccessibleBadge';
import { HelpCircle, Info } from 'lucide-react';
import { CoachmarkDot } from '../shared/CoachmarkDot';

interface MetricGridProps {
  metrics: ComputedMetrics;
  onJargonClick?: (term: string) => void;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ metrics, onJargonClick }) => {
  const {
    currentValue,
    totalInvested,
    absoluteReturn,
    returnPercentage,
    returnState,
    averageNav,
    totalUnits,
    xirr,
    isShortTenure,
  } = metrics;

  return (
    <div className="bg-surface-card rounded-2xl p-4 border border-border-subtle shadow-xs space-y-4 scroll-mt-24">
      {/* Returns Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <span className="text-xs text-gray-400">Total Returns</span>
          <div className="mt-1">
            <AccessibleBadge
              amount={absoluteReturn}
              percentage={returnPercentage}
              state={returnState}
              size="md"
            />
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            <span className="text-xs text-gray-400">Annualised XIRR</span>
            <button
              onClick={() => onJargonClick?.('XIRR')}
              data-tour="jargon-xirr"
              className="text-gray-400 hover:text-navy relative inline-flex items-center"
              title="Learn about XIRR"
            >
              <HelpCircle size={12} />
              <CoachmarkDot id="coachmark-jargon-xirr" label="Tip: Tap XIRR for definition" position="top-right" />
            </button>
          </div>
          <div
            className={`text-base font-bold mt-0.5 ${
              xirr >= 0 ? 'text-[#00B386]' : 'text-[#EB5757]'
            }`}
          >
            {xirr > 0 ? `+${xirr}%` : `${xirr}%`}
          </div>
        </div>
      </div>

      {/* Short Tenure Warning Notice (EDGE-MATH-002) */}
      {isShortTenure && (
        <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-xl text-[11px] text-amber-900 leading-snug">
          <Info size={14} className="text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Short-period XIRR:</strong> Annualised standard formula exaggerates short-term
            swings (under 90 days). Your actual rupee return is{' '}
            <strong>{formatINR(absoluteReturn, { sign: true })}</strong>.
          </span>
        </div>
      )}

      {/* Grid of Units & NAV */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Average NAV</span>
            <button
              onClick={() => onJargonClick?.('NAV')}
              className="text-gray-400 hover:text-navy"
              title="What is NAV?"
            >
              <HelpCircle size={11} />
            </button>
          </div>
          <div className="text-sm font-bold text-navy mt-1">₹{averageNav.toFixed(2)}</div>
        </div>

        <div className="bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Total Units</span>
            <button
              onClick={() => onJargonClick?.('Units')}
              className="text-gray-400 hover:text-navy"
              title="What are units?"
            >
              <HelpCircle size={11} />
            </button>
          </div>
          <div className="text-sm font-bold text-navy mt-1">{totalUnits.toFixed(4)}</div>
        </div>
      </div>
    </div>
  );
};

