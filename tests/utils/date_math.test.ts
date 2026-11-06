import { describe, it, expect } from 'vitest';
import { addMonthsSafe, getHoursRemaining } from '@/lib/utils/date';

describe('Phase 4: Month-End Date Math & Hours Utility (EDGE-FLEX-004)', () => {
  it('correctly clamps Jan 31 + 1 month to Feb 28 on non-leap years without March rollover', () => {
    // 2026 is not a leap year -> Feb 28
    const result = addMonthsSafe('2026-01-31', 1);
    expect(result).toBe('2026-02-28');
  });

  it('correctly clamps Jan 31 + 1 month to Feb 29 on leap years (e.g. 2024)', () => {
    // 2024 is a leap year -> Feb 29
    const result = addMonthsSafe('2024-01-31', 1);
    expect(result).toBe('2024-02-29');
  });

  it('correctly clamps March 31 + 1 month to April 30', () => {
    const result = addMonthsSafe('2026-03-31', 1);
    expect(result).toBe('2026-04-30');
  });

  it('correctly preserves normal days (e.g. 15th of the month)', () => {
    const result = addMonthsSafe('2026-01-15', 1);
    expect(result).toBe('2026-02-15');

    const result2 = addMonthsSafe('2026-01-15', 3);
    expect(result2).toBe('2026-04-15');
  });

  it('correctly rolls across year boundaries (e.g. Dec 31 + 2 months)', () => {
    const result = addMonthsSafe('2025-12-31', 2);
    expect(result).toBe('2026-02-28');
  });

  describe('getHoursRemaining', () => {
    it('accurately computes positive difference in hours', () => {
      const ref = new Date('2026-04-01T12:00:00.000Z');
      const target = '2026-04-02T12:00:00.000Z'; // 24 hours later
      expect(getHoursRemaining(target, ref)).toBe(24);
    });

    it('accurately computes negative difference when target has passed', () => {
      const ref = new Date('2026-04-02T12:00:00.000Z');
      const target = '2026-04-01T12:00:00.000Z'; // 24 hours earlier
      expect(getHoursRemaining(target, ref)).toBe(-24);
    });
  });
});

