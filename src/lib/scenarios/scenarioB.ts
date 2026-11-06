import { PortfolioState } from '../calc/types';

export const SCENARIO_B: PortfolioState = {
  id: 'scenario-b',
  scenarioName: 'Scenario B: Cash Crunch & Tight Month (Month 6)',
  personaName: 'Priya',
  description:
    'Priya has invested ₹15,000 across 5 instalments. An unexpected emergency expense occurred this month. Her upcoming debit is in 4 days, and she is contemplating cancelling her SIP.',
  schemeName: 'Sample Index Fund',
  monthlyAmount: 3000,
  instalments: [
    {
      id: 'inst-b-1',
      instalmentNumber: 1,
      date: '2026-06-10',
      amount: 3000,
      nav: 162.50,
      unitsPurchased: 18.4615,
    },
    {
      id: 'inst-b-2',
      instalmentNumber: 2,
      date: '2026-07-10',
      amount: 3000,
      nav: 165.20,
      unitsPurchased: 18.1598,
    },
    {
      id: 'inst-b-3',
      instalmentNumber: 3,
      date: '2026-08-10',
      amount: 3000,
      nav: 168.00,
      unitsPurchased: 17.8571,
    },
    {
      id: 'inst-b-4',
      instalmentNumber: 4,
      date: '2026-09-10',
      amount: 3000,
      nav: 171.40,
      unitsPurchased: 17.5029,
    },
    {
      id: 'inst-b-5',
      instalmentNumber: 5,
      date: '2026-10-10',
      amount: 3000,
      nav: 174.10,
      unitsPurchased: 17.2315,
    },
  ],
  latestNav: 175.20,
  latestNavDate: '2026-11-06',
  nextDebitDate: '2026-11-10', // Due in 4 days!
  mandateStatus: 'ACTIVE',
};

