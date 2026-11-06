import { create } from 'zustand';
import { PortfolioState } from '../calc/types';
import { getScenarioById, DEFAULT_SCENARIO_ID } from '../scenarios';

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

  // Actions
  selectScenario: (scenarioId: string) => void;
  resetDemo: () => void;
  showInactiveNotice: (tabName: string) => void;
  clearInactiveNotice: () => void;
  updatePortfolio: (updater: (prev: PortfolioState) => PortfolioState) => void;
  logAuditEvent: (action: string, details: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  scenarioId: DEFAULT_SCENARIO_ID,
  portfolio: getScenarioById(DEFAULT_SCENARIO_ID),
  auditLog: [],
  inactiveNotice: null,

  selectScenario: (scenarioId: string) => {
    set({
      scenarioId,
      portfolio: getScenarioById(scenarioId),
      auditLog: [],
      inactiveNotice: null,
    });
  },

  resetDemo: () => {
    set((state) => ({
      portfolio: getScenarioById(state.scenarioId),
      auditLog: [],
      inactiveNotice: null,
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
}));

