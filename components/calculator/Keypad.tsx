'use client';

import React from 'react';
import { Delete } from 'lucide-react';
import { ApplicationMode } from '@/lib/calculator/types';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onOpenConverter?: () => void;
  appMode?: ApplicationMode;
}

interface KeyConfig {
  label: React.ReactNode;
  value: string;
  type: 'number' | 'operator' | 'action' | 'equals';
  colSpan?: string;
  keyboardHint?: string;
  testId?: string;
  onClickCustom?: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  appMode = 'default',
}) => {
  const isComplete = appMode === 'complete';

  const keys: KeyConfig[] = [
    // Row 1: AC and C side-by-side
    { label: 'AC', value: 'AC', type: 'action', testId: 'btn-ac' },
    { label: 'C', value: 'C', type: 'action', testId: 'btn-c' },
    { label: <Delete strokeWidth={2} className="w-5 h-5 mx-auto" />, value: 'BACKSPACE', type: 'action', testId: 'btn-backspace' },
    { label: '÷', value: '/', type: 'operator', keyboardHint: '/', testId: 'btn-divide' },

    // Row 2
    { label: '7', value: '7', type: 'number', testId: 'btn-7' },
    { label: '8', value: '8', type: 'number', testId: 'btn-8' },
    { label: '9', value: '9', type: 'number', testId: 'btn-9' },
    { label: '×', value: '*', type: 'operator', keyboardHint: '*', testId: 'btn-multiply' },

    // Row 3
    { label: '4', value: '4', type: 'number', testId: 'btn-4' },
    { label: '5', value: '5', type: 'number', testId: 'btn-5' },
    { label: '6', value: '6', type: 'number', testId: 'btn-6' },
    { label: '−', value: '-', type: 'operator', keyboardHint: '-', testId: 'btn-subtract' },

    // Row 4
    { label: '1', value: '1', type: 'number', testId: 'btn-1' },
    { label: '2', value: '2', type: 'number', testId: 'btn-2' },
    { label: '3', value: '3', type: 'number', testId: 'btn-3' },
    { label: '+', value: '+', type: 'operator', keyboardHint: '+', testId: 'btn-add' },

    // Row 5: 0, Dot, and Wide Equals (= col-span-2)
    { label: '0', value: '0', type: 'number', testId: 'btn-0' },
    { label: '.', value: '.', type: 'number', testId: 'btn-dot' },
    { label: '=', value: '=', type: 'equals', colSpan: 'col-span-2', keyboardHint: '↵', testId: 'btn-equals' },
  ];

  const getKeyStyle = (type: KeyConfig['type']) => {
    switch (type) {
      case 'number':
        return 'glass-key-num text-[#0A1128] dark:text-white font-semibold tabular-nums';
      case 'operator':
        return 'glass-key-op font-semibold';
      case 'equals':
        return 'glass-key-eq font-semibold';
      case 'action':
        return 'glass-key-action font-semibold text-base sm:text-lg';
    }
  };

  return (
    <div id="calculator-keypad" className="w-full mt-auto pt-1.5">
      <div className={`grid grid-cols-4 transition-all duration-300 ${isComplete ? 'gap-1.5 sm:gap-2' : 'gap-2.5 sm:gap-3'}`}>
        {keys.map((key, idx) => (
          <button
            key={`${key.value}-${idx}`}
            id={key.testId}
            data-testid={key.testId}
            type="button"
            onClick={() => {
              if (key.onClickCustom) {
                key.onClickCustom();
              } else {
                onKeyPress(key.value);
              }
            }}
            className={`relative ${
              isComplete ? 'h-11 sm:h-12 text-lg sm:text-xl' : 'h-14 sm:h-[58px] text-xl sm:text-2xl'
            } rounded-2xl transition-all duration-200 btn-press-effect flex items-center justify-center select-none ${
              key.colSpan || ''
            } ${getKeyStyle(key.type)}`}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Keypad;
