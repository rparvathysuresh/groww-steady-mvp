import React from 'react';
import Link from 'next/link';
import { ChevronRight, CalendarClock, ShieldCheck } from 'lucide-react';
import { PortfolioState, ComputedMetrics } from '@/lib/calc/types';
import { formatINR, formatDateShort } from '@/lib/utils/format';

interface ActiveSIPCardProps {
  portfolio: PortfolioState;
  metrics: ComputedMetrics;
}

export const ActiveSIPCard: React.FC<ActiveSIPCardProps> = ({ portfolio, metrics }) => {
  const isSkipped = portfolio.mandateStatus === 'SKIPPED';
  const isSteppedDown = portfolio.mandateStatus === 'STEPPED_DOWN';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Active SIPs (1)
        </h2>
        <span className="text-[11px] text-primary-dark font-medium">Autopay Active</span>
      </div>

      <Link
        href={`/sip/${portfolio.id}`}
        data-tour="active-sip"
        className="block bg-surface-card rounded-2xl p-4 border border-border-subtle shadow-xs hover:border-primary/40 hover:shadow-sm transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-dark inline-block shrink-0" />
              <h3 className="font-bold text-sm text-navy">{portfolio.schemeName}</h3>
            </div>

            <p className="text-xs text-gray-500">
              {formatINR(portfolio.monthlyAmount)} / month • {portfolio.instalments.length} instalments completed
            </p>
          </div>

          <ChevronRight size={18} className="text-gray-400 shrink-0 mt-1" />
        </div>

        {/* Status Pills if mandate adjusted */}
        {isSkipped && (
          <div className="mt-3 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-1.5">
            <CalendarClock size={13} />
            <span>Upcoming instalment skipped. Resumes next cycle.</span>
          </div>
        )}

        {isSteppedDown && (
          <div className="mt-3 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium flex items-center gap-1.5">
            <CalendarClock size={13} />
            <span>
              Stepped down to {formatINR(portfolio.stepDownConfig?.reducedAmount || 500)} for{' '}
              {portfolio.stepDownConfig?.remainingCycles || 1} more cycles.
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100 text-xs">
          <div>
            <span className="text-gray-400">Current Value</span>
            <div className="font-bold text-navy mt-0.5">{formatINR(metrics.currentValue)}</div>
          </div>
          <div className="text-right">
            <span className="text-gray-400">Next Debit</span>
            <div className="font-semibold text-navy mt-0.5 flex items-center justify-end gap-1">
              <CalendarClock size={12} className="text-primary-dark" />
              <span>{formatDateShort(portfolio.nextDebitDate)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

