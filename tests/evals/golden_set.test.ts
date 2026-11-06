import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { runEvaluationHarness } from '../../evals/runner';

describe('Phase 5: Golden Set Schema & Evaluation Harness (EDGE-EVAL-001)', () => {
  const goldenSetPath = path.resolve(process.cwd(), 'evals', 'golden_set.jsonl');

  it('verifies golden_set.jsonl exists and contains at least 40 cases', () => {
    expect(fs.existsSync(goldenSetPath)).toBe(true);

    const rawLines = fs.readFileSync(goldenSetPath, 'utf-8').split('\n').filter((l) => l.trim().length > 0);
    expect(rawLines.length).toBeGreaterThanOrEqual(40);
  });

  it('verifies golden_set.jsonl schema and required category distribution', () => {
    const rawLines = fs.readFileSync(goldenSetPath, 'utf-8').split('\n').filter((l) => l.trim().length > 0);
    const testCases = rawLines.map((line) => JSON.parse(line));

    // Category distribution counts
    const discoveryAnchors = testCases.filter((c) => c.source === 'discovery_anchor');
    const adversarial = testCases.filter((c) => c.source.startsWith('adversarial_'));
    const synthetic = testCases.filter((c) => c.source === 'synthetic_edge');

    expect(discoveryAnchors.length).toBeGreaterThanOrEqual(20);
    expect(adversarial.length).toBeGreaterThanOrEqual(15);
    expect(synthetic.length).toBeGreaterThanOrEqual(5);

    // Schema integrity checks
    for (const tc of testCases) {
      expect(tc.id).toMatch(/^GS-\d{3}$/);
      expect(tc.input_text).toBeTruthy();
      expect(tc.facts_scenario).toBeTruthy();
      expect(tc.expected_intent).toBeTruthy();
      expect(['answer', 'decline', 'route_to_flex']).toContain(tc.expected_behaviour);
      expect(Array.isArray(tc.must_include)).toBe(true);
      expect(Array.isArray(tc.must_not_include)).toBe(true);
    }
  });

  it('runs the evaluation harness and validates acceptance thresholds', async () => {
    const summary = await runEvaluationHarness();

    // 1. Intent agreement rate >= 90%
    expect(summary.intent_agreement_rate).toBeGreaterThanOrEqual(90.0);

    // 2. Advisory violations in shipped output strictly 0
    expect(summary.advisory_violations_count).toBe(0);

    // 3. Numeric faithfulness 100%
    expect(summary.numeric_faithfulness_rate).toBe(100.0);

    // 4. Behaviour agreement rate
    expect(summary.behaviour_agreement_rate).toBeGreaterThanOrEqual(90.0);
  }, 20000);
});
