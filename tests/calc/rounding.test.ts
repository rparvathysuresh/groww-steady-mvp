import { describe, it, expect } from 'vitest';
import { computePortfolioMetrics } from '@/lib/calc/engine';
import { PortfolioState } from '@/lib/calc/types';

describe('Phase 1 Edge Case: Break-Even & Rounding Precision (EDGE-MATH-004, EDGE-MATH-005)', () => {
  it('identifies exact break-even state with NEUTRAL return tag (EDGE-MATH-004)', () => {
    const breakEvenState: PortfolioState = {
      id: 'break-even',
      scenarioName: 'Exact Break Even',
      personaName: 'Neutral User',
      description: 'Zero gain zero loss',
      schemeName: 'Sample Index Fund',
      monthlyAmount: 2500,
      instalments: [
        {
          id: '1',
          instalmentNumber: 1,
          date: '2026-09-01',
          amount: 2500,
          nav: 100.00,
          unitsPurchased: 25.0,
        },
      ],
      latestNav: 100.00, // Value = 25 * 100 = 2500
      latestNavDate: '2026-10-01',
      nextDebitDate: '2026-10-15',
      mandateStatus: 'ACTIVE',
    };

    const metrics = computePortfolioMetrics(breakEvenState);
    expect(metrics.totalInvested).toBe(2500);
    expect(metrics.currentValue).toBe(2500);
    expect(metrics.absoluteReturn).toBe(0);
    expect(metrics.returnPercentage).toBe(0);
    expect(metrics.returnState).toBe('NEUTRAL');
    expect(metrics.isDipState).toBe(false);
  });

  it('prevents floating point arithmetic drift on fractional units (EDGE-MATH-005)', () => {
    // 3 instalments of amounts prone to IEEE-754 drift
    const driftState: PortfolioState = {
      id: 'drift-test',
      scenarioName: 'Drift Test',
      personaName: 'Tester',
      description: 'Floating point test',
      schemeName: 'Sample Index Fund',
      monthlyAmount: 1000,
      instalments: [
        { id: '1', instalmentNumber: 1, date: '2026-08-01', amount: 1000, nav: 133.33, unitsPurchased: 0 },
        { id: '2', instalmentNumber: 2, date: '2026-09-01', amount: 1000, nav: 166.67, unitsPurchased: 0 },
        { id: '3', instalmentNumber: 3, date: '2026-10-01', amount: 1000, nav: 199.99, unitsPurchased: 0 },
      ],
      latestNav: 180.50,
      latestNavDate: '2026-10-20',
      nextDebitDate: '2026-11-01',
      mandateStatus: 'ACTIVE',
    };

    const metrics = computePortfolioMetrics(driftState);
    // Must be clean rounded numbers, not 18.500000000000004
    expect(metrics.totalUnits.toString()).toMatch(/^\d+\.\d{1,4}$/);
    expect(metrics.currentValue.toString()).toMatch(/^\d+(\.\d{1,2})?$/);
    expect(metrics.absoluteReturn.toString()).toMatch(/^-?\d+(\.\d{1,2})?$/);
  });
});

