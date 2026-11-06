import { create } from 'zustand';
import { PortfolioState } from '../calc/types';
import { getScenarioById, DEFAULT_SCENARIO_ID } from '../scenarios';

const STORAGE_KEY_INTRO_SEEN = 'groww_steady_intro_seen';
const STORAGE_KEY_CONSENT = 'groww_steady_analytics_consent';

function getStoredBoolean(key: string, defaultVal: boolean = false): boolean {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val === 'true' : defaultVal;
  } catch (_) {
    return defaultVal;
  }
}

function setStoredBoolean(key: string, value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, String(value));
  } catch (_) {}
}

function removeStoredItem(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (_) {}
}

interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  details: string;
}

interface SessionState {
  scenarioId: string;
  portfolio: PortfolioState;
  auditLog: AuditEvent[];
  inactiveNotice: string | null;

  // Feature Discovery & Help Modal
  introSeen: boolean;
  isHelpModalOpen: boolean;
  helpActiveTab: 'tour' | 'checklist';
  isTourActive: boolean;
  tourStepIndex: number;
  anonymousAnalyticsConsent: boolean;
  completedChecklistItems: string[];
  coachmarksDismissed: Record<string, boolean>;
  analyticsEvents: Array<{ event: string; timestamp: string; details?: any }>;

  // Actions
  selectScenario: (scenarioId: string) => void;
  resetDemo: () => void;
  showInactiveNotice: (tabName: string) => void;
  clearInactiveNotice: () => void;
  updatePortfolio: (updater: (prev: PortfolioState) => PortfolioState) => void;
  logAuditEvent: (action: string, details: string) => void;

  // Discovery Actions
  setIntroSeen: (seen: boolean) => void;
  openHelpModal: (tab?: 'tour' | 'checklist') => void;
  closeHelpModal: () => void;
  startGuidedTour: (startIndex?: number) => void;
  setTourStep: (step: number) => void;
  endGuidedTour: (skip?: boolean) => void;
  setAnonymousAnalyticsConsent: (consent: boolean) => void;
  toggleChecklistItem: (id: string) => void;
  dismissCoachmark: (id: string) => void;
  logAnalyticsEvent: (event: string, details?: any) => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  scenarioId: DEFAULT_SCENARIO_ID,
  portfolio: getScenarioById(DEFAULT_SCENARIO_ID),
  auditLog: [],
  inactiveNotice: null,

  // Feature Discovery & Help defaults
  introSeen: getStoredBoolean(STORAGE_KEY_INTRO_SEEN, false),
  isHelpModalOpen: false,
  helpActiveTab: 'checklist',
  isTourActive: !getStoredBoolean(STORAGE_KEY_INTRO_SEEN, false),
  tourStepIndex: 0,
  anonymousAnalyticsConsent: getStoredBoolean(STORAGE_KEY_CONSENT, false),
  completedChecklistItems: [],
  coachmarksDismissed: {},
  analyticsEvents: [],

  selectScenario: (scenarioId: string) => {
    const introAlreadySeen = getStoredBoolean(STORAGE_KEY_INTRO_SEEN, false);
    set({
      scenarioId,
      portfolio: getScenarioById(scenarioId),
      auditLog: [],
      inactiveNotice: null,
      isTourActive: !introAlreadySeen,
      tourStepIndex: 0,
    });
  },

  resetDemo: () => {
    removeStoredItem(STORAGE_KEY_INTRO_SEEN);
    set((state) => ({
      portfolio: getScenarioById(state.scenarioId),
      auditLog: [],
      inactiveNotice: null,
      introSeen: false,
      isHelpModalOpen: false,
      isTourActive: true, // Start fresh spotlight tour from step 1
      tourStepIndex: 0,
      helpActiveTab: 'checklist',
      completedChecklistItems: [],
      coachmarksDismissed: {},
    }));
  },

  showInactiveNotice: (tabName: string) => {
    set({
      inactiveNotice: `The "${tabName}" section is not part of this prototype. This prototype focuses exclusively on the Mutual Funds SIP experience.`,
    });
  },

  clearInactiveNotice: () => {
    set({ inactiveNotice: null });
  },

  updatePortfolio: (updater) => {
    set((state) => ({
      portfolio: updater(state.portfolio),
    }));
  },

  logAuditEvent: (action: string, details: string) => {
    set((state) => ({
      auditLog: [
        {
          id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
          action,
          details,
        },
        ...state.auditLog,
      ],
    }));
  },

  setIntroSeen: (seen: boolean) => {
    setStoredBoolean(STORAGE_KEY_INTRO_SEEN, seen);
    set({ introSeen: seen, isTourActive: !seen });
  },

  startGuidedTour: (startIndex = 0) => {
    const { logAnalyticsEvent } = get();
    logAnalyticsEvent('guided_tour_started', { startIndex });
    set({
      isTourActive: true,
      tourStepIndex: startIndex,
      isHelpModalOpen: false,
    });
  },

  setTourStep: (step: number) => {
    const { logAnalyticsEvent } = get();
    logAnalyticsEvent('guided_tour_step_changed', { step });
    set({ tourStepIndex: step });
  },

  endGuidedTour: (skip = false) => {
    const { logAnalyticsEvent } = get();
    setStoredBoolean(STORAGE_KEY_INTRO_SEEN, true);
    logAnalyticsEvent('guided_tour_ended', { skip });
    set({
      isTourActive: false,
      introSeen: true,
      tourStepIndex: 0,
    });
  },

  openHelpModal: (tab = 'checklist') => {
    const { logAnalyticsEvent } = get();
    logAnalyticsEvent('help_modal_opened', { tab });
    set({ isHelpModalOpen: true, helpActiveTab: tab });
  },

  closeHelpModal: () => {
    set({ isHelpModalOpen: false });
  },

  setAnonymousAnalyticsConsent: (consent: boolean) => {
    setStoredBoolean(STORAGE_KEY_CONSENT, consent);
    set({ anonymousAnalyticsConsent: consent });
    if (consent) {
      get().logAnalyticsEvent('analytics_consent_granted');
    }
  },

  toggleChecklistItem: (id: string) => {
    const { completedChecklistItems, logAnalyticsEvent } = get();
    const isCompleted = completedChecklistItems.includes(id);
    const updated = isCompleted
      ? completedChecklistItems.filter((item) => item !== id)
      : [...completedChecklistItems, id];

    set({ completedChecklistItems: updated });
    logAnalyticsEvent('checklist_item_toggled', { id, completed: !isCompleted });
  },

  dismissCoachmark: (id: string) => {
    const { coachmarksDismissed, logAnalyticsEvent } = get();
    if (!coachmarksDismissed[id]) {
      set({
        coachmarksDismissed: {
          ...coachmarksDismissed,
          [id]: true,
        },
      });
      logAnalyticsEvent('coachmark_dismissed', { id });
    }
  },

  logAnalyticsEvent: (event: string, details?: any) => {
    const { anonymousAnalyticsConsent } = get();
    // Only log if explicit consent is given
    if (!anonymousAnalyticsConsent) return;

    set((state) => ({
      analyticsEvents: [
        {
          event,
          timestamp: new Date().toISOString(),
          details,
        },
        ...state.analyticsEvents,
      ],
    }));
  },
}));

