import React from 'react';
import { Instalment } from '@/lib/calc/types';
import { formatINR, formatDateShort } from '@/lib/utils/format';
import { CheckCircle2 } from 'lucide-react';

interface InstalmentListProps {
  instalments: Instalment[];
}

export const InstalmentList: React.FC<InstalmentListProps> = ({ instalments }) => {
  // Sort in reverse chronological order (latest on top)
  const sorted = [...instalments].reverse();

  return (
    <div className="bg-surface-card rounded-2xl p-4 border border-border-subtle shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          Instalment History ({instalments.length})
        </h3>
        <span className="text-[11px] text-gray-400">Autopay Successful</span>
      </div>

      <div className="divide-y divide-gray-100">
        {sorted.map((inst) => (
          <div key={inst.id} className="py-2.5 first:pt-1 last:pb-1 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-primary-dark shrink-0" />
              <div>
                <div className="font-semibold text-navy">
                  Instalment #{inst.instalmentNumber}
                </div>
                <div className="text-[11px] text-gray-400">
                  {formatDateShort(inst.date)} • NAV ₹{inst.nav.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-navy">{formatINR(inst.amount)}</div>
              <div className="text-[11px] text-gray-500">
                +{inst.unitsPurchased.toFixed(4)} units
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

