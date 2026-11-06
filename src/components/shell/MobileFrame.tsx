'use client';

import React from 'react';
import { PrototypeBanner } from './PrototypeBanner';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { InactiveTabModal } from './InactiveTabModal';
import { ResetControl } from './ResetControl';

interface MobileFrameProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  hideNav?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  title,
  showBack,
  hideNav = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 flex justify-center selection:bg-primary-light">
      {/* Centered Mobile Container */}
      <div
        data-testid="mobile-frame-container"
        className="w-full max-w-mobile-frame min-h-screen bg-surface-canvas shadow-xl flex flex-col relative border-x border-slate-200"
      >
        {/* Persistent Non-Groww Prototype Disclaimer */}
        <PrototypeBanner />

        {/* Top App Chrome */}
        <TopNav title={title} showBack={showBack} />

        {/* Scrollable Viewport Content */}
        <main className="flex-1 pb-6 overflow-y-auto">{children}</main>

        {/* Bottom Tab Bar */}
        {!hideNav && <BottomNav />}

        {/* Global Modal for Inactive Tab Notices */}
        <InactiveTabModal />

        {/* Global Floating Demo Reset Control */}
        <ResetControl />
      </div>
    </div>
  );
};

