'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/lib/store/sessionStore';
import { ALL_SCENARIOS } from '@/lib/scenarios';
import { APP_CONFIG } from '@/lib/config';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  User,
  Compass,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { scenarioId, selectScenario, resetDemo } = useSessionStore();

  const handleLaunch = (id: string) => {
    selectScenario(id);
    router.push('/app');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      <div className="max-w-2xl mx-auto w-full space-y-6 pt-4">
        {/* Top Header & Prototype Banner */}
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Sparkles size={13} />
            <span>Groww MVP</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Groww <span className="text-primary">{APP_CONFIG.WORDMARK}</span>
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            An eval-gated point-of-doubt companion and flexible SIP controls prototype designed for
            first-time mutual fund investors during market dips and tight-money months.
          </p>
        </header>

        {/* Prototype Academic Notice */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-300">
          <AlertCircle size={18} className="text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-white">Independent Prototype</p>
            <p className="text-slate-400 leading-normal">
              This prototype runs on synthetic sample data. It is not affiliated with or endorsed by Groww,
              and contains no investment advice, real bank connections, or real financial transactions.
            </p>
          </div>
        </div>

        {/* 1. Scenario Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Select an Investor Persona
            </h2>
            <span className="text-xs text-primary font-medium">Select & Launch</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {Object.values(ALL_SCENARIOS).map((sc) => {
              const isSelected = sc.id === scenarioId;
              return (
                <div
                  key={sc.id}
                  onClick={() => selectScenario(sc.id)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all text-left relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-primary ring-1 ring-primary shadow-lg shadow-emerald-950/40'
                      : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white flex items-center gap-1.5">
                        <User size={14} className="text-primary" />
                        {sc.personaName}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {sc.scenarioName.split(':')[0]}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-slate-200">
                      {sc.scenarioName.split(':')[1] || sc.scenarioName}
                    </h3>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {sc.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      SIP: ₹{sc.monthlyAmount}/mo • {sc.instalments.length} debits
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunch(sc.id);
                      }}
                      className="font-medium text-primary hover:text-emerald-300 flex items-center gap-1"
                    >
                      <span>Launch</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. "Try this task" Panel for Mentors and Evaluators */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Compass size={14} className="text-primary" />
            <span>Suggested Evaluation Tasks</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-white block">1. Understand a Dip</strong>
              <p className="text-slate-400 text-[11px]">
                Launch Scenario A. Inspect the Point-of-Doubt card and short-tenure XIRR context.
              </p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-white block">2. Handle Cash Crunch</strong>
              <p className="text-slate-400 text-[11px]">
                Launch Scenario B. Tap on active SIP to explore lighter mandate adjustments.
              </p>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-white block">3. Jargon Clarity</strong>
              <p className="text-slate-400 text-[11px]">
                Tap on XIRR, NAV, or Units on the SIP detail page to read plain explanations.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => handleLaunch(scenarioId)}
              className="w-full sm:w-auto bg-primary hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Prototype with {ALL_SCENARIOS[scenarioId]?.personaName || 'Selected Persona'}</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={resetDemo}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw size={12} />
              <span>Reset Local State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Discrete Footer with Evaluation Dashboard Link */}
      <footer className="max-w-2xl mx-auto w-full pt-8 pb-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <span>Groww Steady MVP • Original Assets Only</span>
        <div className="flex items-center gap-4">
          <Link
            href="/evaluators"
            className="text-primary hover:underline flex items-center gap-1 text-[11px] font-medium"
          >
            <span>Evaluation Dashboard</span>
            <ExternalLink size={11} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
