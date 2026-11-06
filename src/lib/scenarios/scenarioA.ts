import { PortfolioState } from '../calc/types';

export const SCENARIO_A: PortfolioState = {
  id: 'scenario-a',
  scenarioName: 'Scenario A: Volatility & Point of Doubt (Month 3)',
  personaName: 'Aarav',
  description:
    'Aarav started his first SIP 3 months ago. The market pulled back, and his portfolio is showing in red with a negative annualized XIRR. He is anxious and wondering if he lost money.',
  schemeName: 'Sample Index Fund',
  monthlyAmount: 2500,
  instalments: [
    {
      id: 'inst-a-1',
      instalmentNumber: 1,
      date: '2026-08-05',
      amount: 2500,
      nav: 176.40,
      unitsPurchased: 14.1723,
    },
    {
      id: 'inst-a-2',
      instalmentNumber: 2,
      date: '2026-09-05',
      amount: 2500,
      nav: 172.10,
      unitsPurchased: 14.5264,
    },
    {
      id: 'inst-a-3',
      instalmentNumber: 3,
      date: '2026-10-05',
      amount: 2500,
      nav: 168.90,
      unitsPurchased: 14.8017,
    },
  ],
  latestNav: 166.85,
  latestNavDate: '2026-10-20',
  nextDebitDate: '2026-11-05',
  mandateStatus: 'ACTIVE',
};
