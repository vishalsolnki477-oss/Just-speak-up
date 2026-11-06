import React from 'react';
import {
  Flame,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Mic,
  Headphones,
  BookOpen,
  Bookmark,
  Bot,
  ArrowRight,
  AlertCircle,
  PlayCircle,
  Target,
  Smartphone,
  Download,
} from 'lucide-react';
import { UserProgress, LearningLevel } from '../types/index.ts';
import { VOCABULARY_LIST } from '../data/vocabularyData.ts';
import { PWAInstallBanner } from './PWAInstallPrompt.tsx';
import { useApkStatus } from '../hooks/useApkStatus.ts';

interface DashboardProps {
  progress: UserProgress;
  onNavigate: (tab: string) => void;
  onOpenAssessment: () => void;
  onOpenAndroid?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  onNavigate,
  onOpenAssessment,
  onOpenAndroid,
}) => {
  const { profile, todayTasksCompleted } = progress;
  const showHindi = profile.showHindiHints;
  const { exists: apkExists, apkInfo } = useApkStatus();

  // Calculate task completion percentage
  const tasks = [
    { key: 'speaking', label: 'Speak for 5 mins', done: todayTasksCompleted.speaking, tab: 'speaking' },
    { key: 'vocab', label: 'Learn 10 new words', done: todayTasksCompleted.vocab, tab: 'vocabulary' },
    { key: 'grammar', label: 'Complete 1 grammar quiz', done: todayTasksCompleted.grammar, tab: 'grammar' },
    { key: 'listening', label: 'Listen to 1 conversation', done: todayTasksCompleted.listening, tab: 'listening' },
    { key: 'aiChat', label: 'Talk with AI Tutor', done: todayTasksCompleted.aiChat, tab: 'tutor' },
  ];

  const completedCount = tasks.filter((t) => t.done).length;
  const dailyGoalPct = Math.round((completedCount / tasks.length) * 100);

  // Pick a featured word of the day
  const wordOfTheDay = VOCABULARY_LIST[0];

  // Unmastered mistakes
  const pendingMistakes = progress.mistakeHistory.filter((m) => !m.mastered);

  const levelBadges: Record<LearningLevel, { title: string; subtitle: string; color: string; badge: string }> = {
    beginner: {
      title: 'Beginner (शुरुआती स्तर)',
      subtitle: 'Building core sounds, everyday vocabulary, and basic sentences',
      color: 'from-emerald-500 to-teal-600',
      badge: 'Level 1: Zero to Confident',
    },
    intermediate: {
      title: 'Intermediate (मध्यम स्तर)',
      subtitle: 'Mastering tenses, fluid conversations, and workplace dialogue',
      color: 'from-sky-500 to-indigo-600',
      badge: 'Level 2: Conversational Fluency',
    },
    advanced: {
      title: 'Advanced (उन्नत स्तर)',
      subtitle: 'Professional English, boardroom presentation, and rhetoric',
      color: 'from-purple-500 to-violet-600',
      badge: 'Level 3: Executive Eloquence',
    },
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-indigo-900/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome back, {profile.name}! हर दिन थोड़ा बोलें, आत्मविश्वास से बोलें।</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Ready to Speak English with <span className="text-indigo-400">Total Confidence?</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Your AI-powered personal tutor is ready. Practice speaking, correct grammar slip-ups instantly, and level up your career.
            </p>

            {/* Quick Level Status & Test Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-medium">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Current Tier: <strong className="capitalize text-white">{profile.level}</strong></span>
              </div>
              <button
                onClick={onOpenAssessment}
                className="text-xs font-semibold text-indigo-300 hover:text-white underline underline-offset-4 transition flex items-center gap-1"
              >
                Retake Level Diagnostic Test <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick Teacher Sophia CTA Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col items-center justify-center text-center min-w-[220px] shadow-2xl relative overflow-hidden group">
            <div className="relative mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-indigo-600 p-0.5 shadow-lg group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                  <span className="text-2xl">👩‍🏫</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
            </div>
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
              <span>Teacher Sophia</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            </h3>
            <p className="text-slate-300 text-xs mb-3">Real-time Voice Conversation</p>
            <button
              onClick={() => onNavigate('sophia')}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold text-xs hover:from-pink-600 hover:to-indigo-700 transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Call Sophia Live</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Streak */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {profile.currentStreak} <span className="text-xs font-semibold text-slate-500">days</span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Streak</p>
          </div>
        </div>

        {/* Total Days */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {profile.totalDaysLearned} <span className="text-xs font-semibold text-slate-500">days</span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Learning Days</p>
          </div>
        </div>

        {/* Lessons Completed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {progress.completedLessonIds.length + progress.completedQuizIds.length}
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Lessons & Quizzes</p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="w-full">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {progress.overallScore}%
              </div>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Fluency Score</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progress.overallScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SpeakUp AI Android App & APK Banner */}
      {onOpenAndroid && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-indigo-950/20 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-500/30">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-cyan-500 p-0.5 shrink-0 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight">
                  SpeakUp AI for Android Smartphone
                </h3>
                {apkExists ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    APK Ready & Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Build In Progress
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Full-screen English learning with dedicated app icon, splash screen, offline lessons, and real-time voice calls with Teacher Sophia. Package: <code className="font-mono text-cyan-300 font-bold">com.speakupai.english</code>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
            {apkExists ? (
              <a
                href="/api/download-apk"
                download="SpeakUp-AI-v1.0.0.apk"
                onClick={async (e) => {
                  try {
                    const res = await fetch('/api/download-apk');
                    const contentType = res.headers.get('content-type') || '';
                    if (!contentType.includes('text/html')) {
                      const blob = await res.blob();
                      if (!blob.type.includes('text/html') && blob.size > 50000) {
                        e.preventDefault();
                        const apkBlob = new Blob([blob], { type: 'application/vnd.android.package-archive' });
                        const url = window.URL.createObjectURL(apkBlob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'SpeakUp-AI-v1.0.0.apk';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
                      }
                    }
                  } catch (err) {
                    console.warn('Dashboard direct blob download fallback:', err);
                  }
                }}
                className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download APK ({apkInfo?.sizeFormatted || '1.1 MB'})</span>
              </a>
            ) : (
              <div className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-semibold">
                APK Build In Progress
              </div>
            )}
            <button
              onClick={onOpenAndroid}
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/20 transition active:scale-95 cursor-pointer"
            >
              <span>Install Options</span>
            </button>
          </div>
        </div>
      )}

      {/* PWA Standalone App Banner */}
      <PWAInstallBanner />

      {/* Daily Learning Goal & Checklist */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Today's Daily Learning Goal
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Target: {profile.dailyGoalMinutes} minutes daily. Complete 5 micro-habits to keep your streak blazing!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {completedCount} of {tasks.length} Completed
              </div>
              <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                {dailyGoalPct}% Finished
              </div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-950 flex items-center justify-center relative">
              <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{dailyGoalPct}%</span>
            </div>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {tasks.map((task) => (
            <button
              key={task.key}
              onClick={() => onNavigate(task.tab)}
              className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition group ${
                task.done
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                  : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-600'
              }`}
            >
              <div>
                <span className={`text-xs font-bold block ${task.done ? 'text-emerald-800 dark:text-emerald-300 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                  {task.label}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {task.done ? 'Done!' : 'Start now'} <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                task.done
                  ? 'bg-emerald-500 text-white'
                  : 'border-2 border-slate-300 dark:border-slate-600'
              }`}>
                {task.done && <CheckCircle2 className="w-4 h-4" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Practice Recommendations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Daily Practice Recommendations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curated exercises tailored to your current level: <strong className="capitalize">{profile.level}</strong>
            </p>
          </div>
          <button
            onClick={() => onNavigate('levels')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View Full Syllabus <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Speaking Recommendation */}
          <div
            onClick={() => onNavigate('speaking')}
            className="cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-rose-600 dark:text-rose-400">
                Speaking Workout
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                Self-Introduction Practice
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Introduce your career and background with AI voice feedback on grammar and fluency.
              </p>
              {showHindi && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg">
                  💡 अपना परिचय अंग्रेजी में बोलने का 5-मिनट अभ्यास करें।
                </p>
              )}
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Start Speaking</span>
              <PlayCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Listening Recommendation */}
          <div
            onClick={() => onNavigate('listening')}
            className="cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-sky-600 dark:text-sky-400">
                Listening Audio
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                Morning Routine & Coffee Order
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Listen at 0.75x slow or 1.0x normal speed and answer 3 comprehension questions.
              </p>
              {showHindi && (
                <p className="text-[11px] text-sky-700 dark:text-sky-400/90 font-medium bg-sky-50 dark:bg-sky-950/30 px-2 py-1 rounded-lg">
                  🎧 ऑडियो सुनकर समझें और सवालों के जवाब दें।
                </p>
              )}
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
              <span>Play Audio Lesson</span>
              <PlayCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Grammar Topic */}
          <div
            onClick={() => onNavigate('grammar')}
            className="cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Grammar Rules & Quiz
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                Articles: A, An, and The
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                Learn why we say "an hour" but "a university". Includes Hindi explanations and mini-quiz.
              </p>
              {showHindi && (
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 font-medium bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg">
                  📖 A, An और The के इस्तेमाल के सभी नियम समझें।
                </p>
              )}
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span>Take Grammar Quiz</span>
              <PlayCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Daily Vocabulary */}
          <div
            onClick={() => onNavigate('vocabulary')}
            className="cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-violet-600 dark:text-violet-400">
                Word of the Day
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {wordOfTheDay.word} <span className="text-xs text-slate-400 font-normal">{wordOfTheDay.phonetic}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                "{wordOfTheDay.englishMeaning}"
              </p>
              {showHindi && (
                <p className="text-[11px] text-violet-700 dark:text-violet-400/90 font-medium bg-violet-50 dark:bg-violet-950/30 px-2 py-1 rounded-lg">
                  हिंदी अर्थ: {wordOfTheDay.hindiMeaning}
                </p>
              )}
            </div>
            <div className="pt-4 flex items-center justify-between text-xs font-semibold text-violet-600 dark:text-violet-400">
              <span>Learn 10 Words</span>
              <PlayCircle className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Mistake Spotlight & Review Banner */}
      {pendingMistakes.length > 0 && (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  You Have {pendingMistakes.length} Saved Grammar {pendingMistakes.length === 1 ? 'Mistake' : 'Mistakes'} to Master
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Latest: <span className="text-rose-600 dark:text-rose-400 font-semibold line-through">"{pendingMistakes[0].wrong}"</span> → <span className="text-emerald-700 dark:text-emerald-400 font-semibold">"{pendingMistakes[0].correct}"</span>
                </p>
                {showHindi && (
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1">
                    {pendingMistakes[0].hindiExplanation}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => onNavigate('progress')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition shrink-0"
            >
              Review Mistakes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
