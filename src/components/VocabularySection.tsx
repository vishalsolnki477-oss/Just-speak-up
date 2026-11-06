import React, { useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Volume2,
  Sparkles,
  Search,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VOCABULARY_LIST } from '../data/vocabularyData.ts';
import { VocabWord, LearningLevel } from '../types/index.ts';
import { speechService } from '../services/speechService.ts';

interface VocabularySectionProps {
  currentLevel: LearningLevel;
  showHindi: boolean;
  bookmarkedWordIds: string[];
  learnedWordIds: string[];
  onToggleBookmark: (wordId: string) => void;
  onMarkLearned: (wordId: string) => void;
}

export const VocabularySection: React.FC<VocabularySectionProps> = ({
  currentLevel,
  showHindi,
  bookmarkedWordIds,
  learnedWordIds,
  onToggleBookmark,
  onMarkLearned,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'saved' | 'learned'>('all');
  const [activeWord, setActiveWord] = useState<VocabWord>(VOCABULARY_LIST[0]);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const handlePlayWord = (word: string) => {
    speechService.speak(word, { rate: 0.85 });
  };

  const handlePlaySentence = (sentence: string) => {
    speechService.speak(sentence, { rate: 0.95 });
  };

  const filteredWords = VOCABULARY_LIST.filter((w) => {
    const matchSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.hindiMeaning.includes(searchQuery);

    if (selectedFilter === 'saved') {
      return matchSearch && bookmarkedWordIds.includes(w.id);
    }
    if (selectedFilter === 'learned') {
      return matchSearch && learnedWordIds.includes(w.id);
    }
    return matchSearch;
  });

  // Quiz logic
  const currentQuizWord = VOCABULARY_LIST[quizIndex];
  // Generate 4 options for quiz (1 correct meaning, 3 distractors)
  const getQuizOptions = (correctWord: VocabWord) => {
    const wrong = VOCABULARY_LIST.filter((w) => w.id !== correctWord.id)
      .slice(0, 3)
      .map((w) => w.englishMeaning);
    const all = [correctWord.englishMeaning, ...wrong];
    return all.sort(() => 0.5 - Math.random());
  };

  const [options, setOptions] = useState<string[]>(() =>
    getQuizOptions(VOCABULARY_LIST[0])
  );

  const handleSelectQuizAnswer = (optIdx: number) => {
    if (selectedQuizOption !== null) return;
    setSelectedQuizOption(optIdx);

    const isCorrect = options[optIdx] === currentQuizWord.englishMeaning;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      onMarkLearned(currentQuizWord.id);
    }

    setTimeout(() => {
      if (quizIndex < Math.min(5, VOCABULARY_LIST.length - 1)) {
        const nextIdx = quizIndex + 1;
        setQuizIndex(nextIdx);
        setSelectedQuizOption(null);
        setOptions(getQuizOptions(VOCABULARY_LIST[nextIdx]));
      } else {
        setQuizCompleted(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedQuizOption(null);
    setQuizCompleted(false);
    setOptions(getQuizOptions(VOCABULARY_LIST[0]));
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Daily 10-Word Vocabulary Builder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Master 10 Power Words Every Day
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Expand your vocabulary with English meanings, Hindi translations, clear audio phonetics, daily life examples, synonyms, and quizzes.
          </p>
        </div>

        <button
          onClick={() => {
            setQuizMode(!quizMode);
            if (!quizMode) resetQuiz();
          }}
          className="px-5 py-3 rounded-2xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition shadow-lg shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span>{quizMode ? 'Back to Word List' : 'Take Daily Vocab Quiz'}</span>
        </button>
      </div>

      {!quizMode ? (
        /* Regular Vocabulary Directory View */
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search words or meanings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium focus:outline-none focus:border-violet-500 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedFilter === 'all'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                All 10 Words
              </button>
              <button
                onClick={() => setSelectedFilter('saved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  selectedFilter === 'saved'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved ({bookmarkedWordIds.length})</span>
              </button>
              <button
                onClick={() => setSelectedFilter('learned')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  selectedFilter === 'learned'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Learned ({learnedWordIds.length})</span>
              </button>
            </div>
          </div>

          {/* Grid: Word Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((word) => {
              const isBookmarked = bookmarkedWordIds.includes(word.id);
              const isLearned = learnedWordIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-violet-300 dark:hover:border-violet-700 transition"
                >
                  {/* Top line: Word, phonetics, bookmark */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">
                          {word.word}
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">
                          {word.phonetic}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                          {word.partOfSpeech}
                        </span>
                      </div>
                      {showHindi && (
                        <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1">
                          हिंदी अर्थ: {word.hindiMeaning}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handlePlayWord(word.word)}
                        className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 hover:scale-105 active:scale-95 transition"
                        title="Listen to pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleBookmark(word.id)}
                        className={`p-2 rounded-xl border transition ${
                          isBookmarked
                            ? 'bg-amber-50 dark:bg-amber-950 border-amber-300 text-amber-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-500'
                        }`}
                        title={isBookmarked ? 'Remove from Saved' : 'Save word'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* English Definition */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    "{word.englishMeaning}"
                  </p>

                  {/* Example Sentence with audio */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-500 dark:text-slate-400">
                        Example:
                      </span>
                      <button
                        onClick={() => handlePlaySentence(word.exampleEn)}
                        className="text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <Volume2 className="w-3 h-3" /> Hear Sentence
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      "{word.exampleEn}"
                    </p>
                    {showHindi && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {word.exampleHi}
                      </p>
                    )}
                  </div>

                  {/* Synonyms & Antonyms */}
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Synonyms:
                    </span>
                    {word.synonyms.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Footer: Daily Tip & Learned Check */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      💡 {word.dailyLifeTip}
                    </span>
                    <button
                      onClick={() => onMarkLearned(word.id)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ${
                        isLearned
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isLearned ? 'Learned' : 'Mark Learned'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Daily Vocab Quiz Mode */
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {!quizCompleted ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  Question {quizIndex + 1} of 6
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Score: {quizScore}
                </span>
              </div>

              <div className="text-center space-y-2 py-4">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  What is the meaning of:
                </span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
                  <span>{currentQuizWord.word}</span>
                  <button
                    onClick={() => handlePlayWord(currentQuizWord.word)}
                    className="p-2 rounded-xl text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </h3>
                {showHindi && (
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    (संकेत: {currentQuizWord.hindiMeaning})
                  </p>
                )}
              </div>

              {/* 4 Options */}
              <div className="space-y-3">
                {options.map((opt, idx) => {
                  const isSelected = selectedQuizOption === idx;
                  const isCorrect = opt === currentQuizWord.englishMeaning;
                  return (
                    <button
                      key={idx}
                      disabled={selectedQuizOption !== null}
                      onClick={() => handleSelectQuizAnswer(idx)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition ${
                        selectedQuizOption !== null && isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : isSelected && !isCorrect
                          ? 'bg-rose-500 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-violet-400'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center space-y-5 py-6">
              <div className="w-16 h-16 rounded-3xl bg-violet-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-violet-600/30">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Vocab Quiz Completed!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                You scored <strong>{quizScore}</strong> correct out of 6 questions. Daily vocabulary practice strengthens memory pathways!
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setQuizMode(false)}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20"
                >
                  Return to Words
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
