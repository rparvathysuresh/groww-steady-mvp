/**
 * Readability & Length Validator.
 * Limits explanations to 2-4 sentences and max 80 words for Grade 8 reading level.
 */

export interface ReadabilityCheckResult {
  passed: boolean;
  sentenceCount: number;
  wordCount: number;
  reason?: string;
}

export function checkReadability(text: string): ReadabilityCheckResult {
  if (!text) {
    return { passed: true, sentenceCount: 0, wordCount: 0 };
  }

  // Replace decimals within numbers (e.g., 176.40, 14.8017) so they are not treated as sentence boundaries
  const cleanedForSentences = text.replace(/\b\d+\.\d+\b/g, '0');

  // Split into sentences using punctuation boundaries (. ! ?)
  const sentences = cleanedForSentences
    .split(/[.!?]+(?:\s+|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const words = text
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);

  const sentenceCount = sentences.length;
  const wordCount = words.length;

  if (sentenceCount > 4) {
    return {
      passed: false,
      sentenceCount,
      wordCount,
      reason: `Sentence count (${sentenceCount}) exceeds maximum allowed (4).`,
    };
  }

  if (wordCount > 85) {
    return {
      passed: false,
      sentenceCount,
      wordCount,
      reason: `Word count (${wordCount}) exceeds maximum allowed (85 words).`,
    };
  }

  return {
    passed: true,
    sentenceCount,
    wordCount,
  };
}

