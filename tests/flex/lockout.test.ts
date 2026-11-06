import { describe, it, expect } from 'vitest';
import { canModifyMandate, canSkipMandate } from '@/lib/flex/engine';

describe('Phase 4: 72-Hour Debit Window Lockout (EDGE-FLEX-001)', () => {
  const baseTime = new Date('2026-04-10T10:00:00.000Z');

  it('allows mandate modifications when scheduled debit is outside 72h window (e.g. 96h away)', () => {
    // 96 hours after baseTime: 2026-04-14T10:00:00.000Z
    const debitDate = new Date(baseTime.getTime() + 96 * 60 * 60 * 1000).toISOString();
    const result = canModifyMandate(debitDate, baseTime);

    expect(result.allowed).toBe(true);
    expect(result.hoursRemaining).toBeCloseTo(96, 1);
    expect(result.reason).toBeUndefined();
  });

  it('blocks mandate modifications when scheduled debit is inside 72h window (e.g. 71h away)', () => {
    // 71 hours after baseTime: 2026-04-13T09:00:00.000Z
    const debitDate = new Date(baseTime.getTime() + 71 * 60 * 60 * 1000).toISOString();
    const result = canModifyMandate(debitDate, baseTime);

    expect(result.allowed).toBe(false);
    expect(result.hoursRemaining).toBeCloseTo(71, 1);
    expect(result.reason).toContain('Mandate modifications lock 72 hours prior to scheduled debit');
  });

  it('correctly handles the exact 72-hour threshold', () => {
    // Exactly 72.0 hours: allowed
    const exact72 = new Date(baseTime.getTime() + 72 * 60 * 60 * 1000).toISOString();
    expect(canModifyMandate(exact72, baseTime).allowed).toBe(true);

    // 71.9 hours: blocked
    const sub72 = new Date(baseTime.getTime() + 71.9 * 60 * 60 * 1000).toISOString();
    expect(canModifyMandate(sub72, baseTime).allowed).toBe(false);
  });

  it('works identically via canSkipMandate alias', () => {
    const debitDate = new Date(baseTime.getTime() + 96 * 60 * 60 * 1000).toISOString();
    expect(canSkipMandate(debitDate, baseTime).allowed).toBe(true);

    const lockedDebit = new Date(baseTime.getTime() + 48 * 60 * 60 * 1000).toISOString();
    expect(canSkipMandate(lockedDebit, baseTime).allowed).toBe(false);
  });
});

