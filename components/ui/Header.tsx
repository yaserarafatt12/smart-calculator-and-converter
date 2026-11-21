'use client';

import React from 'react';
import { History, Settings, ArrowLeftRight, Calculator, Globe, Sun, Moon } from 'lucide-react';
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
  theme,
  onToggleTheme,
  onToggleHistory,
  language,
  onToggleLanguage,
  onOpenSettings,
}) => {
  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';

  return (
    <header className="w-full flex flex-col gap-3 pb-3.5 mb-1.5 border-b border-[#0A1128]/[0.08] dark:border-white/[0.10] select-none">
      {/* Top Row: Minimal Monochrome Brand Emblem + Wordmark & Utility Controls */}
      <div className="flex items-center justify-between gap-2">
        {/* Minimal Monochrome Tempered-Glass Squircle Emblem + Single-Tone Wordmark */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-[10px] bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="w-4 h-4 text-[#0A1128] dark:text-white"
            >
              {/* Clean geometric 2x2 operator monogram */}
              <path
                d="M5.5 3.5V7.5M3.5 5.5H7.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M12.5 5.5H16.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M4.1 13.1L6.9 15.9M6.9 13.1L4.1 15.9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M12.5 13.4H16.5M12.5 15.8H16.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#0A1128] dark:text-white truncate">
            Smart Calc
          </span>
        </div>

        {/* Utility Pills: Monochrome Tempered Glass */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className="h-8 flex items-center gap-1 px-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85 hover:text-[#0A1128] dark:hover:text-white hover:border-black/[0.16] dark:hover:border-white/30 transition-all duration-200 btn-press-effect text-[11px] font-semibold tracking-wide"
            title={language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
          >
            <Globe strokeWidth={2} className="w-3.5 h-3.5" />
            <span>{language.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85 hover:text-[#0A1128] dark:hover:text-white hover:border-black/[0.16] dark:hover:border-white/30 transition-all duration-200 btn-press-effect flex items-center justify-center"
            title={isDark ? t.lightMode : t.darkMode}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun strokeWidth={2} className="w-4 h-4" /> : <Moon strokeWidth={2} className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleHistory}
            className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85 hover:text-[#0A1128] dark:hover:text-white hover:border-black/[0.16] dark:hover:border-white/30 transition-all duration-200 btn-press-effect flex items-center justify-center"
            title={t.history}
            aria-label={t.history}
          >
            <History strokeWidth={2} className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85 hover:text-[#0A1128] dark:hover:text-white hover:border-black/[0.16] dark:hover:border-white/30 transition-all duration-200 btn-press-effect flex items-center justify-center"
            title={t.settings}
            aria-label={t.settings}
          >
            <Settings strokeWidth={2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Row: iOS 26 Liquid Glass Sliding Navigation Pill */}
      <nav
        aria-label="Primary Navigation"
        className="relative overflow-visible w-full rounded-full liquid-glass-pill p-1 grid grid-cols-2"
      >
        {/* Sliding Refractive Glass Lens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full liquid-glass-lens-active"
          style={{
            transform: activeTab === 'converter' ? 'translateX(100%)' : 'translateX(0%)',
          }}
        />

        <button
          type="button"
          id="tab-calculator"
          onClick={() => onTabChange('calculator')}
          className={`relative z-10 flex items-center justify-center gap-2 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-colors duration-200 ${
            activeTab === 'calculator'
              ? 'text-[#0A1128] dark:text-white'
              : 'text-[#0A1128]/55 dark:text-white/55 hover:text-[#0A1128]/85 dark:hover:text-white/85'
          }`}
        >
          <Calculator
            strokeWidth={2.1}
            className={`w-4 h-4 transition-colors duration-200 ${
              activeTab === 'calculator' ? 'text-[#00A3FF] dark:text-[#38BDF8]' : ''
            }`}
          />
          <span>{t.calculator}</span>
        </button>

        <button
          type="button"
          id="tab-converter"
          onClick={() => onTabChange('converter')}
          className={`relative z-10 flex items-center justify-center gap-2 py-2 rounded-full text-[13px] font-semibold tracking-tight transition-colors duration-200 ${
            activeTab === 'converter'
              ? 'text-[#0A1128] dark:text-white'
              : 'text-[#0A1128]/55 dark:text-white/55 hover:text-[#0A1128]/85 dark:hover:text-white/85'
          }`}
        >
          <ArrowLeftRight
            strokeWidth={2.1}
            className={`w-4 h-4 transition-colors duration-200 ${
              activeTab === 'converter' ? 'text-[#00A3FF] dark:text-[#38BDF8]' : ''
            }`}
          />
          <span>{t.converter}</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;
