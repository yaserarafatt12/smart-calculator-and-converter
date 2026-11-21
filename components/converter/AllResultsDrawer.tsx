'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Layers } from 'lucide-react';
import { UnitCategory, convertAllUnitsInCategory } from '@/lib/converter/unit-conversion';
import { Language, Translations } from '@/lib/i18n/translations';

interface AllResultsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: UnitCategory;
  fromValue: string;
  fromUnit: string;
  language?: Language;
  t?: Translations;
}

export const AllResultsDrawer: React.FC<AllResultsDrawerProps> = ({
  isOpen,
  onClose,
  category,
  fromValue,
  fromUnit,
  language = 'en',
  t,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const numVal = parseFloat(fromValue) || 0;
  const allResults = convertAllUnitsInCategory(category, numVal, fromUnit);

  const handleCopy = (unitId: string, valStr: string) => {
    navigator.clipboard.writeText(valStr);
    setCopiedId(unitId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const drawerTitle = language === 'id' ? 'Semua Hasil Konversi' : 'All Unit Conversions';
  const drawerSubtitle = language === 'id'
    ? `${fromValue} ${fromUnit} dalam setiap satuan`
    : `${fromValue} ${fromUnit} across all units`;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container — Midnight Navy Tempered Glass */}
      <div className="relative w-full max-w-sm tempered-glass-modal rounded-[28px] p-5 z-10 flex flex-col max-h-[85vh] font-sans text-[#0A1128] dark:text-white animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#0A1128]/[0.08] dark:border-white/12 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85">
              <Layers strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight">{drawerTitle}</h3>
              <p className="text-[11px] text-[#0A1128]/55 dark:text-white/55 font-medium">
                {drawerSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/70 hover:text-[#0A1128] dark:text-white/75 dark:hover:text-white transition-colors btn-press-effect"
            aria-label="Close"
          >
            <X strokeWidth={2} className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Results List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
          {allResults.map((item) => (
            <div
              key={item.unitId}
              className="p-3 rounded-2xl tempered-glass-surface flex items-center justify-between gap-2 hover:border-black/[0.16] dark:hover:border-white/28 transition-all"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-medium text-[#0A1128]/55 dark:text-white/55 block truncate">
                  {item.name} ({item.symbol})
                </span>
                <span className="text-sm font-semibold text-[#0A1128] dark:text-white font-sans tabular-nums block truncate">
                  {item.formattedValue}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(item.unitId, String(item.value))}
                className="px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] hover:border-black/[0.16] dark:hover:border-white/30 text-[#0A1128]/85 dark:text-white/85 text-xs font-semibold transition-all shrink-0 flex items-center gap-1 btn-press-effect"
                title={t?.copyBtn || 'Copy'}
              >
                {copiedId === item.unitId ? (
                  <>
                    <Check strokeWidth={2.2} className="w-3.5 h-3.5 text-[#00A3FF] dark:text-[#38BDF8]" />
                    <span>{t?.copiedBtn || 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy strokeWidth={2} className="w-3.5 h-3.5" />
                    <span>{t?.copyBtn || 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllResultsDrawer;
