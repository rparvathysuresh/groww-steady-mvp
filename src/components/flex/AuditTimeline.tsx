'use client';

import React from 'react';
import { useSessionStore } from '@/lib/store/sessionStore';
import { History, Clock } from 'lucide-react';
import { formatDateShort } from '@/lib/utils/format';

export const AuditTimeline: React.FC = () => {
  const { auditLog } = useSessionStore();

  if (auditLog.length === 0) {
    return (
      <div className="text-center py-4 text-xs text-gray-400 bg-gray-50/60 rounded-xl border border-gray-100">
        No mandate modifications recorded in this session.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <History size={13} className="text-primary-dark" />
        <span>Mandate Change Log</span>
      </div>

      <div className="space-y-2">
        {auditLog.map((log) => (
          <div
            key={log.id}
            className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-1"
          >
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span className="font-semibold text-primary-dark uppercase">{log.action.replace('_', ' ')}</span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {new Date(log.timestamp).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="text-gray-700 leading-normal text-[11px]">{log.details}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

