'use client';

import React, { useState } from 'react';
import { X, Copy, Check, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
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
        className="absolute inset-0 bg-black/55 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container — Midnight Navy Tempered Glass */}
      <div className="relative w-full max-w-sm tempered-glass-modal rounded-[28px] p-5 z-10 space-y-4 font-sans text-[#0A1128] dark:text-white animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0A1128]/[0.08] dark:border-white/12">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85">
              <SlidersHorizontal strokeWidth={2} className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold tracking-tight">{t.resultDetailTitle}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/70 hover:text-[#0A1128] dark:text-white/75 dark:hover:text-white transition-colors btn-press-effect"
            aria-label={t.close}
          >
            <X strokeWidth={2} className="w-4 h-4" />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          {/* Full Precision Value */}
          <div className="p-3.5 rounded-2xl tempered-glass-surface space-y-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#0A1128]/50 dark:text-white/55">
              {t.fullPrecisionValue}
            </span>
            <div className="text-base font-semibold font-sans tabular-nums break-all select-all text-[#0A1128] dark:text-white">
              {result.rawValue}
            </div>
          </div>

          {/* Scientific Notation */}
          {result.scientificNotation && (
            <div className="p-3.5 rounded-2xl tempered-glass-surface space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#0A1128]/50 dark:text-white/55">
                {t.scientificNotationLabel}
              </span>
              <div className="text-sm font-semibold font-sans tabular-nums text-[#0A1128] dark:text-white">
                {result.scientificNotation}
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="flex items-center justify-between text-xs text-[#0A1128]/65 dark:text-white/65 font-medium px-1">
            <span>{t.valueStatusLabel}</span>
            <span className="font-semibold text-[#0A1128] dark:text-white">
              {result.isApproximate ? t.approximateValue : t.exactValue}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleCopy(result.rawValue)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl tempered-glass-surface text-[#0A1128]/85 dark:text-white/85 hover:text-[#0A1128] dark:hover:text-white text-xs font-semibold transition-all btn-press-effect"
          >
            {copied ? (
              <Check strokeWidth={2.2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8]" />
            ) : (
              <Copy strokeWidth={2} className="w-4 h-4" />
            )}
            <span>{copied ? t.copiedBtn : t.copyValueBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onUseAsInput(result.rawValue);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl primary-cta-btn text-xs font-semibold transition-all btn-press-effect"
          >
            <ArrowUpRight strokeWidth={2.2} className="w-4 h-4" />
            <span>{t.useAsInputBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDetailModal;
