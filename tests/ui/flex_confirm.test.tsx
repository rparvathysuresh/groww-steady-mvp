import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { FlexConfirmDialog } from '@/components/flex/FlexConfirmDialog';
import { SkipStepSheet } from '@/components/flex/SkipStepSheet';
import { StepDownSheet } from '@/components/flex/StepDownSheet';
import { SCENARIO_A } from '@/lib/scenarios/scenarioA';

describe('Steady Flex Confirmation Box', () => {
  it('renders FlexConfirmDialog with title, details, and action buttons', () => {
    const html = renderToString(
      <FlexConfirmDialog
        isOpen={true}
        title="Confirm 1-Month Skip?"
        description="Please review before confirming."
        variant="amber"
        details={[
          { label: 'Upcoming Debit Date', value: '05 Nov 2026' },
          { label: 'Amount for this cycle', value: '₹0 (Skipped)', highlight: true },
        ]}
        confirmLabel="Yes, Skip Instalment"
        cancelLabel="Go Back"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(html).toContain('Confirm 1-Month Skip?');
    expect(html).toContain('Please review before confirming');
    expect(html).toContain('Upcoming Debit Date');
    expect(html).toContain('05 Nov 2026');
    expect(html).toContain('₹0 (Skipped)');
    expect(html).toContain('Yes, Skip Instalment');
    expect(html).toContain('Go Back');
    expect(html).toContain('No penalties or fees apply');
  });

  it('does not render when isOpen is false', () => {
    const html = renderToString(
      <FlexConfirmDialog
        isOpen={false}
        title="Confirm 1-Month Skip?"
        description="Test"
        details={[]}
        confirmLabel="Confirm"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(html).toBe('');
  });

  it('renders SkipStepSheet with confirmation button ready to trigger confirmation box', () => {
    const html = renderToString(
      <SkipStepSheet
        portfolio={SCENARIO_A}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(html).toContain('Confirm 1-Month Skip');
    expect(html).toContain('Keep As Is');
  });

  it('renders StepDownSheet with amount selector and confirmation trigger', () => {
    const html = renderToString(
      <StepDownSheet
        portfolio={SCENARIO_A}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    );

    expect(html).toContain('Step Down Temporarily');
    expect(html).toMatch(/Confirm Step-Down to ₹.*500/);
    expect(html).toContain('Keep As Is');
  });
});
