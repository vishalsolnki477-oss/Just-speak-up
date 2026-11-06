import { UserProgress, MistakeItem, LearningLevel, UserAccount } from '../types/index.ts';

const ACCOUNTS_STORAGE_KEY = 'speakup_ai_user_accounts_v1';
const ACTIVE_ACCOUNT_KEY = 'speakup_ai_active_account_id_v1';
const BASE_STORAGE_KEY = 'speakup_ai_user_progress_';

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'user_rahul',
    name: 'Rahul Sharma',
    email: 'rahul@speakup.ai',
    avatar: '👨‍🎓',
    level: 'beginner',
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 'user_priya',
    name: 'Priya Patel',
    email: 'priya@speakup.ai',
    avatar: '👩‍💼',
    level: 'intermediate',
    createdAt: '2026-02-01T10:00:00.000Z',
  },
];

const DEFAULT_PROGRESS: UserProgress = {
  profile: {
    name: 'Rahul Sharma',
    email: 'rahul@speakup.ai',
    avatar: '👨‍🎓',
    level: 'beginner',
    dailyGoalMinutes: 15,
    nativeLanguage: 'hindi',
    showHindiHints: true,
    soundEnabled: true,
    joinDate: new Date().toISOString(),
    totalDaysLearned: 4,
    currentStreak: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
  },
  completedLessonIds: ['beg_lesson_1', 'beg_lesson_2'],
  completedQuizIds: ['grammar_topic_1'],
  bookmarkedWordIds: ['word_resilient', 'word_articulate'],
  learnedWordIds: ['word_fluent', 'word_confident', 'word_curious'],
  speakingSessionsCompleted: 2,
  listeningLessonsCompleted: 3,
  grammarQuizzesPassed: 4,
  totalMinutesPracticed: 45,
  overallScore: 78,
  mistakeHistory: [
    {
      id: 'm_1',
      date: new Date(Date.now() - 86400000).toISOString(),
      wrong: 'I am go to office everyday.',
      correct: 'I go to the office everyday.',
      explanation: 'Use simple present tense (go) for daily routine actions, not "am go".',
      hindiExplanation: 'Roj marra ke kaamo (daily routines) ke liye Simple Present Tense use karte hain: "I go", na ki "I am go".',
      topic: 'Simple Present Tense',
      category: 'grammar',
      repeatCount: 2,
      mastered: false,
    },
    {
      id: 'm_2',
      date: new Date(Date.now() - 172800000).toISOString(),
      wrong: 'She do not like coffee.',
      correct: 'She does not like coffee.',
      explanation: 'With singular third-person pronouns (he, she, it), use "does not", not "do not".',
      hindiExplanation: 'He, She, It ke sath "does not" lagta hai, "do not" nahi.',
      topic: 'Subject-Verb Agreement',
      category: 'grammar',
      repeatCount: 1,
      mastered: false,
    },
    {
      id: 'm_3',
      date: new Date(Date.now() - 259200000).toISOString(),
      wrong: 'I discussed about the project.',
      correct: 'I discussed the project.',
      explanation: 'The verb "discuss" already means talk about. Do not add "about" after discuss.',
      hindiExplanation: '"Discuss" ke baad "about" nahi lagaya jata.',
      topic: 'Prepositions',
      category: 'vocabulary',
      repeatCount: 1,
      mastered: true,
    },
  ],
  weeklyScores: [
    { day: 'Mon', score: 68 },
    { day: 'Tue', score: 72 },
    { day: 'Wed', score: 75 },
    { day: 'Thu', score: 70 },
    { day: 'Fri', score: 82 },
    { day: 'Sat', score: 85 },
    { day: 'Sun', score: 88 },
  ],
  todayTasksCompleted: {
    speaking: false,
    vocab: true,
    grammar: true,
    listening: false,
    aiChat: false,
  },
};

export class StorageService {
  public static getAccounts(): UserAccount[] {
    try {
      const data = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to load accounts:', e);
    }
    // initialize defaults
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  }

  public static getCurrentAccount(): UserAccount {
    const accounts = this.getAccounts();
    const activeId = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    const found = accounts.find((a) => a.id === activeId);
    if (found) return found;

    // Default to first account
    const initial = accounts[0] || DEFAULT_ACCOUNTS[0];
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, initial.id);
    return initial;
  }

  public static signup(
    name: string,
    email: string,
    password?: string,
    level: LearningLevel = 'beginner',
    avatar: string = '🎯'
  ): { success: boolean; error?: string; account?: UserAccount } {
    try {
      const accounts = this.getAccounts();
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail) {
        return { success: false, error: 'Email is required' };
      }
      if (!name.trim()) {
        return { success: false, error: 'Name is required' };
      }
      if (accounts.some((a) => a.email.toLowerCase() === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newAccount: UserAccount = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        avatar,
        level,
        password: password || 'speakup123',
        createdAt: new Date().toISOString(),
      };

      accounts.push(newAccount);
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, newAccount.id);

      // Create initial progress for new account
      const userProgress: UserProgress = {
        ...DEFAULT_PROGRESS,
        profile: {
          ...DEFAULT_PROGRESS.profile,
          name: newAccount.name,
          email: newAccount.email,
          avatar: newAccount.avatar,
          level: newAccount.level,
          joinDate: new Date().toISOString(),
          totalDaysLearned: 1,
          currentStreak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
        },
        completedLessonIds: [],
        completedQuizIds: [],
        bookmarkedWordIds: [],
        learnedWordIds: [],
        speakingSessionsCompleted: 0,
        listeningLessonsCompleted: 0,
        grammarQuizzesPassed: 0,
        totalMinutesPracticed: 0,
        overallScore: 65,
        mistakeHistory: [],
      };
      this.saveProgress(userProgress);

      return { success: true, account: newAccount };
    } catch (e: any) {
      return { success: false, error: e.message || 'Signup failed' };
    }
  }

  public static login(
    email: string,
    _password?: string
  ): { success: boolean; error?: string; account?: UserAccount } {
    try {
      const accounts = this.getAccounts();
      const cleanEmail = email.trim().toLowerCase();
      const found = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
      if (!found) {
        return { success: false, error: 'Account not found with this email' };
      }
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, found.id);
      return { success: true, account: found };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  }

  public static switchAccount(accountId: string): UserProgress {
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, accountId);
    return this.getProgress();
  }

  public static logout(): UserAccount {
    // Switch to guest / first account
    const accounts = this.getAccounts();
    const guest = accounts[0] || DEFAULT_ACCOUNTS[0];
    localStorage.setItem(ACTIVE_ACCOUNT_KEY, guest.id);
    return guest;
  }

  private static getActiveStorageKey(): string {
    const active = this.getCurrentAccount();
    return BASE_STORAGE_KEY + (active ? active.id : 'default');
  }

  public static getProgress(): UserProgress {
    try {
      const key = this.getActiveStorageKey();
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        return this.verifyAndUpdateStreak(parsed);
      }
    } catch (e) {
      console.warn('Failed to load user progress from storage:', e);
    }
    // Return initialized default progress adapted for current account
    const account = this.getCurrentAccount();
    const initial: UserProgress = {
      ...DEFAULT_PROGRESS,
      profile: {
        ...DEFAULT_PROGRESS.profile,
        name: account.name,
        email: account.email,
        avatar: account.avatar,
        level: account.level,
      },
    };
    this.saveProgress(initial);
    return initial;
  }

  public static saveProgress(progress: UserProgress): void {
    try {
      const key = this.getActiveStorageKey();
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save user progress:', e);
    }
  }

  private static verifyAndUpdateStreak(progress: UserProgress): UserProgress {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = progress.profile.lastActiveDate;

    if (lastActive !== today) {
      const lastDate = new Date(lastActive);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        progress.profile.currentStreak += 1;
        progress.profile.totalDaysLearned += 1;
      } else if (diffDays > 1) {
        // Streak broken
        progress.profile.currentStreak = 1;
        progress.profile.totalDaysLearned += 1;
      }
      progress.profile.lastActiveDate = today;
      // Reset today's daily checklist on new day
      progress.todayTasksCompleted = {
        speaking: false,
        vocab: false,
        grammar: false,
        listening: false,
        aiChat: false,
      };
      this.saveProgress(progress);
    }

    return progress;
  }

  public static updateLevel(level: LearningLevel): UserProgress {
    const p = this.getProgress();
    p.profile.level = level;
    this.saveProgress(p);
    return p;
  }

  public static toggleHindiHints(): boolean {
    const p = this.getProgress();
    p.profile.showHindiHints = !p.profile.showHindiHints;
    this.saveProgress(p);
    return p.profile.showHindiHints;
  }

  public static addMistake(mistake: Omit<MistakeItem, 'id' | 'date' | 'repeatCount' | 'mastered'>): MistakeItem {
    const p = this.getProgress();
    // Check if similar mistake already exists
    const existing = p.mistakeHistory.find(
      (m) => m.wrong.toLowerCase().trim() === mistake.wrong.toLowerCase().trim()
    );

    if (existing) {
      existing.repeatCount += 1;
      existing.mastered = false;
      existing.date = new Date().toISOString();
      this.saveProgress(p);
      return existing;
    }

    const newItem: MistakeItem = {
      ...mistake,
      id: 'm_' + Date.now(),
      date: new Date().toISOString(),
      repeatCount: 1,
      mastered: false,
    };

    p.mistakeHistory.unshift(newItem);
    this.saveProgress(p);
    return newItem;
  }

  public static toggleMasterMistake(id: string): void {
    const p = this.getProgress();
    const item = p.mistakeHistory.find((m) => m.id === id);
    if (item) {
      item.mastered = !item.mastered;
      this.saveProgress(p);
    }
  }

  public static toggleBookmarkWord(wordId: string): boolean {
    const p = this.getProgress();
    const index = p.bookmarkedWordIds.indexOf(wordId);
    let isBookmarked = false;
    if (index >= 0) {
      p.bookmarkedWordIds.splice(index, 1);
      isBookmarked = false;
    } else {
      p.bookmarkedWordIds.push(wordId);
      isBookmarked = true;
    }
    this.saveProgress(p);
    return isBookmarked;
  }

  public static markWordLearned(wordId: string): void {
    const p = this.getProgress();
    if (!p.learnedWordIds.includes(wordId)) {
      p.learnedWordIds.push(wordId);
      p.todayTasksCompleted.vocab = true;
      this.saveProgress(p);
    }
  }

  public static markLessonCompleted(lessonId: string): void {
    const p = this.getProgress();
    if (!p.completedLessonIds.includes(lessonId)) {
      p.completedLessonIds.push(lessonId);
      this.saveProgress(p);
    }
  }

  public static markQuizCompleted(quizId: string, score: number): void {
    const p = this.getProgress();
    if (!p.completedQuizIds.includes(quizId)) {
      p.completedQuizIds.push(quizId);
    }
    p.grammarQuizzesPassed += 1;
    p.todayTasksCompleted.grammar = true;
    p.overallScore = Math.min(100, Math.round((p.overallScore * 4 + score) / 5));
    this.saveProgress(p);
  }

  public static recordSpeakingSession(score: number): void {
    const p = this.getProgress();
    p.speakingSessionsCompleted += 1;
    p.todayTasksCompleted.speaking = true;
    p.totalMinutesPracticed += 5;
    p.overallScore = Math.min(100, Math.round((p.overallScore * 4 + score) / 5));
    this.saveProgress(p);
  }

  public static recordListeningExercise(score: number): void {
    const p = this.getProgress();
    p.listeningLessonsCompleted += 1;
    p.todayTasksCompleted.listening = true;
    p.totalMinutesPracticed += 6;
    p.overallScore = Math.min(100, Math.round((p.overallScore * 4 + score) / 5));
    this.saveProgress(p);
  }

  public static recordAIChatInteraction(): void {
    const p = this.getProgress();
    p.todayTasksCompleted.aiChat = true;
    p.totalMinutesPracticed += 4;
    this.saveProgress(p);
  }
}
