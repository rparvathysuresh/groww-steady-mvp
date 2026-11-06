import { describe, it, expect } from 'vitest';
import { sanitizePII } from '@/lib/intent/pii';

describe('Phase 3: PII Sanitization Engine (EDGE-CONV-001)', () => {
  it('redacts standard Indian 10-digit mobile numbers', () => {
    const res = sanitizePII('Call me at 9876543210 to discuss my SIP.');
    expect(res.hasPII).toBe(true);
    expect(res.detectedTypes).toContain('phone');
    expect(res.sanitizedText).toBe('Call me at [PHONE_REDACTED] to discuss my SIP.');
  });

  it('redacts spaced and dotted phone numbers', () => {
    const res = sanitizePII('Reach me on 9 8 7 6 5 4 3 2 1 0 please.');
    expect(res.hasPII).toBe(true);
    expect(res.detectedTypes).toContain('phone');
    expect(res.sanitizedText).toContain('[PHONE_REDACTED]');
  });

  it('redacts Indian PAN card numbers', () => {
    const res = sanitizePII('My PAN card is ABCDE1234F.');
    expect(res.hasPII).toBe(true);
    expect(res.detectedTypes).toContain('pan');
    expect(res.sanitizedText).toBe('My PAN card is [PAN_REDACTED].');
  });

  it('redacts email addresses', () => {
    const res = sanitizePII('Send the receipt to investor.demo@gmail.com.');
    expect(res.hasPII).toBe(true);
    expect(res.detectedTypes).toContain('email');
    expect(res.sanitizedText).toBe('Send the receipt to [EMAIL_REDACTED].');
  });

  it('passes clean inputs without modification', () => {
    const cleanText = 'Why is my portfolio showing a negative return this month?';
    const res = sanitizePII(cleanText);
    expect(res.hasPII).toBe(false);
    expect(res.detectedTypes).toEqual([]);
    expect(res.sanitizedText).toBe(cleanText);
  });
});

