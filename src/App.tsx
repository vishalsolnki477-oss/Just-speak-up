import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { LevelsView } from './components/LevelsView.tsx';
import { SpeakingSection } from './components/SpeakingSection.tsx';
import { ListeningSection } from './components/ListeningSection.tsx';
import { GrammarSection } from './components/GrammarSection.tsx';
import { VocabularySection } from './components/VocabularySection.tsx';
import { AITutorSection } from './components/AITutorSection.tsx';
import { SophiaLiveSession } from './components/SophiaLiveSession.tsx';
import { ProgressSection } from './components/ProgressSection.tsx';
import { LevelAssessmentModal } from './components/LevelAssessmentModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { AndroidInstallModal } from './components/AndroidInstallModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { StorageService } from './services/storageService.ts';
import { UserProgress, LearningLevel, UserProfile } from './types/index.ts';
import { App as CapacitorApp } from '@capacitor/app';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => StorageService.getProgress());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('speakup_theme') === 'dark' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isAndroidOpen, setIsAndroidOpen] = useState<boolean>(false);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('speakup_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('speakup_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle Android Hardware Back Button & Mobile Popstate
  useEffect(() => {
    let removeCapacitorListener: (() => void) | null = null;

    try {
      const listenerPromise = CapacitorApp.addListener('backButton', () => {
        if (isAndroidOpen) {
          setIsAndroidOpen(false);
        } else if (isAuthOpen) {
          setIsAuthOpen(false);
        } else if (isAssessmentOpen) {
          setIsAssessmentOpen(false);
        } else if (isProfileOpen) {
          setIsProfileOpen(false);
        } else if (activeTab !== 'home') {
          setActiveTab('home');
        } else {
          CapacitorApp.exitApp();
        }
      });
      listenerPromise.then((handle) => {
        removeCapacitorListener = () => handle.remove();
      });
    } catch (e) {
      // Browser mode fallback
    }

    return () => {
      if (removeCapacitorListener) {
        removeCapacitorListener();
      }
    };
  }, [isAndroidOpen, isAuthOpen, isAssessmentOpen, isProfileOpen, activeTab]);

  const refreshProgress = () => {
    setProgress(StorageService.getProgress());
  };

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleToggleHindiHints = () => {
    StorageService.toggleHindiHints();
    refreshProgress();
  };

  const handleSelectLevel = (level: LearningLevel) => {
    StorageService.updateLevel(level);
    refreshProgress();
  };

  const handleCompleteLesson = (lessonId: string) => {
    StorageService.markLessonCompleted(lessonId);
    refreshProgress();
  };

  const handleCompleteQuiz = (topicId: string, score: number) => {
    StorageService.markQuizCompleted(topicId, score);
    refreshProgress();
  };

  const handleSpeakingComplete = (score: number) => {
    StorageService.recordSpeakingSession(score);
    refreshProgress();
  };

  const handleListeningComplete = (score: number) => {
    StorageService.recordListeningExercise(score);
    refreshProgress();
  };

  const handleToggleBookmarkWord = (wordId: string) => {
    StorageService.toggleBookmarkWord(wordId);
    refreshProgress();
  };

  const handleMarkWordLearned = (wordId: string) => {
    StorageService.markWordLearned(wordId);
    refreshProgress();
  };

  const handleAIChatInteraction = () => {
    StorageService.recordAIChatInteraction();
    refreshProgress();
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const current = StorageService.getProgress();
    current.profile = { ...current.profile, ...updated };
    StorageService.saveProgress(current);
    refreshProgress();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLevel={progress.profile.level}
        streak={progress.profile.currentStreak}
        showHindiHints={progress.profile.showHindiHints}
        onToggleHindiHints={handleToggleHindiHints}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAssessment={() => setIsAssessmentOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAndroid={() => setIsAndroidOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        userName={progress.profile.name}
        userAvatar={progress.profile.avatar}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-20 lg:pb-12">
        {activeTab === 'home' && (
          <Dashboard
            progress={progress}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
            onOpenAndroid={() => setIsAndroidOpen(true)}
          />
        )}

        {activeTab === 'levels' && (
          <LevelsView
            currentLevel={progress.profile.level}
            onSetLevel={handleSelectLevel}
            completedLessonIds={progress.completedLessonIds}
            onCompleteLesson={handleCompleteLesson}
            showHindi={progress.profile.showHindiHints}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
          />
        )}

        {activeTab === 'sophia' && (
          <SophiaLiveSession
            currentLevel={progress.profile.level}
            showHindi={progress.profile.showHindiHints}
            onEndSession={(report) => {
              StorageService.recordSpeakingSession(report.grammarScore);
              refreshProgress();
            }}
            onSwitchTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'speaking' && (
          <SpeakingSection
            currentLevel={progress.profile.level}
            showHindi={progress.profile.showHindiHints}
            onSessionComplete={handleSpeakingComplete}
          />
        )}

        {activeTab === 'listening' && (
          <ListeningSection
            currentLevel={progress.profile.level}
            showHindi={progress.profile.showHindiHints}
            onExerciseComplete={handleListeningComplete}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarSection
            currentLevel={progress.profile.level}
            showHindi={progress.profile.showHindiHints}
            completedQuizIds={progress.completedQuizIds}
            onQuizComplete={handleCompleteQuiz}
          />
        )}

        {activeTab === 'vocabulary' && (
          <VocabularySection
            currentLevel={progress.profile.level}
            showHindi={progress.profile.showHindiHints}
            bookmarkedWordIds={progress.bookmarkedWordIds}
            learnedWordIds={progress.learnedWordIds}
            onToggleBookmark={handleToggleBookmarkWord}
            onMarkLearned={handleMarkWordLearned}
          />
        )}

        {activeTab === 'tutor' && (
          <AITutorSection
            currentLevel={progress.profile.level}
            showHindi={progress.profile.showHindiHints}
            onInteraction={handleAIChatInteraction}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressSection
            progress={progress}
            showHindi={progress.profile.showHindiHints}
            onRefresh={refreshProgress}
          />
        )}
      </main>

      {/* Level Diagnostic Assessment Modal */}
      <LevelAssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        currentLevel={progress.profile.level}
        onSelectLevel={handleSelectLevel}
        showHindi={progress.profile.showHindiHints}
      />

      {/* User Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={progress.profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenAssessment={() => {
          setIsProfileOpen(false);
          setIsAssessmentOpen(true);
        }}
      />

      {/* User Auth Modal (Login / Sign Up / Account Switcher) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={refreshProgress}
      />

      {/* Android Mobile APK & Installation Center Modal */}
      <AndroidInstallModal
        isOpen={isAndroidOpen}
        onClose={() => setIsAndroidOpen(false)}
      />

      {/* Network Connectivity & Offline Cache Indicator */}
      <OfflineIndicator />
    </div>
  );
}
