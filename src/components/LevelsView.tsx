import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Volume2,
  Play,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { CURRICULUM_DATA, CurriculumLesson } from '../data/curriculumData.ts';
import { LearningLevel } from '../types/index.ts';
import { speechService } from '../services/speechService.ts';

interface LevelsViewProps {
  currentLevel: LearningLevel;
  onSetLevel: (level: LearningLevel) => void;
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string) => void;
  showHindi: boolean;
  onOpenAssessment: () => void;
}

export const LevelsView: React.FC<LevelsViewProps> = ({
  currentLevel,
  onSetLevel,
  completedLessonIds,
  onCompleteLesson,
  showHindi,
  onOpenAssessment,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<LearningLevel>(currentLevel);
  const [activeLesson, setActiveLesson] = useState<CurriculumLesson | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizFeedback, setQuizFeedback] = useState<Record<number, boolean>>({});

  const lessons = CURRICULUM_DATA[selectedLevel] || [];

  const handlePlayAudio = (text: string) => {
    speechService.speak(text, { rate: 0.9 });
  };

  const handleAnswerQuiz = (qIdx: number, optionIdx: number, correctIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
    setQuizFeedback((prev) => ({ ...prev, [qIdx]: optionIdx === correctIdx }));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Level Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Step-by-Step Curriculum</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Three Progressive Learning Tracks
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            From absolute zero to business executive eloquence. Each tier contains curated phonetic lessons, real-life conversational dialogues, and interactive drills.
          </p>
        </div>

        <button
          onClick={onOpenAssessment}
          className="px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition shadow-lg shrink-0 flex items-center gap-2"
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Take Level Diagnostic Test</span>
        </button>
      </div>

      {/* Level Selector Tabs */}
      <div className="grid grid-cols-3 gap-3 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        {(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((lvl) => {
          const isSelected = selectedLevel === lvl;
          const isUserCurrent = currentLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                setActiveLesson(null);
              }}
              className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="capitalize">{lvl}</span>
              {isUserCurrent && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Lessons List + Active Lesson Modal / Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lessons Directory */}
        <div className="lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {selectedLevel} Modules ({lessons.length})
            </h2>
            {currentLevel !== selectedLevel && (
              <button
                onClick={() => onSetLevel(selectedLevel)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Set as my active level
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {lessons.map((lesson, idx) => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isCurrentActive = activeLesson?.id === lesson.id;
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    setQuizAnswers({});
                    setQuizFeedback({});
                  }}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                    isCurrentActive
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 dark:border-indigo-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950">
                          Lesson {idx + 1}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {lesson.durationMin}m
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                        {lesson.title}
                      </h3>
                      {showHindi && (
                        <p className="text-xs text-amber-700 dark:text-amber-400/90 font-medium">
                          {lesson.hindiTitle}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 mt-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Lesson Study Pane */}
        <div className="lg:col-span-2">
          {activeLesson ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {activeLesson.level} Level Module
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayAudio(`${activeLesson.title}. ${activeLesson.description}`)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition flex items-center gap-1.5 text-xs font-semibold"
                      title="Listen to lesson overview"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Audio Overview</span>
                    </button>
                    <button
                      onClick={() => onCompleteLesson(activeLesson.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        completedLessonIds.includes(activeLesson.id)
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{completedLessonIds.includes(activeLesson.id) ? 'Completed' : 'Mark as Done'}</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {activeLesson.title}
                </h2>
                {showHindi && (
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mt-1">
                    {activeLesson.hindiTitle}
                  </p>
                )}
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
                  {activeLesson.description}
                </p>
                {showHindi && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activeLesson.hindiDescription}
                  </p>
                )}
              </div>

              {/* Key Concept Points */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Key Learning Insights
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {activeLesson.keyPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3"
                    >
                      <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {pt.en}
                        </p>
                        {showHindi && (
                          <p className="text-[11px] text-amber-700 dark:text-amber-400/90 font-medium">
                            {pt.hi}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practice Sentences with Audio Playback */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Listen & Practice Sentences Out Loud
                </h3>
                <div className="space-y-2">
                  {activeLesson.practiceSentences.map((sent, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          "{sent.en}"
                        </p>
                        {showHindi && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {sent.hi}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handlePlayAudio(sent.en)}
                        className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:scale-105 active:scale-95 transition shrink-0"
                        title="Click to hear native audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Quiz */}
              {activeLesson.miniQuiz.length > 0 && (
                <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    Quick Check Mini-Quiz
                  </h3>
                  {activeLesson.miniQuiz.map((quiz, qIdx) => {
                    const answered = quizAnswers[qIdx] !== undefined;
                    const isCorrect = quizFeedback[qIdx];
                    return (
                      <div
                        key={qIdx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3"
                      >
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {qIdx + 1}. {quiz.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {quiz.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              disabled={answered}
                              onClick={() => handleAnswerQuiz(qIdx, optIdx, quiz.answer)}
                              className={`p-2.5 rounded-xl text-xs font-semibold text-left transition border ${
                                answered && optIdx === quiz.answer
                                  ? 'bg-emerald-500 text-white border-emerald-600'
                                  : answered && quizAnswers[qIdx] === optIdx
                                  ? 'bg-rose-500 text-white border-rose-600'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {answered && (
                          <div
                            className={`p-3 rounded-xl text-xs ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                            }`}
                          >
                            <strong>{isCorrect ? 'Correct! 🎉' : 'Incorrect.'}</strong> {quiz.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Select a Lesson from the Left
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm max-w-sm mt-1">
                Click any topic on the left to start reading, listening to audio, and practicing sentences out loud.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
