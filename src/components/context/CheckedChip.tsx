'use client';

import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

interface CheckedChipProps {
  uncertaintyNotice?: string;
  isFallback?: boolean;
}

export const CheckedChip: React.FC<CheckedChipProps> = ({
  uncertaintyNotice,
  isFallback = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isFallback && uncertaintyNotice) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-1 rounded-lg">
        <Info size={13} className="text-amber-700 shrink-0" />
        <span>{uncertaintyNotice}</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium hover:bg-emerald-100/70 transition-colors cursor-pointer"
        title="View verification details"
      >
        <ShieldCheck size={12} className="text-primary-dark" />
        <span>Checked against your numbers</span>
      </button>

      {/* Verification Drawer Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div className="bg-surface-card rounded-2xl p-5 max-w-xs w-full shadow-lg border border-border-subtle space-y-3 text-navy">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary-dark" />
                <h4 className="font-bold text-sm">Quality & Safety Check</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-600 leading-relaxed">
              <p>
                <strong>Checked against your numbers:</strong> Every rupee amount, unit count, and
                date in this explanation was checked by code to match your sample transaction data.
              </p>
              <p>
                <strong>Educational only:</strong> Steady never provides financial advice. It will
                never tell you to buy, sell, pause, or continue your investments.
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-navy hover:bg-navy-dark text-white font-medium text-xs py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

