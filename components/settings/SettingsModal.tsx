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

  const iconCls = 'w-4 h-4 text-[#0A1128]/75 dark:text-white/80';

  const categoriesDetail = [
    {
      id: 'length',
      name: language === 'id' ? 'Panjang & Jarak' : 'Length & Distance',
      desc: language === 'id' ? 'Dimensi benda, tinggi badan, & jarak (mm, cm, m, km, inch, feet, yard, mile).' : 'Dimensions, heights, & distances (mm, cm, m, km, in, ft, yd, mi).',
      icon: <Ruler strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'weight',
      name: language === 'id' ? 'Berat & Massa' : 'Weight & Mass',
      desc: language === 'id' ? 'Timbangan badan, barang, & muatan (mg, g, kg, ton, lb, oz).' : 'Body weight, goods, & cargo (mg, g, kg, ton, lb, oz).',
      icon: <Scale strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'temperature',
      name: language === 'id' ? 'Suhu & Temperatur' : 'Temperature',
      desc: language === 'id' ? 'Cuaca, masakan, & sains (°C, °F, K, °R).' : 'Weather, cooking, & science (°C, °F, K, °R).',
      icon: <Thermometer strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'area',
      name: language === 'id' ? 'Luas & Bidang' : 'Area & Surface',
      desc: language === 'id' ? 'Denah ruangan, tanah, & wilayah (m², km², ha, acre, sq ft).' : 'Floor plans, land plots, & areas (m², km², ha, acre, sq ft).',
      icon: <Square strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'volume',
      name: language === 'id' ? 'Volume & Takaran' : 'Volume & Capacity',
      desc: language === 'id' ? 'Isi wadah, resep, & tangki (mL, L, m³, galon, fl oz).' : 'Containers, recipes, & tanks (mL, L, m³, gallon, fl oz).',
      icon: <Box strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'time',
      name: language === 'id' ? 'Waktu & Durasi' : 'Time & Duration',
      desc: language === 'id' ? 'Durasi kerja & kalender (ms, detik, menit, jam, hari, minggu, tahun).' : 'Work durations & calendars (ms, sec, min, hr, day, wk, yr).',
      icon: <Clock strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'speed',
      name: language === 'id' ? 'Kecepatan' : 'Speed & Velocity',
      desc: language === 'id' ? 'Laju kendaraan, angin, & kapal (m/s, km/jam, mph, knot).' : 'Vehicle, wind, & nautical speeds (m/s, km/h, mph, knot).',
      icon: <Zap strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'digital',
      name: language === 'id' ? 'Data Digital' : 'Digital Data & Storage',
      desc: language === 'id' ? 'Ukuran file & penyimpanan (bit, B, KB, MB, GB, TB, KiB, MiB).' : 'File sizes & storage (bit, B, KB, MB, GB, TB, KiB, MiB).',
      icon: <Cpu strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'energy',
      name: language === 'id' ? 'Energi & Kalori' : 'Energy & Calories',
      desc: language === 'id' ? 'Kalori makanan & listrik (Joule, kJ, cal, Wh, kWh).' : 'Food calories & electrical energy (Joule, kJ, cal, Wh, kWh).',
      icon: <Flame strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'power',
      name: language === 'id' ? 'Daya Listrik' : 'Power & Wattage',
      desc: language === 'id' ? 'Daya mesin & elektronik (Watt, kW, Horsepower/HP).' : 'Appliances & engine power (W, kW, HP).',
      icon: <Activity strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'pressure',
      name: language === 'id' ? 'Tekanan' : 'Pressure & Fluids',
      desc: language === 'id' ? 'Tekanan ban & barometrik (Pa, bar, atm, psi).' : 'Tire pressure & weather (Pa, bar, atm, psi).',
      icon: <Gauge strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'angle',
      name: language === 'id' ? 'Sudut' : 'Angle & Geometry',
      desc: language === 'id' ? 'Geometri & navigasi (Derajat/°, Radian/rad, Gradian).' : 'Geometry & headings (Degrees/°, Radians/rad, Grad).',
      icon: <Compass strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'frequency',
      name: language === 'id' ? 'Frekuensi' : 'Frequency & Signal',
      desc: language === 'id' ? 'Frekuensi sinyal & prosesor (Hz, kHz, MHz, GHz).' : 'Signal frequencies & clock rates (Hz, kHz, MHz, GHz).',
      icon: <Radio strokeWidth={2} className={iconCls} />,
    },
    {
      id: 'fuel',
      name: language === 'id' ? 'Bahan Bakar' : 'Fuel Economy',
      desc: language === 'id' ? 'Efisiensi BBM kendaraan (km/L, L/100km, mpg).' : 'Vehicle fuel efficiency (km/L, L/100km, mpg).',
      icon: <Droplet strokeWidth={2} className={iconCls} />,
    },
  ];

  const guideRowHeaderClass =
    'w-full p-3.5 text-left font-semibold text-xs flex items-center justify-between text-[#0A1128] dark:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors';
  const guideRowBodyClass =
    'p-3.5 bg-black/[0.02] dark:bg-black/[0.20] text-xs space-y-2.5 text-[#0A1128]/70 dark:text-white/70 font-normal border-t border-[#0A1128]/[0.08] dark:border-white/[0.10]';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-md flex items-start sm:items-center justify-center p-3.5 sm:p-4 pt-4 animate-fade-in cursor-pointer font-sans"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[92vh] sm:max-h-[85vh] tempered-glass-modal rounded-[28px] overflow-y-auto p-5 sm:p-6 space-y-4 animate-modal-pop cursor-default text-[#0A1128] dark:text-white"
      >
        {/* Header Title Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#0A1128]/[0.08] dark:border-white/12">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85">
              <Settings strokeWidth={2} className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-[#0A1128] dark:text-white">
                {t.settingsTitle}
              </h2>
              <p className="text-[11px] text-[#0A1128]/55 dark:text-white/55 font-normal">
                {t.manageSessionSub}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/70 hover:text-[#0A1128] dark:text-white/75 dark:hover:text-white transition-colors btn-press-effect"
            aria-label={t.close}
          >
            <X strokeWidth={2} className="w-4 h-4" />
          </button>
        </div>

        {/* SECTION 1: Install App (PWA) Banner */}
        <div className="p-4 rounded-2xl tempered-glass-card flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85 shrink-0">
              <Smartphone strokeWidth={2} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs sm:text-[13px] font-semibold tracking-tight text-[#0A1128] dark:text-white">
                {t.pwaInstallTitle}
              </div>
              <div className="text-[11px] text-[#0A1128]/60 dark:text-white/60 font-normal mt-0.5">
                {isStandalone ? t.pwaInstalledText : t.pwaInstallDesc}
              </div>
            </div>
          </div>

          {!isStandalone && (
            <button
              type="button"
              onClick={handleInstallPWA}
              className="px-3.5 py-2 rounded-full text-xs font-semibold primary-cta-btn transition-all btn-press-effect shrink-0 flex items-center gap-1.5"
            >
              <Download strokeWidth={2.2} className="w-3.5 h-3.5" />
              <span>{t.installBtn}</span>
            </button>
          )}
        </div>

        {/* iOS / Safari Installation Instructions */}
        {showIOSInstructions && !isStandalone && (
          <div className="p-4 rounded-2xl tempered-glass-surface space-y-2 text-xs text-[#0A1128]/80 dark:text-white/80 animate-modal-pop">
            <div className="flex items-center justify-between font-semibold text-[#0A1128] dark:text-white">
              <span className="flex items-center gap-1.5">
                <Share2 strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8]" />
                {t.iosGuideTitle}
              </span>
              <button
                type="button"
                onClick={() => setShowIOSInstructions(false)}
                className="text-[#0A1128]/50 hover:text-[#0A1128] dark:text-white/55 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <ol className="list-decimal pl-5 space-y-1.5 font-normal text-[11px]">
              <li>{t.iosStep1}</li>
              <li>{t.iosStep2}</li>
              <li>{t.iosStep3}</li>
            </ol>
          </div>
        )}

        {/* SECTION 2: Guest Session Summary */}
        <div className="p-3.5 rounded-2xl tempered-glass-surface flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85 flex items-center justify-center">
              <UserCheck strokeWidth={2} className="w-4 h-4" />
            </div>
            <div className="text-xs sm:text-[13px] font-semibold tracking-tight text-[#0A1128] dark:text-white">
              {t.guestProfile}
            </div>
          </div>

          <span className="text-xs font-semibold tabular-nums text-[#0A1128]/75 dark:text-white/75 px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/15">
            {historyCount} {language === 'id' ? 'Riwayat' : 'Saved'}
          </span>
        </div>

        {/* SECTION 3: Appearance & Language Controls */}
        <div className="space-y-2.5">
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#0A1128]/50 dark:text-white/55 px-0.5">
            {t.appSettingsGroup}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Theme Toggle */}
            <div className="p-3.5 rounded-2xl tempered-glass-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDark ? (
                  <Moon strokeWidth={2} className="w-4 h-4 text-[#0A1128]/75 dark:text-white/80" />
                ) : (
                  <Sun strokeWidth={2} className="w-4 h-4 text-[#0A1128]/75 dark:text-white/80" />
                )}
                <span className="text-xs font-semibold text-[#0A1128] dark:text-white">{t.appearance}</span>
              </div>

              <button
                type="button"
                aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-full text-xs font-semibold primary-cta-btn transition-all btn-press-effect"
              >
                {isDark ? t.darkMode : t.lightMode}
              </button>
            </div>

            {/* Language Toggle */}
            <div className="p-3.5 rounded-2xl tempered-glass-surface flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe strokeWidth={2} className="w-4 h-4 text-[#0A1128]/75 dark:text-white/80" />
                <span className="text-xs font-semibold text-[#0A1128] dark:text-white">{t.languageLabel}</span>
              </div>

              <button
                type="button"
                onClick={onToggleLanguage}
                className="px-3 py-1.5 rounded-full text-xs font-semibold primary-cta-btn transition-all btn-press-effect"
              >
                {language === 'en' ? 'English' : 'Indonesia'}
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: User Guidebook */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-2 px-0.5">
            <BookOpen strokeWidth={2} className="w-3.5 h-3.5 text-[#0A1128]/55 dark:text-white/55" />
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#0A1128]/50 dark:text-white/55">
              {t.guidebookTitle}
            </h3>
          </div>

          <div className="space-y-2">
            {/* Guide 1 */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('purpose')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Info strokeWidth={2} className={iconCls} />
                  {t.guidePurposeTitle}
                </span>
                {openGuideSection === 'purpose' ? <ChevronDown className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
              </button>

              {openGuideSection === 'purpose' && (
                <div className={guideRowBodyClass}>
                  <p className="leading-relaxed">
                    {language === 'id'
                      ? 'Smart Calc menghadirkan alat hitung & konversi satuan yang bersih, cepat, akurat, dan bebas iklan.'
                      : 'Smart Calc provides a clean, ad-free, high-precision calculator and unit converter for everyday tasks.'}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A1128] dark:text-white font-semibold">
                          {language === 'id' ? '100% Offline & Bebas Iklan:' : '100% Offline & Ad-Free:'}
                        </strong>{' '}
                        {language === 'id' ? 'Berjalan sepenuhnya lokal di perangkat tanpa koneksi internet.' : 'Runs completely locally on your device with no internet required.'}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#0A1128] dark:text-white font-semibold">
                          {language === 'id' ? 'Evaluasi Presisi Tinggi:' : 'High-Precision Engine:'}
                        </strong>{' '}
                        {language === 'id' ? 'Menggunakan parser matematika khusus untuk hasil akurat dan aman.' : 'Uses a dedicated math parser for safe, accurate calculations.'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide 2 */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('modes')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Calculator strokeWidth={2} className={iconCls} />
                  {t.guideModesTitle}
                </span>
                {openGuideSection === 'modes' ? <ChevronDown className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
              </button>

              {openGuideSection === 'modes' && (
                <div className={guideRowBodyClass}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0A1128] dark:text-white font-semibold">{t.defaultMode}:</strong>{' '}
                      {language === 'id' ? 'Tata letak ringkas dengan tombol besar untuk hitungan harian.' : 'Clean layout with large keys for everyday arithmetic.'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0A1128] dark:text-white font-semibold">{t.completeMode}:</strong>{' '}
                      {language === 'id' ? 'Menambahkan trigonometri, logaritma, pangkat, memori (MC/MR), dan Ans.' : 'Adds trigonometry, logarithms, powers, memory (MC/MR), and Ans.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide 3 */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('second')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Zap strokeWidth={2} className={iconCls} />
                  {t.guideSecondTitle}
                </span>
                {openGuideSection === 'second' ? <ChevronDown className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
              </button>

              {openGuideSection === 'second' && (
                <div className={guideRowBodyClass}>
                  <p>
                    {language === 'id'
                      ? 'Aktifkan tombol 2nd di mode Ilmiah untuk beralih ke fungsi invers:'
                      : 'Tap the 2nd key in Scientific mode to switch to inverse functions:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-sans tabular-nums text-[11px] text-[#0A1128] dark:text-white font-medium">
                    <li>sin → sin⁻¹ (Arcsin)</li>
                    <li>cos → cos⁻¹ (Arccos)</li>
                    <li>tan → tan⁻¹ (Arctan)</li>
                    <li>log → 10ˣ &nbsp;&middot;&nbsp; ln → eˣ</li>
                    <li>√x → x²</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Guide 4 */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('history')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <History strokeWidth={2} className={iconCls} />
                  {t.guideHistoryTitle}
                </span>
                {openGuideSection === 'history' ? <ChevronDown className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
              </button>

              {openGuideSection === 'history' && (
                <div className={guideRowBodyClass}>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0A1128] dark:text-white font-semibold">{t.restoreFormula}:</strong>{' '}
                      {language === 'id' ? 'Muat kembali seluruh rumus sebelumnya ke layar.' : 'Restores the previous expression into the calculator.'}
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0A1128] dark:text-white font-semibold">{t.insertResult}:</strong>{' '}
                      {language === 'id' ? 'Sisipkan angka hasil ke perhitungan yang sedang diketik.' : 'Appends the result number into your current expression.'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guide 5 */}
            <div className="rounded-2xl tempered-glass-surface overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGuide('converter')}
                className={guideRowHeaderClass}
              >
                <span className="flex items-center gap-2">
                  <Layers strokeWidth={2} className={iconCls} />
                  {t.guideConverterTitle}
                </span>
                {openGuideSection === 'converter' ? <ChevronDown className="w-4 h-4 opacity-60" /> : <ChevronRight className="w-4 h-4 opacity-60" />}
              </button>

              {openGuideSection === 'converter' && (
                <div className={guideRowBodyClass}>
                  <div className="grid grid-cols-1 gap-2">
                    {categoriesDetail.map((cat, idx) => (
                      <div
                        key={cat.id}
                        className="p-2.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.10] flex items-start gap-2.5"
                      >
                        <div className="p-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.14] shrink-0">
                          {cat.icon}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-[#0A1128] dark:text-white">
                            {idx + 1}. {cat.name}
                          </div>
                          <div className="text-[10px] text-[#0A1128]/60 dark:text-white/60 mt-0.5">
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

        {/* SECTION 5: About Footer */}
        <div className="pt-3 border-t border-[#0A1128]/[0.08] dark:border-white/12 text-center text-xs font-normal text-[#0A1128]/55 dark:text-white/55 space-y-1">
          <div className="font-semibold text-[#0A1128] dark:text-white">
            {t.versionLabel}
          </div>
          <div>
            Built with Next.js 14, TypeScript &amp; Tailwind CSS by{' '}
            <strong className="text-[#0A1128] dark:text-white font-semibold">Yaser Arafat</strong>.
          </div>
          <div className="text-[10px] opacity-75">
            Licensed under MIT &copy; 2026 &middot; 100% Local-First
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
