'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare } from 'lucide-react';
import { Language } from '@/lib/i18n/translations';

interface PwaInstallPromptProps {
  language?: Language;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ language = 'en' }) => {
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
        <div className="p-3.5 rounded-3xl tempered-glass-modal text-[#0A1128] dark:text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/80 dark:text-white/85 shrink-0">
              <Smartphone strokeWidth={2} className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold tracking-tight truncate">
                {language === 'id' ? 'Pasang di Layar Utama' : 'Install Smart Calc'}
              </div>
              <div className="text-[11px] text-[#0A1128]/60 dark:text-white/55 font-medium mt-0.5 truncate">
                {isIOS
                  ? (language === 'id' ? 'Tambahkan lewat Safari' : 'Add to iPhone Home Screen')
                  : (language === 'id' ? 'Bisa digunakan 100% offline' : 'Works 100% offline')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold primary-cta-btn transition-all btn-press-effect flex items-center gap-1.5"
            >
              <Download strokeWidth={2.2} className="w-3.5 h-3.5" />
              <span>{language === 'id' ? 'Pasang' : 'Install'}</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 rounded-full text-[#0A1128]/50 dark:text-white/55 hover:text-[#0A1128] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X strokeWidth={2} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Step-by-Step Guide Sheet */}
      {showIOSModal && (
        <div
          onClick={() => setShowIOSModal(false)}
          className="fixed inset-0 z-[110] bg-black/55 backdrop-blur-md flex flex-col justify-end p-4 animate-fade-in cursor-pointer font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm mx-auto tempered-glass-modal text-[#0A1128] dark:text-white rounded-3xl p-5 space-y-4 relative animate-sheet-up cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#0A1128]/10 dark:border-white/12">
              <span className="text-xs font-semibold tracking-tight flex items-center gap-2">
                <Smartphone strokeWidth={2} className="w-4 h-4 text-[#00A3FF] dark:text-[#38BDF8]" />
                {language === 'id' ? 'Cara Pasang di iPhone (Safari)' : 'How to Install on iPhone'}
              </span>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.18] text-[#0A1128]/70 dark:text-white/75 hover:text-[#0A1128] dark:hover:text-white transition-colors"
                aria-label="Close"
              >
                <X strokeWidth={2} className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-medium text-[#0A1128]/75 dark:text-white/75">
              <div className="flex items-start gap-3 p-3 rounded-2xl tempered-glass-surface">
                <div className="w-6 h-6 rounded-lg bg-black/[0.06] dark:bg-white/[0.10] border border-black/[0.08] dark:border-white/15 text-[#0A1128] dark:text-white font-semibold shrink-0 text-xs flex items-center justify-center">1</div>
                <div>
                  {language === 'id' ? (
                    <>Ketuk ikon <strong className="text-[#0A1128] dark:text-white font-semibold inline-flex items-center gap-1">Bagikan <Share className="w-3.5 h-3.5 inline" /></strong> di bar Safari.</>
                  ) : (
                    <>Tap the <strong className="text-[#0A1128] dark:text-white font-semibold inline-flex items-center gap-1">Share <Share className="w-3.5 h-3.5 inline" /></strong> button in Safari.</>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl tempered-glass-surface">
                <div className="w-6 h-6 rounded-lg bg-black/[0.06] dark:bg-white/[0.10] border border-black/[0.08] dark:border-white/15 text-[#0A1128] dark:text-white font-semibold shrink-0 text-xs flex items-center justify-center">2</div>
                <div>
                  {language === 'id' ? (
                    <>Pilih <strong className="text-[#0A1128] dark:text-white font-semibold inline-flex items-center gap-1">&quot;Tambah ke Layar Utama&quot; <PlusSquare className="w-3.5 h-3.5 inline" /></strong>.</>
                  ) : (
                    <>Scroll down and tap <strong className="text-[#0A1128] dark:text-white font-semibold inline-flex items-center gap-1">&quot;Add to Home Screen&quot; <PlusSquare className="w-3.5 h-3.5 inline" /></strong>.</>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl tempered-glass-surface">
                <div className="w-6 h-6 rounded-lg bg-black/[0.06] dark:bg-white/[0.10] border border-black/[0.08] dark:border-white/15 text-[#0A1128] dark:text-white font-semibold shrink-0 text-xs flex items-center justify-center">3</div>
                <div>
                  {language === 'id' ? (
                    <>Ketuk <strong className="text-[#0A1128] dark:text-white font-semibold">&quot;Tambah&quot;</strong> di pojok kanan atas.</>
                  ) : (
                    <>Tap <strong className="text-[#0A1128] dark:text-white font-semibold">&quot;Add&quot;</strong> at the top right to finish.</>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-2xl primary-cta-btn text-xs font-semibold transition-all btn-press-effect"
            >
              {language === 'id' ? 'Saya Mengerti' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PwaInstallPrompt;
