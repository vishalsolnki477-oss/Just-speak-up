import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed in standalone mode, suppress
  if (isInstalled) {
    return null;
  }

  // Handle click for standard Android/Chromium vs iOS
  const handleClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // In iframes or non-supporting browsers, trigger native prompt instructions
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        title="Install SpeakUp AI as standalone mobile app"
        className={`px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95 cursor-pointer ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>

      {/* Guided installation modal for iOS / manual browsers */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Install SpeakUp AI App
                  </h3>
                  <p className="text-[11px] text-slate-500">Standalone Fullscreen Mobile Experience</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white block">
                    {isIOS ? 'Tap Share Button in Safari' : 'Open Chrome Browser Menu'}
                  </strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    {isIOS ? (
                      <>
                        Tap the <Share className="w-3.5 h-3.5 inline text-indigo-600" /> Share icon at the bottom of Safari.
                      </>
                    ) : (
                      <>
                        Tap the top-right <strong className="font-mono">⋮</strong> (three dots) in Chrome.
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong className="text-slate-900 dark:text-white block">
                    {isIOS ? 'Select "Add to Home Screen"' : 'Select "Install app" or "Add to Home screen"'}
                  </strong>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <PlusSquare className="w-3.5 h-3.5 inline text-indigo-600" /> Confirms installation with SpeakUp AI icon.
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-900 dark:text-emerald-200 block">
                    Launch in Pure App Mode
                  </strong>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Opens like a native Android app without browser URL bars, complete with hardware mic permissions for Sophia AI.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const PWAInstallBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstalled, isInstallable, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) return null;

  return (
    <div
      className={`rounded-3xl p-5 bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden ${className}`}
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3.5 right-3.5 p-1 rounded-full text-slate-400 hover:text-white transition"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/30 shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">
                Install SpeakUp AI on Your Device
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PWA Standalone
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 max-w-lg">
              Enjoy full-screen learning, faster load times, and offline access without browser navigation bars.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isInstallable ? (
            <button
              onClick={install}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Install Now</span>
            </button>
          ) : (
            <PWAInstallButton className="flex-1 sm:flex-initial" />
          )}
        </div>
      </div>
    </div>
  );
};
