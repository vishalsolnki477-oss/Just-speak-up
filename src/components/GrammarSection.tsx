import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  BookOpen,
  Volume2,
  ChevronRight,
  Send,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GRAMMAR_TOPICS } from '../data/grammarData.ts';
import { GrammarTopic, LearningLevel } from '../types/index.ts';
import { speechService } from '../services/speechService.ts';

interface GrammarSectionProps {
  currentLevel: LearningLevel;
  showHindi: boolean;
  completedQuizIds: string[];
  onQuizComplete: (topicId: string, score: number) => void;
}

export const GrammarSection: React.FC<GrammarSectionProps> = ({
  currentLevel,
  showHindi,
  completedQuizIds,
  onQuizComplete,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic>(GRAMMAR_TOPICS[0]);
  const [activeTab, setActiveTab] = useState<'rules' | 'examples' | 'quiz' | 'ask_ai'>('rules');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Ask AI explainer state
  const [aiQuery, setAiQuery] = useState<string>('');
  const [isAskingAi, setIsAskingAi] = useState<boolean>(false);
  const [aiExplanation, setAiExplanation] = useState<any | null>(null);

  const handlePlayAudio = (text: string) => {
    speechService.speak(text, { rate: 0.95 });
  };

  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    let correct = 0;
    selectedTopic.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / selectedTopic.quiz.length) * 100);
    onQuizComplete(selectedTopic.id, scorePct);

    if (scorePct >= 70) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return;
    setIsAskingAi(true);
    setAiExplanation(null);

    try {
      const res = await fetch('/api/ai/explain-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ruleTopic: selectedTopic.title,
          userQuery: aiQuery,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiExplanation(data);
      } else {
        throw new Error('Failed to ask AI');
      }
    } catch (e) {
      // Fallback response
      setAiExplanation({
        englishRule: `In ${selectedTopic.title}, the subject directly dictates the appropriate verb and pronoun agreement.`,
        hindiExplanation: `इस नियम में कर्ता (Subject) के अनुसार ही सही क्रिया और सर्वनाम का प्रयोग किया जाता है।`,
        examples: [
          { en: `Example: ${aiQuery}`, hi: 'दैनिक जीवन में इसका सटीक प्रयोग।' },
        ],
        commonMistake: {
          wrong: 'Using incorrect tense or pronoun',
          correct: 'Applying the proper agreement rule',
          reason: 'Always double check the subject count (singular vs plural).',
        },
      });
    } finally {
      setIsAskingAi(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Structured 12-Topic Grammar Masterclass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            English Grammar Demystified
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every grammar rule explained in simple English with clear Hindi explanations, daily-life Indian contexts, common mistakes to avoid, interactive quizzes, and instant AI tutor explanations.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shrink-0">
          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          <div>
            <div className="text-xs text-slate-300 font-medium">Completed Quizzes</div>
            <div className="text-sm font-bold text-white">
              {completedQuizIds.length} of {GRAMMAR_TOPICS.length} Mastered
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Topics Directory + Topic Study Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 12 Topics List */}
        <div className="lg:col-span-1 space-y-2.5">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            12 Course Modules
          </h2>

          <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
            {GRAMMAR_TOPICS.map((topic, idx) => {
              const isSelected = selectedTopic.id === topic.id;
              const isPassed = completedQuizIds.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setAiExplanation(null);
                    setActiveTab('rules');
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/30 dark:border-emerald-500 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                        {topic.title}
                      </h3>
                      {showHindi && (
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium line-clamp-1">
                          {topic.hindiTitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {isPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Topic Study Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            {/* Topic Header */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {selectedTopic.level} Topic
                </span>
                <button
                  onClick={() =>
                    handlePlayAudio(
                      `${selectedTopic.title}. ${selectedTopic.simpleExplanation}`
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 transition flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen to Rule</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {selectedTopic.title}
              </h2>
              {showHindi && (
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1">
                  {selectedTopic.hindiTitle}
                </p>
              )}

              {/* Simple Explanation */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                  {selectedTopic.simpleExplanation}
                </p>
                {showHindi && (
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl">
                    💡 <strong>हिंदी में समझें:</strong> {selectedTopic.hindiExplanation}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('rules')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'rules'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Core Rules ({selectedTopic.rules.length})
              </button>
              <button
                onClick={() => setActiveTab('examples')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'examples'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Daily-Life Examples
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'quiz'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Interactive Quiz ({selectedTopic.quiz.length})
              </button>
              <button
                onClick={() => setActiveTab('ask_ai')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  activeTab === 'ask_ai'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI Explainer</span>
              </button>
            </div>

            {/* Tab 1: Rules & Common Mistakes */}
            {activeTab === 'rules' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Essential Rules
                  </h3>
                  <div className="space-y-3">
                    {selectedTopic.rules.map((r, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1.5"
                      >
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Rule {i + 1}: {r.rule}
                        </p>
                        {showHindi && (
                          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                            {r.hindiRule}
                          </p>
                        )}
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                          Example: "{r.example}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Mistakes */}
                {selectedTopic.commonMistakes.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Common Mistakes Students Make:
                    </h3>
                    {selectedTopic.commonMistakes.map((m, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2 text-xs"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="line-through text-rose-600 dark:text-rose-400 font-semibold bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                            {m.wrong}
                          </span>
                          <span className="text-slate-400">→</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                            {m.correct}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">
                          {m.explanation}
                        </p>
                        {showHindi && (
                          <p className="text-amber-800 dark:text-amber-300 font-medium bg-white dark:bg-slate-900 p-2 rounded-lg">
                            💡 {m.hindiTip}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Examples */}
            {activeTab === 'examples' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Real-Life Spoken Sentences
                </h3>
                <div className="space-y-2.5">
                  {selectedTopic.englishExamples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          "{ex.en}"
                        </p>
                        {showHindi && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {ex.hi}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handlePlayAudio(ex.en)}
                        className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:scale-105 transition shrink-0"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pt-4">
                  Everyday Indian Situations
                </h3>
                <div className="space-y-2.5">
                  {selectedTopic.dailyLifeExamples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          "{ex.en}"
                        </p>
                        {showHindi && (
                          <p className="text-xs text-amber-700 dark:text-amber-400/90 font-medium mt-0.5">
                            {ex.hi}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handlePlayAudio(ex.en)}
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 transition shrink-0"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Interactive Quiz */}
            {activeTab === 'quiz' && (
              <div className="space-y-5">
                {selectedTopic.quiz.map((q, qIdx) => {
                  const isSelected = quizAnswers[q.id] !== undefined;
                  const isCorrect = quizAnswers[q.id] === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3"
                    >
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {qIdx + 1}. {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => {
                          const optionChosen = quizAnswers[q.id] === optIdx;
                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleSelectQuizOption(q.id, optIdx)}
                              className={`p-3 rounded-xl text-xs font-semibold text-left transition border ${
                                quizSubmitted && optIdx === q.correctAnswer
                                  ? 'bg-emerald-500 text-white border-emerald-600'
                                  : quizSubmitted && optionChosen
                                  ? 'bg-rose-500 text-white border-rose-600'
                                  : optionChosen
                                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-900 dark:text-indigo-200'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div
                          className={`p-3 rounded-xl text-xs ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          <p>
                            <strong>{isCorrect ? 'Correct! 🎯' : 'Incorrect.'}</strong> {q.explanation}
                          </p>
                          {showHindi && q.hindiExplanation && (
                            <p className="mt-1 font-medium text-amber-700 dark:text-amber-400">
                              💡 {q.hindiExplanation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="flex justify-end pt-2">
                  <button
                    disabled={
                      quizSubmitted ||
                      Object.keys(quizAnswers).length < selectedTopic.quiz.length
                    }
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 disabled:opacity-40 disabled:pointer-events-none transition"
                  >
                    Submit Grammar Quiz
                  </button>
                </div>
              </div>
            )}

            {/* Tab 4: Ask AI Explainer */}
            {activeTab === 'ask_ai' && (
              <div className="space-y-4">
                <div className="bg-violet-50 dark:bg-violet-950/30 p-4 rounded-2xl border border-violet-200 dark:border-violet-900/50 text-xs">
                  <span className="font-bold text-violet-900 dark:text-violet-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4" /> AI Rule Assistant
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    Have a doubt about <strong>{selectedTopic.title}</strong>? Type your confusing sentence or ask "Why do we say X and not Y?" for an instant bilingual breakdown.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                    placeholder="e.g. When should I use 'since' vs 'for'?"
                    className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:border-violet-500 text-slate-900 dark:text-white"
                  />
                  <button
                    disabled={!aiQuery.trim() || isAskingAi}
                    onClick={handleAskAI}
                    className="px-5 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition shadow-md shadow-violet-600/20"
                  >
                    {isAskingAi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Ask</span>
                  </button>
                </div>

                {/* AI Explanation Output */}
                {aiExplanation && (
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-900/60 shadow-sm space-y-3 text-xs animate-in fade-in">
                    <div>
                      <span className="font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider text-[10px]">
                        English Grammar Rule:
                      </span>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {aiExplanation.englishRule}
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl text-amber-900 dark:text-amber-300">
                      <strong>Hindi Explanation:</strong> {aiExplanation.hindiExplanation}
                    </div>

                    {aiExplanation.commonMistake && (
                      <div className="bg-rose-50 dark:bg-rose-950/30 p-3 rounded-xl text-rose-900 dark:text-rose-300">
                        <span className="font-bold">Avoid this:</span>{' '}
                        <span className="line-through">{aiExplanation.commonMistake.wrong}</span> →{' '}
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {aiExplanation.commonMistake.correct}
                        </span>
                        <p className="mt-1 text-[11px]">{aiExplanation.commonMistake.reason}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
