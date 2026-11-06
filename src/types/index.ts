export type LearningLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: LearningLevel;
  password?: string;
  createdAt: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  avatar: string;
  level: LearningLevel;
  dailyGoalMinutes: number;
  nativeLanguage: 'hindi' | 'other';
  showHindiHints: boolean;
  soundEnabled: boolean;
  joinDate: string;
  totalDaysLearned: number;
  currentStreak: number;
  lastActiveDate: string;
}

export interface MistakeItem {
  id: string;
  date: string;
  wrong: string;
  correct: string;
  explanation: string;
  hindiExplanation: string;
  topic?: string;
  category: 'grammar' | 'vocabulary' | 'pronunciation' | 'sentence_structure';
  repeatCount: number;
  mastered: boolean;
}

export interface UserProgress {
  profile: UserProfile;
  completedLessonIds: string[];
  completedQuizIds: string[];
  bookmarkedWordIds: string[];
  learnedWordIds: string[];
  speakingSessionsCompleted: number;
  listeningLessonsCompleted: number;
  grammarQuizzesPassed: number;
  totalMinutesPracticed: number;
  overallScore: number;
  mistakeHistory: MistakeItem[];
  weeklyScores: { day: string; score: number }[];
  todayTasksCompleted: {
    speaking: boolean;
    vocab: boolean;
    grammar: boolean;
    listening: boolean;
    aiChat: boolean;
  };
}

export interface GrammarQuizQuestion {
  id: string;
  question: string;
  hindiQuestion?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hindiExplanation: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  hindiTitle: string;
  level: LearningLevel;
  iconName: string;
  simpleExplanation: string;
  hindiExplanation: string;
  englishExamples: { en: string; hi: string; context?: string }[];
  dailyLifeExamples: { en: string; hi: string }[];
  rules: { rule: string; hindiRule: string; example: string }[];
  commonMistakes: { wrong: string; correct: string; explanation: string; hindiTip: string }[];
  quiz: GrammarQuizQuestion[];
}

export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  level: LearningLevel;
  englishMeaning: string;
  hindiMeaning: string;
  exampleEn: string;
  exampleHi: string;
  synonyms: string[];
  antonyms: string[];
  dailyLifeTip: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  hindiTitle: string;
  level: LearningLevel;
  category: 'daily_talk' | 'travel' | 'work' | 'stories' | 'shopping' | 'interviews';
  audioScript: string;
  speaker: 'male' | 'female';
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  fillInTheBlanks: {
    sentenceWithBlank: string; // e.g. "I usually drink ___ in the morning."
    missingWord: string;
    hintHi: string;
  }[];
}

export interface SpeakingScenario {
  id: string;
  title: string;
  hindiTitle: string;
  level: LearningLevel;
  category: 'intro' | 'daily' | 'interview' | 'office' | 'roleplay' | 'public_speaking';
  icon: string;
  description: string;
  starterPrompt: string;
  targetKeywords: string[];
  sampleResponses: { en: string; hi: string }[];
  guidingQuestions: string[];
}

export interface SpeechEvaluation {
  overallScore: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  mistakes: {
    wrong: string;
    correct: string;
    explanation: string;
    hindiTip: string;
  }[];
  pronunciationTips: string[];
  vocabularySuggestions: string[];
  confidenceTips: string[];
  betterPhrasing: string;
  overallFeedback: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  hasMistake?: boolean;
  incorrectPart?: string;
  correctedSentence?: string;
  mistakeExplanation?: string;
  hindiExplanation?: string;
  naturalAlternative?: string;
  teacherReply?: string;
  vocabularyTip?: string;
  encouragement?: string;
}

export type SophiaState = 'idle' | 'listening' | 'thinking' | 'speaking';
export type SophiaAccent = 'us' | 'uk' | 'in';
export type SophiaSpeed = 'slow' | 'normal' | 'fast';

export interface SophiaCorrection {
  wrong: string;
  correct: string;
  hindiExplanation: string;
  naturalAlternative: string;
  repeatPrompt: string;
}

export interface SophiaMessage {
  id: string;
  sender: 'user' | 'sophia';
  text: string;
  timestamp: string;
  hasMistake?: boolean;
  correction?: SophiaCorrection;
  fluencyScore?: number;
  followUpQuestion?: string;
}

export interface SophiaSessionReport {
  durationSeconds: number;
  totalSentences: number;
  grammarScore: number;
  vocabularyScore: number;
  fluencyScore: number; // e.g. 8.5
  pronunciationFeedback: string[];
  mistakes: SophiaCorrection[];
  suggestions: string[];
  completedAt: string;
}
