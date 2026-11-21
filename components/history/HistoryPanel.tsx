'use client';

import React, { useState } from 'react';
import { Trash2, ArrowUpRight, Plus, Clock, AlertTriangle } from 'lucide-react';
import { HistoryItem } from '@/lib/storage/history-storage';
import { Language, TRANSLATIONS } from '@/lib/i18n/translations';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectExpression: (expr: string) => void;
  onSelectResult: (result: string | number) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  language?: Language;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onSelectExpression,
  onSelectResult,
  onRemoveItem,
  onClearAll,
  language = 'id',
}) => {
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const t = TRANSLATIONS[language];

  const formatTime = (timestamp: number) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString(language === 'id' ? 'id-ID' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const handleConfirmClearAll = () => {
    onClearAll();
    setShowConfirmClear(false);
  };

  return (
    <div
      id="history-panel"
      data-testid="history-panel"
      className="w-full flex flex-col justify-between font-sans"
    >
      {/* Subheader Row: History Count & Clean Clear Button */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-900/10 dark:border-white/12">
        <span className="text-xs font-extrabold tracking-wider text-slate-600 dark:text-slate-300/80 uppercase">
          {t.historyCount(history.length)}
        </span>

        {history.length > 0 && (
          <button
            type="button"
            id="btn-clear-history"
            data-testid="btn-clear-history"
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 dark:text-rose-300 dark:hover:text-rose-200 font-extrabold transition-all px-3 py-1.5 rounded-full glass-key-action btn-press-effect"
            title={t.clearAll}
          >
            <Trash2 strokeWidth={2.5} className="w-3.5 h-3.5" />
            <span>{t.clearAll}</span>
          </button>
        )}
      </div>

      {/* Confirmation Dialog Overlay when clearing all history */}
      {showConfirmClear && (
        <div className="mb-4 p-4 rounded-2xl bg-rose-500/12 dark:bg-rose-950/50 border border-rose-400/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] flex flex-col gap-3 animate-modal-pop">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-300 shrink-0 mt-0.5" />
            <div className="text-xs font-bold text-rose-700 dark:text-rose-200">
              {t.confirmClearText}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfirmClear(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-extrabold text-slate-700 dark:text-slate-200 tempered-glass-surface btn-press-effect"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleConfirmClearAll}
              className="px-3.5 py-1.5 rounded-full text-xs font-extrabold text-white bg-gradient-to-b from-rose-500 to-rose-600 shadow-[0_6px_16px_rgba(244,63,94,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] btn-press-effect"
            >
              {t.clearAll}
            </button>
          </div>
        </div>
      )}

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] sm:max-h-[460px] pr-1 space-y-2.5">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 dark:text-slate-500">
            <div className="p-3.5 rounded-2xl tempered-glass-surface mb-3">
              <Clock strokeWidth={2.2} className="w-8 h-8 text-sky-500 dark:text-sky-400" />
            </div>
            <p className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{t.noHistory}</p>
            <p className="text-xs mt-1 max-w-[220px] text-slate-500 dark:text-slate-400 font-medium">
              {t.noHistoryDesc}
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              data-testid="history-item"
              className="group relative p-3.5 sm:p-4 rounded-2xl tempered-glass-surface hover:border-sky-400/50 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Clickable Expression */}
                  <button
                    type="button"
                    onClick={() => onSelectExpression(item.expression)}
                    className="text-xs sm:text-sm font-sans tabular-nums text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300 truncate block w-full text-left transition-colors font-semibold"
                    title={t.restoreFormula}
                  >
                    {item.expression} =
                  </button>

                  {/* Clickable Result */}
                  <button
                    type="button"
                    onClick={() => onSelectResult(item.result)}
                    className="text-lg sm:text-xl font-sans tabular-nums font-extrabold text-slate-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-300 truncate block w-full text-left mt-0.5 transition-colors"
                    title={t.insertResult}
                  >
                    {item.result}
                  </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] text-slate-400 dark:text-slate-400 font-sans tabular-nums font-medium mr-1">
                    {formatTime(item.timestamp)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-rose-500 dark:hover:text-rose-300 hover:bg-rose-500/15 transition-colors btn-press-effect"
                    title="Hapus Item"
                  >
                    <Trash2 strokeWidth={2.4} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Explicit restored formula & inserted result action buttons */}
              <div className="mt-2.5 pt-2 border-t border-slate-900/10 dark:border-white/10 flex items-center justify-between text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => onSelectExpression(item.expression)}
                  className="flex items-center gap-1 text-sky-700 dark:text-sky-300 hover:underline transition-colors"
                  title="Kembalikan seluruh rumus ini ke layar masukan kalkulator"
                >
                  <ArrowUpRight strokeWidth={2.5} className="w-3.5 h-3.5" />
                  <span>{t.restoreFormula}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectResult(item.result)}
                  className="flex items-center gap-1 text-emerald-600 dark:text-emerald-300 hover:underline transition-colors"
                  title="Sisipkan angka hasil ini ke masukan yang sedang diketik"
                >
                  <Plus strokeWidth={2.5} className="w-3.5 h-3.5" />
                  <span>{t.insertResult}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
