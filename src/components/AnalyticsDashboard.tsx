import React from 'react';
import { Trophy, Clock, BookOpen, HelpCircle, Award, CheckCircle2, Lock } from 'lucide-react';
import type { Badge, UserStats } from '../types';

interface AnalyticsDashboardProps {
  stats: UserStats;
  badges: Badge[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ stats, badges }) => {
  const currentLevelXp = stats.xp % 250;
  const xpPercentage = Math.min(100, Math.round((currentLevelXp / 250) * 100));

  const scholarRanks = [
    'Novice Apprentice',
    'Curious Explorer',
    'Focused Scholar',
    'Knowledge Wizard',
    'Grand Mastermind',
  ];
  const currentRank = scholarRanks[Math.min(stats.level - 1, scholarRanks.length - 1)];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Scholar Rank Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900/90 via-slate-900 to-purple-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="space-y-3 text-center md:text-left z-10">
          <span className="px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 uppercase tracking-wider">
            Rank Status: {currentRank}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Level {stats.level} Scholar
          </h2>
          <p className="text-xs text-slate-300 max-w-md">
            Earn +50 XP per Pomodoro session, +15 XP per mastered flashcard, and +20 XP per correct quiz question!
          </p>

          {/* XP Progress Bar */}
          <div className="space-y-1.5 pt-2 max-w-md">
            <div className="flex justify-between text-xs font-mono text-slate-300">
              <span>{currentLevelXp} / 250 XP</span>
              <span>Level {stats.level + 1} ({250 - currentLevelXp} XP needed)</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Level Emblem Badge */}
        <div className="relative z-10">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-pink-500 p-1 shadow-2xl shadow-amber-500/20 transform rotate-3 hover:rotate-0 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-2 text-center">
              <Trophy className="w-8 h-8 text-amber-400 mb-1" />
              <span className="font-extrabold text-sm text-slate-100">Lvl {stats.level}</span>
              <span className="text-[10px] text-amber-300/80 font-mono">{stats.xp} Total XP</span>
            </div>
          </div>
        </div>

      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-indigo-400">
            <Clock className="w-5 h-5" />
            <span className="text-[11px] font-mono text-slate-500">Total</span>
          </div>
          <h3 className="font-extrabold text-2xl text-slate-100">{stats.totalFocusMinutes}m</h3>
          <p className="text-xs text-slate-400">Focus Time Logged</p>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-lg">🍅</span>
            <span className="text-[11px] font-mono text-slate-500">Sessions</span>
          </div>
          <h3 className="font-extrabold text-2xl text-slate-100">{stats.pomodorosCompleted}</h3>
          <p className="text-xs text-slate-400">Pomodoros Finished</p>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-purple-400">
            <BookOpen className="w-5 h-5" />
            <span className="text-[11px] font-mono text-slate-500">Cards</span>
          </div>
          <h3 className="font-extrabold text-2xl text-slate-100">{stats.cardsStudied}</h3>
          <p className="text-xs text-slate-400">Flashcards Reviewed</p>
        </div>

        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between text-emerald-400">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[11px] font-mono text-slate-500">Passed</span>
          </div>
          <h3 className="font-extrabold text-2xl text-slate-100">{stats.quizzesCompleted}</h3>
          <p className="text-xs text-slate-400">Quizzes Completed</p>
        </div>

      </div>

      {/* Achievements Showcase */}
      <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <h3 className="font-extrabold text-slate-100 text-lg">Achievement Badges</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                badge.unlocked
                  ? 'bg-indigo-950/40 border-indigo-500/40 text-slate-100 shadow-md shadow-indigo-950/40'
                  : 'bg-slate-950/40 border-white/5 opacity-50 grayscale'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                {badge.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-200 truncate">{badge.name}</h4>
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{badge.description}</p>
                <span className="text-[10px] text-indigo-400 font-mono block mt-1">{badge.requirement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
