'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Ruler,
  Scale,
  Thermometer,
  Square,
  Clock,
  Zap,
  Gauge,
  Compass,
  Radio,
  Box,
  Droplet,
  Cpu,
  Flame,
  Activity,
  ArrowLeftRight,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import {
  UnitCategory,
  UNIT_CATEGORIES,
  convertUnit,
  searchUnits,
  UnitDefinition,
} from '@/lib/converter/unit-conversion';
import AllResultsDrawer from './AllResultsDrawer';
import { Language, Translations } from '@/lib/i18n/translations';

interface CategoryItem {
  id: UnitCategory;
  name: string;
  desc: string;
  icon: React.ReactNode;
}

interface CompleteConverterViewProps {
  language?: Language;
  t?: Translations;
}

export const CompleteConverterView: React.FC<CompleteConverterViewProps> = ({ language = 'en', t }) => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('km');
  const [toUnit, setToUnit] = useState<string>('m');
  const [result, setResult] = useState<number | null>(1000);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Search & Drawer State
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Custom Dropdown open states
  const [openFromSelect, setOpenFromSelect] = useState(false);
  const [openToSelect, setOpenToSelect] = useState(false);

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const CATEGORY_ITEMS: CategoryItem[] = [
    { id: 'length', name: t?.catLength || 'Length & Distance', desc: 'mm, cm, m, km, in, ft...', icon: <Ruler strokeWidth={2.4} className="w-4 h-4 text-sky-600 dark:text-sky-300" /> },
    { id: 'weight', name: t?.catWeight || 'Weight & Mass', desc: 'mg, g, kg, ton, lb...', icon: <Scale strokeWidth={2.4} className="w-4 h-4 text-violet-600 dark:text-violet-300" /> },
    { id: 'temperature', name: t?.catTemp || 'Temperature', desc: '°C, °F, K, °R', icon: <Thermometer strokeWidth={2.4} className="w-4 h-4 text-rose-600 dark:text-rose-300" /> },
    { id: 'area', name: t?.catArea || 'Area & Surface', desc: 'm², km², ha, acre...', icon: <Square strokeWidth={2.4} className="w-4 h-4 text-amber-600 dark:text-amber-300" /> },
    { id: 'volume', name: t?.catVolume || 'Volume & Capacity', desc: 'mL, L, m³, gal...', icon: <Box strokeWidth={2.4} className="w-4 h-4 text-cyan-600 dark:text-cyan-300" /> },
    { id: 'time', name: t?.catTime || 'Time & Duration', desc: 'ms, s, min, hr...', icon: <Clock strokeWidth={2.4} className="w-4 h-4 text-emerald-600 dark:text-emerald-300" /> },
    { id: 'speed', name: t?.catSpeed || 'Speed & Velocity', desc: 'm/s, km/h, mph, knot...', icon: <Zap strokeWidth={2.4} className="w-4 h-4 text-yellow-600 dark:text-yellow-300" /> },
    { id: 'digital', name: t?.catDigital || 'Digital Data', desc: 'bit, B, KB, MB, GB, KiB...', icon: <Cpu strokeWidth={2.4} className="w-4 h-4 text-blue-600 dark:text-blue-300" /> },
    { id: 'energy', name: t?.catEnergy || 'Energy & Calories', desc: 'J, kJ, cal, Wh, kWh...', icon: <Flame strokeWidth={2.4} className="w-4 h-4 text-orange-600 dark:text-orange-300" /> },
    { id: 'power', name: t?.catPower || 'Power & Wattage', desc: 'W, kW, HP...', icon: <Activity strokeWidth={2.4} className="w-4 h-4 text-red-600 dark:text-red-300" /> },
    { id: 'pressure', name: t?.catPressure || 'Pressure', desc: 'Pa, bar, atm, psi...', icon: <Gauge strokeWidth={2.4} className="w-4 h-4 text-teal-600 dark:text-teal-300" /> },
    { id: 'angle', name: t?.catAngle || 'Angle & Geometry', desc: '°, rad, grad...', icon: <Compass strokeWidth={2.4} className="w-4 h-4 text-purple-600 dark:text-purple-300" /> },
    { id: 'frequency', name: t?.catFrequency || 'Frequency', desc: 'Hz, kHz, MHz, GHz...', icon: <Radio strokeWidth={2.4} className="w-4 h-4 text-pink-600 dark:text-pink-300" /> },
    { id: 'fuel', name: t?.catFuel || 'Fuel Economy', desc: 'km/L, L/100km, mpg...', icon: <Droplet strokeWidth={2.4} className="w-4 h-4 text-sky-600 dark:text-sky-300" /> },
  ];

  // Visible categories
  const visibleCats = showAllCategories ? CATEGORY_ITEMS : CATEGORY_ITEMS.slice(0, 4);

  // Update default units when category changes
  useEffect(() => {
    const units = UNIT_CATEGORIES[category]?.units;
    if (units && units.length >= 2) {
      setFromUnit(units[0].id);
      setToUnit(units[1].id);
    }
  }, [category]);

  // Recalculate conversion
  useEffect(() => {
    if (!fromValue.trim()) {
      setResult(null);
      setErrorMsg(null);
      return;
    }
    const num = parseFloat(fromValue);
    if (isNaN(num)) {
      setResult(null);
      setErrorMsg(t?.validNumberError || 'Please enter a valid number');
      return;
    }
    try {
      const converted = convertUnit(category, num, fromUnit, toUnit);
      setResult(converted);
      setErrorMsg(null);
    } catch (err: any) {
      setResult(null);
      setErrorMsg(err.message || 'Conversion failed');
    }
  }, [category, fromValue, fromUnit, toUnit]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(e.target as Node)) {
        setOpenFromSelect(false);
      }
      if (toRef.current && !toRef.current.contains(e.target as Node)) {
        setOpenToSelect(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwap = () => {
    const prevFrom = fromUnit;
    const prevTo = toUnit;
    setFromUnit(prevTo);
    setToUnit(prevFrom);
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(String(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Search Results
  const searchResults = searchQuery.trim() ? searchUnits(searchQuery) : [];

  const currentUnits: UnitDefinition[] = UNIT_CATEGORIES[category]?.units || [];
  const selectedFromObj = currentUnits.find((u) => u.id === fromUnit) || currentUnits[0];
  const selectedToObj = currentUnits.find((u) => u.id === toUnit) || currentUnits[1] || currentUnits[0];

  const getFormulaHint = () => {
    if (!result && result !== 0) return null;
    try {
      const benchmark = convertUnit(category, 1, fromUnit, toUnit);
      const fromSymbol = selectedFromObj?.symbol || fromUnit;
      const toSymbol = selectedToObj?.symbol || toUnit;
      return `1 ${fromSymbol} = ${benchmark} ${toSymbol}`;
    } catch {
      return null;
    }
  };

  const categoryLabel = language === 'id' ? 'Kategori:' : 'Category:';

  return (
    <div
      id="unit-converter-container"
      data-testid="unit-converter-container"
      className="w-full font-sans text-slate-900 dark:text-white pb-4"
    >
      {/* Unit Search Bar — Frosted Tempered Glass */}
      <div className="relative mb-4">
        <div className="relative flex items-center tempered-glass-surface rounded-2xl px-3.5 py-2.5 focus-within:border-sky-400/65 transition-all">
          <Search strokeWidth={2.4} className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t?.searchPlaceholder || 'Search units (e.g. kg, pound, liter, megabyte)...'}
            className="w-full text-xs font-bold bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-400/70"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white font-extrabold px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 tempered-glass-card rounded-2xl p-2 z-[999] max-h-60 overflow-y-auto space-y-1 animate-modal-pop">
            {searchResults.map((res, idx) => (
              <button
                key={`${res.category.id}-${res.unit.id}-${idx}`}
                type="button"
                onClick={() => {
                  setCategory(res.category.id);
                  setFromUnit(res.unit.id);
                  setSearchQuery('');
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-sky-500/15 dark:hover:bg-white/10 transition-colors"
              >
                <div>
                  <span className="font-extrabold text-sky-700 dark:text-sky-300 block">
                    {res.unit.name} ({res.unit.symbol})
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {categoryLabel} {res.category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Grid Section */}
      <div className="mb-4">
        <div
          className={`grid grid-cols-2 gap-2.5 transition-all duration-300 ${
            showAllCategories ? 'max-h-60 overflow-y-auto p-1 scrollbar-thin' : ''
          }`}
        >
          {visibleCats.map((cat) => {
            const isSelected = category === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-${cat.id}`}
                type="button"
                onClick={() => {
                  setCategory(cat.id);
                  setOpenFromSelect(false);
                  setOpenToSelect(false);
                }}
                className={`p-3 rounded-2xl text-left transition-all duration-200 btn-press-effect flex flex-col justify-between ${
                  isSelected
                    ? 'liquid-glass-lens text-white font-bold scale-[1.01]'
                    : 'tempered-glass-surface text-slate-800 dark:text-slate-100 hover:border-sky-400/45'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div
                    className={`p-2 rounded-xl border ${
                      isSelected
                        ? 'bg-white/95 text-indigo-600 border-white shadow-sm'
                        : 'bg-sky-500/10 dark:bg-white/[0.07] border-sky-500/20 dark:border-white/12'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] animate-pulse" />
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold tracking-tight">{cat.name}</div>
                  <div
                    className={`text-[10px] sm:text-[11px] mt-0.5 font-semibold ${
                      isSelected ? 'text-sky-100/90' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {cat.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Middle Centered Expand Toggle */}
        <div className="flex justify-center w-full mt-3">
          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="flex items-center justify-center gap-2 text-xs font-extrabold text-sky-700 dark:text-sky-300 hover:border-sky-400/55 px-5 py-2 tempered-glass-surface rounded-full transition-all btn-press-effect w-full max-w-[260px] whitespace-nowrap"
          >
            <span>
              {showAllCategories
                ? t?.hideCategories || 'Hide Categories'
                : t?.showMoreCategories || 'View 14 Other Categories'}
            </span>
            {showAllCategories ? (
              <ChevronUp strokeWidth={2.5} className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronDown strokeWidth={2.5} className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="w-full my-5 border-t border-slate-900/10 dark:border-white/10" />

      {/* Main Conversion Input Block */}
      <div className="space-y-3.5" ref={formRef}>
        {/* From Value & Select */}
        <div className="space-y-1.5 relative z-30" ref={fromRef}>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300/90 px-0.5">
            {t?.fromValueLabel || 'From Value & Unit'}
          </label>
          <div className="relative flex rounded-2xl tempered-glass-surface focus-within:border-sky-400/70 transition-all">
            <input
              id="from-value-input"
              data-testid="from-value-input"
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-lg font-extrabold font-sans tabular-nums bg-transparent outline-none"
            />
            <button
              type="button"
              id="from-unit-trigger"
              onClick={() => {
                setOpenFromSelect((prev) => !prev);
                setOpenToSelect(false);
              }}
              className="px-3.5 py-3 text-xs font-extrabold bg-slate-900/[0.04] dark:bg-white/[0.06] text-slate-900 dark:text-slate-100 border-l border-slate-900/10 dark:border-white/12 flex items-center gap-2 shrink-0 hover:bg-slate-900/[0.08] dark:hover:bg-white/[0.12] transition-colors rounded-r-2xl"
            >
              <span>
                {selectedFromObj?.name} ({selectedFromObj?.symbol})
              </span>
              <ChevronDown
                strokeWidth={2.5}
                className={`w-4 h-4 transition-transform duration-200 ${
                  openFromSelect ? 'rotate-180 text-sky-500 dark:text-sky-300' : 'text-slate-400'
                }`}
              />
            </button>

            {openFromSelect && (
              <div className="absolute right-0 top-full mt-2 w-72 tempered-glass-card rounded-2xl p-2 z-[999] max-h-64 overflow-y-auto font-sans animate-modal-pop">
                {currentUnits.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setFromUnit(u.id);
                      setOpenFromSelect(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors my-0.5 ${
                      fromUnit === u.id
                        ? 'liquid-glass-lens text-white font-extrabold'
                        : 'text-slate-900 dark:text-slate-100 hover:bg-sky-500/15 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{u.name}</span>
                    <span className="font-sans font-bold opacity-80">({u.symbol})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Refractive Swap Button */}
        <div className="flex justify-center -my-2 relative z-20">
          <button
            type="button"
            id="btn-swap-units"
            data-testid="btn-swap-units"
            onClick={handleSwap}
            className="w-10 h-10 rounded-full tempered-glass-card text-sky-600 dark:text-sky-300 flex items-center justify-center hover:scale-110 hover:rotate-180 active:scale-95 transition-all duration-300 border border-sky-400/45"
            title={t?.swapTooltip || 'Swap Units'}
          >
            <ArrowLeftRight strokeWidth={2.5} className="w-4 h-4" />
          </button>
        </div>

        {/* To Value & Select */}
        <div className="space-y-1.5 relative z-10" ref={toRef}>
          <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300/90 px-0.5">
            {t?.toValueLabel || 'To Result & Unit'}
          </label>
          <div className="relative flex items-center justify-between rounded-2xl tempered-glass-card p-2 transition-all">
            <div
              id="to-value-output"
              data-testid="to-value-output"
              className="px-3 text-xl font-extrabold font-sans tabular-nums text-sky-700 dark:text-sky-300 truncate"
            >
              {result !== null ? result : '-'}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {result !== null && (
                <button
                  type="button"
                  id="btn-copy-converter-result"
                  data-testid="btn-copy-converter-result"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full liquid-glass-lens text-white text-xs font-bold transition-all btn-press-effect"
                  title={t?.copyBtn || 'Copy'}
                >
                  {copied ? (
                    <Check strokeWidth={2.5} className="w-3.5 h-3.5 text-emerald-200" />
                  ) : (
                    <Copy strokeWidth={2.5} className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? t?.copiedBtn || 'Copied' : t?.copyBtn || 'Copy'}</span>
                </button>
              )}

              <button
                type="button"
                id="to-unit-trigger"
                onClick={() => {
                  setOpenToSelect((prev) => !prev);
                  setOpenFromSelect(false);
                }}
                className="px-3 py-2 text-xs font-extrabold tempered-glass-surface text-slate-900 dark:text-slate-100 flex items-center gap-1.5 rounded-xl hover:border-sky-400/50 transition-colors"
              >
                <span>
                  {selectedToObj?.name} ({selectedToObj?.symbol})
                </span>
                <ChevronDown
                  strokeWidth={2.5}
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openToSelect ? 'rotate-180 text-sky-500 dark:text-sky-300' : 'text-slate-400'
                  }`}
                />
              </button>
            </div>

            {openToSelect && (
              <div className="absolute right-0 top-full mt-2 w-72 tempered-glass-card rounded-2xl p-2 z-[999] max-h-64 overflow-y-auto font-sans animate-modal-pop">
                {currentUnits.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setToUnit(u.id);
                      setOpenToSelect(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors my-0.5 ${
                      toUnit === u.id
                        ? 'liquid-glass-lens text-white font-extrabold'
                        : 'text-slate-900 dark:text-slate-100 hover:bg-sky-500/15 dark:hover:bg-white/10'
                    }`}
                  >
                    <span>{u.name}</span>
                    <span className="font-sans font-bold opacity-80">({u.symbol})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View All Results Button */}
      <div className="pt-4 flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={() => setShowAllDrawer(true)}
          className="w-full py-3 px-4 rounded-2xl liquid-glass-lens text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all btn-press-effect"
        >
          <Layers strokeWidth={2.5} className="w-4 h-4" />
          <span>{t?.viewAllResults(currentUnits.length) || `View Results in ${currentUnits.length} Units`}</span>
        </button>

        {/* Benchmark Hint */}
        {errorMsg ? (
          <div className="w-full p-3 rounded-2xl bg-rose-500/12 dark:bg-rose-950/50 border border-rose-400/30 text-xs text-rose-600 dark:text-rose-300 font-bold text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center">
            {t?.benchmarkLabel || 'Unit Benchmark:'}{' '}
            <strong className="font-sans tabular-nums font-extrabold text-sky-700 dark:text-sky-300">
              {getFormulaHint()}
            </strong>
          </div>
        )}
      </div>

      {/* Drawer Overlay */}
      <AllResultsDrawer
        isOpen={showAllDrawer}
        onClose={() => setShowAllDrawer(false)}
        category={category}
        fromValue={fromValue}
        fromUnit={fromUnit}
        language={language}
        t={t}
      />
    </div>
  );
};

export default CompleteConverterView;
