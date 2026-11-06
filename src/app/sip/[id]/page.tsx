'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MobileFrame } from '@/components/shell/MobileFrame';
import { SIPHeader } from '@/components/sip/SIPHeader';
import { MetricGrid } from '@/components/sip/MetricGrid';
import { InstalmentList } from '@/components/sip/InstalmentList';
import { ActionFooter } from '@/components/sip/ActionFooter';
import { DipCard } from '@/components/context/DipCard';
import { JargonSheet } from '@/components/context/JargonSheet';
import { ChatDrawer } from '@/components/context/ChatDrawer';
import { FlexModal } from '@/components/flex/FlexModal';
import { CancelSheet } from '@/components/cancellation/CancelSheet';
import { useSessionStore } from '@/lib/store/sessionStore';
import { computePortfolioMetrics } from '@/lib/calc/engine';
import { APP_CONFIG } from '@/lib/config';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function SIPDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { portfolio } = useSessionStore();
  const metrics = computePortfolioMetrics(portfolio);

  const [jargonTerm, setJargonTerm] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFlexOpen, setIsFlexOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [flexInitialTab, setFlexInitialTab] = useState<'skip' | 'stepdown' | 'audit'>('skip');

  return (
    <MobileFrame title={portfolio.schemeName} showBack={true}>
      <div className="p-4 space-y-4">
        {/* 1. Header Overview */}
        <SIPHeader portfolio={portfolio} />

        {/* 2. Key Metrics & Returns with Tappable Terms */}
        <MetricGrid metrics={metrics} onJargonClick={(term) => setJargonTerm(term)} />

        {/* 3. Point-of-Doubt Steady Context Card (Eval-Gated AI Feature) */}
        <DipCard portfolio={portfolio} metrics={metrics} />

        {/* 4. Ask Steady Context Assistant CTA */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="w-full bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/90 text-primary-dark font-semibold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-between shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={15} />
            <span className="text-navy font-bold">Have a doubt about this SIP?</span>
          </div>
          <span className="text-[11px] underline">Ask Steady</span>
        </button>

        {/* 5. Historical Instalments */}
        <InstalmentList instalments={portfolio.instalments} />

        {/* 6. Mandate & Cancellation Actions */}
        <ActionFooter
          mandateStatus={portfolio.mandateStatus}
          onFlexClick={() => {
            setFlexInitialTab('skip');
            setIsFlexOpen(true);
          }}
          onCancelClick={() => setIsCancelOpen(true)}
          onViewAuditClick={() => {
            setFlexInitialTab('audit');
            setIsFlexOpen(true);
          }}
        />

        {/* Standing Legal Disclaimer */}
        <footer className="pt-2 text-center">
          <p className="text-[10px] text-gray-400 leading-normal px-2">
            {APP_CONFIG.STANDING_DISCLOSURE}
          </p>
        </footer>
      </div>

      {/* 1-Tap Jargon Explanation Sheet */}
      <JargonSheet
        term={jargonTerm}
        portfolio={portfolio}
        metrics={metrics}
        onClose={() => setJargonTerm(null)}
      />

      {/* Free-Text Conversational Question Sheet */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenFlex={() => {
          setIsChatOpen(false);
          setFlexInitialTab('skip');
          setIsFlexOpen(true);
        }}
      />

      {/* Steady Flex Controls Modal (Skip / Step Down / Audit Log) */}
      <FlexModal
        isOpen={isFlexOpen}
        initialTab={flexInitialTab}
        portfolio={portfolio}
        onClose={() => setIsFlexOpen(false)}
      />

      {/* Informational Anti-Coercion Cancellation Sheet */}
      <CancelSheet
        isOpen={isCancelOpen}
        portfolio={portfolio}
        onClose={() => setIsCancelOpen(false)}
        onOpenFlexSkip={() => {
          setIsCancelOpen(false);
          setFlexInitialTab('skip');
          setIsFlexOpen(true);
        }}
        onOpenFlexStepDown={() => {
          setIsCancelOpen(false);
          setFlexInitialTab('stepdown');
          setIsFlexOpen(true);
        }}
        onCancelled={() => {
          setIsCancelOpen(false);
        }}
      />
    </MobileFrame>
  );
}
