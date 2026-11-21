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
      title={isDark ? 'Mode Terang' : 'Mode Gelap'}
      className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full tempered-glass-surface text-xs font-bold transition-all duration-300 btn-press-effect text-slate-800 dark:text-sky-100 hover:border-sky-400/50"
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 -rotate-12 hover:rotate-0" />
        )}
      </div>
      <span className="hidden sm:inline font-semibold">
        {isDark ? 'Mode Terang' : 'Mode Gelap'}
      </span>
    </button>
  );
};

export default ThemeToggle;
