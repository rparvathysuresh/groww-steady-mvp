import { PortfolioState } from '../calc/types';

export const SCENARIO_C: PortfolioState = {
  id: 'scenario-c',
  scenarioName: 'Scenario C: Flat Returns & Jargon Confusion (Month 5)',
  personaName: 'Rohan',
  description:
    'Rohan has completed 5 instalments of ₹2,000. Returns are essentially flat (+0.5%). He is confused by what NAV means compared to share prices and why his annualized XIRR looks unfamiliar.',
  schemeName: 'Sample Index Fund',
  monthlyAmount: 2000,
  instalments: [
    {
      id: 'inst-c-1',
      instalmentNumber: 1,
      date: '2026-06-15',
      amount: 2000,
      nav: 170.00,
      unitsPurchased: 11.7647,
    },
    {
      id: 'inst-c-2',
      instalmentNumber: 2,
      date: '2026-07-15',
      amount: 2000,
      nav: 172.50,
      unitsPurchased: 11.5942,
    },
    {
      id: 'inst-c-3',
      instalmentNumber: 3,
      date: '2026-08-15',
      amount: 2000,
      nav: 169.80,
      unitsPurchased: 11.7786,
    },
    {
      id: 'inst-c-4',
      instalmentNumber: 4,
      date: '2026-09-15',
      amount: 2000,
      nav: 171.20,
      unitsPurchased: 11.6822,
    },
    {
      id: 'inst-c-5',
      instalmentNumber: 5,
      date: '2026-10-15',
      amount: 2000,
      nav: 170.90,
      unitsPurchased: 11.7028,
    },
  ],
  latestNav: 171.10,
  latestNavDate: '2026-11-01',
  nextDebitDate: '2026-11-15',
  mandateStatus: 'ACTIVE',
};

