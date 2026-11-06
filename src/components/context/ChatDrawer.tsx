'use client';

import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CheckedChip } from './CheckedChip';
import { useSessionStore } from '@/lib/store/sessionStore';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFlex?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  isDeclined?: boolean;
  routeToFlex?: boolean;
  isFallback?: boolean;
  uncertaintyNotice?: string;
  hasPII?: boolean;
  warningMessage?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, onOpenFlex }) => {
  const { scenarioId } = useSessionStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Ask any question about your SIP, recent instalments, market dips, or financial terms. I will provide facts and plain explanations without giving investment advice.',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSend },
    ]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          scenarioId,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.output,
          isDeclined: data.isDeclined,
          routeToFlex: data.routeToFlex,
          isFallback: data.isFallback,
          uncertaintyNotice: data.uncertaintyNotice,
          hasPII: data.hasPII,
          warningMessage: data.warningMessage,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach the assistant right now. In general, portfolio values move daily with market fluctuations while all accumulated units remain permanently owned in your folio.',
          isFallback: true,
          uncertaintyNotice: "We couldn't verify this explanation, so here is our standard explanation instead.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'Why is my balance less than invested?',
    'Did I lose my money?',
    'What does XIRR mean?',
    'Should I stop my SIP?',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200"
    >
      <div className="bg-surface-card rounded-t-3xl sm:rounded-2xl max-w-sm w-full h-[85vh] sm:h-[600px] flex flex-col shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between bg-surface-card sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-50 text-primary-dark">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-navy">Ask Steady Companion</h3>
              <p className="text-[10px] text-gray-400">Plain explanations • Non-advisory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-canvas text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-navy text-white rounded-br-xs'
                    : 'bg-white text-navy border border-border-subtle rounded-bl-xs space-y-2'
                }`}
              >
                {/* PII warning banner */}
                {m.hasPII && m.warningMessage && (
                  <div className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 p-1.5 rounded-lg flex items-center gap-1">
                    <AlertTriangle size={12} className="shrink-0 text-amber-700" />
                    <span>{m.warningMessage}</span>
                  </div>
                )}

                <p>{m.text}</p>

                {/* Steady Flex Route Button */}
                {m.routeToFlex && onOpenFlex && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFlex();
                    }}
                    className="w-full bg-primary-light border border-primary/30 text-primary-dark font-semibold py-1.5 px-3 rounded-lg text-xs hover:bg-primary/20 transition-colors"
                  >
                    Open Steady Flex Mandate Controls
                  </button>
                )}

                {/* Checked Badge or Fallback */}
                {m.sender === 'assistant' && !m.isDeclined && !m.routeToFlex && (
                  <div className="pt-1">
                    <CheckedChip
                      uncertaintyNotice={m.uncertaintyNotice}
                      isFallback={m.isFallback}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="bg-white border border-border-subtle rounded-2xl rounded-bl-xs p-3 text-xs text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                <span>Checking your numbers...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-3 py-2 bg-surface-card border-t border-gray-100 overflow-x-auto flex gap-1.5 no-scrollbar">
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-[10px] whitespace-nowrap bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-full shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-surface-card border-t border-border-subtle flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your SIP, dip, or NAV..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-navy focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-navy hover:bg-navy-dark disabled:opacity-40 text-white p-2 rounded-xl transition-colors shrink-0"
            aria-label="Send query"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

