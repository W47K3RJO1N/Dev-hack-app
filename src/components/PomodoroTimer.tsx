import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Music, Check, Zap } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';
import type { Task, UserStats } from '../types';

interface PomodoroTimerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  soundEnabled: boolean;
}

type Mode = 'work' | 'shortBreak' | 'longBreak';

const DEFAULT_DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  tasks,
  setTasks,
  setStats,
  soundEnabled
}) => {
  const [mode, setMode] = useState<Mode>('work');
  const [customWorkMin, setCustomWorkMin] = useState<number>(25);
  const [customBreakMin, setCustomBreakMin] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATIONS.work);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(tasks[0]?.id || null);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'waves' | 'binaural' | 'whiteNoise'>('none');
  const [ambientVolume] = useState<number>(0.3);
  const [completedRounds, setCompletedRounds] = useState<number>(0);
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const totalDuration = mode === 'work' ? customWorkMin * 60 : mode === 'shortBreak' ? customBreakMin * 60 : 15 * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  // Audio timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Ambient sound controller
  useEffect(() => {
    if (ambientSound !== 'none' && isRunning && soundEnabled) {
      soundFX.startAmbient(ambientSound, ambientVolume);
    } else {
      soundFX.stopAmbient();
    }

    return () => {
      soundFX.stopAmbient();
    };
  }, [ambientSound, isRunning, soundEnabled]);

  const handleSessionComplete = () => {
    setIsRunning(false);

    if (soundEnabled) {
      soundFX.playTimerComplete();
    }

    if (mode === 'work') {
      // Award XP & stats update
      setStats((prev) => {
        const newPomos = prev.pomodorosCompleted + 1;
        const newMinutes = prev.totalFocusMinutes + Math.round(customWorkMin);
        const newXp = prev.xp + 50;
        const newLevel = Math.floor(newXp / 250) + 1;

        return {
          ...prev,
          pomodorosCompleted: newPomos,
          totalFocusMinutes: newMinutes,
          xp: newXp,
          level: Math.max(prev.level, newLevel)
        };
      });

      // Update selected task pomodoro count
      if (selectedTaskId) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === selectedTaskId
              ? { ...t, completedPomodoros: t.completedPomodoros + 1 }
              : t
          )
        );
      }

      setCompletedRounds((prev) => (prev + 1) % 4);
      // Auto switch to short break or long break
      if ((completedRounds + 1) % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'work') {
      setTimeLeft(customWorkMin * 60);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(customBreakMin * 60);
    } else {
      setTimeLeft(15 * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(customWorkMin * 60);
    } else if (mode === 'shortBreak') {
      setTimeLeft(customBreakMin * 60);
    } else {
      setTimeLeft(15 * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Timer Container Card */}
      <div className="relative overflow-hidden bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl shadow-indigo-950/40">
        
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none"></div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto bg-slate-950/80 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              mode === 'work'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔥 Focus ({customWorkMin}m)
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              mode === 'shortBreak'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ☕ Short Break ({customBreakMin}m)
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
              mode === 'longBreak'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🌴 Long Break (15m)
          </button>
        </div>

        {/* Radial SVG Countdown Display */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-slate-800"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Gradient Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`transition-all duration-1000 ${
                  mode === 'work'
                    ? 'text-indigo-500'
                    : mode === 'shortBreak'
                    ? 'text-emerald-400'
                    : 'text-cyan-400'
                }`}
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Time Digital Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-5xl sm:text-6xl font-black tracking-tighter bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-md">
                {formatTime(timeLeft)}
              </span>
              
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mt-2 flex items-center gap-1.5">
                {isRunning ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    {mode === 'work' ? 'Deep Work Session' : 'Relax & Recharge'}
                  </>
                ) : (
                  'Ready to Focus'
                )}
              </span>

              {/* Round indicator dots */}
              <div className="flex gap-1.5 mt-3">
                {[0, 1, 2, 3].map((r) => (
                  <div
                    key={r}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      r < completedRounds
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 shadow-sm shadow-indigo-400/50'
                        : 'bg-slate-800 border border-white/10'
                    }`}
                    title={`Round ${r + 1} of 4`}
                  ></div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all active:scale-95 shadow-md"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-rose-500/20'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-indigo-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current ml-1" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowCustomModal(true)}
            className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/10 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-all active:scale-95 shadow-md"
            title="Custom Durations"
          >
            <Settings className="w-5 h-5" />
          </button>

        </div>

        {/* Ambient Sound Machine Drawer */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Music className="w-4 h-4 text-indigo-400" />
              <span>Ambient Focus Sounds (Web Audio Synth)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Play background rain, ocean waves, or 432Hz focus beats while studying.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: 'none', label: 'Off', icon: '🔇' },
              { id: 'rain', label: 'Rain', icon: '🌧️' },
              { id: 'waves', label: 'Waves', icon: '🌊' },
              { id: 'binaural', label: '432Hz Beat', icon: '🎧' },
              { id: 'whiteNoise', label: 'White Noise', icon: '📻' },
            ].map((snd) => (
              <button
                key={snd.id}
                onClick={() => setAmbientSound(snd.id as unknown as typeof ambientSound)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                  ambientSound === snd.id
                    ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200 shadow-md shadow-indigo-500/20'
                    : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{snd.icon}</span>
                <span>{snd.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Active Focus Task Selector */}
      <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-200 text-sm">Focus Objective</h3>
          </div>
          <span className="text-xs text-slate-400">Attach a task to track your Pomodoro progress</span>
        </div>

        {tasks.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No tasks created yet. Head over to the Tasks tab to add one!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedTaskId === task.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-100 shadow-md shadow-indigo-600/10'
                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTaskId === task.id ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'}`}>
                    {selectedTaskId === task.id && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xs font-semibold truncate">{task.title}</span>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  🍅 {task.completedPomodoros}/{task.estimatedPomodoros}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Duration Settings Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-100 text-base">Customize Timer Durations</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Focus Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customWorkMin}
                  onChange={(e) => setCustomWorkMin(Math.max(1, parseInt(e.target.value) || 25))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Short Break Duration (Minutes)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customBreakMin}
                  onChange={(e) => setCustomBreakMin(Math.max(1, parseInt(e.target.value) || 5))}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowCustomModal(false);
                  resetTimer();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 hover:opacity-90"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
