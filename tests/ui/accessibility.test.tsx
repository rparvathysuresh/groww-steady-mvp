import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { AccessibleBadge } from '@/components/shared/AccessibleBadge';

describe('Phase 2: Accessibility & Non-Color Redundancy (EDGE-UI-001)', () => {
  it('renders triple-redundant indicators for negative return (LOSS)', () => {
    const html = renderToString(
      <AccessibleBadge amount={-250} percentage={-3.33} state="LOSS" showLabel={true} />
    );

    // 1. Sign prefix and rupee figure
    expect(html).toContain('-₹250.00');

    // 2. Percentage
    expect(html).toContain('-3.33%');

    // 3. Explicit non-color text label
    expect(html).toContain('Loss');

    // 4. Data-state attribute for programmatic verification
    expect(html).toContain('data-state="LOSS"');
    expect(html).toContain('<svg'); // Icon present
  });

  it('renders triple-redundant indicators for positive return (PROFIT)', () => {
    const html = renderToString(
      <AccessibleBadge amount={520.5} percentage={6.94} state="PROFIT" showLabel={true} />
    );

    expect(html).toContain('+₹520.50');
    expect(html).toContain('+6.94%');
    expect(html).toContain('Profit');
    expect(html).toContain('data-state="PROFIT"');
  });

  it('renders clean neutral indicator for zero return (NEUTRAL, EDGE-MATH-004)', () => {
    const html = renderToString(
      <AccessibleBadge amount={0} percentage={0} state="NEUTRAL" showLabel={true} />
    );

    expect(html).toContain('₹0.00');
    expect(html).toContain('0.00%');
    expect(html).toContain('No change');
    expect(html).toContain('data-state="NEUTRAL"');
  });
});

