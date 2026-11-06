import React from 'react';
import { SlidersHorizontal, AlertTriangle, History, CheckCircle2 } from 'lucide-react';
import { MandateStatus } from '@/lib/calc/types';

interface ActionFooterProps {
  mandateStatus?: MandateStatus;
  onFlexClick?: () => void;
  onCancelClick?: () => void;
  onViewAuditClick?: () => void;
}

export const ActionFooter: React.FC<ActionFooterProps> = ({
  mandateStatus = 'ACTIVE',
  onFlexClick,
  onCancelClick,
  onViewAuditClick,
}) => {
  if (mandateStatus === 'CANCELLED') {
    return (
      <div className="pt-2 space-y-2.5">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs text-gray-600 flex items-start gap-2">
          <CheckCircle2 size={16} className="text-gray-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-navy block">Mandate Cancelled</span>
            <span>
              All future auto-debits have stopped. Your units remain invested and can be redeemed
              anytime.
            </span>
          </div>
        </div>

        <button
          onClick={onViewAuditClick}
          className="w-full bg-surface-card hover:bg-gray-50 text-navy border border-border-subtle font-medium text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
        >
          <History size={14} className="text-primary-dark" />
          <span>View Mandate Audit Log</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 space-y-2.5">
      {/* Primary Mandate Adjustment CTA */}
      <button
        onClick={onFlexClick}
        className="w-full bg-navy hover:bg-navy-dark text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
      >
        <SlidersHorizontal size={16} />
        <span>Skip or Edit Amount (Steady Flex)</span>
      </button>

      {/* Secondary Cancellation Action */}
      <button
        onClick={onCancelClick}
        className="w-full bg-surface-card hover:bg-gray-50 text-gray-600 hover:text-navy border border-border-subtle font-medium text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
      >
        <AlertTriangle size={14} className="text-gray-400" />
        <span>Cancel SIP</span>
      </button>
    </div>
  );
};

