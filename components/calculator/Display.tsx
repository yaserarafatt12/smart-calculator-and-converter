'use client';

import React, { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Language, Translations } from '@/lib/i18n/translations';

interface DisplayProps {
  expression: string;
  result: string | number | null;
  errorIndex?: number | null;
  isError?: boolean;
  language?: Language;
  t?: Translations;
}

export const Display: React.FC<DisplayProps> = ({
  expression,
  errorIndex = null,
  isError = false,
  t,
}) => {
  // Helper to format expression display (* -> × and / -> ÷)
  const formatExpressionForDisplay = (str: string) => {
    return str.replace(/\*/g, '×').replace(/\//g, '÷');
  };

  // Helper to render expression characters with error token highlighting
  const renderExpressionWithHighlight = () => {
    if (!expression) {
      return (
        <span className="text-[#0A1128]/35 dark:text-white/35 select-none">
          0
        </span>
      );
    }

    const formatted = formatExpressionForDisplay(expression);

    if (isError && errorIndex !== null && errorIndex !== undefined && errorIndex >= 0 && errorIndex < expression.length) {
      const before = formatExpressionForDisplay(expression.slice(0, errorIndex));
      const errChar = formatExpressionForDisplay(expression[errorIndex]);
      const after = formatExpressionForDisplay(expression.slice(errorIndex + 1));

      return (
        <span className="break-all">
          {before}
          <span
            data-testid="error-highlight"
            className="inline-block bg-black/[0.08] dark:bg-white/[0.14] text-[#0A1128] dark:text-white font-bold px-1.5 py-0.5 rounded-lg ring-1 ring-[#00A3FF]/60 dark:ring-[#38BDF8]/60"
            title={`Error on index ${errorIndex}: '${errChar}'`}
          >
            {errChar}
          </span>
          {after}
        </span>
      );
    }

    return <span className="break-all">{formatted}</span>;
  };

  return (
    <div
      id="calculator-display-container"
      className="w-full pt-2 pb-1 px-1 flex flex-col text-right relative overflow-hidden"
    >
      {/* Error indicator pill */}
      {isError && (
        <div className="flex items-center justify-start text-xs mb-1.5 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full tempered-glass-surface text-[#0A1128]/85 dark:text-white/85">
            <AlertCircle strokeWidth={2.2} className="w-3 h-3 text-[#00A3FF] dark:text-[#38BDF8]" />
            {t?.syntaxError || 'Check Expression'}
          </span>
        </div>
      )}

      {/* Main Expression Input Area at the top */}
      <div
        id="calculator-expression"
        data-testid="calculator-expression"
        className="text-right text-[#0A1128]/70 dark:text-white/75 font-sans tabular-nums text-xl sm:text-2xl font-medium tracking-tight overflow-x-auto py-2.5 scrollbar-none min-h-[3.25rem]"
      >
        {renderExpressionWithHighlight()}
        <span className="inline-block w-[2px] h-6 bg-[#00A3FF] dark:bg-[#38BDF8] ml-1 rounded-full animate-cursor align-middle" />
      </div>
    </div>
  );
};

interface ResultCardProps {
  result: string | number | null;
  isError?: boolean;
  onCopyResult?: () => void;
  onClickDetail?: () => void;
  language?: Language;
  t?: Translations;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  isError = false,
  onClickDetail,
  language = 'en',
  t,
}) => {
  const [copied, setCopied] = useState(false);

  // Copy raw exact un-rounded value to clipboard
  const handleCopyResult = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (result !== null && result !== undefined) {
      navigator.clipboard.writeText(String(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Format display result with clean thousands separator & max 6 decimals for card view
  const formatDisplayResult = (val: string | number | null): string => {
    if (val === null || val === undefined) return '0';
    if (typeof val === 'string' && isNaN(Number(val))) return val;

    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return String(val);

    const locale = language === 'id' ? 'id-ID' : 'en-US';
    const decimalSep = language === 'id' ? ',' : '.';

    const parts = String(num).split('.');
    const integerPart = Number(parts[0]).toLocaleString(locale);
    if (parts.length > 1) {
      const decimalPart = parts[1].slice(0, 6);
      return `${integerPart}${decimalSep}${decimalPart}`;
    }
    return integerPart;
  };

  const resultLabelText = t?.resultLabel ?? (language === 'id' ? 'Hasil' : 'Result');
  const copyBtnText = t?.copyBtn ?? (language === 'id' ? 'Salin' : 'Copy');
  const copiedBtnText = t?.copiedBtn ?? (language === 'id' ? 'Tersalin' : 'Copied');
  const copyTooltipText = t?.copyTooltip ?? (language === 'id' ? 'Salin hasil presisi penuh' : 'Copy exact full-precision result');

  return (
    <div
      id="calculator-result"
      data-testid="calculator-result"
      onClick={onClickDetail}
      className="w-full p-3.5 sm:p-4 rounded-2xl tempered-glass-card flex items-center justify-between gap-3 cursor-pointer hover:border-[#00A3FF]/40 dark:hover:border-[#38BDF8]/40 transition-all duration-200"
    >
      {/* Left: Formatted Result Value */}
      <div className="flex-1 min-w-0 text-left">
        <span className="text-[11px] font-medium uppercase tracking-wider text-[#0A1128]/50 dark:text-white/55 block mb-0.5">
          {resultLabelText}
        </span>
        <div className="text-2xl sm:text-3xl font-sans tabular-nums font-semibold tracking-tight text-[#0A1128] dark:text-white truncate">
          {formatDisplayResult(result)}
        </div>
      </div>

      {/* Far Right: Monochrome Tempered Glass Copy Pill */}
      {result !== null && !isError && (
        <button
          type="button"
          onClick={handleCopyResult}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/85 dark:text-white/90 hover:border-black/[0.16] dark:hover:border-white/30 text-xs font-semibold shrink-0 transition-all btn-press-effect"
          title={copyTooltipText}
        >
          {copied ? (
            <>
              <Check strokeWidth={2.2} className="w-3.5 h-3.5 text-[#00A3FF] dark:text-[#38BDF8]" />
              <span>{copiedBtnText}</span>
            </>
          ) : (
            <>
              <Copy strokeWidth={2} className="w-3.5 h-3.5" />
              <span>{copyBtnText}</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default Display;
