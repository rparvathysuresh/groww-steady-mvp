'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, CalendarClock, History } from 'lucide-react';
import { PortfolioState } from '@/lib/calc/types';
import { SkipStepSheet } from './SkipStepSheet';
import { StepDownSheet } from './StepDownSheet';
import { AuditTimeline } from './AuditTimeline';

interface FlexModalProps {
  isOpen: boolean;
  portfolio: PortfolioState;
  onClose: () => void;
  initialTab?: 'skip' | 'stepdown' | 'audit';
}

export const FlexModal: React.FC<FlexModalProps> = ({
  isOpen,
  portfolio,
  onClose,
  initialTab = 'skip',
}) => {
  const [activeTab, setActiveTab] = useState<'skip' | 'stepdown' | 'audit'>(initialTab);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-surface-card rounded-t-3xl sm:rounded-2xl max-w-sm w-full max-h-[90vh] flex flex-col shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between bg-surface-card sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary-light text-primary-dark">
              <SlidersHorizontal size={16} />
            </div>
            <div>
              <h2 className="font-bold text-sm text-navy">Steady Flex Controls</h2>
              <p className="text-[10px] text-gray-400">Guilt-free simulated mandate adjustments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 p-1 m-4 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('skip')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'skip'
                ? 'bg-white text-navy shadow-xs'
                : 'text-gray-500 hover:text-navy'
            }`}
          >
            <CalendarClock size={13} />
            <span>Skip</span>
          </button>

          <button
            onClick={() => setActiveTab('stepdown')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'stepdown'
                ? 'bg-white text-navy shadow-xs'
                : 'text-gray-500 hover:text-navy'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span>Step Down</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'audit'
                ? 'bg-white text-navy shadow-xs'
                : 'text-gray-500 hover:text-navy'
            }`}
          >
            <History size={13} />
            <span>Log</span>
          </button>
        </div>

        {/* Success Feedback Banner */}
        {successNotice && (
          <div className="mx-4 mb-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
            <span>{successNotice}</span>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-800 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-5 pt-0 overflow-y-auto flex-1">
          {activeTab === 'skip' && (
            <SkipStepSheet
              portfolio={portfolio}
              onClose={onClose}
              onSuccess={() => {
                setSuccessNotice('Mandate skipped for 1 month! Resumes automatically next cycle.');
                setActiveTab('audit');
              }}
            />
          )}

          {activeTab === 'stepdown' && (
            <StepDownSheet
              portfolio={portfolio}
              onClose={onClose}
              onSuccess={() => {
                setSuccessNotice('Mandate stepped down! Visual schedule updated.');
                setActiveTab('audit');
              }}
            />
          )}

          {activeTab === 'audit' && <AuditTimeline />}
        </div>
      </div>
    </div>
  );
};
