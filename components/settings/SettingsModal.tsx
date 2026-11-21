'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Sun,
  Moon,
  Globe,
  BookOpen,
  Zap,
  Calculator,
  Layers,
  History,
  X,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Info,
  Ruler,
  Scale,
  Thermometer,
  Square,
  Box,
  Clock,
  Cpu,
  Flame,
  Activity,
  Gauge,
  Compass,
  Radio,
  Droplet,
  Download,
  Smartphone,
  Share2,
  Settings,
} from 'lucide-react';
import { Language, TRANSLATIONS } from '@/lib/i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: Language;
  onToggleLanguage: () => void;
  historyCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  historyCount,
}) => {
  const [openGuideSection, setOpenGuideSection] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState<boolean>(false);

  const t = TRANSLATIONS[language];
  const isDark = theme === 'dark';

  // Listen for PWA Install Prompt event & check standalone mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAppStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      setIsStandalone(isAppStandalone);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowIOSInstructions(true);
    }
  };

  if (!isOpen) return null;

  const toggleGuide = (sectionId: string) => {
    setOpenGuideSection((prev) => (prev === sectionId ? null : sectionId));
  };

  const categoriesDetail = [
    {
      id: 'length',
      name: language === 'id' ? 'Panjang & Jarak' : 'Length & Distance',
      desc: language === 'id' ? 'Konversi dimensi benda, tinggi badan, & jarak tempuh (mm, cm, m, km, inch, feet, yard, mile).' : 'Convert object dimensions, heights, & travel distances (mm, cm, m, km, in, ft, yd, mi).',
      icon: <Ruler className="w-4 h-4 text-sky-500" />,
    },
    {
      id: 'weight',
      name: language === 'id' ? 'Berat & Massa' : 'Weight & Mass',
      desc: language === 'id' ? 'Konversi timbangan badan, barang, & muatan (mg, gram, kg, ton, pound/lb, ounce/oz).' : 'Convert body weights, commodities, & cargo (mg, g, kg, ton, lb, oz).',
      icon: <Scale className="w-4 h-4 text-violet-500" />,
    },
    {
      id: 'temperature',
      name: language === 'id' ? 'Suhu & Temperatur' : 'Temperature',
      desc: language === 'id' ? 'Konversi cuaca & sains kelautan (°C Celsius, °F Fahrenheit, K Kelvin, °R Rankine).' : 'Convert weather & scientific temperatures (°C, °F, K, °R).',
      icon: <Thermometer className="w-4 h-4 text-rose-500" />,
    },
    {
      id: 'area',
      name: language === 'id' ? 'Luas & Bidang' : 'Area & Surface',
      desc: language === 'id' ? 'Perhitungan denah ruangan, tanah, & wilayah (m², km², hektar/ha, acre, sq ft).' : 'Calculate floor plans, land plots, & territories (m², km², ha, acre, sq ft).',
      icon: <Square className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'volume',
      name: language === 'id' ? 'Volume & Takaran Liquid' : 'Volume & Fluid Capacity',
      desc: language === 'id' ? 'Konversi isi tangki, bahan resep, & wadah (mL, Liter, m³, galon, fluid oz).' : 'Convert container capacities, liquid recipes, & tanks (mL, L, m³, gallon, fl oz).',
      icon: <Box className="w-4 h-4 text-cyan-500" />,
    },
    {
      id: 'time',
      name: language === 'id' ? 'Waktu & Durasi' : 'Time & Duration',
      desc: language === 'id' ? 'Konversi durasi kerja, stopwatch, & kalender (ms, detik, menit, jam, hari, minggu, tahun).' : 'Convert work durations, stopwatches, & calendars (ms, sec, min, hr, day, wk, yr).',
      icon: <Clock className="w-4 h-4 text-emerald-500" />,
    },
    {
      id: 'speed',
      name: language === 'id' ? 'Kecepatan & Lajuan' : 'Speed & Velocity',
      desc: language === 'id' ? 'Konversi laju kendaraan, angin, & kapal (m/s, km/jam, mph, knot).' : 'Convert vehicle speeds, wind, & nautical speeds (m/s, km/h, mph, knot).',
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
    },
    {
      id: 'digital',
      name: language === 'id' ? 'Data Digital & Memori' : 'Digital Data & Storage',
      desc: language === 'id' ? 'Konversi ukuran file & kuota internet (bit, Byte, KB, MB, GB, TB, KiB, MiB).' : 'Convert file sizes & internet bandwidth (bit, B, KB, MB, GB, TB, KiB, MiB).',
      icon: <Cpu className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 'energy',
      name: language === 'id' ? 'Energi & Kalori' : 'Energy & Calories',
      desc: language === 'id' ? 'Konversi nilai gizi makanan & listrik (Joule, kJ, kalori/cal, Wh, kWh).' : 'Convert food nutrition calories & electrical work (Joule, kJ, cal, Wh, kWh).',
      icon: <Flame className="w-4 h-4 text-orange-500" />,
    },
    {
      id: 'power',
      name: language === 'id' ? 'Daya & Beban Listrik' : 'Power & Wattage',
      desc: language === 'id' ? 'Perhitungan daya mesin & alat elektronik (Watt, kW, Horsepower/HP).' : 'Calculate appliance wattage & engine horsepower (W, kW, HP).',
      icon: <Activity className="w-4 h-4 text-red-500" />,
    },
    {
      id: 'pressure',
      name: language === 'id' ? 'Tekanan & Fluida' : 'Pressure & Fluids',
      desc: language === 'id' ? 'Konversi tekanan ban kendaraan & cuaca (Pascal, bar, atm, psi).' : 'Convert tire inflation pressure & barometric weather (Pa, bar, atm, psi).',
      icon: <Gauge className="w-4 h-4 text-teal-500" />,
    },
    {
      id: 'angle',
      name: language === 'id' ? 'Sudut & Trigonometri' : 'Angle & Geometry',
      desc: language === 'id' ? 'Konversi bidang geometri & kompas navigasi (Derajat/°, Radian/rad, Gradian).' : 'Convert geometry angles & navigation headings (Degrees/°, Radians/rad, Grad).',
      icon: <Compass className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 'frequency',
      name: language === 'id' ? 'Frekuensi & Gelombang' : 'Frequency & Signal',
      desc: language === 'id' ? 'Konversi frekuensi sinyal & prosesor (Hz, kHz, MHz, GHz).' : 'Convert signal frequencies & processor clocks (Hz, kHz, MHz, GHz).',
      icon: <Radio className="w-4 h-4 text-pink-500" />,
    },
    {
      id: 'fuel',
      name: language === 'id' ? 'Bahan Bakar & Konsumsi' : 'Fuel Consumption',
      desc: language === 'id' ? 'Perhitungan efisiensi bahan bakar kendaraan (km/L, L/100km, mpg).' : 'Calculate vehicle fuel mileage efficiency (km/L, L/100km, mpg).',
      icon: <Droplet className="w-4 h-4 text-sky-500" />,
    },
  ];

  const guideRowHeaderClass =
    'w-full p-3.5 text-left font-extrabold text-xs flex items-center justify-between text-slate-900 dark:text-white hover:bg-sky-500/10 dark:hover:bg-white/[0.06] transition-colors';
  const guideRowBodyClass =
    'p-3.5 bg-white/55 dark:bg-[#070f20]/60 text-xs space-y-2.5 text-slate-700 dark:text-slate-300 font-medium border-t border-slate-900/10 dark:border-white/10';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-md flex items-start sm:items-center justify-center p-3.5 sm:p-4 pt-4 animate-fade-in cursor-pointer font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] tempered-glass-card rounded-[32px] overflow-y-auto p-5 sm:p-6 space-y-4 animate-modal-pop cursor-default text-slate-900 dark:text-white"
      >
        {/* Header Title Bar with Settings Gear Icon */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-900/10 dark:border-white/12">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl liquid-glass-lens text-white">
              <Settings strokeWidth={2.5} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                {t.settingsTitle}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {t.manageSessionSub}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full tempered-glass-surface text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors btn-press-effect"
            aria-label={t.close}
          >
            <X strokeWidth={2.5} className="w-4 h-4" />
          </button>
        </div>

        {/* SECTION 1: Install App (PWA) Banner */}
        <div className="p-4 rounded-2xl liquid-glass-lens text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/25 shrink-0">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black tracking-tight">
                {t.pwaInstallTitle}
              </div>
              <div className="text-[11px] text-sky-100/90 font-medium mt-0.5">
                {isStandalone ? t.pwaInstalledText : t.pwaInstallDesc}
              </div>
            </div>
          </div>

          {!isStandalone && (
            <button
              type="button"
              onClick={handleInstallPWA}
              className="px-3.5 py-2 rounded-full text-xs font-black bg-white text-indigo-700 hover:bg-sky-50 transition-all btn-press-effect shrink-0 flex items-center gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.installBtn}</span>
            </button>
          )}
        </div>

        {/* iOS / Safari Installation Instructions Modal Box */}
        {showIOSInstructions && !isStandalone && (
          <div className="p-4 rounded-2xl tempered-glass-surface space-y-2 text-xs text-slate-900 dark:text-slate-200 animate-modal-pop">
            <div className="flex items-center justify-between font-extrabold text-slate-900 dark:text-white">
              <span className="flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                {t.iosGuideTitle}
              </span>
              <button
                type="button"
                onClick={() => setShowIOSInstructions(false)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <ol className="list-decimal pl-5 space-y-2 font-medium text-[11px]">
              <li>{t.iosStep1}</li>
              <li>{t.iosStep2}</li>
              <li>{t.iosStep3}</li>
            </ol>
          </div>
        )}

        {/* SECTION 2: Clean Guest Profile Card */}
        <div className="p-3.5 rounded-2xl tempered-glass-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl liquid-glass-lens text-white flex items-center justify-center font-extrabold text-sm">
              <UserCheck strokeWidth={2.5} className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.guestProfile}
            </div>
          </div>

          <span className="text-xs font-extrabold tabular-nums text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/25">
            {historyCount} {language === 'id' ? 'Riwayat' : 'History'}
          </span>
        </div>

        {/* SECTION 3: Appearance & Language Controls */}
        <div className="space-y-2.5">
          <h3 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
            {t.appSettingsGroup}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Theme Toggle */}
            <div className="p-3.5 rounded-2xl tempered-glass-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Moon strokeWidth={2.5} className="w-4 h-4 text-amber-300" />
                ) : (
                  <Sun strokeWidth={2.5} className="w-4 h-4 text-amber-500" />
                )}
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">{t.appearance}</span>
              </div>

              <button
                type="button"
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-full text-xs font-extrabold liquid-glass-lens text-white transition-all btn-press-effect"
              >
                {isDark ? t.darkMode : t.lightMode}
              </button>
            </div>

            {/* Language Toggle */}
            <div className="p-3.5 rounded-2xl tempered-glass-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe strokeWidth={2.5} className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">{t.languageLabel}</span>
              </div>

              <button
                type="button"
                onClick={onToggleLanguage}
                className="px-3 py-1.5 rounded-full text-xs font-extrabold liquid-glass-lens text-white transition-all btn-press-effect"
              >
                {language === 'en' ? 'English' : 'Indonesia'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: Complete Guidebook */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-2">
            <BookOpen strokeWidth={2.5} className="w-4 h-4 text-sky-700 dark:text-sky-300" />
            <h3 className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-sky-700 dark:text-sky-300">
              {t.guidebookTitle}
            </h3>
          </div>

          <div className="space-y-2">
            {/* Guide 1: Kegunaan Utama Aplikasi */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('purpose')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                  {t.guidePurposeTitle}
                </span>
                {openGuideSection === 'purpose' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {openGuideSection === 'purpose' && (
                <div className={guideRowBodyClass}>
                  <p className="leading-relaxed">
                    {language === 'id'
                      ? 'Aplikasi ini dibangun untuk menghadirkan alat kalkulasi & konversi satuan yang 100% bersih, cepat, aman, dan bebas dari iklan yang mengganggu.'
                      : 'Built to provide a 100% clean, ad-free, high-precision calculation & unit conversion tool for everyday productivity.'}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white font-extrabold">100% Bebas Iklan &amp; Offline:</strong>{' '}
                        {language === 'id' ? 'Bekerja secara lokal di browser tanpa membutuhkan koneksi internet atau server eksternal.' : 'Runs locally in browser without needing internet connections.'}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white font-extrabold">Aman Tanpa eval():</strong>{' '}
                        {language === 'id' ? 'Menggunakan mesin AST Parser matematika buatan sendiri untuk evaluasi ekspresi presisi tinggi.' : 'Uses a custom Shunting-Yard AST Parser for 100% secure calculation evaluation.'}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 dark:text-white font-extrabold">Dua Mode Ergonomis:</strong>{' '}
                        {language === 'id' ? 'Bebas berganti antara Mode Default (aritmatika harian) dan Mode Lengkap (fungsi ilmiah 4 kolom).' : 'Easily switch between Default Mode (everyday arithmetic) and Complete Mode (4-column scientific keypad).'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide 2: Perbedaan Mode Default & Lengkap */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('modes')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                  {t.guideModesTitle}
                </span>
                {openGuideSection === 'modes' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {openGuideSection === 'modes' && (
                <div className={guideRowBodyClass}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-extrabold">Mode Default:</strong>{' '}
                      {language === 'id' ? 'Didesain untuk aritmatika dasar sehari-hari dengan tombol angka besar yang sangat lega.' : 'Designed for everyday basic arithmetic with large, comfortable touch buttons.'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-extrabold">Mode Lengkap:</strong>{' '}
                      {language === 'id' ? 'Tata letak 4-kolom ilmiah presisi dengan tombol hapus (AC, C, ⌫) di baris paling atas tepat di bawah layar hasil.' : 'Precision 4-column scientific layout with clear/delete buttons (AC, C, ⌫) at Row 1 directly below the result card.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide 3: 2nd Button & Inverse Functions */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('second')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 dark:text-amber-300" />
                  {t.guideSecondTitle}
                </span>
                {openGuideSection === 'second' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {openGuideSection === 'second' && (
                <div className={guideRowBodyClass}>
                  <p>
                    {language === 'id'
                      ? 'Tombol 2nd berwarna kuning mencolok. Saat ditekan aktif, fungsi matematika otomatis bertransformasi:'
                      : 'The yellow 2nd button toggles inverse mathematical functions:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-mono text-[11px] text-amber-700 dark:text-amber-300 font-bold">
                    <li>sin → sin⁻¹ (Arcsin)</li>
                    <li>cos → cos⁻¹ (Arccos)</li>
                    <li>tan → tan⁻¹ (Arctan)</li>
                    <li>log → 10x &nbsp;&nbsp;&nbsp;&nbsp; ln → ex</li>
                    <li>√x → x²</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Guide 4: Calculation History & Actions */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('history')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                  {t.guideHistoryTitle}
                </span>
                {openGuideSection === 'history' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {openGuideSection === 'history' && (
                <div className={guideRowBodyClass}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-extrabold">{t.restoreFormula}:</strong>{' '}
                      {language === 'id' ? 'Mengembalikan seluruh rumus lama ke layar kalkulator untuk dihitung atau diedit kembali.' : 'Restores the original formula string into the calculator display.'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 dark:text-white font-extrabold">{t.insertResult}:</strong>{' '}
                      {language === 'id' ? 'Menyisipkan angka hasil ke dalam rumus yang sedang diketik.' : 'Appends the calculated number into your ongoing expression.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide 5: Unit Converter & Detailed 14 Category Breakdown */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('converter')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600 dark:text-sky-300" />
                  {t.guideConverterTitle}
                </span>
                {openGuideSection === 'converter' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {openGuideSection === 'converter' && (
                <div className={guideRowBodyClass}>
                  <div className="grid grid-cols-1 gap-2">
                    {categoriesDetail.map((cat, idx) => (
                      <div
                        key={cat.id}
                        className="p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.04] border border-slate-900/10 dark:border-white/10 flex items-start gap-2.5"
                      >
                        <div className="p-1.5 rounded-lg bg-white dark:bg-[#0c1930] border border-slate-900/10 dark:border-white/12 shadow-sm shrink-0">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="text-[11px] font-extrabold text-slate-900 dark:text-white">
                            {idx + 1}. {cat.name}
                          </div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                            {cat.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 5: About & License Footer */}
        <div className="pt-3 border-t border-slate-900/10 dark:border-white/12 text-center text-xs font-medium text-slate-600 dark:text-slate-400 space-y-1">
          <div className="font-extrabold text-slate-900 dark:text-white">
            {t.versionLabel}
          </div>
          <div>
            Built with Next.js 14, TypeScript &amp; Tailwind CSS by{' '}
            <strong className="text-sky-700 dark:text-sky-300 font-extrabold">Yaser Arafat</strong>.
          </div>
          <div className="text-[10px] opacity-75">
            Licensed under MIT &copy; 2026. Zero `eval()`, 100% Local-First.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
