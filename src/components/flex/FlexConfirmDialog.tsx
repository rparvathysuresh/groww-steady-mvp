'use client';

import React, { useEffect, useRef } from 'react';
import { AlertCircle, CalendarClock, SlidersHorizontal, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface DetailItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface FlexConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  details: DetailItem[];
  reassurance?: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'amber' | 'blue';
  onConfirm: () => void;
  onCancel: () => void;
}

export const FlexConfirmDialog: React.FC<FlexConfirmDialogProps> = ({
  isOpen,
  title,
  description,
  details,
  reassurance = 'All existing units remain invested. No penalties or fees apply.',
  confirmLabel,
  cancelLabel = 'Go Back',
  variant = 'amber',
  onConfirm,
  onCancel,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Escape key closes dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isAmber = variant === 'amber';

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        ref={dialogRef}
        className="bg-surface-card rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 duration-150 text-navy"
      >
        {/* Header with icon & title */}
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isAmber
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}
          >
            {isAmber ? <CalendarClock size={20} /> : <SlidersHorizontal size={20} />}
          </div>

          <div className="space-y-0.5">
            <h3 id="confirm-dialog-title" className="font-bold text-sm text-navy">
              {title}
            </h3>
            <p className="text-xs text-gray-500 leading-snug">{description}</p>
          </div>
        </div>

        {/* Changes Recap Box */}
        <div className="bg-gray-50/90 p-3 rounded-xl border border-gray-100 space-y-2 text-xs">
          {details.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <span className="text-gray-500">{item.label}:</span>
              <strong
                className={`${
                  item.highlight
                    ? isAmber
                      ? 'text-amber-800 font-bold'
                      : 'text-primary-dark font-bold'
                    : 'text-navy'
                }`}
              >
                {item.value}
              </strong>
            </div>
          ))}
        </div>

        {/* Reassurance note */}
        <div className="flex items-start gap-2 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/80 text-[11px] text-emerald-900">
          <ShieldCheck size={14} className="text-emerald-700 shrink-0 mt-0.5" />
          <span className="leading-snug">{reassurance}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onConfirm}
            className="w-full py-2.5 px-4 rounded-xl bg-navy hover:bg-navy-dark text-white font-semibold text-xs shadow-xs transition-colors text-center"
          >
            {confirmLabel}
          </button>

          <button
            onClick={onCancel}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-colors text-center"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

