'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, AlertCircle, CheckCircle2, Calendar } from 'lucide-react';
import { PortfolioState } from '@/lib/calc/types';
import { formatINR, formatDateShort } from '@/lib/utils/format';
import { canModifyMandate, applyStepDown } from '@/lib/flex/engine';
import { useSessionStore } from '@/lib/store/sessionStore';
import { addMonthsSafe } from '@/lib/utils/date';
import { FlexConfirmDialog } from './FlexConfirmDialog';

interface StepDownSheetProps {
  portfolio: PortfolioState;
  onClose: () => void;
  onSuccess: () => void;
}

export const StepDownSheet: React.FC<StepDownSheetProps> = ({
  portfolio,
  onClose,
  onSuccess,
}) => {
  const { updatePortfolio, logAuditEvent } = useSessionStore();
  const [amount, setAmount] = useState<number>(500);
  const [cycles, setCycles] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const lockout = canModifyMandate(portfolio.nextDebitDate);
  const resumptionDate = addMonthsSafe(portfolio.nextDebitDate, cycles);

  const handleExecuteStepDown = () => {
    try {
      setShowConfirm(false);
      const { updatedState, auditEvent } = applyStepDown(portfolio, amount, cycles);
      updatePortfolio(() => updatedState);
      logAuditEvent(auditEvent.action, auditEvent.details);
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Unable to step down amount.');
    }
  };

  const presetAmounts = [500, 1000, 1500].filter((amt) => amt < portfolio.monthlyAmount);

  return (
    <div className="space-y-4 text-navy">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-800">
          <SlidersHorizontal size={18} />
        </div>
        <div>
          <h3 className="font-bold text-sm">Step Down Temporarily</h3>
          <p className="text-xs text-gray-500">Lower your debit for 1–3 months, auto-resumes</p>
        </div>
      </div>

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

      {/* Amount Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-600 block">
          Select Temporary Monthly Amount
        </label>
        <div className="flex gap-2">
          {presetAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                amount === amt
                  ? 'bg-navy text-white border-navy shadow-xs'
                  : 'bg-gray-50 text-navy border-gray-200 hover:bg-gray-100'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>
      </div>

      {/* Cycle Duration Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-600 block">Duration (Cycles)</label>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((c) => (
            <button
              key={c}
              onClick={() => setCycles(c)}
              className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                cycles === c
                  ? 'bg-primary-dark text-white border-primary-dark shadow-xs'
                  : 'bg-gray-50 text-navy border-gray-200 hover:bg-gray-100'
              }`}
            >
              {c} {c === 1 ? 'Month' : 'Months'}
            </button>
          ))}
        </div>
      </div>

      {/* Restoration Schedule Summary */}
      <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-100 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-blue-900">
          <Calendar size={14} />
          <span>Automatic Resumption Schedule</span>
        </div>
        <p className="text-blue-800 leading-relaxed text-[11px]">
          You will be debited <strong>₹{amount}</strong> for the next {cycles} {cycles === 1 ? 'month' : 'months'}.
          On <strong>{formatDateShort(resumptionDate)}</strong>, your instalment will automatically return to your regular amount of{' '}
          <strong>{formatINR(portfolio.monthlyAmount)}</strong>.
        </p>
      </div>

      {/* Action CTAs */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => setShowConfirm(true)}
          disabled={!lockout.allowed}
          className="w-full bg-navy hover:bg-navy-dark disabled:opacity-50 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors"
        >
          Confirm Step-Down to ₹{amount}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-navy font-medium text-xs py-2.5 rounded-xl transition-colors"
        >
          Keep As Is
        </button>
      </div>

      {/* Confirmation Dialog Box */}
      <FlexConfirmDialog
        isOpen={showConfirm}
        title="Confirm Temporary Step-Down?"
        description="Please review your reduced SIP schedule before confirming."
        variant="blue"
        details={[
          { label: 'Scheme', value: portfolio.schemeName },
          { label: 'Temporary Monthly Amount', value: `₹${amount} / month`, highlight: true },
          { label: 'Duration', value: `${cycles} ${cycles === 1 ? 'Month' : 'Months'}` },
          {
            label: 'Automatic Resumption',
            value: `${formatDateShort(resumptionDate)} (${formatINR(portfolio.monthlyAmount)})`,
          },
        ]}
        reassurance="Autopay stays active. Your SIP resumes at regular amount automatically."
        confirmLabel="Yes, Update Amount"
        cancelLabel="Go Back"
        onConfirm={handleExecuteStepDown}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
};
