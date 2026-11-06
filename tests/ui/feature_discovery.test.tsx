import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderToString } from 'react-dom/server';
import { GuidedTour, TOUR_STEPS } from '@/components/shell/GuidedTour';
import { FeatureDiscoveryModal } from '@/components/shell/FeatureDiscoveryModal';
import { CoachmarkDot } from '@/components/shared/CoachmarkDot';
import { useSessionStore } from '@/lib/store/sessionStore';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/app',
}));

describe('First-Open Feature Discovery Pop-Up & Guided Tour', () => {
  beforeEach(() => {
    // Reset store before each test
    useSessionStore.setState({
      introSeen: false,
      isTourActive: true,
      tourStepIndex: 0,
      isHelpModalOpen: false,
      anonymousAnalyticsConsent: false,
      completedChecklistItems: [],
      coachmarksDismissed: {},
    });
  });

  it('renders Step 1 anchored tour pop-up with disclosure and anonymous toggle', () => {
    const html = renderToString(<GuidedTour />);

    // 1. Title and prototype disclaimers
    expect(html).toContain('Welcome to Steady, a prototype');
    expect(html).toContain('student concept');
    expect(html).toContain('sample data');
    expect(html).toContain('nothing here is investment advice');
    expect(html).toContain('Please do not enter PAN');

    // 2. Anonymous consent toggle (default off)
    expect(html).toContain('Share anonymous usage data to help this study');

    // 3. Navigation controls
    expect(html).toContain('Skip tour');
    expect(html).toContain('Next: See SIP Features');
    expect(html).toContain('1 of 5');
  });

  it('verifies all 5 tour steps strictly contain <= 40 words each', () => {
    TOUR_STEPS.forEach((step) => {
      const words = step.body.trim().split(/\s+/).length;
      expect(words).toBeLessThanOrEqual(40);
    });
  });

  it('verifies each step targets its respective UI element in order', () => {
    expect(TOUR_STEPS[0].targetAttr).toBe('welcome');
    expect(TOUR_STEPS[1].targetAttr).toBe('dip-card');
    expect(TOUR_STEPS[2].targetAttr).toBe('jargon-xirr');
    expect(TOUR_STEPS[3].targetAttr).toBe('ask-steady');
    expect(TOUR_STEPS[4].targetAttr).toBe('steady-flex');

    // Final step button is "Start exploring"
    expect(TOUR_STEPS[4].actionButtonLabel).toBe('Start exploring');
  });

  it('renders the Things to Try checklist inside the Help modal with all 5 required tasks', () => {
    useSessionStore.setState({
      isHelpModalOpen: true,
    });

    const html = renderToString(<FeatureDiscoveryModal isOpen={true} />);

    expect(html).toContain('Things to Try');
    expect(html).toContain('Tap the dip card');
    expect(html).toContain('Tap XIRR or NAV');
    expect(html).toContain('Ask a question');
    expect(html).toContain('Try skip or step-down');
    expect(html).toContain('Open the Cancel SIP screen');
    expect(html).toContain('Replay Guided Tour');
    expect(html).toContain('Informational ticks only');
  });

  it('renders and dismisses contextual coachmark dots cleanly', () => {
    const activeHtml = renderToString(
      <CoachmarkDot id="test-dot" label="Tip: Tap to read" />
    );
    expect(activeHtml).toContain('animate-ping');
    expect(activeHtml).toContain('Tip: Tap to read');

    // Dismiss coachmark
    useSessionStore.getState().dismissCoachmark('test-dot');

    const dismissedHtml = renderToString(
      <CoachmarkDot id="test-dot" label="Tip: Tap to read" />
    );
    expect(dismissedHtml).toBe('');
  });

  it('verifies resetDemo clears the intro-seen flag and re-activates the guided tour', () => {
    useSessionStore.getState().endGuidedTour(false);
    useSessionStore.getState().toggleChecklistItem('dip_card');
    useSessionStore.getState().dismissCoachmark('coachmark-steady-flex');

    expect(useSessionStore.getState().introSeen).toBe(true);
    expect(useSessionStore.getState().isTourActive).toBe(false);
    expect(useSessionStore.getState().completedChecklistItems).toContain('dip_card');
    expect(useSessionStore.getState().coachmarksDismissed['coachmark-steady-flex']).toBe(true);

    // Trigger resetDemo
    useSessionStore.getState().resetDemo();

    expect(useSessionStore.getState().introSeen).toBe(false);
    expect(useSessionStore.getState().isTourActive).toBe(true);
    expect(useSessionStore.getState().tourStepIndex).toBe(0);
    expect(useSessionStore.getState().completedChecklistItems).toEqual([]);
    expect(useSessionStore.getState().coachmarksDismissed).toEqual({});
  });
});
