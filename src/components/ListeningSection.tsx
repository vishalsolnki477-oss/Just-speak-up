import React, { useState } from 'react';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Gauge,
  Sparkles,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LISTENING_EXERCISES } from '../data/listeningData.ts';
import { ListeningExercise, LearningLevel } from '../types/index.ts';
import { speechService } from '../services/speechService.ts';

interface ListeningSectionProps {
  currentLevel: LearningLevel;
  showHindi: boolean;
  onExerciseComplete: (score: number) => void;
}

export const ListeningSection: React.FC<ListeningSectionProps> = ({
  currentLevel,
  showHindi,
  onExerciseComplete,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<ListeningExercise>(LISTENING_EXERCISES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0); // 1.0 or 0.75
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'mcq' | 'blanks'>('mcq');

  // Answers state
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [blankAnswers, setBlankAnswers] = useState<Record<number, string>>({});
  const [blankChecked, setBlankChecked] = useState<Record<number, boolean>>({});

  const handlePlayAudio = () => {
    if (isPlaying) {
      speechService.stopSpeaking();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speechService.speak(selectedExercise.audioScript, {
      rate: playbackRate,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handlePlayWord = (word: string) => {
    speechService.speak(word, { rate: playbackRate });
  };

  const handleSelectMCQ = (qId: string, optionIdx: number) => {
    setMcqAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleCheckBlank = (idx: number, correctWord: string) => {
    const userVal = (blankAnswers[idx] || '').trim().toLowerCase();
    const isCorrect = userVal === correctWord.toLowerCase();
    setBlankChecked((prev) => ({ ...prev, [idx]: isCorrect }));

    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    }
  };

  // Submit & grade overall
  const handleSubmitQuiz = () => {
    let correct = 0;
    selectedExercise.questions.forEach((q) => {
      if (mcqAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / selectedExercise.questions.length) * 100);
    onExerciseComplete(scorePct);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold">
            <Headphones className="w-3.5 h-3.5" />
            <span>Interactive Listening Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            English Listening Comprehension
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Train your ears to understand native English speakers effortlessly. Toggle slow playback (0.75x) to catch every consonant, test comprehension, and complete audio fill-in-the-blanks.
          </p>
        </div>

        {/* Speed Quick Toggle Pill */}
        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3 shrink-0">
          <Gauge className="w-5 h-5 text-sky-400" />
          <div className="text-xs">
            <div className="text-slate-300">Audio Speed</div>
            <div className="font-bold text-white">
              {playbackRate === 0.75 ? 'Slow (0.75x)' : 'Normal (1.0x)'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Audio Lesson Picker + Active Player & Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lessons Directory */}
        <div className="lg:col-span-1 space-y-2.5">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Audio Lessons ({LISTENING_EXERCISES.length})
          </h2>

          {LISTENING_EXERCISES.map((ex) => {
            const isSelected = selectedExercise.id === ex.id;
            return (
              <button
                key={ex.id}
                onClick={() => {
                  speechService.stopSpeaking();
                  setIsPlaying(false);
                  setSelectedExercise(ex);
                  setMcqAnswers({});
                  setBlankAnswers({});
                  setBlankChecked({});
                  setShowTranscript(false);
                }}
                className={`w-full p-4 rounded-2xl border text-left transition flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-sky-600 bg-sky-50/60 dark:bg-sky-950/30 dark:border-sky-500 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950">
                      {ex.level}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {ex.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {ex.title}
                  </h3>
                  {showHindi && (
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                      {ex.hindiTitle}
                    </p>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300 mt-1">
                  <Headphones className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Active Player & Interactive Quizzes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Player Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  Listening Track
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {selectedExercise.title}
                </h2>
                {showHindi && (
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mt-0.5">
                    {selectedExercise.hindiTitle}
                  </p>
                )}
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setPlaybackRate(0.75);
                    if (isPlaying) {
                      speechService.stopSpeaking();
                      setIsPlaying(false);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    playbackRate === 0.75
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  0.75x Slow
                </button>
                <button
                  onClick={() => {
                    setPlaybackRate(1.0);
                    if (isPlaying) {
                      speechService.stopSpeaking();
                      setIsPlaying(false);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    playbackRate === 1.0
                      ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  1.0x Normal
                </button>
              </div>
            </div>

            {/* Visual Audio Player Box */}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={handlePlayAudio}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all shrink-0 ${
                    isPlaying
                      ? 'bg-amber-600 animate-pulse ring-4 ring-amber-500/20'
                      : 'bg-gradient-to-tr from-sky-500 to-indigo-600 hover:scale-105 active:scale-95 shadow-sky-500/25'
                  }`}
                >
                  {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                </button>

                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {isPlaying ? 'Playing Audio Lesson...' : 'Click to Listen'}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Speaker: {selectedExercise.speaker === 'female' ? 'Natural US Female' : 'Natural US Male'}
                  </p>
                </div>
              </div>

              {/* Show / Hide Transcript Button */}
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sky-400 text-xs font-semibold flex items-center gap-2 transition"
              >
                {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showTranscript ? 'Hide Transcript' : 'Reveal Script'}</span>
              </button>
            </div>

            {/* Revealed Script Container */}
            {showTranscript && (
              <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 space-y-2 animate-in fade-in">
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" /> Full Audio Script:
                </span>
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif">
                  "{selectedExercise.audioScript}"
                </p>
              </div>
            )}

            {/* Exercise Tabs: Listen & Answer vs Fill-in-the-Blanks */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <button
                  onClick={() => setActiveTab('mcq')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'mcq'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Listen & Answer (MCQs)
                </button>
                <button
                  onClick={() => setActiveTab('blanks')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'blanks'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Fill-in-the-Blanks
                </button>
              </div>

              {/* MCQ Tab */}
              {activeTab === 'mcq' && (
                <div className="space-y-4">
                  {selectedExercise.questions.map((q, idx) => {
                    const answered = mcqAnswers[q.id] !== undefined;
                    const isCorrect = mcqAnswers[q.id] === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3"
                      >
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          {idx + 1}. {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = mcqAnswers[q.id] === optIdx;
                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleSelectMCQ(q.id, optIdx)}
                                className={`p-3 rounded-xl text-xs font-semibold text-left transition border ${
                                  answered && optIdx === q.correctAnswer
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : isSelected && !isCorrect
                                    ? 'bg-rose-500 text-white border-rose-600'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-sky-400'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {answered && (
                          <div
                            className={`p-3 rounded-xl text-xs ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            }`}
                          >
                            <strong>{isCorrect ? 'Correct! 🌟' : 'Not quite.'}</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20"
                    >
                      Submit & Grade Listening Test
                    </button>
                  </div>
                </div>
              )}

              {/* Fill in the Blanks Tab */}
              {activeTab === 'blanks' && (
                <div className="space-y-4">
                  {selectedExercise.fillInTheBlanks.map((b, idx) => {
                    const isChecked = blankChecked[idx] !== undefined;
                    const isCorrect = blankChecked[idx];
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                            Blank #{idx + 1}
                          </span>
                          <button
                            onClick={() => handlePlayWord(b.missingWord)}
                            className="text-xs text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Hear Missing Word
                          </button>
                        </div>

                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {b.sentenceWithBlank}
                        </p>

                        {showHindi && (
                          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                            💡 संकेत: {b.hintHi}
                          </p>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Type missing word..."
                            value={blankAnswers[idx] || ''}
                            onChange={(e) =>
                              setBlankAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                            }
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:border-sky-500 w-48 text-slate-800 dark:text-slate-200"
                          />
                          <button
                            onClick={() => handleCheckBlank(idx, b.missingWord)}
                            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
                          >
                            Check
                          </button>
                        </div>

                        {isChecked && (
                          <div
                            className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Correct word: "{b.missingWord}"!
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                                Incorrect. Correct answer is: "{b.missingWord}".
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
