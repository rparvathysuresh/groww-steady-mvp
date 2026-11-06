'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Shield,
  Layers,
  HelpCircle,
  MessageSquare,
  SlidersHorizontal,
  X,
  CheckSquare,
  Square,
  ExternalLink,
  Play,
} from 'lucide-react';
import { useSessionStore } from '@/lib/store/sessionStore';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  actionRoute?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'dip_card',
    label: 'Tap the dip card',
    description: 'Inspect "What your last instalment bought" on the SIP detail page.',
    actionRoute: '/sip/scenario-a',
  },
  {
    id: 'glossary',
    label: 'Tap XIRR or NAV',
    description: 'Read the 1-tap plain-English glossary sheets.',
    actionRoute: '/sip/scenario-a',
  },
  {
    id: 'ask_steady',
    label: 'Ask a question',
    description: 'Test a question or advice probe ("Should I stop my SIP?").',
    actionRoute: '/sip/scenario-a',
  },
  {
    id: 'steady_flex',
    label: 'Try skip or step-down',
    description: 'Adjust mandate debits temporarily without cancelling.',
    actionRoute: '/sip/scenario-a',
  },
  {
    id: 'cancel',
    label: 'Open the Cancel SIP screen',
    description: 'Inspect the educational, non-coercive cancellation flow.',
    actionRoute: '/sip/scenario-a',
  },
];

interface FeatureDiscoveryModalProps {
  isOpen?: boolean;
}

export const FeatureDiscoveryModal: React.FC<FeatureDiscoveryModalProps> = ({
  isOpen: propIsOpen,
}) => {
  const router = useRouter();
  const {
    portfolio,
    isHelpModalOpen,
    closeHelpModal,
    startGuidedTour,
    anonymousAnalyticsConsent,
    setAnonymousAnalyticsConsent,
    completedChecklistItems,
    toggleChecklistItem,
    logAnalyticsEvent,
  } = useSessionStore();

  const isOpen = propIsOpen !== undefined ? propIsOpen : isHelpModalOpen;
  const modalRef = useRef<HTMLDivElement>(null);

  // Escape key listener & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeHelpModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeHelpModal]);

  // Open only when explicitly opened via TopNav '?' button or prop
  if (!isOpen) {
    return null;
  }

  const handleStartTour = () => {
    logAnalyticsEvent('tour_replayed_from_help');
    closeHelpModal();
    startGuidedTour(0);
  };

  const currentRoute = `/sip/${portfolio?.id || 'scenario-a'}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
    >
      {/* Modal Container: Full-width bottom sheet on mobile, rounded card on tablet/desktop */}
      <div
        ref={modalRef}
        className="w-full max-w-mobile-frame sm:max-w-md bg-surface-card rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
      >
        {/* Header Bar */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between bg-surface-card">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-primary-dark flex items-center justify-center">
              <HelpCircle size={16} />
            </div>
            <div>
              <h2 id="help-modal-title" className="text-sm font-bold text-navy">
                Help & Feature Discovery
              </h2>
              <span className="text-[10px] text-gray-400">Steady Prototype Guide</span>
            </div>
          </div>

          <button
            onClick={() => closeHelpModal()}
            className="p-1 rounded-full text-gray-400 hover:text-navy hover:bg-gray-100 transition-colors"
            aria-label="Close help"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 1. Standalone Guided Tour Launcher Banner */}
          <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-dark flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>Interactive Walkthrough</span>
                </span>
                <h3 className="text-xs font-bold text-navy">Step-by-Step Feature Discovery</h3>
                <p className="text-[11px] text-gray-600 leading-snug">
                  Highlights terms, the dip card, questions, and flex controls directly where they appear.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartTour}
              className="w-full py-2 px-3 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Play size={12} className="fill-white" />
              <span>Replay Guided Tour</span>
            </button>
          </div>

          {/* 2. "Things to Try" Checklist */}
          <div className="space-y-2">
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Things to Try
              </h3>
              <p className="text-[10px] text-gray-400 leading-tight">
                Informational ticks only. There are no points, badges, scores, or timers.
              </p>
            </div>

            <div className="space-y-2">
              {CHECKLIST_ITEMS.map((item) => {
                const isChecked = completedChecklistItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                        : 'bg-gray-50/60 border-gray-100 text-gray-700'
                    }`}
                  >
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className="mt-0.5 text-gray-400 hover:text-primary-dark transition-colors focus:outline-none"
                      aria-label={`Mark "${item.label}" as ${isChecked ? 'uncompleted' : 'completed'}`}
                    >
                      {isChecked ? (
                        <CheckSquare size={18} className="text-emerald-600" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isChecked ? 'line-through text-gray-500' : 'text-navy'
                          }`}
                        >
                          {item.label}
                        </span>
                        <button
                          onClick={() => {
                            closeHelpModal();
                            router.push(currentRoute);
                          }}
                          className="text-[10px] text-primary-dark hover:underline flex items-center gap-0.5 font-semibold"
                        >
                          <span>Try</span>
                          <ExternalLink size={10} />
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-snug">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Standing Prototype Disclosure & Anonymous Research Toggle */}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700 block mb-0.5">Prototype Disclosure</span>
              Steady is a student research prototype built with sample data. It is not Groww and
              contains no investment advice. Never enter real account details.
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-left">
              <input
                type="checkbox"
                checked={anonymousAnalyticsConsent}
                onChange={(e) => setAnonymousAnalyticsConsent(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-[10px] text-gray-600 leading-snug">
                Share anonymous usage events to assist evaluation study (default off).
              </span>
            </label>
          </div>
        </div>

        {/* Footer Close */}
        <div className="p-4 border-t border-gray-100 bg-surface-card">
          <button
            onClick={() => closeHelpModal()}
            className="w-full py-2.5 px-4 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-semibold shadow-xs transition-colors text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
