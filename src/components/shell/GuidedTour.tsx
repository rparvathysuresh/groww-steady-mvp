'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  HelpCircle,
  MessageSquare,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useSessionStore } from '@/lib/store/sessionStore';

export interface TourStep {
  id: string;
  targetAttr: string;
  stepNum: number;
  totalSteps: number;
  badge: string;
  title: string;
  body: string;
  preferredPlacement: 'bottom' | 'top';
  actionButtonLabel?: string;
  icon: React.ReactNode;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    targetAttr: 'welcome',
    stepNum: 1,
    totalSteps: 5,
    badge: '1 of 5 • Prototype Disclosure',
    title: 'Welcome to Steady, a prototype',
    body: 'This is a student concept built in a Groww-like experience, using sample data. It is not Groww and nothing here is investment advice. Please do not enter PAN, account or personal details.',
    preferredPlacement: 'bottom',
    actionButtonLabel: 'Next: See SIP Features',
    icon: <Shield size={16} className="text-emerald-600" />,
  },
  {
    id: 'dip-card',
    targetAttr: 'dip-card',
    stepNum: 2,
    totalSteps: 5,
    badge: '2 of 5 • Point-of-Doubt Card',
    title: 'See what your numbers mean',
    body: 'On the SIP page, a card explains in plain words what your last instalment bought. Tap underlined terms like XIRR or NAV for a one-tap explanation.',
    preferredPlacement: 'bottom',
    actionButtonLabel: 'Next: Tap Terms',
    icon: <Layers size={16} className="text-indigo-600" />,
  },
  {
    id: 'jargon-xirr',
    targetAttr: 'jargon-xirr',
    stepNum: 3,
    totalSteps: 5,
    badge: '3 of 5 • One-Tap Glossary',
    title: 'Tap XIRR or NAV for clarity',
    body: 'Tap the question mark next to XIRR or NAV for a one-tap plain-language explanation without financial jargon.',
    preferredPlacement: 'bottom',
    actionButtonLabel: 'Next: Ask Steady',
    icon: <HelpCircle size={16} className="text-amber-600" />,
  },
  {
    id: 'ask-steady',
    targetAttr: 'ask-steady',
    stepNum: 4,
    totalSteps: 5,
    badge: '4 of 5 • Non-Advisory Assistant',
    title: 'Ask your own question',
    body: 'Ask about a term or something you see on screen. If you ask whether to buy, sell, continue or stop, Steady will decline and point to official sources. A "Checked" chip shows numbers come from sample data.',
    preferredPlacement: 'bottom',
    actionButtonLabel: 'Next: Adjust SIP',
    icon: <MessageSquare size={16} className="text-teal-600" />,
  },
  {
    id: 'steady-flex',
    targetAttr: 'steady-flex',
    stepNum: 5,
    totalSteps: 5,
    badge: '5 of 5 • Steady Flex Controls',
    title: 'Adjust without cancelling',
    body: 'Skip a month or lower the amount for a few months. This is simulated, so no real money moves, and Cancel stays available.',
    preferredPlacement: 'top',
    actionButtonLabel: 'Start exploring',
    icon: <SlidersHorizontal size={16} className="text-emerald-600" />,
  },
];

export const GuidedTour: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isTourActive,
    tourStepIndex,
    setTourStep,
    endGuidedTour,
    portfolio,
    anonymousAnalyticsConsent,
    setAnonymousAnalyticsConsent,
    logAnalyticsEvent,
  } = useSessionStore();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('bottom');
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[tourStepIndex] || TOUR_STEPS[0];
  const portfolioId = portfolio?.id || 'scenario-a';
  const sipDetailRoute = `/sip/${portfolioId}`;

  // Helper to determine the target route for a step
  const getStepRoute = useCallback(
    (step: TourStep): string => {
      if (step.id === 'welcome') {
        if (pathname?.startsWith('/sip/')) {
          return pathname;
        }
        return '/app';
      }
      return sipDetailRoute;
    },
    [pathname, sipDetailRoute]
  );

  // Route synchronization
  useEffect(() => {
    if (!isTourActive) return;

    const expectedRoute = getStepRoute(currentStep);
    if (pathname && pathname !== expectedRoute && !pathname.startsWith('/sip/') && currentStep.id !== 'welcome') {
      router.push(expectedRoute);
    }
  }, [isTourActive, currentStep, pathname, router, getStepRoute]);

  // Target element lookup & coordinate calculation
  useEffect(() => {
    if (!isTourActive) {
      setTargetRect(null);
      return;
    }

    let isMounted = true;
    let pollCount = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const updatePosition = () => {
      if (!isMounted) return;

      let targetEl = document.querySelector(`[data-tour="${currentStep.targetAttr}"]`);

      // Fallback for welcome step if on /sip/ page
      if (!targetEl && currentStep.id === 'welcome') {
        targetEl =
          document.querySelector('[data-tour="sip-header"]') ||
          document.querySelector('[data-tour="welcome"]');
      }

      if (targetEl) {
        // Smart scroll alignment based on element height
        if (currentStep.id === 'dip-card') {
          // Dip card is tall: scroll it to top (respecting scroll-mt-24) so popover below has maximum room
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // All other steps (including ask-steady): scroll cleanly to center of the viewport
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const rect = targetEl.getBoundingClientRect();
        setTargetRect(rect);

        // Check space above vs below accounting for top chrome (80px) and bottom nav (60px)
        const spaceBelow = window.innerHeight - rect.bottom - 60;
        const spaceAbove = rect.top - 80;

        if (currentStep.preferredPlacement === 'top') {
          setPlacement('top');
        } else if (spaceBelow < 240 && spaceAbove > spaceBelow) {
          setPlacement('top');
        } else {
          setPlacement('bottom');
        }
      } else if (pollCount < 12) {
        pollCount++;
        timeoutId = setTimeout(updatePosition, 150);
      }
    };

    updatePosition();

    // Re-check after smooth scroll settles
    const t1 = setTimeout(updatePosition, 100);
    const t2 = setTimeout(updatePosition, 300);
    const t3 = setTimeout(updatePosition, 550);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isTourActive, currentStep, pathname]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        endGuidedTour(true);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourActive, tourStepIndex]);

  if (!isTourActive) {
    return null;
  }

  const handleNext = () => {
    if (tourStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = tourStepIndex + 1;
      const nextStep = TOUR_STEPS[nextIndex];
      const targetRoute = getStepRoute(nextStep);
      setTourStep(nextIndex);
      if (pathname !== targetRoute) {
        router.push(targetRoute);
      }
    } else {
      // Completed all steps: "Start exploring"
      endGuidedTour(false);
    }
  };

  const handlePrev = () => {
    if (tourStepIndex > 0) {
      const prevIndex = tourStepIndex - 1;
      const prevStep = TOUR_STEPS[prevIndex];
      const targetRoute = getStepRoute(prevStep);
      setTourStep(prevIndex);
      if (pathname !== targetRoute) {
        router.push(targetRoute);
      }
    }
  };

  // Comfortable width for the card (breathable, up to 395px on wider screens)
  const popoverWidth = typeof window !== 'undefined' ? Math.min(395, window.innerWidth - 24) : 360;

  // Calculate popover style with viewport safety clamping
  const getPopoverStyle = (): React.CSSProperties => {
    if (!targetRect || typeof window === 'undefined') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${popoverWidth}px`,
        maxHeight: 'calc(100vh - 32px)',
        zIndex: 60,
      };
    }

    const idealLeft = targetRect.left + targetRect.width / 2 - popoverWidth / 2;
    const clampedLeft = Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, idealLeft));
    const windowH = window.innerHeight;
    const popoverH = popoverRef.current?.offsetHeight || 240;

    if (placement === 'top') {
      const idealBottom = windowH - targetRect.top + 14;
      const clampedBottom = Math.min(windowH - popoverH - 80, idealBottom);

      return {
        position: 'fixed',
        bottom: `${Math.max(72, clampedBottom)}px`,
        left: `${clampedLeft}px`,
        width: `${popoverWidth}px`,
        maxHeight: 'calc(100vh - 88px)',
        zIndex: 60,
      };
    }

    // Default: 'bottom'
    const idealTop = targetRect.bottom + 14;

    // Safety guard: if popover would overflow into bottom nav, pin safely above it
    if (idealTop + popoverH > windowH - 72) {
      return {
        position: 'fixed',
        bottom: '72px',
        left: `${clampedLeft}px`,
        width: `${popoverWidth}px`,
        maxHeight: 'calc(100vh - 88px)',
        zIndex: 60,
      };
    }

    return {
      position: 'fixed',
      top: `${Math.max(80, idealTop)}px`,
      left: `${clampedLeft}px`,
      width: `${popoverWidth}px`,
      maxHeight: 'calc(100vh - 88px)',
      zIndex: 60,
    };
  };

  // Dimensions for the spotlight box
  const isSmall = targetRect ? targetRect.width < 32 || targetRect.height < 32 : false;
  const paddingX = isSmall && targetRect ? Math.max(10, (38 - targetRect.width) / 2) : 8;
  const paddingY = isSmall && targetRect ? Math.max(10, (38 - targetRect.height) / 2) : 8;
  const boxTop = targetRect ? Math.max(0, targetRect.top - paddingY) : 0;
  const boxLeft = targetRect ? Math.max(0, targetRect.left - paddingX) : 0;
  const boxWidth = targetRect ? targetRect.width + paddingX * 2 : 0;
  const boxHeight = targetRect ? targetRect.height + paddingY * 2 : 0;

  // Arrow left coordinate
  const currentLeft =
    targetRect && typeof window !== 'undefined'
      ? Math.max(12, Math.min(window.innerWidth - popoverWidth - 12, targetRect.left + targetRect.width / 2 - popoverWidth / 2))
      : 16;
  const arrowLeft = targetRect
    ? Math.max(24, Math.min(popoverWidth - 38, targetRect.left + targetRect.width / 2 - currentLeft - 7))
    : 24;

  return (
    <>
      {/* 1. Backdrop to prevent accidental clicks behind active tour card */}
      <div
        className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-2xs pointer-events-auto"
        onClick={(e) => {
          e.stopPropagation();
        }}
        aria-hidden="true"
      />

      {/* 2. Spotlight Overlay with Cutout Mask around Target Element */}
      {targetRect && (
        <div
          data-testid="tour-spotlight-box"
          style={{
            position: 'fixed',
            top: boxTop,
            left: boxLeft,
            width: boxWidth,
            height: boxHeight,
          }}
          className="pointer-events-none z-50 rounded-2xl ring-4 ring-emerald-400 ring-offset-2 ring-offset-slate-900/60 shadow-[0_0_0_9999px_rgba(15,23,42,0.65)] transition-all duration-300"
        />
      )}

      {/* 3. Anchored Feature Discovery Popover Card */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-step-title"
        style={getPopoverStyle()}
        className="bg-surface-card rounded-3xl shadow-2xl shadow-slate-900/20 border border-gray-150 p-5 sm:p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 select-none z-[60] pointer-events-auto relative"
      >
        {/* Pointer Arrow pointing directly to target element without overlapping content */}
        {targetRect && (
          <div
            style={{ left: `${arrowLeft}px` }}
            className={`absolute w-3.5 h-3.5 bg-surface-card rotate-45 border-gray-150 ${
              placement === 'top'
                ? '-bottom-[7px] border-b border-r'
                : '-top-[7px] border-t border-l'
            }`}
          />
        )}

        {/* Step Badge & Skip Button Header */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/80">
              {currentStep.icon}
            </div>
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
              {currentStep.badge}
            </span>
          </div>

          <button
            onClick={() => endGuidedTour(true)}
            className="text-xs font-semibold text-gray-400 hover:text-navy px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Skip guided tour"
          >
            Skip tour
          </button>
        </div>

        {/* Title & Body with breathable spacing */}
        <div className="space-y-2">
          <h3 id="tour-step-title" className="text-base sm:text-[17px] font-bold text-navy leading-snug tracking-tight">
            {currentStep.title}
          </h3>
          <p className="text-[13px] sm:text-sm text-gray-600 leading-relaxed font-normal">
            {currentStep.body}
          </p>
        </div>

        {/* Card 1: Anonymous Study Consent Toggle with generous internal padding */}
        {currentStep.id === 'welcome' && (
          <div className="pt-0.5">
            <label className="flex items-start gap-3 bg-gray-50/90 hover:bg-gray-100/90 p-3 rounded-2xl border border-gray-150 cursor-pointer transition-colors text-left">
              <input
                type="checkbox"
                checked={anonymousAnalyticsConsent}
                onChange={(e) => setAnonymousAnalyticsConsent(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer shrink-0"
              />
              <span className="text-xs text-gray-600 leading-normal font-normal">
                Share anonymous usage data to help this study (default off, no personal data stored).
              </span>
            </label>
          </div>
        )}

        {/* Tour Navigation Controls with breathable spacing */}
        <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-3">
          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {TOUR_STEPS.map((s, idx) => (
              <span
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${
                  idx === tourStepIndex ? 'w-5 bg-primary-dark' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            {tourStepIndex > 0 && (
              <button
                onClick={handlePrev}
                className="py-2 px-3.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="py-2 px-4 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{currentStep.actionButtonLabel || 'Next'}</span>
              {tourStepIndex === TOUR_STEPS.length - 1 ? (
                <Sparkles size={14} className="text-emerald-400" />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
