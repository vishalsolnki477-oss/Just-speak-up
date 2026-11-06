import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Layers,
  Send,
  MessageSquare,
  Clock,
  TrendingUp,
  HelpCircle,
  Settings,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SophiaAvatar } from './SophiaAvatar.tsx';
import {
  SophiaState,
  SophiaAccent,
  SophiaSpeed,
  SophiaCorrection,
  SophiaMessage,
  SophiaSessionReport,
  LearningLevel,
} from '../types/index.ts';
import { speechService } from '../services/speechService.ts';
import { StorageService } from '../services/storageService.ts';

interface SophiaLiveSessionProps {
  currentLevel: LearningLevel;
  showHindi: boolean;
  onEndSession?: (report: SophiaSessionReport) => void;
  onSwitchTab?: (tab: string) => void;
}

export const SophiaLiveSession: React.FC<SophiaLiveSessionProps> = ({
  currentLevel,
  showHindi,
  onEndSession,
  onSwitchTab,
}) => {
  // Session Configuration
  const [topic, setTopic] = useState<string>('Free Conversation');
  const [accent, setAccent] = useState<SophiaAccent>('us');
  const [speed, setSpeed] = useState<SophiaSpeed>(
    currentLevel === 'beginner' ? 'slow' : currentLevel === 'intermediate' ? 'normal' : 'normal'
  );

  // Live Call States
  const [callState, setCallState] = useState<SophiaState>('idle');
  const [isInCall, setIsInCall] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [showTypeInput, setShowTypeInput] = useState<boolean>(false);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Live Subtitles & Conversation Feed
  const [messages, setMessages] = useState<SophiaMessage[]>([]);
  const [latestCorrection, setLatestCorrection] = useState<SophiaCorrection | null>(null);
  const [lastSophiaSpeech, setLastSophiaSpeech] = useState<string>('');
  const [currentWord, setCurrentWord] = useState<string>('');

  // Performance Report Modal State
  const [sessionReport, setSessionReport] = useState<SophiaSessionReport | null>(null);

  const recognitionStopperRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Speed multiplier mapping
  const speedRates: Record<SophiaSpeed, number> = {
    slow: 0.82,
    normal: 1.0,
    fast: 1.18,
  };

  // Conversation Topics
  const topics = [
    { id: 'Free Conversation', label: 'Chit-Chat & Daily Life', desc: 'Natural casual conversations about hobbies, food, and daily routines' },
    { id: 'Self-Introduction', label: 'Self-Introduction Practice', desc: 'Tell Sophia about your work, education, and career aspirations' },
    { id: 'Job Interview', label: 'Job Interview Simulation', desc: 'Sophia acts as an HR interviewer asking behavioral questions' },
    { id: 'Office English', label: 'Workplace & Meeting English', desc: 'Presenting updates, asking for leave, and polite disagreement' },
    { id: 'Daily Sentences', label: 'Daily-Use Sentences Drill', desc: 'Common phrases for shopping, travel, banking, and restaurants' },
    { id: 'Grammar Doubts', label: 'Grammar Doubt Clearing', desc: 'Ask Sophia any confusing rules (tenses, prepositions, articles)' },
  ];

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, latestCorrection]);

  // Call Duration Timer
  useEffect(() => {
    if (isInCall && !sessionReport) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isInCall, sessionReport]);

  // Initial greeting from Sophia when call begins
  useEffect(() => {
    const greetingText = `Hello! I am Sophia, your personal English teacher. It is wonderful to meet you. I am here to help you speak with natural fluency and confidence. What would you like to talk about today?`;
    
    setMessages([
      {
        id: 'sophia_welcome',
        sender: 'sophia',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLastSophiaSpeech(greetingText);

    // Speak welcome out loud
    playSophiaVoice(greetingText);

    return () => {
      speechService.stopSpeaking();
      if (recognitionStopperRef.current) {
        recognitionStopperRef.current.stop();
      }
    };
  }, []);

  // Voice playback with lip-sync hooks
  const playSophiaVoice = (text: string) => {
    if (isMuted) return;

    setCallState('speaking');
    speechService.speak(text, {
      rate: speedRates[speed],
      accent: accent,
      voiceGender: 'female',
      onBoundary: (_, word) => {
        setCurrentWord(word);
      },
      onEnd: () => {
        setCallState('idle');
        setCurrentWord('');
        // Automatically activate listening if user was in voice call mode
        if (isInCall && !isMicActive && !showTypeInput) {
          startListening();
        }
      },
      onError: () => {
        setCallState('idle');
        setCurrentWord('');
      },
    });
  };

  // Start Speech Recognition
  const startListening = () => {
    if (callState === 'speaking') {
      speechService.stopSpeaking();
    }

    setTranscript('');
    setIsMicActive(true);
    setCallState('listening');

    const stopper = speechService.startListening({
      accent: accent,
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 1) {
          stopListening();
          handleUserSentenceSubmit(text.trim());
        }
      },
      onError: (err) => {
        console.warn('Speech recognition warning:', err);
        setIsMicActive(false);
        setCallState('idle');
      },
      onEnd: () => {
        setIsMicActive(false);
        if (callState === 'listening') {
          setCallState('idle');
        }
      },
      onStart: () => {
        setIsMicActive(true);
        setCallState('listening');
      },
    });

    recognitionStopperRef.current = stopper;
  };

  const stopListening = () => {
    if (recognitionStopperRef.current) {
      recognitionStopperRef.current.stop();
    }
    setIsMicActive(false);
    if (callState === 'listening') {
      setCallState('idle');
    }
  };

  const toggleMic = () => {
    if (isMicActive) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Submit User Message to Sophia AI Backend
  const handleUserSentenceSubmit = async (userText: string) => {
    if (!userText.trim()) return;

    const userMessage: SophiaMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTranscript('');
    setTypedInput('');
    setCallState('thinking');

    // Retrieve past mistakes for personalization context
    const currentProgress = StorageService.getProgress();
    const pastMistakeTexts = currentProgress.mistakeHistory.map((m) => m.wrong);

    try {
      const res = await fetch('/api/ai/sophia-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
          userLevel: currentLevel,
          topic: topic,
          accent: accent,
          speakingSpeed: speed,
          previousMistakes: pastMistakeTexts,
        }),
      });

      if (!res.ok) {
        throw new Error('Sophia service response error');
      }

      const data = await res.json();
      const sophiaSpeechText = data.sophiaSpeech || "I hear you! What would you like to discuss next?";

      const sophiaMessage: SophiaMessage = {
        id: 'sophia_' + Date.now(),
        sender: 'sophia',
        text: sophiaSpeechText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hasMistake: data.hasMistake,
        correction: data.mistakeCorrection || undefined,
        fluencyScore: data.fluencyScore,
        followUpQuestion: data.followUpQuestion,
      };

      setMessages((prev) => [...prev, sophiaMessage]);
      setLastSophiaSpeech(sophiaSpeechText);

      // If Sophia identified an error, update correction card and save to mistake notebook!
      if (data.hasMistake && data.mistakeCorrection) {
        setLatestCorrection(data.mistakeCorrection);
        StorageService.addMistake({
          wrong: data.mistakeCorrection.wrong,
          correct: data.mistakeCorrection.correct,
          explanation: `Sophia Voice Correction: ${data.mistakeCorrection.correct}`,
          hindiExplanation: data.mistakeCorrection.hindiExplanation,
          topic: topic,
          category: 'grammar',
        });
      } else {
        setLatestCorrection(null);
      }

      // Record progress interaction
      StorageService.recordAIChatInteraction();

      // Sophia speaks out loud
      playSophiaVoice(sophiaSpeechText);
    } catch (e) {
      console.error('Sophia voice request error:', e);
      const fallbackSpeech = "That is a great thought! Can you tell me a little more about that?";
      setMessages((prev) => [
        ...prev,
        {
          id: 'sophia_' + Date.now(),
          sender: 'sophia',
          text: fallbackSpeech,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLastSophiaSpeech(fallbackSpeech);
      playSophiaVoice(fallbackSpeech);
    }
  };

  // User repeats the corrected sentence
  const handlePracticeRepeat = (phrase: string) => {
    handleUserSentenceSubmit(phrase);
  };

  // Replay Last Sophia Voice
  const handleReplayVoice = () => {
    if (lastSophiaSpeech) {
      playSophiaVoice(lastSophiaSpeech);
    }
  };

  // End Call & Generate Performance Report
  const handleEndCall = () => {
    speechService.stopSpeaking();
    stopListening();
    setIsInCall(false);

    // Compute session statistics
    const userMessages = messages.filter((m) => m.sender === 'user');
    const mistakesFound: SophiaCorrection[] = [];
    messages.forEach((m) => {
      if (m.correction) mistakesFound.push(m.correction);
    });

    const totalSentences = userMessages.length;
    const errorCount = mistakesFound.length;
    const grammarAccuracy =
      totalSentences > 0 ? Math.max(60, Math.round(((totalSentences - errorCount) / totalSentences) * 100)) : 88;
    const vocabScore = Math.min(100, 78 + totalSentences * 3);
    const fluencyScore = Number(
      Math.min(9.8, Math.max(6.5, 7.0 + totalSentences * 0.4 - errorCount * 0.3)).toFixed(1)
    );

    const report: SophiaSessionReport = {
      durationSeconds: callDuration,
      totalSentences: Math.max(1, totalSentences),
      grammarScore: grammarAccuracy,
      vocabularyScore: vocabScore,
      fluencyScore: fluencyScore,
      pronunciationFeedback: [
        'Great clarity on initial consonant syllables.',
        'Remember to pause naturally at commas rather than stopping abruptly.',
      ],
      mistakes: mistakesFound,
      suggestions: [
        'Practice daily for 5-10 minutes with Sophia to overcome initial hesitation.',
        'Keep expanding your vocabulary with descriptive adjectives.',
      ],
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessionReport(report);
    onEndSession?.(report);

    // Celebrate completed lesson!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Session Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-indigo-900/40">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-indigo-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                <span className="text-xl">👩‍🏫</span>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight">
                Sophia Live Voice Classroom
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold border border-indigo-400/30">
                2-Way Voice
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Practicing <strong className="text-white">{topic}</strong> with Teacher Sophia
            </p>
          </div>
        </div>

        {/* Call Timer & Settings Controls */}
        <div className="flex items-center gap-2.5">
          {/* Active Call Duration Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-2xl border transition text-xs font-semibold flex items-center gap-1.5 ${
              showSettings
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-white/10 border-white/10 hover:bg-white/20 text-slate-200'
            }`}
            title="Session Voice & Accent Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* Settings Drawer Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4 text-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-indigo-500" />
              Sophia Voice & Learning Settings
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-xs font-semibold"
            >
              Done
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Accent Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Sophia's English Accent
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'us', label: '🇺🇸 US' },
                  { id: 'uk', label: '🇬🇧 UK' },
                  { id: 'in', label: '🇮🇳 Indian' },
                ].map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setAccent(acc.id as SophiaAccent)}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition text-[11px] ${
                      accent === acc.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speaking Speed */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Sophia's Speaking Speed
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'slow', label: '🐢 Slow' },
                  { id: 'normal', label: '🚶 Normal' },
                  { id: 'fast', label: '🏃 Fast' },
                ].map((spd) => (
                  <button
                    key={spd.id}
                    onClick={() => setSpeed(spd.id as SophiaSpeed)}
                    className={`py-2 px-2 rounded-xl border text-center font-bold transition text-[11px] ${
                      speed === spd.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                    }`}
                  >
                    {spd.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Switcher */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300">
                Conversation Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Main Classroom Screen: Avatar Centerpiece + Subtitles & Mistake Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Virtual Sophia Stage (Avatar, Mic Controls, Call Bar) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center justify-between min-h-[460px] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            {/* Top Bar inside Stage: Topic Pill & Replay button */}
            <div className="w-full flex items-center justify-between text-xs mb-4 z-10">
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>{topic}</span>
              </span>

              <button
                onClick={handleReplayVoice}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 text-[11px] font-semibold"
                title="Replay Sophia's Voice"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Voice</span>
              </button>
            </div>

            {/* Sophia Animated Avatar with Lip-Sync, Eye Blinking, and Head Tilt */}
            <div className="my-auto py-2 z-10">
              <SophiaAvatar
                state={callState}
                currentWord={currentWord}
                isMuted={isMuted}
              />
            </div>

            {/* Live Interactive Microphone & Call Controls Bar */}
            <div className="w-full mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 z-10">
              {/* Mute/Unmute Sophia Audio */}
              <button
                onClick={() => {
                  if (!isMuted) speechService.stopSpeaking();
                  setIsMuted(!isMuted);
                }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition ${
                  isMuted
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 text-rose-600'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
                title={isMuted ? 'Unmute Audio' : 'Mute Sophia'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Primary Microphone Speak Button */}
              <button
                onClick={toggleMic}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isMicActive
                    ? 'bg-emerald-600 text-white animate-pulse ring-8 ring-emerald-500/30 scale-105'
                    : 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white hover:scale-105 active:scale-95 shadow-indigo-600/30'
                }`}
                aria-label={isMicActive ? 'Stop listening' : 'Start speaking'}
                title={isMicActive ? 'Click to stop listening' : 'Click to speak with Sophia'}
              >
                {isMicActive ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={handleEndCall}
                className="w-12 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/25 flex items-center justify-center transition active:scale-95"
                title="End Conversation & View Report"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>

            {/* Instruction Cue */}
            <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-3 text-center">
              {isMicActive ? 'Listening to you... Speak naturally' : 'Tap microphone to speak with Sophia'}
            </p>
          </div>
        </div>

        {/* Right Column: Live Conversation Captions & Real-Time Mistake Correction Card */}
        <div className="lg:col-span-7 space-y-4">
          {/* Sophia's Floating Real-Time Mistake Correction Card */}
          {latestCorrection && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 dark:border-amber-800 shadow-md space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Sophia's Real-Time English Correction
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold">
                  Saved to Notebook
                </span>
              </div>

              {/* Wrong vs Correct Comparison */}
              <div className="space-y-1.5 text-xs sm:text-sm">
                <div className="text-rose-700 dark:text-rose-400">
                  <span className="font-bold">You said:</span>{' '}
                  <span className="line-through">{latestCorrection.wrong}</span>
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                  <span>Sophia recommends:</span> "{latestCorrection.correct}"
                </div>
              </div>

              {/* Hindi Explanation */}
              {showHindi && (
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 font-medium leading-relaxed">
                  💡 <strong>हिंदी में नियम:</strong> {latestCorrection.hindiExplanation}
                </div>
              )}

              {/* Natural Native Alternative */}
              {latestCorrection.naturalAlternative && (
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Native Alternative:
                  </span>{' '}
                  "{latestCorrection.naturalAlternative}"
                </div>
              )}

              {/* Repeat Prompt CTA */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  Try repeating now:
                </span>
                <button
                  onClick={() => handlePracticeRepeat(latestCorrection.repeatPrompt)}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Repeat: "{latestCorrection.repeatPrompt}"</span>
                </button>
              </div>
            </div>
          )}

          {/* Live Conversation Subtitles Box */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Live Conversation Subtitles
                </h3>
              </div>
              <button
                onClick={() => setShowTypeInput(!showTypeInput)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {showTypeInput ? 'Hide Keyboard' : 'Type Message Instead'}
              </button>
            </div>

            {/* Conversation Feed */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                        isUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gradient-to-tr from-pink-500 to-indigo-600 text-white'
                      }`}
                    >
                      {isUser ? 'You' : 'S'}
                    </div>

                    <div className={`space-y-1 max-w-[85%] ${isUser ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>

                      <div className="text-[10px] text-slate-400 flex items-center gap-2 px-1">
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => playSophiaVoice(msg.text)}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-0.5"
                          >
                            <Volume2 className="w-3 h-3" /> Listen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Live interim transcript while user speaks */}
              {isMicActive && transcript && (
                <div className="flex items-start gap-2.5 flex-row-reverse">
                  <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    You
                  </div>
                  <div className="p-3.5 rounded-2xl text-xs sm:text-sm bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 rounded-tr-none border border-indigo-400/40 animate-pulse">
                    <p>"{transcript}..."</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Optional Keyboard Typing Fallback Bar */}
            {showTypeInput && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={typedInput}
                  onChange={(e) => setTypedInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserSentenceSubmit(typedInput)}
                  placeholder="Type a sentence to say to Sophia..."
                  className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  disabled={!typedInput.trim() || callState === 'thinking'}
                  onClick={() => handleUserSentenceSubmit(typedInput)}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-40 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post-Session Performance Report Modal */}
      {sessionReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Sophia Speaking Session Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Session ended at {sessionReport.completedAt} • Duration: {formatTimer(sessionReport.durationSeconds)}
              </p>
            </div>

            {/* Scorecard Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Fluency Score
                </span>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  {sessionReport.fluencyScore} <span className="text-xs font-normal text-slate-400">/ 10</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Grammar
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  {sessionReport.grammarScore}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900/60">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Vocabulary
                </span>
                <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">
                  {sessionReport.vocabularyScore}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Sentences
                </span>
                <div className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
                  {sessionReport.totalSentences}
                </div>
              </div>
            </div>

            {/* Mistakes Corrected During Session */}
            {sessionReport.mistakes.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Mistakes Corrected by Sophia ({sessionReport.mistakes.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {sessionReport.mistakes.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="line-through text-rose-600 dark:text-rose-400 font-semibold">
                          "{m.wrong}"
                        </span>
                        <span className="text-slate-400">→</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                          "{m.correct}"
                        </span>
                      </div>
                      {showHindi && (
                        <p className="text-amber-800 dark:text-amber-300 font-medium text-[11px]">
                          💡 {m.hindiExplanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Flawless speaking! No grammatical mistakes detected in this session.
              </div>
            )}

            {/* Pronunciation & Improvement Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-sky-500" /> Pronunciation Feedback
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  {sessionReport.pronunciationFeedback.map((pf, i) => (
                    <li key={i}>• {pf}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-500" /> Sophia's Advice
                </h4>
                <ul className="text-slate-600 dark:text-slate-300 space-y-1">
                  {sessionReport.suggestions.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setSessionReport(null);
                  setIsInCall(true);
                  setCallDuration(0);
                  setMessages([]);
                  setLatestCorrection(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Start New Call
              </button>
              <button
                onClick={() => {
                  setSessionReport(null);
                  onSwitchTab?.('progress');
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
              >
                <span>View Mistake Notebook</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
