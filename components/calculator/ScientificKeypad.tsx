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
    'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-semibold glass-key-action transition-all btn-press-effect flex items-center justify-center select-none';
  const fnKeyClass =
    'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-medium glass-key-fn text-[#0A1128]/85 dark:text-white/85 hover:text-[#0A1128] dark:hover:text-white transition-all btn-press-effect flex items-center justify-center select-none';
  const trigKeyClass = isSecondMode
    ? 'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-semibold glass-key-op transition-all btn-press-effect flex items-center justify-center select-none'
    : 'h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-medium glass-key-fn text-[#0A1128]/85 dark:text-white/85 hover:text-[#0A1128] dark:hover:text-white transition-all btn-press-effect flex items-center justify-center select-none';
  const numKeyClass =
    'h-11 sm:h-12 rounded-2xl text-lg sm:text-xl font-semibold tabular-nums glass-key-num text-[#0A1128] dark:text-white transition-all btn-press-effect flex items-center justify-center select-none';
  const opKeyClass =
    'h-11 sm:h-12 rounded-2xl text-lg sm:text-xl font-semibold glass-key-op transition-all btn-press-effect flex items-center justify-center select-none';

  return (
    <div className="w-full pt-1">
      <div className="grid grid-cols-4 gap-1.5 font-sans">
        {/* ROW 1: Clear & Erase Actions + 2nd Mode */}
        <button type="button" onClick={() => onKeyPress('AC')} className={actionKeyClass}>
          AC
        </button>

        <button type="button" onClick={() => onKeyPress('C')} className={actionKeyClass}>
          C
        </button>

        <button type="button" onClick={() => onKeyPress('BACKSPACE')} className={actionKeyClass}>
          <Delete strokeWidth={2} className="w-4 h-4 mx-auto" />
        </button>

        <button
          type="button"
          onClick={() => setIsSecondMode(!isSecondMode)}
          className={`h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-semibold transition-all btn-press-effect flex items-center justify-center gap-1.5 select-none ${
            isSecondMode
              ? 'primary-cta-btn'
              : 'glass-key-op'
          }`}
          title={isSecondMode ? '2nd Mode Active (Inverse Functions)' : 'Enable 2nd Mode'}
        >
          {isSecondMode && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] dark:bg-[#071124]" />
          )}
          <span>2nd</span>
        </button>

        {/* ROW 2: Angle Mode, Memory & Ans */}
        <button
          type="button"
          onClick={onToggleAngleMode}
          className="h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-semibold glass-key-op transition-all btn-press-effect flex items-center justify-center select-none"
          title="Toggle Degrees / Radians"
        >
          {angleMode === 'degree' ? 'DEG' : 'RAD'}
        </button>

        <button
          type="button"
          onClick={onMemoryClear}
          className={fnKeyClass}
          title="Memory Clear"
        >
          MC
        </button>

        <button
          type="button"
          onClick={onMemoryRecall}
          className={fnKeyClass}
          title="Memory Recall"
        >
          MR
        </button>

        <button
          type="button"
          onClick={onInsertAns}
          className="h-11 sm:h-12 rounded-2xl text-xs sm:text-sm font-semibold glass-key-op transition-all btn-press-effect flex items-center justify-center select-none"
          title="Previous Answer"
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

        <button
          type="button"
          onClick={() => onKeyPress(isSecondMode ? '^2' : '√(')}
          className={trigKeyClass}
        >
          {isSecondMode ? 'x²' : '√x'}
        </button>

        {/* ROW 4: Trigonometry & Logarithm */}
        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'asin(' : 'sin(')} className={trigKeyClass}>
          {isSecondMode ? 'sin⁻¹' : 'sin'}
        </button>

        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'acos(' : 'cos(')} className={trigKeyClass}>
          {isSecondMode ? 'cos⁻¹' : 'cos'}
        </button>

        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'atan(' : 'tan(')} className={trigKeyClass}>
          {isSecondMode ? 'tan⁻¹' : 'tan'}
        </button>

        <button type="button" onClick={() => onKeyPress(isSecondMode ? '10^(' : 'log(')} className={trigKeyClass}>
          {isSecondMode ? '10ˣ' : 'log'}
        </button>

        {/* ROW 5: Ln, Constants & Exponent */}
        <button type="button" onClick={() => onKeyPress(isSecondMode ? 'e^(' : 'ln(')} className={trigKeyClass}>
          {isSecondMode ? 'eˣ' : 'ln'}
        </button>

        <button type="button" onClick={() => onKeyPress('π')} className={fnKeyClass}>
          π
        </button>

        <button type="button" onClick={() => onKeyPress('e')} className={fnKeyClass}>
          e
        </button>

        <button type="button" onClick={() => onKeyPress('^')} className={fnKeyClass}>
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
        <button type="button" onClick={() => onKeyPress('-')} className={opKeyClass}>−</button>

        {/* ROW 9: Number 0, Dot, Add & Equals */}
        <button type="button" onClick={() => onKeyPress('0')} className={numKeyClass}>0</button>
        <button type="button" onClick={() => onKeyPress('.')} className={numKeyClass}>.</button>
        <button type="button" onClick={() => onKeyPress('+')} className={opKeyClass}>+</button>
        <button
          type="button"
          onClick={() => onKeyPress('=')}
          className="h-11 sm:h-12 rounded-2xl text-lg sm:text-xl font-semibold glass-key-eq transition-all btn-press-effect flex items-center justify-center select-none"
        >
          =
        </button>
      </div>
    </div>
  );
};

export default ScientificKeypad;
