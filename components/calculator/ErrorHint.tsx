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
      className="w-full my-2 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/14 via-rose-500/8 to-amber-500/14 dark:from-rose-950/55 dark:via-[#1a1226]/75 dark:to-amber-950/45 border border-rose-400/35 dark:border-rose-400/30 shadow-[0_10px_28px_-8px_rgba(244,63,94,0.28),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl animate-modal-pop"
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-xl bg-gradient-to-b from-rose-400 to-rose-600 text-white shrink-0 shadow-[0_4px_12px_rgba(244,63,94,0.4),inset_0_1px_0_rgba(255,255,255,0.45)] mt-0.5">
            <AlertCircle strokeWidth={2.5} className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-rose-700 dark:text-rose-300 tracking-tight flex items-center gap-1.5">
              <span>{error.title}</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">
              {error.message}
            </p>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
              <HelpCircle className="w-3 h-3 shrink-0" />
              <span>{error.hint}</span>
            </div>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white p-1 rounded-full hover:bg-white/20 dark:hover:bg-white/10 transition-colors btn-press-effect shrink-0"
            title="Tutup Pesan"
          >
            <X strokeWidth={2.5} className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorHint;
