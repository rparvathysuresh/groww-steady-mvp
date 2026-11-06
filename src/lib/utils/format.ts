/**
 * Utility functions for Indian Number Formatting and accessible date representation.
 */

export function formatINR(amount: number, options: { decimals?: number; sign?: boolean } = {}): string {
  const { decimals = 2, sign = false } = options;
  const isNegative = amount < -0.005;
  const absAmount = Math.abs(amount);

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(absAmount);

  if (sign) {
    if (isNegative) return `-₹${formatted}`;
    if (amount > 0.005) return `+₹${formatted}`;
    return `₹${formatted}`;
  }

  return isNegative ? `-₹${formatted}` : `₹${formatted}`;
}

export function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
    }).format(d);
  } catch (_) {
    return dateStr;
  }
}

export function formatDateFull(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch (_) {
    return dateStr;
  }
}

