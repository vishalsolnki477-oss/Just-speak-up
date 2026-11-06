import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-base', ai: 'text-[10px] px-1.5 py-0.5' },
    md: { icon: 40, text: 'text-lg', ai: 'text-xs px-2 py-0.5' },
    lg: { icon: 48, text: 'text-xl', ai: 'text-xs px-2.5 py-1' },
    xl: { icon: 64, text: 'text-2xl', ai: 'text-sm px-3 py-1' },
  };

  const currentSize = sizeMap[size];

  // The Icon Element: Speech Bubble + Elegant 'S' + AI Sparkle
  const IconMark = (
    <div
      style={{ width: currentSize.icon, height: currentSize.icon }}
      className="relative shrink-0 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-0.5 shadow-md shadow-indigo-500/20 ring-1 ring-white/10 group-hover:scale-105 transition-transform"
    >
      <svg
        viewBox="0 0 128 128"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="40%" stopColor="#4F46E5" />
            <stop offset="75%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="brandSparkle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
        </defs>

        {/* Speech Bubble Silhouette */}
        <path
          d="M 68 22
             C 92 22 110 38 110 60
             C 110 74 102 85 92 92
             L 98 108
             L 80 101
             C 76 102 72 103 68 103
             C 44 103 26 86 26 63
             C 26 42 42 27 62 23
             L 68 22 Z"
          fill="url(#brandRibbon)"
        />

        {/* Inner Elegant 'S' Curve */}
        <path
          d="M 66 36
             C 52 36 46 44 46 52
             C 46 60 54 64 68 68
             C 82 72 88 78 88 86
             C 88 94 78 98 66 98
             C 54 98 46 92 44 84
             L 54 82
             C 56 86 60 90 66 90
             C 72 90 78 87 78 82
             C 78 76 72 72 60 68
             C 46 64 36 58 36 48
             C 36 38 46 28 64 28
             C 74 28 82 32 86 38
             L 78 44
             C 76 40 72 36 66 36 Z"
          fill="#FFFFFF"
        />

        {/* AI Sparkle */}
        <path
          d="M 98 16 Q 98 26 88 26 Q 98 26 98 36 Q 98 26 108 26 Q 98 26 98 16 Z"
          fill="url(#brandSparkle)"
        />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center cursor-pointer ${className}`}
        onClick={onClick}
      >
        {IconMark}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2.5 cursor-pointer text-left select-none group ${className}`}
      onClick={onClick}
    >
      {IconMark}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`${currentSize.text} font-black tracking-tight text-slate-900 dark:text-white transition-colors`}
          >
            SpeakUp
          </span>
          <span
            className={`${currentSize.ai} font-black rounded-lg bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-sm shadow-cyan-500/20`}
          >
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 tracking-tight">
            Speak English. Build Confidence. Transform Your Future.
          </span>
        )}
      </div>
    </div>
  );
};
