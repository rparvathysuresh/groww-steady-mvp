'use client';

import React, { useEffect, useState } from 'react';
import { PortfolioState, ComputedMetrics } from '@/lib/calc/types';
import { formatINR, formatDateShort } from '@/lib/utils/format';
import { Sparkles, Layers, ArrowUpRight, TrendingDown } from 'lucide-react';
import { CheckedChip } from './CheckedChip';

interface DipCardProps {
  portfolio: PortfolioState;
  metrics: ComputedMetrics;
}

export const DipCard: React.FC<DipCardProps> = ({ portfolio, metrics }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [uncertaintyNotice, setUncertaintyNotice] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const latestInst = portfolio.instalments[portfolio.instalments.length - 1];

  useEffect(() => {
    let isMounted = true;

    async function fetchExplanation() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId: portfolio.id,
            intent: 'explain_dip',
          }),
        });

        if (!res.ok) throw new Error('Failed to fetch explanation');
        const data = await res.json();

        if (isMounted) {
          setExplanation(data.output);
          setIsFallback(data.isFallback);
          setUncertaintyNotice(data.uncertaintyNotice);
        }
      } catch (err) {
        if (isMounted) {
          setExplanation(
            `Your portfolio value is currently ${formatINR(
              metrics.currentValue
            )}. In early months, portfolio balances primarily reflect deposits made, while units remain owned in your account.`
          );
          setIsFallback(true);
          setUncertaintyNotice(
            "We couldn't verify this explanation right now, so here is our standard explanation instead."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [portfolio.id]);

  if (!metrics.isDipState && !metrics.isDebitNear) {
    return null;
  }

  return (
    <div
      data-testid="dip-card"
      className="bg-surface-card rounded-2xl p-4 border border-border-subtle shadow-xs space-y-3.5 transition-all"
    >
      {/* 1. Neutral Title */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-emerald-50 text-primary-dark">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm text-navy">What your last instalment bought</h3>
            <span className="text-[11px] text-gray-400">
              {latestInst ? formatDateShort(latestInst.date) : 'Recent deposit'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Transaction Facts from Deterministic Engine */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/70 p-3 rounded-xl border border-gray-100">
        <div>
          <span className="text-gray-500">Units Acquired</span>
          <div className="font-bold text-navy text-sm mt-0.5">
            {latestInst?.unitsPurchased.toFixed(4) || '—'}
          </div>
          <span className="text-[10px] text-gray-400">at ₹{latestInst?.nav.toFixed(2)} NAV</span>
        </div>

        <div>
          <span className="text-gray-500">Additional Units</span>
          <div className="font-bold text-primary-dark text-sm mt-0.5 flex items-center gap-1">
            <ArrowUpRight size={13} />
            <span>+{metrics.additionalUnitsVsPrevious.toFixed(4)}</span>
          </div>
          <span className="text-[10px] text-gray-400">vs last month's price</span>
        </div>
      </div>

      {/* 3. AI Phrased Grounded Explanation */}
      <div className="text-xs text-gray-700 leading-relaxed space-y-2">
        {isLoading ? (
          <div className="space-y-1.5 animate-pulse py-1">
            <div className="h-3 bg-gray-200 rounded w-full" />
            <div className="h-3 bg-gray-200 rounded w-4/5" />
          </div>
        ) : (
          <p>{explanation}</p>
        )}
      </div>

      {/* 4. Subtle In-Context Quality Indicator */}
      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
        <CheckedChip uncertaintyNotice={uncertaintyNotice} isFallback={isFallback} />
      </div>
    </div>
  );
};

