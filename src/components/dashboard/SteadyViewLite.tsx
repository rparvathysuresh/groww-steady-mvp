import React from 'react';
import { formatINR } from '@/lib/utils/format';
import { ComputedMetrics } from '@/lib/calc/types';
import { ShieldCheck, Calendar } from 'lucide-react';

interface SteadyViewLiteProps {
  metrics: ComputedMetrics;
  monthsInvested: number;
}

export const SteadyViewLite: React.FC<SteadyViewLiteProps> = ({ metrics, monthsInvested }) => {
  const { totalInvested, currentValue, absoluteReturn, isDipState } = metrics;

  // Percentage contribution of actual deposits vs market value
  const depositShare = currentValue > 0 ? Math.min(100, (totalInvested / currentValue) * 100) : 100;

  return (
    <div className="bg-surface-card rounded-2xl p-4 border border-border-subtle shadow-xs space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-semibold text-navy uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-primary-dark" />
          SIP Progress Overview
        </span>
        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
          <Calendar size={11} />
          {monthsInvested} {monthsInvested === 1 ? 'Month' : 'Months'} Invested
        </span>
      </div>

      {/* Visual Composition Bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${Math.min(100, depositShare)}%` }}
            className="bg-navy h-full transition-all duration-500"
            title={`Your Deposits: ${formatINR(totalInvested)}`}
          />
          {!isDipState && (
            <div
              style={{ width: `${Math.max(0, 100 - depositShare)}%` }}
              className="bg-[#00B386] h-full transition-all duration-500"
              title={`Market Growth: ${formatINR(absoluteReturn)}`}
            />
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-navy inline-block" />
            <span>Your Deposits:</span>
            <strong className="text-navy">{formatINR(totalInvested)}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                isDipState ? 'bg-[#EB5757]' : 'bg-[#00B386]'
              }`}
            />
            <span>Market Effect:</span>
            <strong className={`whitespace-nowrap ${isDipState ? 'text-[#EB5757]' : 'text-[#00B386]'}`}>
              {formatINR(absoluteReturn, { sign: true })}
            </strong>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed bg-gray-50 p-2 rounded-lg border border-gray-100">
        Early SIP portfolio values are primarily composed of the direct deposits you have made so far.
        Market value fluctuates with daily NAV.
      </p>
    </div>
  );
};

