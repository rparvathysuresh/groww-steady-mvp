import React from 'react';
import { PortfolioState } from '@/lib/calc/types';
import { formatINR, formatDateShort } from '@/lib/utils/format';
import { ShieldCheck, Calendar, Zap, AlertCircle, PauseCircle, SlidersHorizontal } from 'lucide-react';

interface SIPHeaderProps {
  portfolio: PortfolioState;
}

export const SIPHeader: React.FC<SIPHeaderProps> = ({ portfolio }) => {
  const isCancelled = portfolio.mandateStatus === 'CANCELLED';
  const isSkipped = portfolio.mandateStatus === 'SKIPPED';
  const isSteppedDown = portfolio.mandateStatus === 'STEPPED_DOWN';

  return (
    <div className="bg-surface-card rounded-2xl p-4 border border-border-subtle shadow-xs space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">
            Index Mutual Fund
          </span>
          <h2 className="text-lg font-bold text-navy mt-0.5">{portfolio.schemeName}</h2>
          <p className="text-xs text-gray-500">
            Monthly Autopay • Folio #SAMPLE-84920
          </p>
        </div>

        {/* Dynamic Status Badge */}
        {isCancelled ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
            <AlertCircle size={10} className="text-rose-600" />
            Mandate Cancelled
          </span>
        ) : isSkipped ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
            <PauseCircle size={10} className="text-amber-600" />
            Skipped (1 Mo)
          </span>
        ) : isSteppedDown ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shrink-0">
            <SlidersHorizontal size={10} className="text-blue-600" />
            Stepped Down
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
            <Zap size={10} className="fill-emerald-600 text-emerald-600" />
            Autopay Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs">
        <div>
          <span className="text-gray-400">Monthly Amount</span>
          {isCancelled ? (
            <div className="font-bold text-gray-400 mt-0.5">₹0 (Stopped)</div>
          ) : isSteppedDown && portfolio.stepDownConfig ? (
            <div className="font-bold text-navy mt-0.5 flex items-center gap-1.5">
              <span>{formatINR(portfolio.stepDownConfig.reducedAmount)}</span>
              <span className="text-[10px] text-gray-400 line-through">
                {formatINR(portfolio.monthlyAmount)}
              </span>
            </div>
          ) : isSkipped ? (
            <div className="font-bold text-amber-700 mt-0.5">
              ₹0 <span className="text-[10px] text-gray-400 font-normal">(this month)</span>
            </div>
          ) : (
            <div className="font-bold text-navy mt-0.5">{formatINR(portfolio.monthlyAmount)}</div>
          )}
        </div>

        <div>
          <span className="text-gray-400">
            {isCancelled ? 'Status' : isSkipped ? 'Resumes On' : 'Next Instalment'}
          </span>
          <div className="font-semibold text-navy mt-0.5 flex items-center gap-1">
            <Calendar size={12} className="text-primary-dark" />
            <span>
              {isCancelled ? 'No future debits' : formatDateShort(portfolio.nextDebitDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

