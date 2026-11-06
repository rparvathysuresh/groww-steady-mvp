import { describe, it, expect } from 'vitest';
import { computePortfolioMetrics } from '@/lib/calc/engine';
import { PortfolioState } from '@/lib/calc/types';

describe('Phase 1 Edge Case: Single-Instalment Baseline (EDGE-MATH-001)', () => {
  it('safely handles portfolio with exactly 1 completed instalment', () => {
    const singleInstalmentState: PortfolioState = {
      id: 'single-inst',
      scenarioName: 'Single Month State',
      personaName: 'New Investor',
      description: 'First instalment executed',
      schemeName: 'Sample Index Fund',
      monthlyAmount: 2500,
      instalments: [
        {
          id: 'inst-1',
          instalmentNumber: 1,
          date: '2026-10-01',
          amount: 2500,
          nav: 170.00,
          unitsPurchased: 0,
        },
      ],
      latestNav: 168.00,
      latestNavDate: '2026-10-15',
      nextDebitDate: '2026-11-01',
      mandateStatus: 'ACTIVE',
    };

    const metrics = computePortfolioMetrics(singleInstalmentState);

    expect(metrics.totalInvested).toBe(2500);
    expect(metrics.totalUnits).toBeCloseTo(14.7059, 4);
    // When length < 2, must default to 0 without error or NaN
    expect(metrics.additionalUnitsVsPrevious).toBe(0);
    expect(metrics.navDeltaVsPrevious).toBe(0);
    expect(metrics.isDipState).toBe(true);
    expect(metrics.isShortTenure).toBe(true);
  });
});

