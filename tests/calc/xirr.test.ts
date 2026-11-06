import { describe, it, expect } from 'vitest';
import { solveXIRR, CashFlow } from '@/lib/calc/xirr';

describe('Phase 1: Deterministic Engine - XIRR Solver', () => {
  it('calculates accurate annualized return for standard cash flows', () => {
    // 3 monthly cash outflows of ₹2,500 and a 10% gain after 1 year
    const cashFlows: CashFlow[] = [
      { date: new Date('2025-01-01'), amount: -10000 },
      { date: new Date('2026-01-01'), amount: 11000 },
    ];

    const rate = solveXIRR(cashFlows);
    // Exact 1-year rate should be 0.10 (10%)
    expect(rate).toBeCloseTo(0.10, 2);
  });

  it('handles negative returns accurately', () => {
    const cashFlows: CashFlow[] = [
      { date: new Date('2026-01-01'), amount: -10000 },
      { date: new Date('2026-07-01'), amount: 9500 },
    ];

    const rate = solveXIRR(cashFlows);
    expect(rate).toBeLessThan(0);
  });

  it('safely handles empty or single cash flow series', () => {
    expect(solveXIRR([])).toBe(0.0);
    expect(solveXIRR([{ date: new Date(), amount: -1000 }])).toBe(0.0);
    expect(solveXIRR([{ date: new Date(), amount: 1000 }])).toBe(0.0);
  });
});

