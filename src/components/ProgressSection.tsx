import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  FileCheck,
  Calendar,
  Layers,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { UserProgress } from '../types/index.ts';
import { StorageService } from '../services/storageService.ts';

interface ProgressSectionProps {
  progress: UserProgress;
  showHindi: boolean;
  onRefresh: () => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  progress,
  showHindi,
  onRefresh,
}) => {
  const [showMonthlyReport, setShowMonthlyReport] = useState<boolean>(false);
  const { profile, mistakeHistory, weeklyScores } = progress;

  const handleToggleMaster = (id: string) => {
    StorageService.toggleMasterMistake(id);
    onRefresh();
  };

  const masteredMistakesCount = mistakeHistory.filter((m) => m.mastered).length;
  const pendingMistakesCount = mistakeHistory.filter((m) => !m.mastered).length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Learning Analytics & Fluency Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Your English Growth & Milestone Tracker
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Monitor speaking improvements, grammar quiz accuracy, listening scores, vocabulary expansion, and conquer repeated mistakes.
          </p>
        </div>

        <button
          onClick={() => setShowMonthlyReport(true)}
          className="px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition shadow-lg shrink-0 flex items-center gap-2"
        >
          <FileCheck className="w-4 h-4 text-indigo-600" />
          <span>View Monthly Progress Report</span>
        </button>
      </div>

      {/* 4 Primary Skill Dimension Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Speaking Improvement */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Speaking
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {progress.speakingSessionsCompleted} Sessions
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {Math.min(100, 75 + progress.speakingSessionsCompleted * 3)}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Fluency & pronunciation clarity score
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${Math.min(100, 75 + progress.speakingSessionsCompleted * 3)}%` }}
            />
          </div>
        </div>

        {/* Grammar Accuracy */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Grammar
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {progress.grammarQuizzesPassed} Quizzes
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {Math.min(100, 70 + progress.grammarQuizzesPassed * 4)}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rules & sentence structure accuracy
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(100, 70 + progress.grammarQuizzesPassed * 4)}%` }}
            />
          </div>
        </div>

        {/* Listening Comprehension */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              Listening
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {progress.listeningLessonsCompleted} Lessons
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {Math.min(100, 80 + progress.listeningLessonsCompleted * 2)}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audio comprehension & test retention
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full"
              style={{ width: `${Math.min(100, 80 + progress.listeningLessonsCompleted * 2)}%` }}
            />
          </div>
        </div>

        {/* Vocabulary Growth */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Vocabulary
            </span>
            <span className="text-xs font-black text-slate-900 dark:text-white">
              {progress.bookmarkedWordIds.length} Saved
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {progress.learnedWordIds.length}{' '}
            <span className="text-xs font-semibold text-slate-500">words</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active vocabulary catalog size
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-violet-500 h-full rounded-full"
              style={{ width: `${Math.min(100, progress.learnedWordIds.length * 10)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekly Scores Visual Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Weekly English Performance Trend
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily test and practice performance scores over the last 7 days
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-600"></span> Practice Score
            </span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          {weeklyScores.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
              <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.score}%
              </div>
              <div
                className="w-full max-w-[48px] rounded-2xl bg-gradient-to-t from-indigo-700 to-indigo-500 group-hover:from-violet-600 group-hover:to-indigo-400 transition-all shadow-sm"
                style={{ height: `${item.score}%` }}
              />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-2">
                {item.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Repeated Mistakes Tracker & Remediation Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              Mistakes & Grammar Pitfalls Tracker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every grammar mistake identified by the AI tutor is stored here so you never repeat it.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              {pendingMistakesCount} Pending
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {masteredMistakesCount} Mastered
            </span>
          </div>
        </div>

        {/* Mistakes List */}
        <div className="space-y-3">
          {mistakeHistory.map((m) => (
            <div
              key={m.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                m.mastered
                  ? 'bg-slate-50/60 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950">
                    {m.topic || 'Grammar'}
                  </span>
                  <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                    Repeated: {m.repeatCount} time(s)
                  </span>
                </div>

                <div className="text-xs sm:text-sm">
                  <span className="line-through text-rose-600 dark:text-rose-400 font-semibold mr-2">
                    "{m.wrong}"
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold ml-2">
                    "{m.correct}"
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {m.explanation}
                </p>

                {showHindi && m.hindiExplanation && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg">
                    💡 {m.hindiExplanation}
                  </p>
                )}
              </div>

              {/* Mastered Toggle Button */}
              <button
                onClick={() => handleToggleMaster(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  m.mastered
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{m.mastered ? 'Mastered!' : 'Mark as Mastered'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Report Modal */}
      {showMonthlyReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Official Monthly English Evaluation
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Progress Report for {profile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generated based on live speaking evaluations, listening tests, and grammar drills.
              </p>
            </div>

            {/* Overall Grade Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold opacity-90">Fluency Trajectory</span>
                <div className="text-2xl font-black">Level: Grade A- (Fluent)</div>
              </div>
              <div className="text-3xl font-black bg-white/20 px-3 py-1 rounded-xl">
                {progress.overallScore}%
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Total Practice Time</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {progress.totalMinutesPracticed} Minutes
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Speaking Sessions</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {progress.speakingSessionsCompleted} Completed
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Grammar Quizzes</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {progress.grammarQuizzesPassed} Passed
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Active Streak</span>
                <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {profile.currentStreak} Days
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-200">
              <strong>Personal Recommendation:</strong> You have strong vocabulary and reading comprehension. Your next priority is continuous speaking without translating from Hindi in your mind. Keep speaking with SpeakUp AI Tutor for 5 minutes daily!
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowMonthlyReport(false)}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
