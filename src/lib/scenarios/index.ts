import { PortfolioState } from '../calc/types';
import { SCENARIO_A } from './scenarioA';
import { SCENARIO_B } from './scenarioB';
import { SCENARIO_C } from './scenarioC';

export const ALL_SCENARIOS: Record<string, PortfolioState> = {
  'scenario-a': SCENARIO_A,
  'scenario-b': SCENARIO_B,
  'scenario-c': SCENARIO_C,
};

export const DEFAULT_SCENARIO_ID = 'scenario-a';

export function getScenarioById(id: string): PortfolioState {
  // Deep clone to prevent mutations across runs
  const scenario = ALL_SCENARIOS[id] || ALL_SCENARIOS[DEFAULT_SCENARIO_ID];
  return JSON.parse(JSON.stringify(scenario));
}

export { SCENARIO_A, SCENARIO_B, SCENARIO_C };

