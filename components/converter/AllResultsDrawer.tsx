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

  const drawerTitle = language === 'id' ? 'Seluruh Hasil Konversi' : 'All Conversion Results';
  const drawerSubtitle = language === 'id'
    ? `${fromValue} ${fromUnit} dalam seluruh satuan`
    : `${fromValue} ${fromUnit} in all available units`;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer Container — Midnight Navy Tempered Glass */}
      <div className="relative w-full max-w-sm tempered-glass-card rounded-[30px] p-5 z-10 flex flex-col max-h-[85vh] font-sans text-slate-900 dark:text-white animate-modal-pop">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-900/10 dark:border-white/12 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl liquid-glass-lens text-white">
              <Layers strokeWidth={2.5} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold tracking-tight">{drawerTitle}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {drawerSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full tempered-glass-surface text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors btn-press-effect"
            aria-label="Close"
          >
            <X strokeWidth={2.5} className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Results List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
          {allResults.map((item) => (
            <div
              key={item.unitId}
              className="p-3 rounded-2xl tempered-glass-surface flex items-center justify-between gap-2 hover:border-sky-400/50 transition-all"
            >
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate">
                  {item.name} ({item.symbol})
                </span>
                <span className="text-sm font-extrabold text-sky-700 dark:text-sky-300 font-sans tabular-nums block truncate">
                  {item.formattedValue}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(item.unitId, String(item.value))}
                className="px-3 py-1.5 rounded-full tempered-glass-surface hover:border-sky-400/60 text-slate-800 dark:text-sky-200 text-xs font-bold transition-all shrink-0 flex items-center gap-1 btn-press-effect"
                title={t?.copyBtn || 'Copy'}
              >
                {copiedId === item.unitId ? (
                  <>
                    <Check strokeWidth={2.5} className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    <span>{t?.copiedBtn || 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy strokeWidth={2.5} className="w-3.5 h-3.5" />
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
