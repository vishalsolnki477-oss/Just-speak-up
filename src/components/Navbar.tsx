import React from 'react';
import {
  Flame,
  Languages,
  Moon,
  Sun,
  Award,
  Sparkles,
  BookOpen,
  Mic,
  Headphones,
  FileText,
  Bookmark,
  Bot,
  BarChart3,
  User,
} from 'lucide-react';
import { LearningLevel } from '../types/index.ts';
import { Smartphone, LogIn } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { PWAInstallButton } from './PWAInstallPrompt';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLevel: LearningLevel;
  streak: number;
  showHindiHints: boolean;
  onToggleHindiHints: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAssessment: () => void;
  onOpenProfile: () => void;
  onOpenAndroid: () => void;
  onOpenAuth: () => void;
  userName?: string;
  userAvatar?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentLevel,
  streak,
  showHindiHints,
  onToggleHindiHints,
  isDarkMode,
  onToggleDarkMode,
  onOpenAssessment,
  onOpenProfile,
  onOpenAndroid,
  onOpenAuth,
  userName = 'Learner',
  userAvatar = '👨‍🎓',
}) => {
  const navTabs: {
    id: string;
    label: string;
    hindi: string;
    icon: any;
    isHighlighted?: boolean;
  }[] = [
    { id: 'home', label: 'Home', hindi: 'होम', icon: BookOpen },
    { id: 'sophia', label: 'Teacher Sophia', hindi: 'सोफिया शिक्षक', icon: Sparkles, isHighlighted: true },
    { id: 'speaking', label: 'Speaking', hindi: 'बोलना', icon: Mic },
    { id: 'listening', label: 'Listening', hindi: 'सुनना', icon: Headphones },
    { id: 'grammar', label: 'Grammar', hindi: 'व्याकरण', icon: FileText },
    { id: 'vocabulary', label: 'Vocabulary', hindi: 'शब्दावली', icon: Bookmark },
    { id: 'levels', label: 'Levels', hindi: 'स्तर', icon: Award },
    { id: 'progress', label: 'Progress', hindi: 'प्रगति', icon: BarChart3 },
  ];

  const levelLabels: Record<LearningLevel, { text: string; bg: string; color: string }> = {
    beginner: { text: 'Beginner', bg: 'bg-emerald-100 dark:bg-emerald-950/60', color: 'text-emerald-700 dark:text-emerald-300' },
    intermediate: { text: 'Intermediate', bg: 'bg-sky-100 dark:bg-sky-950/60', color: 'text-sky-700 dark:text-sky-300' },
    advanced: { text: 'Advanced', bg: 'bg-purple-100 dark:bg-purple-950/60', color: 'text-purple-700 dark:text-purple-300' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <BrandLogo
              onClick={() => setActiveTab('home')}
              size="md"
              showTagline={false}
            />

            {/* Level Selector Tag */}
            <button
              onClick={onOpenAssessment}
              title="Click to take level test or change level"
              className={`ml-1 sm:ml-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition ${levelLabels[currentLevel].bg} ${levelLabels[currentLevel].color}`}
            >
              <Award className="w-3.5 h-3.5" />
              <span className="capitalize">{levelLabels[currentLevel].text}</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  } ${tab.isHighlighted && !isActive ? 'text-violet-600 dark:text-violet-400 font-semibold' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${tab.isHighlighted ? 'animate-pulse text-violet-500' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.isHighlighted && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 rounded-full text-xs font-bold text-amber-700 dark:text-amber-300"
              title={`${streak} Days Learning Streak!`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{streak}d</span>
            </div>

            {/* Hindi Hints Toggle */}
            <button
              onClick={onToggleHindiHints}
              title={`Hindi support is ${showHindiHints ? 'Active' : 'Muted'}. Click to toggle.`}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                showHindiHints
                  ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
              }`}
            >
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">{showHindiHints ? 'हिन्दी ON' : 'English Only'}</span>
            </button>

            {/* Install PWA Button */}
            <PWAInstallButton className="hidden md:flex" />

            {/* Android App & APK Center Button */}
            <button
              onClick={onOpenAndroid}
              title="SpeakUp AI for Android – APK Download & Installation"
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 transition hover:scale-105"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
              <span className="hidden sm:inline">Android APK</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Account / Login / Profile Button */}
            <button
              onClick={onOpenAuth}
              title={`Logged in as ${userName}. Click to switch account or sign in.`}
              className="py-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              aria-label="User Account"
            >
              <span className="text-sm leading-none">{userAvatar}</span>
              <span className="hidden md:inline max-w-[80px] truncate">{userName}</span>
            </button>

            {/* Profile Settings Button */}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1"
              aria-label="Settings and Preferences"
              title="Settings & Level Goals"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-2xl">
        <div className="flex items-center justify-around">
          {navTabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-[10px] font-semibold transition ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
          {/* Quick Sophia AI Call Button */}
          <button
            onClick={() => setActiveTab('sophia')}
            className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-[10px] font-bold transition ${
              activeTab === 'sophia'
                ? 'text-pink-600 dark:text-pink-400'
                : 'text-indigo-600 dark:text-indigo-400'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 text-white flex items-center justify-center -mt-3 shadow-md shadow-indigo-500/30 ring-2 ring-white dark:ring-slate-900 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Sophia</span>
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex flex-col items-center py-1.5 px-2 rounded-lg text-[10px] font-semibold transition ${
              activeTab === 'progress'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span>Progress</span>
          </button>
        </div>
      </div>
    </header>
  );
};
