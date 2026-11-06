'use client';

import React, { useState } from 'react';
import { CalendarClock, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PortfolioState } from '@/lib/calc/types';
import { formatINR, formatDateShort } from '@/lib/utils/format';
import { canModifyMandate, applySkipMonth } from '@/lib/flex/engine';
import { useSessionStore } from '@/lib/store/sessionStore';

interface SkipStepSheetProps {
  portfolio: PortfolioState;
  onClose: () => void;
  onSuccess: () => void;
}

export const SkipStepSheet: React.FC<SkipStepSheetProps> = ({
  portfolio,
  onClose,
  onSuccess,
}) => {
  const { updatePortfolio, logAuditEvent } = useSessionStore();
  const [error, setError] = useState<string | null>(null);

  const lockout = canModifyMandate(portfolio.nextDebitDate);

  const handleConfirmSkip = () => {
    try {
      const { updatedState, auditEvent } = applySkipMonth(portfolio);
      updatePortfolio(() => updatedState);
      logAuditEvent(auditEvent.action, auditEvent.details);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Unable to skip this cycle.');
    }
  };

  return (
    <div className="space-y-4 text-navy">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800">
          <CalendarClock size={18} />
        </div>
        <div>
          <h3 className="font-bold text-sm">Skip Upcoming Instalment</h3>
          <p className="text-xs text-gray-500">Take a 1-month break without cancelling</p>
        </div>
      </div>

      {/* Lockout Warning if within 72 hours (EDGE-FLEX-001) */}
      {!lockout.allowed && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <span>{lockout.reason}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          {error}
        </div>
      )}

      {/* Schedule Summary */}
      <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Upcoming Debit Date:</span>
          <strong className="text-navy">{formatDateShort(portfolio.nextDebitDate)}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Payment for this Cycle:</span>
          <strong className="text-emerald-700">₹0 (Skipped)</strong>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-gray-500">Automatic Resumption:</span>
          <strong className="text-navy">Next month ({formatINR(portfolio.monthlyAmount)})</strong>
        </div>
      </div>

      {/* Safe Guarantee Points */}
      <div className="space-y-1.5 text-xs text-gray-600 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
        <div className="flex items-start gap-1.5">
          <CheckCircle2 size={13} className="text-primary-dark shrink-0 mt-0.5" />
          <span>All units already purchased remain invested in your account.</span>
        </div>
        <div className="flex items-start gap-1.5">
          <CheckCircle2 size={13} className="text-primary-dark shrink-0 mt-0.5" />
          <span>Your bank mandate remains active and resumes on schedule.</span>
        </div>
      </div>

      {/* Equal-Prominence CTAs */}
      <div className="space-y-2 pt-2">
        <button
          onClick={handleConfirmSkip}
          disabled={!lockout.allowed}
          className="w-full bg-navy hover:bg-navy-dark disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors"
        >
          Confirm 1-Month Skip
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-navy font-medium text-xs py-2.5 rounded-xl transition-colors"
        >
          Keep As Is
        </button>
      </div>
    </div>
  );
};

