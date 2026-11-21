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

  const iconClass = 'w-4 h-4';

  const CATEGORY_ITEMS: CategoryItem[] = [
    { id: 'length', name: t?.catLength || 'Length & Distance', desc: 'mm, cm, m, km, in, ft', icon: <Ruler strokeWidth={2} className={iconClass} /> },
    { id: 'weight', name: t?.catWeight || 'Weight & Mass', desc: 'mg, g, kg, ton, lb', icon: <Scale strokeWidth={2} className={iconClass} /> },
    { id: 'temperature', name: t?.catTemp || 'Temperature', desc: '°C, °F, K, °R', icon: <Thermometer strokeWidth={2} className={iconClass} /> },
    { id: 'area', name: t?.catArea || 'Area & Surface', desc: 'm², km², ha, acre', icon: <Square strokeWidth={2} className={iconClass} /> },
    { id: 'volume', name: t?.catVolume || 'Volume & Capacity', desc: 'mL, L, m³, gal', icon: <Box strokeWidth={2} className={iconClass} /> },
    { id: 'time', name: t?.catTime || 'Time & Duration', desc: 'ms, s, min, hr', icon: <Clock strokeWidth={2} className={iconClass} /> },
    { id: 'speed', name: t?.catSpeed || 'Speed & Velocity', desc: 'm/s, km/h, mph, knot', icon: <Zap strokeWidth={2} className={iconClass} /> },
    { id: 'digital', name: t?.catDigital || 'Digital Data', desc: 'bit, B, KB, MB, GB', icon: <Cpu strokeWidth={2} className={iconClass} /> },
    { id: 'energy', name: t?.catEnergy || 'Energy & Calories', desc: 'J, kJ, cal, Wh, kWh', icon: <Flame strokeWidth={2} className={iconClass} /> },
    { id: 'power', name: t?.catPower || 'Power & Wattage', desc: 'W, kW, HP', icon: <Activity strokeWidth={2} className={iconClass} /> },
    { id: 'pressure', name: t?.catPressure || 'Pressure', desc: 'Pa, bar, atm, psi', icon: <Gauge strokeWidth={2} className={iconClass} /> },
    { id: 'angle', name: t?.catAngle || 'Angle & Geometry', desc: '°, rad, grad', icon: <Compass strokeWidth={2} className={iconClass} /> },
    { id: 'frequency', name: t?.catFrequency || 'Frequency', desc: 'Hz, kHz, MHz, GHz', icon: <Radio strokeWidth={2} className={iconClass} /> },
    { id: 'fuel', name: t?.catFuel || 'Fuel Economy', desc: 'km/L, L/100km, mpg', icon: <Droplet strokeWidth={2} className={iconClass} /> },
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
  }, [category, fromValue, fromUnit, toUnit, t?.validNumberError]);

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
      className="w-full font-sans text-[#0A1128] dark:text-white pb-3"
    >
      {/* Unit Search Bar — Tempered Glass */}
      <div className="relative mb-4">
        <div className="relative flex items-center tempered-glass-surface rounded-2xl px-3.5 py-2.5 focus-within:border-[#00A3FF]/60 dark:focus-within:border-[#38BDF8]/60 transition-all">
          <Search strokeWidth={2} className="w-4 h-4 text-[#0A1128]/45 dark:text-white/45 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t?.searchPlaceholder || 'Search any unit (kg, mile, liter, MB)...'}
            className="w-full text-xs font-medium bg-transparent outline-none text-[#0A1128] dark:text-white placeholder:text-[#0A1128]/45 dark:placeholder:text-white/45"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#0A1128]/50 hover:text-[#0A1128] dark:text-white/55 dark:hover:text-white font-semibold px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-2 tempered-glass-modal rounded-2xl p-2 z-[999] max-h-60 overflow-y-auto space-y-1 animate-modal-pop">
            {searchResults.map((res, idx) => (
              <button
                key={`${res.category.id}-${res.unit.id}-${idx}`}
                type="button"
                onClick={() => {
                  setCategory(res.category.id);
                  setFromUnit(res.unit.id);
                  setSearchQuery('');
                }}
                className="w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#0A1128] dark:text-white block">
                    {res.unit.name} ({res.unit.symbol})
                  </span>
                  <span className="text-[11px] text-[#0A1128]/55 dark:text-white/55">
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
            showAllCategories ? 'max-h-60 overflow-y-auto p-0.5' : ''
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
                    ? 'tempered-glass-card border-[#00A3FF]/50 dark:border-[#38BDF8]/45 text-[#0A1128] dark:text-white'
                    : 'tempered-glass-surface text-[#0A1128]/80 dark:text-white/80 hover:border-black/[0.16] dark:hover:border-white/28'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div
                    className={`p-2 rounded-xl border transition-colors ${
                      isSelected
                        ? 'bg-[#00A3FF]/10 dark:bg-[#38BDF8]/15 border-[#00A3FF]/25 dark:border-[#38BDF8]/30 text-[#00A3FF] dark:text-[#38BDF8]'
                        : 'bg-black/[0.04] dark:bg-white/[0.07] border-black/[0.08] dark:border-white/[0.14] text-[#0A1128]/75 dark:text-white/80'
                    }`}
                  >
                    {cat.icon}
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#00A3FF] dark:bg-[#38BDF8]" />
                  )}
                </div>
                <div>
                  <div className="text-xs sm:text-[13px] font-semibold tracking-tight text-[#0A1128] dark:text-white">
                    {cat.name}
                  </div>
                  <div className="text-[11px] mt-0.5 font-normal text-[#0A1128]/50 dark:text-white/55 truncate">
                    {cat.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Centered Expand Toggle */}
        <div className="flex justify-center w-full mt-3">
          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#0A1128]/80 dark:text-white/80 hover:text-[#0A1128] dark:hover:text-white px-5 py-2 tempered-glass-surface rounded-full transition-all btn-press-effect w-full max-w-[260px] whitespace-nowrap"
          >
            <span>
              {showAllCategories
                ? t?.hideCategories || 'Show Fewer'
                : t?.showMoreCategories || 'Show All 14 Categories'}
            </span>
            {showAllCategories ? (
              <ChevronUp strokeWidth={2} className="w-4 h-4 shrink-0" />
            ) : (
              <ChevronDown strokeWidth={2} className="w-4 h-4 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Separator */}
      <div className="w-full my-4 border-t border-[#0A1128]/[0.08] dark:border-white/[0.10]" />

      {/* Main Conversion Input Block */}
      <div className="space-y-3" ref={formRef}>
        {/* From Value & Select */}
        <div className="space-y-1.5 relative z-30" ref={fromRef}>
          <label className="block text-[11px] font-medium uppercase tracking-wider text-[#0A1128]/55 dark:text-white/55 px-0.5">
            {t?.fromValueLabel || 'From'}
          </label>
          <div className="relative flex rounded-2xl tempered-glass-surface focus-within:border-[#00A3FF]/60 dark:focus-within:border-[#38BDF8]/60 transition-all">
            <input
              id="from-value-input"
              data-testid="from-value-input"
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-lg font-semibold font-sans tabular-nums bg-transparent text-[#0A1128] dark:text-white outline-none"
            />
            <button
              type="button"
              id="from-unit-trigger"
              onClick={() => {
                setOpenFromSelect((prev) => !prev);
                setOpenToSelect(false);
              }}
              className="px-3.5 py-3 text-xs font-semibold bg-black/[0.03] dark:bg-white/[0.05] text-[#0A1128]/85 dark:text-white/85 border-l border-[#0A1128]/[0.08] dark:border-white/12 flex items-center gap-2 shrink-0 hover:bg-black/[0.06] dark:hover:bg-white/[0.10] transition-colors rounded-r-2xl"
            >
              <span>
                {selectedFromObj?.name} ({selectedFromObj?.symbol})
              </span>
              <ChevronDown
                strokeWidth={2}
                className={`w-4 h-4 transition-transform duration-200 ${
                  openFromSelect ? 'rotate-180 text-[#00A3FF] dark:text-[#38BDF8]' : 'text-[#0A1128]/45 dark:text-white/45'
                }`}
              />
            </button>

            {openFromSelect && (
              <div className="absolute right-0 top-full mt-2 w-72 tempered-glass-modal rounded-2xl p-2 z-[999] max-h-64 overflow-y-auto font-sans animate-modal-pop">
                {currentUnits.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setFromUnit(u.id);
                      setOpenFromSelect(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors my-0.5 ${
                      fromUnit === u.id
                        ? 'bg-[#00A3FF]/12 dark:bg-[#38BDF8]/16 text-[#0A1128] dark:text-white font-semibold border border-[#00A3FF]/25 dark:border-[#38BDF8]/30'
                        : 'text-[#0A1128]/80 dark:text-white/80 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{u.name}</span>
                    <span className="font-sans text-[#0A1128]/55 dark:text-white/55">({u.symbol})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Monochrome Swap Button */}
        <div className="flex justify-center -my-1.5 relative z-20">
          <button
            type="button"
            id="btn-swap-units"
            data-testid="btn-swap-units"
            onClick={handleSwap}
            className="w-9 h-9 rounded-full tempered-glass-card text-[#0A1128]/80 dark:text-white/85 hover:text-[#00A3FF] dark:hover:text-[#38BDF8] flex items-center justify-center hover:scale-105 hover:rotate-180 active:scale-95 transition-all duration-300"
            title={t?.swapTooltip || 'Swap Units'}
          >
            <ArrowLeftRight strokeWidth={2} className="w-4 h-4" />
          </button>
        </div>

        {/* To Value & Select */}
        <div className="space-y-1.5 relative z-10" ref={toRef}>
          <label className="block text-[11px] font-medium uppercase tracking-wider text-[#0A1128]/55 dark:text-white/55 px-0.5">
            {t?.toValueLabel || 'Converted Result'}
          </label>
          <div className="relative flex items-center justify-between rounded-2xl tempered-glass-card p-2 transition-all">
            <div
              id="to-value-output"
              data-testid="to-value-output"
              className="px-3 text-xl font-semibold font-sans tabular-nums text-[#0A1128] dark:text-white truncate"
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/85 dark:text-white/85 hover:border-black/[0.16] dark:hover:border-white/30 text-xs font-semibold transition-all btn-press-effect"
                  title={t?.copyBtn || 'Copy'}
                >
                  {copied ? (
                    <Check strokeWidth={2.2} className="w-3.5 h-3.5 text-[#00A3FF] dark:text-[#38BDF8]" />
                  ) : (
                    <Copy strokeWidth={2} className="w-3.5 h-3.5" />
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
                className="px-3 py-2 text-xs font-semibold tempered-glass-surface text-[#0A1128]/85 dark:text-white/85 flex items-center gap-1.5 rounded-xl hover:border-black/[0.16] dark:hover:border-white/28 transition-colors"
              >
                <span>
                  {selectedToObj?.name} ({selectedToObj?.symbol})
                </span>
                <ChevronDown
                  strokeWidth={2}
                  className={`w-4 h-4 transition-transform duration-200 ${
                    openToSelect ? 'rotate-180 text-[#00A3FF] dark:text-[#38BDF8]' : 'text-[#0A1128]/45 dark:text-white/45'
                  }`}
                />
              </button>
            </div>

            {openToSelect && (
              <div className="absolute right-0 top-full mt-2 w-72 tempered-glass-modal rounded-2xl p-2 z-[999] max-h-64 overflow-y-auto font-sans animate-modal-pop">
                {currentUnits.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setToUnit(u.id);
                      setOpenToSelect(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors my-0.5 ${
                      toUnit === u.id
                        ? 'bg-[#00A3FF]/12 dark:bg-[#38BDF8]/16 text-[#0A1128] dark:text-white font-semibold border border-[#00A3FF]/25 dark:border-[#38BDF8]/30'
                        : 'text-[#0A1128]/80 dark:text-white/80 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{u.name}</span>
                    <span className="font-sans text-[#0A1128]/55 dark:text-white/55">({u.symbol})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compare All Units CTA + Quick Reference */}
      <div className="pt-4 flex flex-col items-center gap-2.5">
        <button
          type="button"
          onClick={() => setShowAllDrawer(true)}
          className="w-full py-3 px-4 rounded-2xl primary-cta-btn text-xs font-semibold flex items-center justify-center gap-2 transition-all btn-press-effect"
        >
          <Layers strokeWidth={2} className="w-4 h-4" />
          <span>{t?.viewAllResults(currentUnits.length) || `Compare All ${currentUnits.length} Units`}</span>
        </button>

        {errorMsg ? (
          <div className="w-full p-3 rounded-2xl tempered-glass-surface border-[#00A3FF]/30 dark:border-[#38BDF8]/30 text-xs text-[#0A1128] dark:text-white font-medium text-center">
            {errorMsg}
          </div>
        ) : (
          <div className="text-xs font-medium text-[#0A1128]/55 dark:text-white/55 text-center">
            {t?.benchmarkLabel || 'Quick Reference:'}{' '}
            <strong className="font-sans tabular-nums font-semibold text-[#0A1128] dark:text-white">
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
