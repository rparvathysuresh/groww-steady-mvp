import React from 'react';
import { APP_CONFIG } from '@/lib/config';
import { AlertCircle } from 'lucide-react';

export const PrototypeBanner: React.FC = () => {
  return (
    <aside
      data-testid="prototype-banner"
      className="w-full bg-amber-50 border-b border-amber-200/80 px-3 py-1.5 text-center text-[11px] text-amber-900 font-medium sticky top-0 z-50 flex items-center justify-center gap-1.5 shadow-xs"
    >
      <AlertCircle size={12} className="text-amber-700 shrink-0" aria-hidden="true" />
      <span>{APP_CONFIG.PROTOTYPE_DISCLAIMER}</span>
    </aside>
  );
};

