'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header, { TabType } from '@/components/ui/Header';
import Display, { ResultCard } from '@/components/calculator/Display';
import Keypad from '@/components/calculator/Keypad';
import ErrorHint from '@/components/calculator/ErrorHint';
import HistoryPanel from '@/components/history/HistoryPanel';
import CompleteConverterView from '@/components/converter/CompleteConverterView';
import ScientificKeypad from '@/components/calculator/ScientificKeypad';
import ResultDetailModal from '@/components/calculator/ResultDetailModal';
import SettingsModal from '@/components/settings/SettingsModal';
import PwaInstallPrompt from '@/components/ui/PwaInstallPrompt';

import { ApplicationMode, AngleMode, CalculationResult } from '@/lib/calculator/types';
import { evaluateExpression } from '@/lib/calculator/math-parser';
import { getFormattedError, FormattedError } from '@/lib/calculator/error-messages';
import { Language, detectBrowserLanguage, TRANSLATIONS } from '@/lib/i18n/translations';
import {
  getStoredMemory,
  saveMemory,
  clearMemory,
  getStoredAns,
  saveAns,
} from '@/lib/calculator/memory-storage';
import {
  getHistory,
  addHistory,
  removeHistoryItem,
  clearHistory,
  HistoryItem,
} from '@/lib/storage/history-storage';

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabType>('calculator');
  const [appMode, setAppMode] = useState<ApplicationMode>('default');
  const [angleMode, setAngleMode] = useState<AngleMode>('degree');

  // Clean initial state for new users
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<number | string | null>(null);
  const [calcResultObj, setCalcResultObj] = useState<CalculationResult | null>(null);

  const [formattedError, setFormattedError] = useState<FormattedError | null>(null);
  const [history, setHistoryState] = useState<HistoryItem[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showResultDetailModal, setShowResultDetailModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [memory, setMemoryState] = useState<{ value: number; hasValue: boolean }>({
    value: 0,
    hasValue: false,
  });

  const t = TRANSLATIONS[language];

  // Load persistent mode, theme (dark by default), and language on mount
  useEffect(() => {
    setHistoryState(getHistory());
    setMemoryState(getStoredMemory());
    setLanguage(detectBrowserLanguage());

    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('smart_calc_app_mode') as ApplicationMode;
      if (savedMode === 'default' || savedMode === 'complete') {
        setAppMode(savedMode);
      }

      const savedTheme = localStorage.getItem('smart_calc_theme');
      const initialDark = savedTheme ? savedTheme === 'dark' : true;
      setTheme(initialDark ? 'dark' : 'light');
      if (initialDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleModeChange = (mode: ApplicationMode) => {
    setAppMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_calc_app_mode', mode);
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_calc_theme', nextTheme);
    }
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'id' : 'en';
    setLanguage(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_calc_lang', nextLang);
    }
  };

  // Evaluate calculation
  const handleCalculate = useCallback(() => {
    if (!expression.trim()) {
      const err = getFormattedError({ success: false, error: 'EMPTY_INPUT', index: 0 }, language);
      setFormattedError(err);
      setResult(null);
      setCalcResultObj(null);
      return;
    }

    const ansVal = getStoredAns();
    const evaluated = evaluateExpression(expression, angleMode, ansVal);

    if (evaluated.error) {
      setResult('Error');
      setCalcResultObj(null);
      const err = getFormattedError({ success: false, error: 'SYNTAX_ERROR', message: evaluated.error, index: 0 }, language);
      setFormattedError(err);
    } else {
      setResult(evaluated.formattedValue);
      setCalcResultObj(evaluated);
      setFormattedError(null);

      // Save Ans and History
      saveAns(evaluated.rawValue);
      const updatedHistory = addHistory(expression, evaluated.formattedValue);
      setHistoryState(updatedHistory);
    }
  }, [expression, angleMode, language]);

  // Keypad key press dispatcher
  const handleKeyPress = useCallback(
    (key: string) => {
      setFormattedError(null);

      if (key === 'AC') {
        setExpression('');
        setResult(null);
        setCalcResultObj(null);
        setFormattedError(null);
        return;
      }

      if (key === 'C') {
        setExpression('');
        setFormattedError(null);
        return;
      }

      if (key === 'BACKSPACE') {
        setExpression((prev) => prev.slice(0, -1));
        return;
      }

      if (key === '=') {
        handleCalculate();
        return;
      }

      setExpression((prev) => prev + key);
    },
    [handleCalculate]
  );

  // Memory Handlers
  const handleMemoryClear = () => {
    const next = clearMemory();
    setMemoryState(next);
  };

  const handleMemoryRecall = () => {
    if (memory.hasValue) {
      setExpression((prev) => prev + String(memory.value));
    }
  };

  const handleMemoryAdd = () => {
    const num = typeof result === 'number' ? result : parseFloat(String(result)) || 0;
    const next = saveMemory(memory.value + num);
    setMemoryState(next);
  };

  const handleMemorySubtract = () => {
    const num = typeof result === 'number' ? result : parseFloat(String(result)) || 0;
    const next = saveMemory(memory.value - num);
    setMemoryState(next);
  };

  const handleInsertAns = () => {
    setExpression((prev) => prev + 'Ans');
  };

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'select' || targetTag === 'textarea') {
        return;
      }

      if (activeTab !== 'calculator') return;

      const key = e.key;

      if (key >= '0' && key <= '9') {
        handleKeyPress(key);
      } else if (['+', '-', '*', '/', '(', ')', '.', '%', '^', '!'].includes(key)) {
        handleKeyPress(key);
      } else if (key === 'Enter') {
        e.preventDefault();
        handleKeyPress('=');
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('BACKSPACE');
      } else if (key === 'Escape') {
        e.preventDefault();
        handleKeyPress('AC');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, handleKeyPress]);

  // History Actions
  const handleSelectExpression = (expr: string) => {
    setExpression(expr);
    setActiveTab('calculator');
    setShowHistoryModal(false);
  };

  const handleSelectResult = (res: string | number) => {
    setExpression((prev) => prev + String(res));
    setActiveTab('calculator');
    setShowHistoryModal(false);
  };

  const handleRemoveHistoryItem = (id: string) => {
    const updated = removeHistoryItem(id);
    setHistoryState(updated);
  };

  const handleClearAllHistory = () => {
    clearHistory();
    setHistoryState([]);
  };

  return (
    <main className="min-h-screen sm:py-8 sm:px-4 flex flex-col items-center justify-center relative overflow-hidden font-sans z-10">
      {/* Phone Chassis Container — Midnight Navy Tempered Glass */}
      <div
        className={`w-full min-h-screen ${
          activeTab === 'converter'
            ? 'sm:min-h-[750px] sm:max-w-[436px]'
            : appMode === 'complete'
            ? 'sm:min-h-[820px] sm:max-w-[436px]'
            : 'sm:min-h-[720px] sm:max-w-[424px]'
        } sm:rounded-[40px] phone-chassis p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-10`}
      >
        {/* Top Header Bar with Minimal Brand Emblem, Utility Controls & Liquid Glass Nav Pill */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          appMode={appMode}
          onModeChange={handleModeChange}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onToggleHistory={() => setShowHistoryModal((prev) => !prev)}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onOpenSettings={() => setShowSettingsModal(true)}
        />

        {/* Main Content View */}
        <div className="flex-1 flex flex-col justify-between my-auto relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {/* CALCULATOR TAB VIEW */}
          <div
            className={`w-full flex flex-col justify-between h-full flex-1 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
              activeTab === 'calculator'
                ? 'opacity-100 scale-100 translate-x-0 relative z-10'
                : 'opacity-0 scale-95 -translate-x-4 pointer-events-none absolute inset-0 z-0 h-0 overflow-hidden'
            }`}
          >
            {/* TOP SECTION: Expression Input */}
            <div className="w-full">
              <Display
                expression={expression}
                result={result}
                errorIndex={formattedError?.index}
                isError={Boolean(formattedError)}
                language={language}
                t={t}
              />
            </div>

            {/* BOTTOM SECTION: Mode Switcher Pill + Result Card + Keypad */}
            <div className="w-full mt-auto space-y-2.5 pt-2">
              <ErrorHint
                error={formattedError}
                onDismiss={() => setFormattedError(null)}
              />

              {/* Mode Switcher Pill: iOS 26 Liquid Glass Sliding Segmented Control */}
              <div className="flex items-center justify-between gap-2">
                <div className="relative overflow-visible grid grid-cols-2 liquid-glass-pill p-1 rounded-full min-w-[196px]">
                  {/* Sliding Refractive Glass Lens */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full liquid-glass-lens-active"
                    style={{
                      transform: appMode === 'complete' ? 'translateX(100%)' : 'translateX(0%)',
                    }}
                  />
                  <button
                    type="button"
                    id="mode-pill-default"
                    onClick={() => handleModeChange('default')}
                    className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors duration-200 ${
                      appMode === 'default'
                        ? 'text-[#0A1128] dark:text-white'
                        : 'text-[#0A1128]/55 dark:text-white/55 hover:text-[#0A1128]/85 dark:hover:text-white/85'
                    }`}
                  >
                    {t.defaultMode}
                  </button>
                  <button
                    type="button"
                    id="mode-pill-complete"
                    onClick={() => handleModeChange('complete')}
                    className={`relative z-10 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-colors duration-200 ${
                      appMode === 'complete'
                        ? 'text-[#0A1128] dark:text-white'
                        : 'text-[#0A1128]/55 dark:text-white/55 hover:text-[#0A1128]/85 dark:hover:text-white/85'
                    }`}
                  >
                    {t.completeMode}
                  </button>
                </div>

                {appMode === 'complete' && memory.hasValue && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full tempered-glass-surface text-[11px] font-medium text-[#0A1128]/80 dark:text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] dark:bg-[#38BDF8]" />
                    {t.memoryActive}
                  </span>
                )}
              </div>

              {/* Result Card */}
              <ResultCard
                result={result}
                isError={Boolean(formattedError)}
                onClickDetail={() => {
                  if (calcResultObj) setShowResultDetailModal(true);
                }}
                language={language}
                t={t}
              />

              {/* Dynamic Keypad View */}
              {appMode === 'complete' ? (
                <div className="animate-fade-in">
                  <ScientificKeypad
                    onKeyPress={handleKeyPress}
                    angleMode={angleMode}
                    onToggleAngleMode={() =>
                      setAngleMode((prev) => (prev === 'degree' ? 'radian' : 'degree'))
                    }
                    onMemoryClear={handleMemoryClear}
                    onMemoryRecall={handleMemoryRecall}
                    onMemoryAdd={handleMemoryAdd}
                    onMemorySubtract={handleMemorySubtract}
                    onInsertAns={handleInsertAns}
                    memoryHasValue={memory.hasValue}
                  />
                </div>
              ) : (
                <div className="animate-fade-in">
                  <Keypad
                    onKeyPress={handleKeyPress}
                    onOpenConverter={() => setActiveTab('converter')}
                    appMode={appMode}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CONVERTER TAB VIEW */}
          <div
            className={`w-full pt-2 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu ${
              activeTab === 'converter'
                ? 'opacity-100 scale-100 translate-x-0 relative z-10'
                : 'opacity-0 scale-95 translate-x-4 pointer-events-none absolute inset-0 z-0 h-0 overflow-hidden'
            }`}
          >
            <CompleteConverterView language={language} t={t} />
          </div>
        </div>

        {/* Minimal Monochrome Footer */}
        <footer className="mt-4 pt-2.5 text-center text-[11px] text-[#0A1128]/45 dark:text-white/45 font-normal border-t border-[#0A1128]/[0.08] dark:border-white/[0.10]">
          Smart Calc &copy; 2026 &middot; {appMode === 'complete' ? t.completeMode : t.defaultMode}
        </footer>

        {/* Settings & Guidebook Modal Overlay */}
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          historyCount={history.length}
        />

        {/* History Modal Overlay — Midnight Navy Tempered Glass Bottom Sheet */}
        {showHistoryModal && (
          <div
            onClick={() => setShowHistoryModal(false)}
            className="absolute inset-0 z-50 bg-black/55 backdrop-blur-md flex flex-col justify-end animate-fade-in cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="tempered-glass-modal rounded-t-[32px] border-x-0 border-b-0 p-5 sm:p-6 max-h-[85%] overflow-y-auto space-y-4 animate-sheet-up cursor-default"
            >
              {/* iOS Grabber Pill */}
              <div className="w-10 h-1 rounded-full bg-[#0A1128]/20 dark:bg-white/25 mx-auto -mt-1 mb-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-tight text-[#0A1128] dark:text-white">
                  {t.historyTitle}
                </span>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="text-xs font-semibold text-[#0A1128]/80 hover:text-[#0A1128] dark:text-white/80 dark:hover:text-white px-3.5 py-1.5 rounded-full tempered-glass-surface btn-press-effect"
                >
                  {t.close}
                </button>
              </div>
              <HistoryPanel
                history={history}
                onSelectExpression={handleSelectExpression}
                onSelectResult={handleSelectResult}
                onRemoveItem={handleRemoveHistoryItem}
                onClearAll={handleClearAllHistory}
                language={language}
              />
            </div>
          </div>
        )}

        {/* Result Detail Modal */}
        <ResultDetailModal
          isOpen={showResultDetailModal}
          onClose={() => setShowResultDetailModal(false)}
          result={calcResultObj}
          onUseAsInput={(val) => setExpression((prev) => prev + val)}
          language={language}
        />
      </div>

      {/* Automatic PWA Install Banner Popup */}
      <PwaInstallPrompt language={language} />
    </main>
  );
}
