'use client';

import React, { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { useSessionStore } from '@/lib/store/sessionStore';

interface ResetControlProps {
  variant?: 'floating' | 'inline';
}

export const ResetControl: React.FC<ResetControlProps> = ({ variant = 'floating' }) => {
  const { resetDemo } = useSessionStore();
  const [showToast, setShowToast] = useState(false);

  const handleReset = () => {
    resetDemo();
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  if (variant === 'inline') {
    return (
      <div className="flex flex-col items-center">
        <button
          onClick={handleReset}
          className="text-[11px] text-gray-400 hover:text-navy transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-gray-100"
          title="Reset demo session to original scenario state"
        >
          <RotateCcw size={11} />
          <span>Reset Demo State</span>
        </button>

        {showToast && (
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1 animate-in fade-in duration-200 flex items-center gap-1">
            <Check size={9} />
            <span>State reset to baseline</span>
          </span>
        )}
      </div>
    );
  }

  // Floating variant for easy access by testers on mobile/desktop frames
  return (
    <>
      <div className="fixed bottom-20 right-4 sm:right-auto sm:left-[calc(50%+140px)] z-40">
        <button
          onClick={handleReset}
          className="bg-navy hover:bg-navy-dark text-white p-2.5 rounded-full shadow-lg border border-slate-700 transition-all flex items-center gap-1.5 text-xs font-semibold hover:scale-105 active:scale-95 opacity-90 hover:opacity-100"
          aria-label="Reset demo state"
          title="Reset demo session state"
        >
          <RotateCcw size={14} />
          <span className="hidden sm:inline text-[11px] pr-1">Reset Demo</span>
        </button>
      </div>

      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <Check size={14} className="text-primary" />
          <span>Demo state reset to clean baseline</span>
        </div>
      )}
    </>
  );
};

