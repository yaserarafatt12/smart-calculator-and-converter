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
  language = 'en',
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
      {/* Subheader Row: History Count & Clear Button */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#0A1128]/[0.08] dark:border-white/12">
        <span className="text-xs font-medium tracking-wide text-[#0A1128]/55 dark:text-white/55 uppercase">
          {t.historyCount(history.length)}
        </span>

        {history.length > 0 && (
          <button
            type="button"
            id="btn-clear-history"
            data-testid="btn-clear-history"
            onClick={() => setShowConfirmClear(true)}
            className="flex items-center gap-1.5 text-xs text-[#0A1128]/75 hover:text-[#0A1128] dark:text-white/75 dark:hover:text-white font-semibold transition-all px-3 py-1.5 rounded-full tempered-glass-surface btn-press-effect"
            title={t.clearAll}
          >
            <Trash2 strokeWidth={2} className="w-3.5 h-3.5" />
            <span>{t.clearAll}</span>
          </button>
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmClear && (
        <div className="mb-4 p-4 rounded-2xl tempered-glass-card flex flex-col gap-3 animate-modal-pop">
          <div className="flex items-start gap-2.5">
            <AlertTriangle strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
            <div className="text-xs font-medium text-[#0A1128]/85 dark:text-white/85 leading-relaxed">
              {t.confirmClearText}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowConfirmClear(false)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#0A1128]/80 dark:text-white/80 tempered-glass-surface btn-press-effect"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleConfirmClearAll}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold primary-cta-btn btn-press-effect"
            >
              {t.clearAll}
            </button>
          </div>
        </div>
      )}

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto max-h-[380px] sm:max-h-[460px] pr-1 space-y-2.5">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-3.5 rounded-2xl tempered-glass-surface mb-3 text-[#0A1128]/60 dark:text-white/60">
              <Clock strokeWidth={1.8} className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-[#0A1128] dark:text-white tracking-tight">
              {t.noHistory}
            </p>
            <p className="text-xs mt-1 max-w-[220px] text-[#0A1128]/55 dark:text-white/55 font-normal">
              {t.noHistoryDesc}
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              data-testid="history-item"
              className="group relative p-3.5 sm:p-4 rounded-2xl tempered-glass-surface hover:border-black/[0.16] dark:hover:border-white/28 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  {/* Clickable Expression */}
                  <button
                    type="button"
                    onClick={() => onSelectExpression(item.expression)}
                    className="text-xs sm:text-sm font-sans tabular-nums text-[#0A1128]/60 dark:text-white/60 hover:text-[#0A1128] dark:hover:text-white truncate block w-full text-left transition-colors font-medium"
                    title={t.restoreFormula}
                  >
                    {item.expression} =
                  </button>

                  {/* Clickable Result */}
                  <button
                    type="button"
                    onClick={() => onSelectResult(item.result)}
                    className="text-lg sm:text-xl font-sans tabular-nums font-semibold tracking-tight text-[#0A1128] dark:text-white hover:text-[#00A3FF] dark:hover:text-[#38BDF8] truncate block w-full text-left mt-0.5 transition-colors"
                    title={t.insertResult}
                  >
                    {item.result}
                  </button>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <span className="text-[11px] text-[#0A1128]/45 dark:text-white/45 font-sans tabular-nums font-medium mr-1">
                    {formatTime(item.timestamp)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-full text-[#0A1128]/45 dark:text-white/45 hover:text-[#0A1128] dark:hover:text-white hover:bg-black/[0.06] dark:hover:bg-white/10 transition-colors btn-press-effect"
                    title={language === 'id' ? 'Hapus Item' : 'Delete Item'}
                  >
                    <Trash2 strokeWidth={2} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Explicit restored formula & inserted result action buttons */}
              <div className="mt-2.5 pt-2 border-t border-[#0A1128]/[0.08] dark:border-white/[0.10] flex items-center justify-between text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onSelectExpression(item.expression)}
                  className="flex items-center gap-1 text-[#0A1128]/75 dark:text-white/75 hover:text-[#00A3FF] dark:hover:text-[#38BDF8] transition-colors"
                >
                  <ArrowUpRight strokeWidth={2} className="w-3.5 h-3.5" />
                  <span>{t.restoreFormula}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectResult(item.result)}
                  className="flex items-center gap-1 text-[#0A1128]/75 dark:text-white/75 hover:text-[#00A3FF] dark:hover:text-[#38BDF8] transition-colors"
                >
                  <Plus strokeWidth={2} className="w-3.5 h-3.5" />
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
