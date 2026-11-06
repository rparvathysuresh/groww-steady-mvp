'use client';

import React from 'react';
import { useSessionStore } from '@/lib/store/sessionStore';

interface CoachmarkDotProps {
  id: string;
  label?: string;
  className?: string;
  position?: 'top-right' | 'inline' | 'top-left';
}

export const CoachmarkDot: React.FC<CoachmarkDotProps> = ({
  id,
  label = 'Tip: tap to explore',
  className = '',
  position = 'top-right',
}) => {
  const coachmarksDismissed = useSessionStore((state) => state.coachmarksDismissed);
  const dismissCoachmark = useSessionStore((state) => state.dismissCoachmark);
  const isDismissed = Boolean(
    (coachmarksDismissed && coachmarksDismissed[id]) ||
    useSessionStore.getState().coachmarksDismissed?.[id]
  );

  if (isDismissed) {
    return null;
  }

  const positionStyles = {
    'top-right': 'absolute -top-1 -right-1',
    'top-left': 'absolute -top-1 -left-1',
    'inline': 'inline-flex items-center ml-1',
  }[position];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        dismissCoachmark(id);
      }}
      aria-label={label}
      title={label}
      className={`${positionStyles} z-10 flex items-center justify-center p-0.5 focus:outline-none group ${className}`}
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white shadow-xs" />
      </span>
      <span className="sr-only">{label}</span>
    </button>
  );
};
