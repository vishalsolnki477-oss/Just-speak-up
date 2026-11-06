import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DIAGNOSTIC_QUESTIONS } from '../data/assessmentData.ts';
import { LearningLevel } from '../types/index.ts';

interface LevelAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: LearningLevel;
  onSelectLevel: (level: LearningLevel) => void;
  showHindi: boolean;
}

export const LevelAssessmentModal: React.FC<LevelAssessmentModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  onSelectLevel,
  showHindi,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiRationale, setAiRationale] = useState<{
    level: LearningLevel;
    rationaleEn: string;
    rationaleHi: string;
    strengths: string[];
    focusAreas: string[];
  } | null>(null);

  if (!isOpen) return null;

  const question = DIAGNOSTIC_QUESTIONS[currentQuestionIndex];
  const totalQuestions = DIAGNOSTIC_QUESTIONS.length;

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Completed all questions!
      setIsAnalyzing(true);
      let correctCount = 0;
      DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
        if (userAnswers[idx] === q.correctAnswer) {
          correctCount++;
        }
      });

      // Determine level
      let recommended: LearningLevel = 'beginner';
      if (correctCount >= 8) {
        recommended = 'advanced';
      } else if (correctCount >= 5) {
        recommended = 'intermediate';
      } else {
        recommended = 'beginner';
      }

      // Try calling server endpoint for rich customized AI diagnostic feedback
      try {
        const res = await fetch('/api/ai/assess-level', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            score: correctCount,
            answers: userAnswers,
            selfReportedGoal: 'Fluent English for work, interviews and everyday conversation',
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setAiRationale({
            level: (data.recommendedLevel?.toLowerCase() as LearningLevel) || recommended,
            rationaleEn: data.rationaleEn || `You scored ${correctCount}/${totalQuestions}. We recommend ${recommended.toUpperCase()} level.`,
            rationaleHi: data.rationaleHi || `आपने ${totalQuestions} में से ${correctCount} सही उत्तर दिए। आपके लिए ${recommended} लेवल सबसे उपयुक्त है।`,
            strengths: data.strengths || ['Good language instinct', 'Basic comprehension'],
            focusAreas: data.focusAreas || ['Speaking fluidity', 'Advanced connectors'],
          });
        } else {
          fallbackRationale(correctCount, recommended);
        }
      } catch (e) {
        fallbackRationale(correctCount, recommended);
      } finally {
        setIsAnalyzing(false);
        setIsCompleted(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const fallbackRationale = (score: number, recommended: LearningLevel) => {
    setAiRationale({
      level: recommended,
      rationaleEn: `You scored ${score} out of ${totalQuestions} questions correctly. Based on your grammar, vocabulary, and situational accuracy, ${recommended.toUpperCase()} will offer you the ideal balance of challenge and rapid growth.`,
      rationaleHi: `आपने ${totalQuestions} में से ${score} प्रश्नों के सही उत्तर दिए। आपके व्याकरण और शब्दावली स्तर के अनुसार ${recommended.toUpperCase()} लेवल सबसे उपयुक्त रहेगा।`,
      strengths: score > 6 ? ['Sentence structure mastery', 'Preposition awareness'] : ['Basic vocabulary foundation', 'Enthusiastic attitude'],
      focusAreas: recommended === 'beginner' ? ['Is/Am/Are verbs', 'Daily sentence templates'] : recommended === 'intermediate' ? ['Tense consistency', 'Complex sentence connectors'] : ['Diplomatic vocabulary', 'STAR interview storytelling'],
    });
  };

  const resetTest = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    setAiRationale(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                English Level Diagnostic Assessment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                10 Quick Questions to identify your exact proficiency level
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isCompleted ? (
            <>
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {question.levelIndicator}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {question.question}
                </h3>
                {showHindi && question.hindiQuestion && (
                  <p className="text-xs text-amber-700 dark:text-amber-400/90 font-medium">
                    {question.hindiQuestion}
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  const isSelected = userAnswers[currentQuestionIndex] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between text-sm transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:border-indigo-500 font-semibold text-indigo-900 dark:text-indigo-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700/70 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                >
                  Previous
                </button>
                <button
                  disabled={userAnswers[currentQuestionIndex] === undefined || isAnalyzing}
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-40 disabled:pointer-events-none transition flex items-center gap-1.5"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Responses...</span>
                    </>
                  ) : currentQuestionIndex === totalQuestions - 1 ? (
                    <>
                      <span>Complete Assessment</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/25">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Assessment Completed!
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Recommended Level: <span className="capitalize text-indigo-600 dark:text-indigo-400">{aiRationale?.level}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {aiRationale?.rationaleEn}
                </p>
                {showHindi && aiRationale?.rationaleHi && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium max-w-lg mx-auto">
                    {aiRationale.rationaleHi}
                  </p>
                )}
              </div>

              {/* Strengths & Focus Areas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Your Strengths
                  </h4>
                  <ul className="text-xs text-emerald-900/80 dark:text-emerald-200 space-y-1">
                    {aiRationale?.strengths.map((s, idx) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-indigo-800 dark:text-indigo-300 flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-4 h-4" /> Key Focus Areas
                  </h4>
                  <ul className="text-xs text-indigo-900/80 dark:text-indigo-200 space-y-1">
                    {aiRationale?.focusAreas.map((f, idx) => (
                      <li key={idx}>• {f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Manual Level Selection Option */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5 text-left">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
                  Confirm or Change Level Manually:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        onSelectLevel(lvl);
                        onClose();
                      }}
                      className={`p-3 rounded-xl border text-center text-xs font-bold capitalize transition ${
                        (aiRationale?.level === lvl)
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-md'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={resetTest}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Retake Test
                </button>
                <button
                  onClick={() => {
                    if (aiRationale?.level) {
                      onSelectLevel(aiRationale.level);
                    }
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20"
                >
                  Start Learning Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
