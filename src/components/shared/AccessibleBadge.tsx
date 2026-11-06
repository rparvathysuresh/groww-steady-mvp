import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatINR } from '@/lib/utils/format';

export interface AccessibleBadgeProps {
  amount?: number;
  percentage?: number;
  state?: 'PROFIT' | 'LOSS' | 'NEUTRAL';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AccessibleBadge: React.FC<AccessibleBadgeProps> = ({
  amount,
  percentage,
  state: explicitState,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  // Infer state if not explicitly passed
  let resolvedState: 'PROFIT' | 'LOSS' | 'NEUTRAL' = explicitState || 'NEUTRAL';
  if (!explicitState && amount !== undefined) {
    if (amount > 0.005) resolvedState = 'PROFIT';
    else if (amount < -0.005) resolvedState = 'LOSS';
    else resolvedState = 'NEUTRAL';
  }

  const isProfit = resolvedState === 'PROFIT';
  const isLoss = resolvedState === 'LOSS';
  const isNeutral = resolvedState === 'NEUTRAL';

  // Styling tokens
  const colorStyles = isProfit
    ? 'text-[#00B386] bg-emerald-50 border-emerald-200'
    : isLoss
    ? 'text-[#EB5757] bg-rose-50 border-rose-200'
    : 'text-gray-600 bg-gray-50 border-gray-200';

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  }[size];

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  // Format amount and percent
  const amountStr = amount !== undefined ? formatINR(amount, { sign: true }) : null;
  const percentStr =
    percentage !== undefined
      ? `${isProfit ? '+' : isLoss ? '' : ''}${percentage.toFixed(2)}%`
      : null;

  const labelText = isProfit ? 'Profit' : isLoss ? 'Loss' : 'No change';

  return (
    <span
      data-testid="accessible-badge"
      data-state={resolvedState}
      className={`inline-flex items-center font-medium rounded-full border whitespace-nowrap shrink-0 ${colorStyles} ${sizeStyles} ${className}`}
      aria-label={`${amountStr || ''} ${percentStr ? `(${percentStr})` : ''} ${labelText}`}
    >
      {/* 1. Explicit Directional Icon */}
      {isProfit && <TrendingUp size={iconSize} aria-hidden="true" className="shrink-0" />}
      {isLoss && <TrendingDown size={iconSize} aria-hidden="true" className="shrink-0" />}
      {isNeutral && <Minus size={iconSize} aria-hidden="true" className="shrink-0" />}

      {/* 2. Numerical Values with Sign */}
      {amountStr && <span className="font-semibold whitespace-nowrap inline-block">{amountStr}</span>}
      {percentStr && <span className="opacity-90 whitespace-nowrap inline-block">({percentStr})</span>}

      {/* 3. Explicit Text Label (Non-color indicator) */}
      {showLabel && (
        <span
          data-testid="badge-text-label"
          className="uppercase tracking-wider text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/5 whitespace-nowrap shrink-0"
        >
          {labelText}
        </span>
      )}
    </span>
  );
};

