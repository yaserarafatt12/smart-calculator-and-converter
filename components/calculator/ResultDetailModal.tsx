'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ArrowUpRight, Sparkles } from 'lucide-react';
import { CalculationResult } from '@/lib/calculator/types';
import { Language, TRANSLATIONS } from '@/lib/i18n/translations';

interface ResultDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult | null;
  onUseAsInput: (val: string) => void;
  language?: Language;
}

export const ResultDetailModal: React.FC<ResultDetailModalProps> = ({
  isOpen,
  onClose,
  result,
  onUseAsInput,
  language = 'en',
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[language];

  if (!isOpen || !result) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container — Midnight Navy Tempered Glass */}
      <div className="relative w-full max-w-sm tempered-glass-card rounded-[30px] p-5 z-10 space-y-4 font-sans text-slate-900 dark:text-white animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-900/10 dark:border-white/12">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl liquid-glass-lens text-white">
              <Sparkles strokeWidth={2.5} className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold tracking-tight">{t.resultDetailTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full tempered-glass-surface text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors btn-press-effect"
            aria-label={t.close}
          >
            <X strokeWidth={2.5} className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          {/* Nilai Lengkap */}
          <div className="p-3.5 rounded-2xl tempered-glass-surface space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
              {t.fullPrecisionValue}
            </span>
            <div className="text-base font-extrabold font-sans tabular-nums break-all select-all text-slate-900 dark:text-white">
              {result.rawValue}
            </div>
          </div>

          {/* Notasi Ilmiah */}
          {result.scientificNotation && (
            <div className="p-3.5 rounded-2xl tempered-glass-surface space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
                {t.scientificNotationLabel}
              </span>
              <div className="text-sm font-extrabold font-sans tabular-nums text-slate-900 dark:text-white">
                {result.scientificNotation}
              </div>
            </div>
          )}

          {/* Detail Info */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold px-1">
            <span>{t.valueStatusLabel}</span>
            <span className="font-bold text-sky-700 dark:text-sky-300">
              {result.isApproximate ? t.approximateValue : t.exactValue}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleCopy(result.rawValue)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl tempered-glass-surface hover:border-sky-400/50 text-xs font-extrabold transition-all btn-press-effect"
          >
            {copied ? (
              <Check strokeWidth={2.5} className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            ) : (
              <Copy strokeWidth={2.5} className="w-4 h-4 text-sky-600 dark:text-sky-300" />
            )}
            <span>{copied ? t.copiedBtn : t.copyValueBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onUseAsInput(result.rawValue);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl liquid-glass-lens text-white text-xs font-extrabold transition-all btn-press-effect"
          >
            <ArrowUpRight strokeWidth={2.5} className="w-4 h-4" />
            <span>{t.useAsInputBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDetailModal;
