'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, SlidersHorizontal, CalendarClock, X } from 'lucide-react';
import { PortfolioState } from '@/lib/calc/types';
import { formatINR } from '@/lib/utils/format';
import { applyCancellation } from '@/lib/flex/engine';
import { useSessionStore } from '@/lib/store/sessionStore';

interface CancelSheetProps {
  isOpen: boolean;
  portfolio: PortfolioState;
  onClose: () => void;
  onOpenFlexSkip: () => void;
  onOpenFlexStepDown: () => void;
  onCancelled: () => void;
}

export const CancelSheet: React.FC<CancelSheetProps> = ({
  isOpen,
  portfolio,
  onClose,
  onOpenFlexSkip,
  onOpenFlexStepDown,
  onCancelled,
}) => {
  const { updatePortfolio, logAuditEvent } = useSessionStore();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const totalUnits = portfolio.instalments
    .reduce((sum, i) => sum + i.unitsPurchased, 0)
    .toFixed(4);

  const handleFinalCancel = () => {
    const { updatedState, auditEvent } = applyCancellation(portfolio);
    updatePortfolio(() => updatedState);
    logAuditEvent(auditEvent.action, auditEvent.details);
    onCancelled();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-surface-card rounded-t-3xl sm:rounded-2xl max-w-sm w-full shadow-2xl border border-border-subtle p-5 space-y-4 text-navy">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Cancel Systematic Investment Plan</h3>
              <p className="text-[11px] text-gray-400">Factual information before you decide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. What Cancelling Does (Factual & Non-Coercive, EDGE-CANCEL-001) */}
        <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 space-y-2 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-primary-dark shrink-0 mt-0.5" />
            <span>
              <strong>Future debits stop:</strong> Your bank account will not be debited for future
              monthly payments.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-primary-dark shrink-0 mt-0.5" />
            <span>
              <strong>Your units remain invested:</strong> Your existing{' '}
              <strong className="text-navy">{totalUnits} units</strong> stay safely in your account
              and continue to move with market prices until you choose to redeem them.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 size={14} className="text-primary-dark shrink-0 mt-0.5" />
            <span>
              <strong>Restart anytime:</strong> You can start a new SIP whenever you wish, subject
              to scheme rules.
            </span>
          </div>
        </div>

        {/* 2. Equal-Weight Lighter Alternatives (Steady Flex) */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            Lighter Options (Keep Your Mandate)
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenFlexSkip();
              }}
              className="p-2.5 rounded-xl border border-primary/30 bg-primary-light/50 hover:bg-primary-light text-left transition-all space-y-1"
            >
              <div className="flex items-center gap-1.5 text-primary-dark font-bold text-xs">
                <CalendarClock size={13} />
                <span>Skip 1 Month</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-tight">
                Pause this debit; resumes automatically next cycle.
              </p>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenFlexStepDown();
              }}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-50 text-left transition-all space-y-1"
            >
              <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
                <SlidersHorizontal size={13} />
                <span>Step Down</span>
              </div>
              <p className="text-[10px] text-gray-600 leading-tight">
                Lower amount to ₹500 temporarily.
              </p>
            </button>
          </div>
        </div>

        {/* 3. Anti-Coercion Non-Dark Pattern Cancel Button (EDGE-CANCEL-002) */}
        <div className="pt-2 space-y-2">
          {!isConfirming ? (
            <button
              onClick={() => setIsConfirming(true)}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 hover:text-navy border border-gray-300 font-semibold text-xs py-2.5 rounded-xl transition-colors"
            >
              Cancel SIP Anyway
            </button>
          ) : (
            <div className="space-y-2 animate-in fade-in duration-150">
              <p className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 text-center">
                Please confirm: This will cancel future auto-debits for this fund.
              </p>
              <button
                onClick={handleFinalCancel}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
              >
                Confirm Cancellation
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-navy font-semibold text-xs py-2.5 rounded-xl transition-colors"
          >
            Keep My SIP Active
          </button>
        </div>
      </div>
    </div>
  );
};

