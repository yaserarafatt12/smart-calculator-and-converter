'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, ArrowDown } from 'lucide-react';
import { Language } from '@/lib/i18n/translations';

interface PwaInstallPromptProps {
  language?: Language;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ language = 'id' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSModal, setShowIOSModal] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      if (isStandalone) return;

      const dismissed = localStorage.getItem('smart_calc_pwa_dismissed');
      if (dismissed) return;

      const userAgent = window.navigator.userAgent.toLowerCase();
      const iosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(iosDevice);

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      // Show prompt banner automatically after 20 seconds of comfortable usage
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 20000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        clearTimeout(timer);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } else {
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSModal(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart_calc_pwa_dismissed', 'true');
    }
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <>
      {/* Bottom Floating PWA Banner — Midnight Navy Tempered Glass */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-sheet-up font-sans">
        <div className="p-3.5 rounded-3xl bg-[#0C1930]/88 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.24)] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl liquid-glass-lens text-white shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black tracking-tight">
                {language === 'id' ? 'Pasang Aplikasi di HP' : 'Install Mobile App'}
              </div>
              <div className="text-[10px] text-sky-200/80 font-medium mt-0.5">
                {isIOS
                  ? (language === 'id' ? 'Pasang via Safari (Share → Layar Utama)' : 'Add to iPhone Home Screen')
                  : (language === 'id' ? 'Bekerja mandiri & 100% offline' : 'Work 100% offline')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-full text-xs font-extrabold liquid-glass-lens text-white transition-all btn-press-effect flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Pasang' : 'Install'}</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Special iOS Step-by-Step Tooltip Sheet */}
      {showIOSModal && (
        <div
          onClick={() => setShowIOSModal(false)}
          className="fixed inset-0 z-[110] bg-slate-950/75 backdrop-blur-md flex flex-col justify-end p-4 animate-fade-in cursor-pointer font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm mx-auto bg-[#0C1930]/92 backdrop-blur-2xl text-white border border-white/22 shadow-[0_28px_70px_-14px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.24)] rounded-3xl p-5 space-y-4 relative animate-sheet-up cursor-default"
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-white/12">
              <span className="text-xs font-extrabold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                {language === 'id' ? 'Cara Pasang di iPhone (Safari)' : 'How to Install on iPhone'}
              </span>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="text-slate-300 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-medium text-slate-200">
              <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/[0.06] border border-white/12">
                <div className="w-6 h-6 rounded-xl liquid-glass-lens text-white font-black shrink-0 text-xs flex items-center justify-center">1</div>
                <div>
                  Ketuk ikon <strong className="text-sky-300 font-extrabold inline-flex items-center gap-1">Bagikan / Share <Share className="w-3.5 h-3.5 inline" /></strong> di menu peramban Safari (bawah/atas layar).
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/[0.06] border border-white/12">
                <div className="w-6 h-6 rounded-xl liquid-glass-lens text-white font-black shrink-0 text-xs flex items-center justify-center">2</div>
                <div>
                  Geser menu ke bawah, ketuk <strong className="text-emerald-300 font-extrabold inline-flex items-center gap-1">&quot;Tambah ke Layar Utama&quot; <PlusSquare className="w-3.5 h-3.5 inline" /></strong> atau <strong className="text-emerald-300 font-extrabold">&quot;Tambah Pintasan&quot;</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-white/[0.06] border border-white/12">
                <div className="w-6 h-6 rounded-xl liquid-glass-lens text-white font-black shrink-0 text-xs flex items-center justify-center">3</div>
                <div>
                  Ketuk <strong className="text-sky-300 font-extrabold">&quot;Tambah&quot;</strong> di pojok kanan atas. Ikon aplikasi akan langsung muncul di Layar Utama iPhone Anda!
                </div>
              </div>
            </div>

            <div className="pt-1 text-center flex flex-col items-center">
              <ArrowDown className="w-5 h-5 text-sky-400 animate-bounce mb-1.5" />
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-2xl liquid-glass-lens text-white text-xs font-black transition-all btn-press-effect"
              >
                {language === 'id' ? 'Saya Mengerti' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallPrompt;
