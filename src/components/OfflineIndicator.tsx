import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex items-center gap-2.5 rounded-2xl bg-slate-900/95 dark:bg-slate-850/95 border border-amber-500/40 text-amber-300 px-3.5 py-2 text-xs font-semibold shadow-xl backdrop-blur-md animate-in slide-in-from-bottom duration-300">
      <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <span>Offline Mode &bull; Cached lessons and quizzes are available.</span>
    </div>
  );
};
