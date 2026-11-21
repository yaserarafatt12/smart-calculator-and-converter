'use client';

import React from 'react';
import { History, Settings, ArrowLeftRight, Calculator, Globe } from 'lucide-react';
import { ApplicationMode } from '@/lib/calculator/types';
import { Language, TRANSLATIONS } from '@/lib/i18n/translations';

export type TabType = 'calculator' | 'converter';

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  appMode: ApplicationMode;
  onModeChange: (mode: ApplicationMode) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleHistory: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onToggleHistory,
  language,
  onToggleLanguage,
  onOpenSettings,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="w-full flex items-center justify-between gap-1.5 sm:gap-2.5 pb-3.5 mb-2 border-b border-slate-900/10 dark:border-white/10 select-none">
      {/* iOS 26 Liquid Glass Segmented Tab Switcher */}
      <nav
        aria-label="Primary Navigation"
        className="relative overflow-visible flex items-center gap-0.5 p-1 rounded-full liquid-glass-track"
      >
        <button
          type="button"
          id="tab-calculator"
          onClick={() => onTabChange('calculator')}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-extrabold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] btn-press-effect ${
            activeTab === 'calculator'
              ? 'liquid-glass-lens text-white scale-[1.03]'
              : 'text-slate-600 dark:text-slate-300/80 hover:text-slate-950 dark:hover:text-white bg-transparent'
          }`}
        >
          <Calculator strokeWidth={2.4} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{t.calculator}</span>
        </button>
        <button
          type="button"
          id="tab-converter"
          onClick={() => onTabChange('converter')}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-[13px] font-extrabold tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] btn-press-effect ${
            activeTab === 'converter'
              ? 'liquid-glass-lens text-white scale-[1.03]'
              : 'text-slate-600 dark:text-slate-300/80 hover:text-slate-950 dark:hover:text-white bg-transparent'
          }`}
        >
          <ArrowLeftRight strokeWidth={2.4} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{t.converter}</span>
        </button>
      </nav>

      {/* Top Right: Liquid Glass Utility Pills (Language, History, Settings) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onToggleLanguage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full tempered-glass-surface text-sky-700 dark:text-sky-300 hover:border-sky-400/50 hover:text-sky-900 dark:hover:text-white transition-all duration-200 btn-press-effect text-[11px] font-black tracking-wide"
          title={language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
        >
          <Globe strokeWidth={2.4} className="w-3.5 h-3.5" />
          <span>{language.toUpperCase()}</span>
        </button>

        <button
          type="button"
          onClick={onToggleHistory}
          className="p-2 rounded-full tempered-glass-surface text-slate-700 dark:text-sky-200 hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-white transition-all duration-200 btn-press-effect"
          title={t.history}
          aria-label={t.history}
        >
          <History strokeWidth={2.4} className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-full tempered-glass-surface text-slate-700 dark:text-sky-200 hover:border-sky-400/50 hover:text-sky-600 dark:hover:text-white transition-all duration-200 btn-press-effect"
          title={t.settings}
          aria-label={t.settings}
        >
          <Settings strokeWidth={2.4} className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
