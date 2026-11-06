import { describe, it, expect } from 'vitest';
import { solveXIRR, CashFlow } from '@/lib/calc/xirr';

describe('Phase 1 Edge Case: XIRR Bounds & Non-Convergence (EDGE-MATH-002, EDGE-MATH-003)', () => {
  it('clamps extreme short-tenure annualization (EDGE-MATH-002)', () => {
    // 15 days elapsed with a 15% drop -> naive annualization explodes to -99.9%
    const shortTenureCashFlows: CashFlow[] = [
      { date: new Date('2026-10-01'), amount: -10000 },
      { date: new Date('2026-10-15'), amount: 8500 },
    ];

    const rate = solveXIRR(shortTenureCashFlows);
    // Must be safely clamped and finite
    expect(rate).toBeGreaterThanOrEqual(-0.99);
    expect(rate).toBeLessThanOrEqual(10.0);
    expect(isFinite(rate)).toBe(true);
  });

  it('terminates cleanly on flat or zero-derivative cash flows (EDGE-MATH-003)', () => {
    // Zero movement over same day
    const flatSameDay: CashFlow[] = [
      { date: new Date('2026-10-01'), amount: -5000 },
      { date: new Date('2026-10-01'), amount: 5000 },
    ];

    const rate = solveXIRR(flatSameDay);
    expect(isFinite(rate)).toBe(true);
    expect(rate).toBeCloseTo(0.0, 2);
  });
});

