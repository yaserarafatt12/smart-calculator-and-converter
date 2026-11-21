'use client';

import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { AngleMode } from '@/lib/calculator/types';

interface ScientificKeypadProps {
  onKeyPress: (key: string) => void;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onInsertAns: () => void;
  memoryHasValue: boolean;
}

export const ScientificKeypad: React.FC<ScientificKeypadProps> = ({
  onKeyPress,
  angleMode,
  onToggleAngleMode,
  onMemoryClear,
  onMemoryRecall,
  onInsertAns,
}) => {
  const [isSecondMode, setIsSecondMode] = useState(false);

  const actionKeyClass =
    'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold glass-key-action text-rose-600 dark:text-rose-300 transition-all btn-press-effect flex items-center justify-center select-none';
  const fnKeyClass =
    'h-11 sm:h-12 rounded-2xl text-sm sm:text-base font-bold glass-key-fn text-slate-800 dark:text-slate-100 transition-all btn-press-effect flex items-center justify-center select-none';
  const trigKeyClass = isSecondMode
    ? 'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-all btn-press-effect flex items-center justify-center select-none'
    : 'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold glass-key-fn text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-white transition-all btn-press-effect flex items-center justify-center select-none';
  const numKeyClass =
    'h-11 sm:h-12 rounded-2xl text-lg sm:text-xl font-extrabold tabular-nums glass-key-num text-slate-900 dark:text-white transition-all btn-press-effect flex items-center justify-center select-none';
  const opKeyClass =
    'h-11 sm:h-12 rounded-2xl text-lg sm:text-xl font-extrabold glass-key-op text-white transition-all btn-press-effect flex items-center justify-center select-none';

  return (
    <div className="w-full pt-1">
      {/* 4 Columns Grid with Standard Scientific Calculator Hierarchy */}
      <div className="grid grid-cols-4 gap-1.5 font-sans">
        {/* ROW 1: Clear & Erase Actions + 2nd Mode (AT THE TOP) */}
        <button type="button" onClick={() => onKeyPress('AC')} className={actionKeyClass}>
          AC
        </button>

        <button type="button" onClick={() => onKeyPress('C')} className={actionKeyClass}>
          C
        </button>

        <button type="button" onClick={() => onKeyPress('BACKSPACE')} className={actionKeyClass}>
          <Delete className="w-5 h-5 mx-auto" />
        </button>

        {/* 2nd Button with Luminous Amber Glass */}
        <button
          type="button"
          onClick={() => setIsSecondMode(!isSecondMode)}
          className={`h-11 sm:h-12 rounded-2xl text-xs sm:text-sm transition-all btn-press-effect flex items-center justify-center gap-1.5 border select-none ${
            isSecondMode
              ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 border-amber-200/80 shadow-[0_8px_20px_-4px_rgba(245,158,11,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.6)] font-black scale-[1.03]'
              : 'bg-amber-500/15 dark:bg-amber-500/18 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 border-amber-400/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] font-extrabold'
          }`}
          title={isSecondMode ? 'Mode 2nd Aktif (Fungsi Invers)' : 'Aktifkan Mode 2nd'}
        >
          {isSecondMode && <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse" />}
          <span>2nd</span>
        </button>

        {/* ROW 2: Angle Mode, Memory & Ans */}
        <button
          type="button"
          onClick={onToggleAngleMode}
          className="h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold bg-sky-500/15 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 hover:bg-sky-500/25 transition-all btn-press-effect border border-sky-400/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] flex items-center justify-center select-none"
        >
          {angleMode === 'degree' ? 'DEG' : 'RAD'}
        </button>

        <button
          type="button"
          onClick={onMemoryClear}
          className="h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold glass-key-fn text-rose-600 dark:text-rose-300 hover:border-rose-400/45 transition-all btn-press-effect flex items-center justify-center select-none"
          title="Memory Clear"
        >
          MC
        </button>

        <button
          type="button"
          onClick={onMemoryRecall}
          className="h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold glass-key-fn text-amber-600 dark:text-amber-300 hover:border-amber-400/45 transition-all btn-press-effect flex items-center justify-center select-none"
          title="Memory Recall"
        >
          MR
        </button>

        <button
          type="button"
          onClick={onInsertAns}
          className="h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold glass-key-op text-white transition-all btn-press-effect flex items-center justify-center select-none"
          title="Hasil Perhitungan Terakhir"
        >
          Ans
        </button>

        {/* ROW 3: Parentheses, Percent & Root / Power */}
        <button type="button" onClick={() => onKeyPress('(')} className={fnKeyClass}>
          (
        </button>

        <button type="button" onClick={() => onKeyPress(')')} className={fnKeyClass}>
          )
        </button>

        <button type="button" onClick={() => onKeyPress('%')} className={fnKeyClass}>
          %
        </button>

        {/* √x transform to x² when 2nd active */}
        <button
          type="button"
          onClick={() => onKeyPress(isSecondMode ? '^2' : '√(')}
          className={
            isSecondMode
              ? 'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] transition-all btn-press-effect flex items-center justify-center select-none'
              : 'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold glass-key-fn text-slate-800 dark:text-slate-100 transition-all btn-press-effect flex items-center justify-center select-none'
          }
        >
          {isSecondMode ? 'x²' : '√x'}
        </button>

        {/* ROW 4: Trigonometry & Logarithm (Transforms on 2nd) */}
        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'asin(' : 'sin(')} className={trigKeyClass}>
          {isSecondMode ? 'sin⁻¹' : 'sin'}
        </button>

        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'acos(' : 'cos(')} className={trigKeyClass}>
          {isSecondMode ? 'cos⁻¹' : 'cos'}
        </button>

        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'atan(' : 'tan(')} className={trigKeyClass}>
          {isSecondMode ? 'tan⁻¹' : 'tan'}
        </button>

        {/* log transforms to 10ˣ when 2nd active */}
        <button type="button" onClick={() => onKeyPress(isSecondMode ? '10^(' : 'log(')} className={trigKeyClass}>
          {isSecondMode ? '10ˣ' : 'log'}
        </button>

        {/* ROW 5: Ln, Constants & Exponent (Transforms on 2nd) */}
        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'e^(' : 'ln(')} className={trigKeyClass}>
          {isSecondMode ? 'eˣ' : 'ln'}
        </button>

        <button type="button" onClick={() => onKeyPress('π')} className={fnKeyClass}>
          π
        </button>

        <button type="button" onClick={() => onKeyPress('e')} className={fnKeyClass}>
          e
        </button>

        <button
          type="button"
          onClick={() => onKeyPress('^')}
          className="h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-extrabold glass-key-fn text-slate-800 dark:text-slate-100 transition-all btn-press-effect flex items-center justify-center select-none"
        >
          xʸ
        </button>

        {/* ROW 6: Numbers 7, 8, 9 & Divide */}
        <button type="button" onClick={() => onKeyPress('7')} className={numKeyClass}>7</button>
        <button type="button" onClick={() => onKeyPress('8')} className={numKeyClass}>8</button>
        <button type="button" onClick={() => onKeyPress('9')} className={numKeyClass}>9</button>
        <button type="button" onClick={() => onKeyPress('/')} className={opKeyClass}>÷</button>

        {/* ROW 7: Numbers 4, 5, 6 & Multiply */}
        <button type="button" onClick={() => onKeyPress('4')} className={numKeyClass}>4</button>
        <button type="button" onClick={() => onKeyPress('5')} className={numKeyClass}>5</button>
        <button type="button" onClick={() => onKeyPress('6')} className={numKeyClass}>6</button>
        <button type="button" onClick={() => onKeyPress('*')} className={opKeyClass}>×</button>

        {/* ROW 8: Numbers 1, 2, 3 & Subtract */}
        <button type="button" onClick={() => onKeyPress('1')} className={numKeyClass}>1</button>
        <button type="button" onClick={() => onKeyPress('2')} className={numKeyClass}>2</button>
        <button type="button" onClick={() => onKeyPress('3')} className={numKeyClass}>3</button>
        <button type="button" onClick={() => onKeyPress('-')} className={opKeyClass}>-</button>

        {/* ROW 9: Number 0, Dot, Add & Equals */}
        <button type="button" onClick={() => onKeyPress('0')} className={numKeyClass}>0</button>
        <button type="button" onClick={() => onKeyPress('.')} className={numKeyClass}>.</button>
        <button type="button" onClick={() => onKeyPress('+')} className={opKeyClass}>+</button>
        <button
          type="button"
          onClick={() => onKeyPress('=')}
          className="h-11 sm:h-12 rounded-2xl text-lg sm:text-xl font-extrabold glass-key-eq text-white transition-all btn-press-effect flex items-center justify-center select-none"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default ScientificKeypad;
