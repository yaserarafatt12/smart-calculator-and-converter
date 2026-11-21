'use client';

import React from 'react';
import { History, Settings, ArrowLeftRight, Calculator, Globe, Sun, Moon } from 'lucide-react';
import { ApplicationMode } from '@/lib/calculator/types';
import { Language, TRANSLATIONS } from '@/lib/i18n/translations';
import { LiquidGlassSegmented } from './LiquidGlassSegmented';

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

  const headerBtnClass =
    'bg-white/75 dark:bg-white/[0.08] border border-[#0A1128]/10 dark:border-white/[0.18] text-[#0A1128]/85 dark:text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(10,17,40,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-md hover:bg-white dark:hover:bg-white/[0.14] hover:text-[#0A1128] dark:hover:text-white hover:border-[#0A1128]/18 dark:hover:border-white/30 transition-all duration-200 btn-press-effect';

  return (
    <header className="w-full flex flex-col gap-3 pb-3.5 mb-1.5 border-b border-[#0A1128]/[0.08] dark:border-white/[0.10] select-none overflow-visible">
      {/* Top Row: Bespoke Architectural Geometric Emblem + Wordmark & Tempered Glass Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Sleek Dark Tempered-Glass Squircle Emblem with 2x2 Precision Grid */}
          <div
            className="relative w-9 h-9 rounded-[11px] bg-white/80 dark:bg-white/[0.08] border border-[#0A1128]/10 dark:border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_4px_12px_rgba(10,17,40,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.24),0_6px_16px_rgba(0,0,0,0.35)] backdrop-blur-md flex items-center justify-center shrink-0 overflow-hidden"
            aria-hidden="true"
          >
            {/* Subtle top glass sheen */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 dark:from-white/15 to-transparent pointer-events-none" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="relative z-10 w-[20px] h-[20px]"
            >
              {/* Architectural 2x2 hairline grid axes */}
              <path
                d="M12 3.5V20.5M3.5 12H20.5"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeLinecap="round"
                className="text-[#0A1128]/15 dark:text-white/18"
              />
              {/* Top-left: + */}
              <path
                d="M7.25 5.25V9.25M5.25 7.25H9.25"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                className="text-[#0A1128] dark:text-white"
              />
              {/* Top-right: − */}
              <path
                d="M14.75 7.25H18.75"
                stroke="currentColor"
                strokeWidth="1.65"
                strokeLinecap="round"
                className="text-[#0A1128]/65 dark:text-white/65"
              />
              {/* Bottom-left: × */}
              <path
                d="M5.65 15.15L8.85 18.35M8.85 15.15L5.65 18.35"
                stroke="currentColor"
                strokeWidth="1.55"
                strokeLinecap="round"
                className="text-[#0A1128]/65 dark:text-white/65"
              />
              {/* Bottom-right: = (Precision Cyan Accent) */}
              <path
                d="M14.75 15.45H18.75M14.75 18.05H18.75"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                className="text-[#00A3FF] dark:text-[#38BDF8]"
              />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-[-0.025em] text-[#0A1128] dark:text-white truncate">
            Smart Calc
          </span>
        </div>

        {/* Utility Pills: Crisp Dark Tempered Glass */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleLanguage}
            className={`h-8 flex items-center gap-1 px-2.5 rounded-full text-[11px] font-semibold tracking-wide ${headerBtnClass}`}
            title={language === 'en' ? 'Switch to Indonesian' : 'Switch to English'}
          >
            <Globe strokeWidth={2} className="w-3.5 h-3.5" />
            <span>{language.toUpperCase()}</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${headerBtnClass}`}
            title={isDark ? t.lightMode : t.darkMode}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun strokeWidth={2} className="w-4 h-4" /> : <Moon strokeWidth={2} className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onToggleHistory}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${headerBtnClass}`}
            title={t.history}
            aria-label={t.history}
          >
            <History strokeWidth={2} className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${headerBtnClass}`}
            title={t.settings}
            aria-label={t.settings}
          >
            <Settings strokeWidth={2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Row: True iOS 26 Liquid Glass Hold-and-Scrub Navigation Pill */}
      <nav aria-label="Primary Navigation" className="w-full overflow-visible">
        <LiquidGlassSegmented<TabType>
          value={activeTab}
          onChange={onTabChange}
          theme={theme}
          size="md"
          ariaLabel="Primary Navigation"
          className="w-full"
          options={[
            {
              value: 'calculator',
              label: t.calculator,
              id: 'tab-calculator',
              icon: <Calculator strokeWidth={2.1} className="w-4 h-4" />,
            },
            {
              value: 'converter',
              label: t.converter,
              id: 'tab-converter',
              icon: <ArrowLeftRight strokeWidth={2.1} className="w-4 h-4" />,
            },
          ]}
        />
      </nav>
    </header>
  );
};

export default Header;
