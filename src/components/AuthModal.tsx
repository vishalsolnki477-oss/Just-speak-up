import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  LogOut,
  Users,
  ShieldCheck,
} from 'lucide-react';
import { StorageService } from '../services/storageService.ts';
import { LearningLevel, UserAccount } from '../types/index.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState<LearningLevel>('beginner');
  const [avatar, setAvatar] = useState('👨‍🎓');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAccount = StorageService.getCurrentAccount();
  const allAccounts = StorageService.getAccounts();

  const avatarChoices = ['👨‍🎓', '👩‍💼', '👩‍🎓', '👨‍💼', '🌟', '🚀', '🎯', '💡'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'login') {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      const res = StorageService.login(email, password);
      if (res.success) {
        setSuccessMsg(`Welcome back, ${res.account?.name}!`);
        setTimeout(() => {
          onAuthSuccess();
          onClose();
        }, 600);
      } else {
        setError(res.error || 'Login failed. Please check your credentials.');
      }
    } else {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      const res = StorageService.signup(name, email, password, level, avatar);
      if (res.success) {
        setSuccessMsg(`Account created! Welcome to SpeakUp AI, ${res.account?.name}!`);
        setTimeout(() => {
          onAuthSuccess();
          onClose();
        }, 800);
      } else {
        setError(res.error || 'Signup failed. Please try a different email.');
      }
    }
  };

  const handleQuickSwitch = (acc: UserAccount) => {
    StorageService.switchAccount(acc.id);
    setSuccessMsg(`Switched to ${acc.name}`);
    setTimeout(() => {
      onAuthSuccess();
      onClose();
    }, 400);
  };

  const handleLogout = () => {
    StorageService.logout();
    onAuthSuccess();
    setSuccessMsg('Logged out. Switched to guest mode.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {mode === 'login' ? 'Sign In to SpeakUp AI' : 'Create Free Account'}
          </h2>
          <p className="text-xs text-indigo-100 mt-1">
            {mode === 'login'
              ? 'Access your saved speaking progress, streak & notebook'
              : 'Start learning English with your personal AI teacher'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign In (लॉग इन)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sign Up (नया खाता)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name (आपका नाम)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Choose Avatar (अवतार चुनें)
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {avatarChoices.map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setAvatar(av)}
                        className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition border ${
                          avatar === av
                            ? 'bg-indigo-100 dark:bg-indigo-950 border-indigo-500 scale-110 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 border-transparent hover:border-slate-300'
                        }`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    English Level (शुरुआती स्तर)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as LearningLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setLevel(lvl)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition border ${
                          level === lvl
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent hover:border-slate-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address (ईमेल पता)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Password (पासवर्ड)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.01]"
            >
              <span>{mode === 'login' ? 'Sign In to Account' : 'Create My Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                <span>Switch Saved Profiles</span>
              </span>
              <span className="text-[10px] text-slate-400">1-click switch</span>
            </div>
            <div className="space-y-1.5">
              {allAccounts.map((acc) => {
                const isSelected = currentAccount?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleQuickSwitch(acc)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition border ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{acc.avatar}</span>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <span>{acc.name}</span>
                          {isSelected && (
                            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 capitalize">{acc.level} English</div>
                      </div>
                    </div>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      {isSelected ? 'Current' : 'Switch'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Security note */}
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Learning progress and speaking history are stored securely per profile.</span>
          </div>

          {currentAccount && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch to Guest</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
