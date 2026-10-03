import React from 'react';
import { Timer, BookOpen, HelpCircle, BarChart3, Flame, Trophy, Volume2, VolumeX, Sparkles, CheckSquare, Palette } from 'lucide-react';
import type { ThemeMode, UserStats } from '../types';

interface NavbarProps {
  activeTab: 'pomodoro' | 'flashcards' | 'quiz' | 'tasks' | 'analytics';
  setActiveTab: (tab: 'pomodoro' | 'flashcards' | 'quiz' | 'tasks' | 'analytics') => void;
  stats: UserStats;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  voiceEnabled?: boolean;
  setVoiceEnabled?: (enabled: boolean) => void;
  toggleBuddyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  toggleBuddyModal
}) => {
  const currentLevelXp = stats.xp % 250;
  const xpPercentage = Math.min(100, Math.round((currentLevelXp / 250) * 100));

  const themes: { id: ThemeMode; name: string; icon: string }[] = [
    { id: 'cyberpunk', name: 'Cyber Neon', icon: '🌌' },
    { id: 'midnight', name: 'Midnight OLED', icon: '🌙' },
    { id: 'emerald', name: 'Zen Emerald', icon: '🌿' },
    { id: 'sunset', name: 'Warm Sunset', icon: '🌅' },
    { id: 'solar', name: 'Solar Light', icon: '☀️' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-white/10 px-4 lg:px-8 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('pomodoro')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 bg-clip-text text-transparent">
                StudyPulse <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">PRO</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Pomodoro • Flashcards • Quiz • AI Buddy</p>
            </div>
          </div>

          {/* Quick AI Buddy Trigger Button */}
          <button
            onClick={toggleBuddyModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/30 hover:border-purple-400 text-xs font-semibold text-purple-200 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-md shadow-purple-900/20"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Study Buddy</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 w-full md:w-auto justify-around md:justify-center overflow-x-auto shadow-inner">
          <button
            onClick={() => setActiveTab('pomodoro')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'pomodoro'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>Pomodoro</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'flashcards'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Quizzes</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Stats</span>
          </button>
        </nav>

        {/* User Stats & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          {/* Level & XP Bar */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Lvl {stats.level}</span>
            </div>

            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>

            <span className="text-[11px] text-slate-400 font-mono">{currentLevelXp}/250 XP</span>
          </div>

          {/* Streak Flame Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-xs">
            <Flame className="w-4 h-4 fill-orange-400 animate-bounce" />
            <span>{stats.streakDays}d Streak</span>
          </div>

          {/* Audio Sound FX Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className={`p-2 rounded-xl border transition-all ${
              soundEnabled
                ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
                : 'bg-slate-800/80 border-white/5 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Dropdown */}
          <div className="relative group">
            <button
              className="p-2 rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1"
              title="Change Theme"
            >
              <Palette className="w-4 h-4" />
            </button>

            <div className="absolute right-0 mt-2 w-44 py-2 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl hidden group-hover:block z-50 transition-all">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Theme
              </div>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    theme === t.id
                      ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </span>
                  {theme === t.id && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
