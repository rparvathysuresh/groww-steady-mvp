'use client';

import React from 'react';
import { useSessionStore } from '@/lib/store/sessionStore';
import { Info, X } from 'lucide-react';

export const InactiveTabModal: React.FC = () => {
  const { inactiveNotice, clearInactiveNotice } = useSessionStore();

  if (!inactiveNotice) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-surface-card rounded-2xl p-5 max-w-xs w-full shadow-lg border border-border-subtle space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-navy font-semibold text-sm">
            <Info size={16} className="text-primary-dark" />
            <span>Prototype Notice</span>
          </div>
          <button
            onClick={clearInactiveNotice}
            className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
            aria-label="Close notice"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">{inactiveNotice}</p>

        <button
          onClick={clearInactiveNotice}
          className="w-full bg-navy hover:bg-navy-dark text-white font-medium text-xs py-2 rounded-lg transition-colors"
        >
          Understood
        </button>
      </div>
    </div>
  );
};

