import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Mic, Volume2, Bot, Heart } from 'lucide-react';
import { SophiaState } from '../types/index.ts';
import sophiaImg from '../assets/sophia.jpg';

interface SophiaAvatarProps {
  state: SophiaState; // 'idle' | 'listening' | 'thinking' | 'speaking'
  currentWord?: string;
  isMuted?: boolean;
}

export const SophiaAvatar: React.FC<SophiaAvatarProps> = ({
  state,
  currentWord = '',
  isMuted = false,
}) => {
  const [blink, setBlink] = useState<boolean>(false);
  const [mouthOpen, setMouthOpen] = useState<number>(0); // 0 (closed) to 1 (wide)
  const [visemeType, setVisemeType] = useState<'rest' | 'open' | 'wide' | 'round'>('rest');
  const animationFrameRef = useRef<number | null>(null);

  // Natural blinking effect every 3.5 - 5 seconds
  useEffect(() => {
    let timeout: any;
    const scheduleBlink = () => {
      const delay = Math.random() * 2500 + 3000;
      timeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          scheduleBlink();
        }, 180);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  // Realistic Lip-Sync Animation while Speaking
  useEffect(() => {
    if (state !== 'speaking') {
      setMouthOpen(0);
      setVisemeType('rest');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    let startTime = performance.now();
    const visemes: ('open' | 'wide' | 'round')[] = ['open', 'wide', 'round', 'open', 'wide'];

    const animateMouth = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      // Speech syllable frequency oscillation (approx 4-6 syllables per second)
      const baseWave = Math.sin(elapsed * 18);
      const secondaryWave = Math.sin(elapsed * 27);
      const combined = Math.max(0, (baseWave + secondaryWave * 0.5) / 1.5);

      setMouthOpen(combined);

      // Cycle viseme shape smoothly
      const idx = Math.floor(elapsed * 6) % visemes.length;
      setVisemeType(visemes[idx]);

      animationFrameRef.current = requestAnimationFrame(animateMouth);
    };

    animationFrameRef.current = requestAnimationFrame(animateMouth);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state, currentWord]);

  // Dynamic Head Movement & Tilt based on state
  const getHeadTransform = () => {
    switch (state) {
      case 'listening':
        return 'rotate-[-1.5deg] scale-[1.02] translate-y-[-2px]';
      case 'thinking':
        return 'rotate-[2deg] translate-y-[-4px]';
      case 'speaking':
        return 'scale-[1.01]';
      default:
        return 'rotate-0 scale-100';
    }
  };

  // State aura & glow styling
  const stateGlow = {
    idle: 'ring-4 ring-slate-200 dark:ring-slate-800 shadow-xl',
    listening: 'ring-8 ring-emerald-500/40 shadow-2xl shadow-emerald-500/30 animate-pulse',
    thinking: 'ring-8 ring-violet-500/40 shadow-2xl shadow-violet-500/30',
    speaking: 'ring-8 ring-indigo-500/50 shadow-2xl shadow-indigo-500/40',
  }[state];

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      {/* Dynamic Sound Equalizer Wave Rings while Speaking */}
      {state === 'speaking' && (
        <div className="absolute -inset-4 sm:-inset-6 rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-ping opacity-75 duration-1000" />
          <div className="absolute -inset-2 rounded-full border border-violet-400/30 animate-pulse" />
        </div>
      )}

      {/* Listening Wave Rings */}
      {state === 'listening' && (
        <div className="absolute -inset-4 sm:-inset-6 rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping opacity-75 duration-1000" />
        </div>
      )}

      {/* Main Avatar Container */}
      <div
        className={`relative w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden transition-all duration-500 ease-out border-4 border-white dark:border-slate-800 ${stateGlow} ${getHeadTransform()}`}
      >
        {/* Base Sophia Portrait */}
        <img
          src={sophiaImg}
          alt="Sophia - AI English Teacher"
          className="w-full h-full object-cover object-center transition-transform duration-700"
          style={{
            transform: state === 'speaking' ? `scale(${1 + mouthOpen * 0.015})` : 'scale(1)',
          }}
        />

        {/* Eyelids Layer for Natural Eye Blinking */}
        {blink && (
          <div className="absolute top-[28%] left-[26%] right-[26%] h-[7%] pointer-events-none flex justify-between px-3">
            <div className="w-8 h-2.5 bg-[#8b5a3e] rounded-full blur-[0.5px] shadow-sm transform -rotate-2" />
            <div className="w-8 h-2.5 bg-[#8b5a3e] rounded-full blur-[0.5px] shadow-sm transform rotate-2" />
          </div>
        )}

        {/* Lip-Sync Animated Mouth Overlay */}
        {state === 'speaking' && mouthOpen > 0.1 && (
          <div
            className="absolute top-[48.8%] left-[45%] pointer-events-none transition-all duration-75 flex items-center justify-center"
            style={{
              width: visemeType === 'wide' ? '30px' : visemeType === 'round' ? '20px' : '24px',
              height: `${Math.max(4, mouthOpen * 14)}px`,
              marginLeft: visemeType === 'wide' ? '-3px' : '0px',
            }}
          >
            {/* Inner mouth cavity & soft lips gradient */}
            <div
              className="w-full h-full bg-[#521c17] rounded-full border border-[#8a3328]/80 shadow-inner flex flex-col items-center justify-between overflow-hidden"
              style={{
                borderRadius: visemeType === 'round' ? '50%' : '40% 40% 60% 60%',
              }}
            >
              {/* Upper teeth glint */}
              <div className="w-[80%] h-[30%] bg-white/90 rounded-b-sm" />
              {/* Tongue hint */}
              <div className="w-[70%] h-[35%] bg-[#ba4747] rounded-t-full" />
            </div>
          </div>
        )}

        {/* State Badge Pill Overlay at bottom of portrait */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
          <div
            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 backdrop-blur-md shadow-md ${
              state === 'listening'
                ? 'bg-emerald-600/90 text-white animate-pulse'
                : state === 'thinking'
                ? 'bg-violet-600/90 text-white'
                : state === 'speaking'
                ? 'bg-indigo-600/90 text-white'
                : 'bg-slate-900/70 text-slate-200'
            }`}
          >
            {state === 'listening' && (
              <>
                <Mic className="w-3 h-3 animate-bounce" />
                <span>Listening to you...</span>
              </>
            )}
            {state === 'thinking' && (
              <>
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Sophia is thinking...</span>
              </>
            )}
            {state === 'speaking' && (
              <>
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>Sophia is speaking</span>
              </>
            )}
            {state === 'idle' && (
              <>
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>Online & Ready</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sophia Educator Nameplate */}
      <div className="mt-4 text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Sophia</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Live AI</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Professional English Speaking Mentor
        </p>
      </div>
    </div>
  );
};
