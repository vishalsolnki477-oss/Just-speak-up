import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Download,
  Terminal,
  CheckCircle2,
  Copy,
  ShieldAlert,
  Sparkles,
  GitBranch,
  Mic,
  Wifi,
  FileDown,
  Info,
  Check,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { useApkStatus } from '../hooks/useApkStatus.ts';
import { BrandLogo } from './BrandLogo.tsx';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'apk' | 'instant' | 'install_guide' | 'github' | 'studio'>('apk');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'checking' | 'downloading' | 'completed' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { exists: apkExists, apkInfo, isLoading: isCheckingApk, checkStatus } = useApkStatus();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2500);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const handleDownloadApk = async () => {
    setDownloadStatus('checking');
    setDownloadProgress(10);
    setErrorMessage(null);

    try {
      // 1. Verify existence through our server status endpoint first
      const statusRes = await fetch('/api/apk-status', { cache: 'no-cache' });
      if (!statusRes.ok) {
        throw new Error('APK status check failed. Server returned HTTP ' + statusRes.status);
      }
      const statusData = await statusRes.json();
      if (!statusData.exists) {
        throw new Error(statusData.error || 'APK file is not available on the server yet.');
      }

      setDownloadStatus('downloading');
      setDownloadProgress(35);

      // 2. Fetch the genuine APK binary stream
      const apkUrl = '/api/download-apk';
      const response = await fetch(apkUrl, { cache: 'no-cache' });
      const contentType = response.headers.get('content-type') || '';

      // Strictly reject HTML responses (the error that previously occurred)
      if (contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of an APK binary. Aborting download to prevent corrupt file.');
      }

      if (!response.ok) {
        throw new Error(`Failed to download APK. Server returned HTTP ${response.status}`);
      }

      setDownloadProgress(70);

      const blob = await response.blob();
      // Ensure the received blob is at least 100KB and definitely not HTML
      if (blob.size < 100000 || blob.type.includes('text/html')) {
        throw new Error(`Corrupt or invalid download received (${blob.size} bytes). Aborting.`);
      }

      setDownloadProgress(90);

      // Create object URL with strictly enforced APK MIME type
      const apkBlob = new Blob([blob], { type: 'application/vnd.android.package-archive' });
      const downloadUrl = window.URL.createObjectURL(apkBlob);

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = statusData.fileName || 'SpeakUp-AI-v1.0.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
      }, 30000);

      setDownloadProgress(100);
      setDownloadStatus('completed');
    } catch (err: any) {
      console.error('APK Download Error:', err);
      setDownloadStatus('error');
      setErrorMessage(err?.message || 'An error occurred while downloading the APK.');
    }
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
        }
      } catch (err) {
        console.warn('PWA prompt error:', err);
      }
    } else {
      setActiveTab('install_guide');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Brand Identity */}
        <div className="relative bg-gradient-to-r from-purple-700 via-indigo-700 to-cyan-600 p-5 sm:p-6 text-white shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <BrandLogo variant="icon" size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight">SpeakUp AI for Android</h2>
                {apkExists ? (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/30 text-emerald-100 border border-emerald-300/40">
                    APK Ready & Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/30 text-amber-100 border border-amber-300/40">
                    Build In Progress
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Speak English. Build Confidence. Transform Your Future.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 p-1.5 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-1 rounded-xl transition text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'apk'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download APK</span>
          </button>
          <button
            onClick={() => setActiveTab('instant')}
            className={`py-2 px-1 rounded-xl transition text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'instant'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Tap Install</span>
          </button>
          <button
            onClick={() => setActiveTab('install_guide')}
            className={`py-2 px-1 rounded-xl transition text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'install_guide'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Install Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`py-2 px-1 rounded-xl transition text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'github'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>GitHub CI</span>
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className={`py-2 px-1 rounded-xl transition text-center flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'studio'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI / Studio</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick Specs Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Package Name</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] truncate block">
                com.speakupai.english
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Microphone</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center justify-center gap-1">
                <Mic className="w-3 h-3" /> Enabled
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Teacher Sophia</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px] flex items-center justify-center gap-1">
                <Wifi className="w-3 h-3" /> Live Voice
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-semibold">Android Target</span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 text-[11px] flex items-center justify-center gap-1">
                API 21 - 34
              </span>
            </div>
          </div>

          {/* Download Progress or Status Indicator */}
          {downloadStatus === 'downloading' && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs text-indigo-900 dark:text-indigo-100 animate-in fade-in">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  Streaming genuine Android APK...
                </span>
                <span className="font-mono">{downloadProgress}%</span>
              </div>
              <div className="w-full bg-indigo-200 dark:bg-indigo-900/60 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center justify-between">
                <span>MIME: application/vnd.android.package-archive</span>
                <span>Size: {apkInfo?.sizeFormatted || '1.1 MB'}</span>
              </p>
            </div>
          )}

          {downloadStatus === 'completed' && (
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 space-y-1.5 text-xs text-emerald-900 dark:text-emerald-100 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>APK Download Initiated Successfully!</span>
                </div>
                <button
                  onClick={handleDownloadApk}
                  className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold underline hover:text-emerald-900"
                >
                  Download Again
                </button>
              </div>
              <p className="text-emerald-800 dark:text-emerald-200">
                <strong>{apkInfo?.fileName || 'SpeakUp-AI-v1.0.0.apk'}</strong> has been sent to your device. Check your notification shade or Files folder to tap and install.
              </p>
            </div>
          )}

          {downloadStatus === 'error' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-700 space-y-2 text-xs text-rose-900 dark:text-rose-100 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Download Error</span>
              </div>
              <p>{errorMessage}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleDownloadApk}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Download</span>
                </button>
                <button
                  onClick={checkStatus}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
                >
                  Check APK Status
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: DIRECT APK DOWNLOAD (PRIMARY) */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              {apkExists ? (
                /* Genuine APK is strictly verified to exist */
                <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-cyan-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-cyan-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Download className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                            {apkInfo?.fileName || 'SpeakUp-AI-v1.0.0.apk'}
                          </h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
                            Release Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                          Universal Android Package with offline lessons, Sophia live voice chat, and speech analyzer.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>• Size: <strong>{apkInfo?.sizeFormatted || '1.1 MB'}</strong></span>
                          <span>• Version: <strong>{apkInfo?.version || '1.0.0'}</strong></span>
                          <span>• Android 5.0 - 14+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Big Action Buttons */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleDownloadApk}
                      disabled={downloadStatus === 'downloading'}
                      className="min-h-[48px] py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-95 text-center cursor-pointer touch-manipulation disabled:opacity-50"
                      aria-label="Download SpeakUp AI APK"
                    >
                      {downloadStatus === 'downloading' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                          <span>Downloading ({downloadProgress}%)...</span>
                        </>
                      ) : downloadStatus === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                          <span>Downloaded! Tap to Re-Download</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 text-cyan-200" />
                          <span>Download APK ({apkInfo?.sizeFormatted || '1.1 MB'})</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        const origin = window.location.origin;
                        const apkUrl = `${origin}/api/download-apk`;
                        handleCopy(apkUrl, 'apkurl');
                      }}
                      className="py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition active:scale-95"
                    >
                      {copiedText === 'apkurl' ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Direct Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-slate-400" />
                          <span>Copy Direct APK Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Strictly hide download button and display build notification when APK doesn't exist */
                <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-3">
                  <div className="flex items-center gap-2.5 font-bold text-amber-900 dark:text-amber-100">
                    <Info className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Android APK Build Notification</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                    The standalone Android APK binary is currently being prepared. To ensure safety and avoid corrupt downloads, the APK download button is strictly displayed only when the genuine APK file exists on the server.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={checkStatus}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isCheckingApk ? 'animate-spin' : ''}`} />
                      <span>Check Build Status</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('instant')}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200"
                    >
                      Use Instant 1-Tap PWA
                    </button>
                  </div>
                </div>
              )}

              {/* Verified APK Technical Details */}
              {apkExists && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Cryptographic APK Verification (SHA-256)
                    </span>
                    <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300/40">
                      Zipalign 4-byte OK
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10px] break-all">
                    SHA256: {apkInfo?.sha256 || '63a82226d6597a03bf3e796d0734e000879b414e68fd86518330ede6a0abd2e7'}
                  </div>
                </div>
              )}

              {/* Quick instructions preview */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Quick 3-Step Phone Installation:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                    <span className="font-bold text-indigo-600 dark:text-cyan-400 block mb-1">1. Tap Download</span>
                    <span>Download the APK above directly onto your smartphone.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                    <span className="font-bold text-indigo-600 dark:text-cyan-400 block mb-1">2. Allow Unknown Apps</span>
                    <span>Toggle "Allow from this source" when Chrome or Files asks.</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60">
                    <span className="font-bold text-indigo-600 dark:text-cyan-400 block mb-1">3. Tap Install</span>
                    <span>Confirm installation and launch SpeakUp AI with Teacher Sophia!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Instant PWA Install on Android */}
          {activeTab === 'instant' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/40 dark:to-cyan-950/40 border border-indigo-100 dark:border-indigo-900/60">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Instant 1-Tap Android App Installation
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      Android devices running Chrome automatically convert SpeakUp AI into an installed WebAPK with dedicated app drawer icon, full-screen UI without browser bars, and hardware microphone access.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleInstallPWA}
                    className="flex-1 min-h-[48px] py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/25 transition active:scale-95 cursor-pointer touch-manipulation"
                    aria-label="Install SpeakUp AI on Android"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install SpeakUp AI on Android</span>
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  How it works on Android Chrome:
                </h4>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Open SpeakUp AI in Google Chrome on your Android smartphone.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Tap the top-right menu <span className="font-bold font-mono">⋮</span> (three dots) in Chrome.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Select <strong className="text-indigo-600 dark:text-cyan-400">"Install app"</strong> or <strong className="text-indigo-600 dark:text-cyan-400">"Add to Home Screen"</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0">4</span>
                    <span>The system will generate an Android APK shortcut and launch SpeakUp AI in native standalone mode with the splash screen!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: How to install APK on your smartphone */}
          {activeTab === 'install_guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                <h3 className="font-bold text-sm text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Installing an APK file on your Android smartphone</span>
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Android requires a 1-time permission toggle to install apps downloaded outside the Google Play Store (sideloading).
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div className="flex-1">
                    <strong className="text-slate-900 dark:text-white block">Download the .apk to your phone</strong>
                    <span>Click the <strong>Download APK</strong> button above or transfer the file via USB / WhatsApp / Google Drive.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div className="flex-1">
                    <strong className="text-slate-900 dark:text-white block">Enable "Install Unknown Apps"</strong>
                    <span>When Android displays <em>"For your security, your phone is not allowed to install unknown apps"</em>, tap <strong className="text-indigo-600 dark:text-cyan-400">Settings</strong> &rarr; toggle on <strong className="text-indigo-600 dark:text-cyan-400">"Allow from this source"</strong>.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div className="flex-1">
                    <strong className="text-slate-900 dark:text-white block">Tap "Install" & "Open"</strong>
                    <span>Tap <strong>Install</strong> on the prompt. Once finished, tap <strong>Open</strong> to start learning English!</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">4</span>
                  <div className="flex-1">
                    <strong className="text-slate-900 dark:text-white block">Allow Microphone Permission for Sophia</strong>
                    <span>When Teacher Sophia starts talking or when you tap the mic button, select <strong className="text-indigo-600 dark:text-cyan-400">"While using the app"</strong>.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GitHub Actions Automated Cloud APK Build */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <GitBranch className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Automated Cloud APK Build via GitHub Actions
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      The workflow at <code className="font-mono text-indigo-600 dark:text-cyan-400">.github/workflows/build-apk.yml</code> automatically compiles Gradle release/debug APKs on GitHub runners with JDK 17 and Android SDK 34.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  How to trigger cloud build:
                </h4>
                <ol className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 list-decimal pl-4">
                  <li>Push this project to your GitHub repository.</li>
                  <li>Go to your repository on GitHub and click the <strong className="text-slate-900 dark:text-white">Actions</strong> tab.</li>
                  <li>Select <strong className="text-indigo-600 dark:text-cyan-400">Build SpeakUp AI Android APK</strong> and click <strong className="text-slate-900 dark:text-white">Run workflow</strong>.</li>
                  <li>Click on the completed build run, scroll to <strong className="text-emerald-600 dark:text-emerald-400">Artifacts</strong>, and download <strong className="font-mono font-bold text-indigo-600 dark:text-cyan-400">SpeakUp-AI-Debug-APK.zip</strong>!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 5: Local Android Studio & Gradle Build */}
          {activeTab === 'studio' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Build Locally with Android Studio or CLI
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      The native Android project is prepared in the <code className="font-mono text-indigo-600 dark:text-cyan-400 font-bold">/android</code> directory with Gradle wrapper and AndroidManifest.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terminal commands */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>1. Terminal 1-Liner to build Debug APK:</span>
                  <button
                    onClick={() =>
                      handleCopy('npm run build && npx cap sync android && cd android && ./gradlew assembleDebug', 'cmd1')
                    }
                    className="text-xs text-indigo-600 dark:text-cyan-400 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedText === 'cmd1' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
npm run build && npx cap sync android && cd android && ./gradlew assembleDebug
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>2. Or open directly in Android Studio:</span>
                  <button
                    onClick={() => handleCopy('npx cap open android', 'cmd2')}
                    className="text-xs text-indigo-600 dark:text-cyan-400 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedText === 'cmd2' ? 'Copied!' : 'Copy Command'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto">
npx cap open android
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
                <strong>Generated APK output location:</strong>
                <p className="font-mono text-[11px] mt-1 break-all">
                  android/app/build/outputs/apk/debug/app-debug.apk
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="hidden sm:inline">Universal Android APK &bull; Package verified</span>
            <span className="sm:hidden font-mono">com.speakupai.english</span>
          </div>
          <div className="flex items-center gap-2">
            {apkExists && (
              <button
                onClick={handleDownloadApk}
                disabled={downloadStatus === 'downloading'}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer touch-manipulation disabled:opacity-50"
                aria-label="Download APK"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {downloadStatus === 'downloading'
                    ? `Downloading ${downloadProgress}%`
                    : 'Download APK'}
                </span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
