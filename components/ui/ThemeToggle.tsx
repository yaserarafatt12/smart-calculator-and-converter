'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      type="button"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/75 dark:bg-white/[0.08] border border-[#0A1128]/10 dark:border-white/[0.18] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_8px_rgba(10,17,40,0.06)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-md text-xs font-semibold transition-all duration-200 btn-press-effect text-[#0A1128]/85 dark:text-white/90 hover:bg-white dark:hover:bg-white/[0.14] hover:text-[#0A1128] dark:hover:text-white"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun strokeWidth={2} className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon strokeWidth={2} className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </div>
      <span className="hidden sm:inline">
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
};

export default ThemeToggle;
