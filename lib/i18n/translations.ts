export type Language = 'en' | 'id';

export interface Translations {
  // Navigation & Header
  calculator: string;
  converter: string;
  history: string;
  settings: string;
  
  // Calculator
  defaultMode: string;
  completeMode: string;
  resultLabel: string;
  copyBtn: string;
  copiedBtn: string;
  syntaxError: string;
  memoryActive: string;
  
  // Result Detail Modal
  resultDetailTitle: string;
  fullPrecisionValue: string;
  scientificNotationLabel: string;
  valueStatusLabel: string;
  approximateValue: string;
  exactValue: string;
  copyValueBtn: string;
  useAsInputBtn: string;
  copyTooltip: string;

  // History Panel
  historyTitle: string;
  historyCount: (count: number) => string;
  clearAll: string;
  confirmClearText: string;
  cancel: string;
  close: string;
  noHistory: string;
  noHistoryDesc: string;
  restoreFormula: string;
  insertResult: string;
  
  // Converter
  searchPlaceholder: string;
  showMoreCategories: string;
  hideCategories: string;
  fromValueLabel: string;
  toValueLabel: string;
  viewAllResults: (count: number) => string;
  benchmarkLabel: string;
  swapTooltip: string;
  validNumberError: string;

  // Converter Categories
  catLength: string;
  catWeight: string;
  catTemp: string;
  catArea: string;
  catVolume: string;
  catTime: string;
  catSpeed: string;
  catDigital: string;
  catEnergy: string;
  catPower: string;
  catPressure: string;
  catAngle: string;
  catFrequency: string;
  catFuel: string;

  // Settings & Guidebook
  settingsTitle: string;
  guestProfile: string;
  guestDesc: string;
  localFirstBadge: string;
  appearance: string;
  darkMode: string;
  lightMode: string;
  languageLabel: string;
  guidebookTitle: string;
  guidebookSubtitle: string;
  aboutTitle: string;
  versionLabel: string;

  pwaInstallTitle: string;
  pwaInstalledText: string;
  pwaInstallDesc: string;
  installBtn: string;
  guidePurposeTitle: string;
  guideModesTitle: string;
  guideSecondTitle: string;
  guideHistoryTitle: string;
  guideConverterTitle: string;
  appSettingsGroup: string;
  manageSessionSub: string;
  iosGuideTitle: string;
  iosStep1: string;
  iosStep2: string;
  iosStep3: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    calculator: 'Calculator',
    converter: 'Converter',
    history: 'History',
    settings: 'Settings & Guide',
    
    defaultMode: 'Basic',
    completeMode: 'Scientific',
    resultLabel: 'Result',
    copyBtn: 'Copy',
    copiedBtn: 'Copied',
    syntaxError: 'Check Expression',
    memoryActive: 'Memory Saved',

    resultDetailTitle: 'Result Details',
    fullPrecisionValue: 'Full Precision Value',
    scientificNotationLabel: 'Scientific Notation',
    valueStatusLabel: 'Accuracy:',
    approximateValue: 'Approximate (≈)',
    exactValue: 'Exact (=)',
    copyValueBtn: 'Copy Value',
    useAsInputBtn: 'Use in Calc',
    copyTooltip: 'Copy exact full-precision result',
    
    historyTitle: 'Calculation History',
    historyCount: (count) => `${count} ${count === 1 ? 'Calculation' : 'Calculations'}`,
    clearAll: 'Clear All',
    confirmClearText: 'Are you sure you want to clear all calculation history? This action cannot be undone.',
    cancel: 'Cancel',
    close: 'Close',
    noHistory: 'No calculation history yet',
    noHistoryDesc: 'Your calculator results will automatically appear here.',
    restoreFormula: 'Restore Formula',
    insertResult: 'Append Result',
    
    searchPlaceholder: 'Search any unit (kg, mile, liter, MB)...',
    showMoreCategories: 'Show All 14 Categories',
    hideCategories: 'Show Fewer',
    fromValueLabel: 'From',
    toValueLabel: 'Converted Result',
    viewAllResults: (count) => `Compare All ${count} Units`,
    benchmarkLabel: 'Quick Reference:',
    swapTooltip: 'Swap Units',
    validNumberError: 'Please enter a valid number',

    catLength: 'Length & Distance',
    catWeight: 'Weight & Mass',
    catTemp: 'Temperature',
    catArea: 'Area & Surface',
    catVolume: 'Volume & Capacity',
    catTime: 'Time & Duration',
    catSpeed: 'Speed & Velocity',
    catDigital: 'Digital Data & Storage',
    catEnergy: 'Energy & Calories',
    catPower: 'Power & Wattage',
    catPressure: 'Pressure & Fluids',
    catAngle: 'Angle & Geometry',
    catFrequency: 'Frequency & Signal',
    catFuel: 'Fuel Economy',

    settingsTitle: 'Settings & Guidebook',
    guestProfile: 'Guest User Profile',
    guestDesc: 'Guest User Session',
    localFirstBadge: 'Local Session',
    appearance: 'Appearance & Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    languageLabel: 'Application Language',
    guidebookTitle: 'Complete User Guidebook',
    guidebookSubtitle: 'Explore app features, scientific modes, and 14+ unit categories.',
    aboutTitle: 'About Application',
    versionLabel: 'Smart Calculator & Unit Converter v1.0.1',

    pwaInstallTitle: 'Install App on Phone (iOS & Android)',
    pwaInstalledText: 'App is installed on your device',
    pwaInstallDesc: 'Add to home screen & work 100% offline',
    installBtn: 'Install',
    guidePurposeTitle: '1. About Smart Calc',
    guideModesTitle: '2. Basic vs Scientific Mode',
    guideSecondTitle: '3. Using 2nd (Inverse) Functions',
    guideHistoryTitle: '4. Calculation History Tips',
    guideConverterTitle: '5. All 14 Unit Categories',
    appSettingsGroup: 'Application Settings',
    manageSessionSub: 'Manage session, theme, and user guide',
    iosGuideTitle: 'iPhone Installation Guide (Safari):',
    iosStep1: 'Tap the Share button (square icon with arrow pointing up) in Safari.',
    iosStep2: 'Scroll down and tap "Add to Home Screen" or "Add Shortcut".',
    iosStep3: 'Tap "Add" at the top right. The app icon will appear on your home screen!',
  },
  id: {
    calculator: 'Kalkulator',
    converter: 'Konverter',
    history: 'Riwayat',
    settings: 'Pengaturan & Panduan',
    
    defaultMode: 'Dasar',
    completeMode: 'Ilmiah',
    resultLabel: 'Hasil',
    copyBtn: 'Salin',
    copiedBtn: 'Tersalin',
    syntaxError: 'Periksa Rumus',
    memoryActive: 'Memori Tersimpan',

    resultDetailTitle: 'Rincian Hasil',
    fullPrecisionValue: 'Nilai Presisi Penuh',
    scientificNotationLabel: 'Notasi Ilmiah',
    valueStatusLabel: 'Ketepatan:',
    approximateValue: 'Pendekatan (≈)',
    exactValue: 'Eksak (=)',
    copyValueBtn: 'Salin Nilai',
    useAsInputBtn: 'Pakai di Rumus',
    copyTooltip: 'Salin hasil presisi penuh',
    
    historyTitle: 'Riwayat Perhitungan',
    historyCount: (count) => `${count} Perhitungan`,
    clearAll: 'Hapus Semua',
    confirmClearText: 'Apakah Anda yakin ingin menghapus seluruh riwayat perhitungan ini? Tindakan ini tidak dapat dibatalkan.',
    cancel: 'Batal',
    close: 'Tutup',
    noHistory: 'Belum ada riwayat perhitungan',
    noHistoryDesc: 'Hasil perhitungan kalkulator Anda akan muncul di sini secara otomatis.',
    restoreFormula: 'Muat Ulang Rumus',
    insertResult: 'Sisipkan Hasil',
    
    searchPlaceholder: 'Cari satuan (kg, mil, liter, MB)...',
    showMoreCategories: 'Lihat Semua 14 Kategori',
    hideCategories: 'Tampilkan Ringkas',
    fromValueLabel: 'Dari',
    toValueLabel: 'Hasil Konversi',
    viewAllResults: (count) => `Bandingkan Semua ${count} Satuan`,
    benchmarkLabel: 'Acuan Cepat:',
    swapTooltip: 'Tukar Satuan',
    validNumberError: 'Masukkan angka yang valid',

    catLength: 'Panjang & Jarak',
    catWeight: 'Berat & Massa',
    catTemp: 'Suhu & Temperatur',
    catArea: 'Luas & Bidang',
    catVolume: 'Volume & Takaran Liquid',
    catTime: 'Waktu & Durasi',
    catSpeed: 'Kecepatan & Lajuan',
    catDigital: 'Data Digital & Memori',
    catEnergy: 'Energi & Kalori',
    catPower: 'Daya & Beban Listrik',
    catPressure: 'Tekanan & Fluida',
    catAngle: 'Sudut & Trigonometri',
    catFrequency: 'Frekuensi & Gelombang',
    catFuel: 'Bahan Bakar & Konsumsi',

    settingsTitle: 'Pengaturan & Buku Panduan',
    guestProfile: 'Profil Pengguna Tamu',
    guestDesc: 'Sesi Pengguna Tamu',
    localFirstBadge: 'Sesi Lokal',
    appearance: 'Tampilan & Tema',
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    languageLabel: 'Bahasa Aplikasi',
    guidebookTitle: 'Buku Panduan Penggunaan Lengkap',
    guidebookSubtitle: 'Pelajari fitur aplikasi, mode ilmiah, dan rincian 14+ kategori satuan.',
    aboutTitle: 'Tentang Aplikasi',
    versionLabel: 'Kalkulator & Konverter Satuan v1.0.1',

    pwaInstallTitle: 'Pasang Aplikasi di HP (iOS & Android)',
    pwaInstalledText: 'Aplikasi sudah terpasang di HP Anda',
    pwaInstallDesc: 'Jadikan aplikasi mandiri tanpa peramban (Offline)',
    installBtn: 'Pasang',
    guidePurposeTitle: '1. Tentang Smart Calc',
    guideModesTitle: '2. Mode Dasar vs Ilmiah',
    guideSecondTitle: '3. Fungsi Tombol 2nd (Invers)',
    guideHistoryTitle: '4. Tips Riwayat Perhitungan',
    guideConverterTitle: '5. Semua 14 Kategori Satuan',
    appSettingsGroup: 'Pengaturan Aplikasi',
    manageSessionSub: 'Kelola sesi, tampilan, dan panduan fitur',
    iosGuideTitle: 'Panduan Pasang di iPhone (Safari):',
    iosStep1: 'Ketuk tombol Bagikan / Share (ikon kotak tanda panah ke atas) di peramban Safari Anda.',
    iosStep2: 'Geser opsi menu ke bawah, lalu ketuk "Tambah ke Layar Utama" ("Add to Home Screen") atau "Tambah Pintasan".',
    iosStep3: 'Ketuk "Tambah" di pojok kanan atas. Ikon Smart Calc akan langsung muncul di HP Anda!',
  },
};

/**
 * Detect browser language on client-side. Defaults to 'en'.
 */
export const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = localStorage.getItem('smart_calc_lang') as Language;
    if (saved === 'en' || saved === 'id') return saved;
    
    const browserLang = (navigator.language || (navigator as any).userLanguage || '').toLowerCase();
    if (browserLang.startsWith('id')) return 'id';
  } catch {
    // Fallback to English
  }
  return 'en';
};
