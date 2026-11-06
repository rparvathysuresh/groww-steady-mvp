/**
 * PII Sanitization Engine for Groww Steady.
 * Detects and redacts sensitive Indian personal and financial identifiers (EDGE-CONV-001).
 * Zero user financial credentials or contact info is ever sent to the LLM or stored.
 */

export interface PIICheckResult {
  hasPII: boolean;
  sanitizedText: string;
  detectedTypes: string[];
  warningMessage?: string;
}

export function sanitizePII(input: string): PIICheckResult {
  if (!input || typeof input !== 'string') {
    return { hasPII: false, sanitizedText: '', detectedTypes: [] };
  }

  let sanitized = input;
  const detectedTypes: string[] = [];

  // 1. Email Addresses (e.g., user@example.com)
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  if (emailRegex.test(sanitized)) {
    detectedTypes.push('email');
    sanitized = sanitized.replace(emailRegex, '[EMAIL_REDACTED]');
  }

  // 2. Indian PAN Card Number (5 letters + 4 digits + 1 letter, with optional hyphens/spaces)
  // E.g., ABCDE1234F, A-B-C-D-E-1-2-3-4-F
  const panRegex = /\b[A-Za-z][\s\-]?[A-Za-z][\s\-]?[A-Za-z][\s\-]?[A-Za-z][\s\-]?[A-Za-z][\s\-]?[0-9][\s\-]?[0-9][\s\-]?[0-9][\s\-]?[0-9][\s\-]?[A-Za-z]\b/g;
  if (panRegex.test(sanitized)) {
    detectedTypes.push('pan');
    sanitized = sanitized.replace(panRegex, '[PAN_REDACTED]');
  }

  // 3. Indian Phone Numbers (10 digits starting with 6-9, optional +91 or 0 prefix, supports spaced/dashed digits)
  // E.g., +91 9876543210, 98765-43210, 9 8 7 6 5 4 3 2 1 0
  const spacedPhoneRegex = /(?:\+91[\s\.\-]?)?(?:0[\s\.\-]?)?(?:[6-9][\s\.\-]?\d[\s\.\-]?\d[\s\.\-]?\d[\s\.\-]?\d[\s\.\-]?\d[\s\.\-]?\d[\s\.\-]?\d[\s\.\-]?\d[\s\.\-]?\d)\b/g;
  if (spacedPhoneRegex.test(sanitized)) {
    detectedTypes.push('phone');
    sanitized = sanitized.replace(spacedPhoneRegex, '[PHONE_REDACTED]');
  }

  // 4. Long Digit Sequences (Aadhaar or Bank account candidates: 12-16 digits with optional spaces/hyphens)
  const digitSequenceRegex = /\b(?:\d[\s\-]?){12,16}\b/g;
  if (digitSequenceRegex.test(sanitized)) {
    // Only flag if not already covered by phone
    const matches = sanitized.match(digitSequenceRegex);
    if (matches && matches.some((m) => m.replace(/[\s\-]/g, '').length >= 12)) {
      detectedTypes.push('account_or_aadhaar');
      sanitized = sanitized.replace(digitSequenceRegex, '[IDENTIFIER_REDACTED]');
    }
  }

  const hasPII = detectedTypes.length > 0;
  return {
    hasPII,
    sanitizedText: sanitized.trim(),
    detectedTypes,
    warningMessage: hasPII
      ? 'For your security, personal contact and financial details were redacted.'
      : undefined,
  };
}

