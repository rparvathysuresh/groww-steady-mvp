import { describe, it, expect } from 'vitest';
import { computePortfolioMetrics } from '@/lib/calc/engine';
import { SCENARIO_A, SCENARIO_B } from '@/lib/scenarios';
import { PortfolioState } from '@/lib/calc/types';

describe('Phase 1: Deterministic Engine - Core Math', () => {
  it('computes metrics accurately for Scenario A (Month 3 Dip)', () => {
    const metrics = computePortfolioMetrics(SCENARIO_A);

    // 1. Total invested: 3 * 2500 = 7500
    expect(metrics.totalInvested).toBe(7500);

    // 2. Units purchased:
    // Month 1: 2500 / 176.40 = 14.1723
    // Month 2: 2500 / 172.10 = 14.5264
    // Month 3: 2500 / 168.90 = 14.8017
    // Total units: 14.1723 + 14.5264 + 14.8017 = 43.5004
    expect(metrics.totalUnits).toBeCloseTo(43.5004, 3);

    // 3. Average NAV: 7500 / 43.5004 = 172.41
    expect(metrics.averageNav).toBeCloseTo(172.41, 1);

    // 4. Current Value: 43.5004 * 166.85 = 7258.04
    expect(metrics.currentValue).toBeCloseTo(7258.04, 1);

    // 5. Absolute Return: 7258.04 - 7500 = -241.96
    expect(metrics.absoluteReturn).toBeCloseTo(-241.96, 1);
    expect(metrics.returnPercentage).toBeLessThan(0);

    // 6. Additional units vs previous month:
    // Month 3 (NAV 168.90): 2500 / 168.90 = 14.8017
    // At Month 2 NAV (172.10): 2500 / 172.10 = 14.5264
    // Additional = 14.8017 - 14.5264 = +0.2753 units
    expect(metrics.additionalUnitsVsPrevious).toBeCloseTo(0.2753, 3);
    expect(metrics.navDeltaVsPrevious).toBeCloseTo(-3.20, 2);

    // 7. State flags
    expect(metrics.isDipState).toBe(true);
    expect(metrics.returnState).toBe('LOSS');
  });

  it('verifies additional units benchmark example from problem statement', () => {
    // Problem statement example (Section 7.1 / line 169):
    // ₹2,500 at NAV ₹168.90 gives 14.80 units.
    // At last month's NAV of ₹176.40 it would have given 14.17 units, so about 0.63 additional units.
    const customState: PortfolioState = {
      id: 'test-custom',
      scenarioName: 'Test Benchmark',
      personaName: 'Tester',
      description: 'Test',
      schemeName: 'Sample Index Fund',
      monthlyAmount: 2500,
      instalments: [
        {
          id: '1',
          instalmentNumber: 1,
          date: '2026-08-01',
          amount: 2500,
          nav: 176.40,
          unitsPurchased: 0,
        },
        {
          id: '2',
          instalmentNumber: 2,
          date: '2026-09-01',
          amount: 2500,
          nav: 168.90,
          unitsPurchased: 0,
        },
      ],
      latestNav: 168.90,
      latestNavDate: '2026-09-15',
      nextDebitDate: '2026-10-01',
      mandateStatus: 'ACTIVE',
    };

    const metrics = computePortfolioMetrics(customState);
    // (2500 / 168.90) - (2500 / 176.40) = 14.7987 - 14.1723 = +0.6264 (~0.63)
    expect(metrics.additionalUnitsVsPrevious).toBeCloseTo(0.6264, 2);
  });

  it('triggers isDebitNear accurately for Scenario B (debit in a few days - 25 Nov)', () => {
    // Reference date: 2026-11-21, nextDebitDate: 2026-11-25 -> 4 days away
    const metrics = computePortfolioMetrics(SCENARIO_B, '2026-11-21');
    expect(metrics.totalInvested).toBe(15000);
    expect(metrics.isDebitNear).toBe(true);
  });
});
