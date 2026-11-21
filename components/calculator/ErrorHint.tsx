'use client';

import React from 'react';
import { AlertCircle, X, HelpCircle } from 'lucide-react';
import { FormattedError } from '@/lib/calculator/error-messages';

interface ErrorHintProps {
  error: FormattedError | null;
  onDismiss?: () => void;
  onAutoFix?: () => void;
}

export const ErrorHint: React.FC<ErrorHintProps> = ({
  error,
  onDismiss,
}) => {
  if (!error) return null;

  return (
    <div
      id="error-hint-widget"
      data-testid="error-hint-widget"
      className="w-full my-2 p-3 sm:p-3.5 rounded-2xl tempered-glass-card border-[#00A3FF]/30 dark:border-[#38BDF8]/30 animate-modal-pop"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5">
            <AlertCircle strokeWidth={2.2} className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#0A1128] dark:text-white tracking-tight flex items-center gap-1.5">
              <span>{error.title}</span>
            </div>
            <p className="text-[11px] font-medium text-[#0A1128]/70 dark:text-white/75 mt-0.5 leading-snug">
              {error.message}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-[#0A1128]/55 dark:text-white/55">
              <HelpCircle strokeWidth={2} className="w-3.5 h-3.5 shrink-0 text-[#00A3FF] dark:text-[#38BDF8]" />
              <span>{error.hint}</span>
            </div>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-[#0A1128]/50 hover:text-[#0A1128] dark:text-white/55 dark:hover:text-white p-1 rounded-full hover:bg-black/[0.05] dark:hover:bg-white/10 transition-colors btn-press-effect shrink-0"
            title="Dismiss"
          >
            <X strokeWidth={2} className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorHint;
