import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PomodoroTimer } from './components/PomodoroTimer';
import { FlashcardStudio } from './components/FlashcardStudio';
import { QuizEngine } from './components/QuizEngine';
import { TaskList } from './components/TaskList';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { StudyBuddyWidget } from './components/StudyBuddyWidget';
import type { ThemeMode, FlashcardDeck, Quiz, Task, UserStats, Badge, BuddyMessage } from './types';
import {
  loadDecks,
  saveDecks,
  loadQuizzes,
  saveQuizzes,
  loadTasks,
  saveTasks,
  loadStats,
  saveStats,
  loadBadges,
  saveBadges,
  loadBuddyMessages,
  saveBuddyMessages
} from './utils/storage';

export function App() {
  const [activeTab, setActiveTab] = useState<'pomodoro' | 'flashcards' | 'quiz' | 'tasks' | 'analytics'>('pomodoro');
  const [theme, setTheme] = useState<ThemeMode>('cyberpunk');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);

  // Persistent App Data States
  const [decks, setDecks] = useState<FlashcardDeck[]>(loadDecks);
  const [quizzes, setQuizzes] = useState<Quiz[]>(loadQuizzes);
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [stats, setStats] = useState<UserStats>(loadStats);
  const [badges] = useState<Badge[]>(loadBadges);
  const [buddyMessages, setBuddyMessages] = useState<BuddyMessage[]>(loadBuddyMessages);

  // Study Buddy Drawer State
  const [isBuddyOpen, setIsBuddyOpen] = useState<boolean>(false);

  // Auto-save changes to localStorage
  useEffect(() => {
    saveDecks(decks);
  }, [decks]);

  useEffect(() => {
    saveQuizzes(quizzes);
  }, [quizzes]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveBadges(badges);
  }, [badges]);

  useEffect(() => {
    saveBuddyMessages(buddyMessages);
  }, [buddyMessages]);

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  // Handle Study Buddy smart action triggers
  const handleBuddyAction = (action: string) => {
    if (action === 'start_pomo') {
      setActiveTab('pomodoro');
    } else if (action === 'go_flashcards') {
      setActiveTab('flashcards');
    } else if (action === 'go_quiz') {
      setActiveTab('quiz');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        theme={theme}
        setTheme={setTheme}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        voiceEnabled={voiceEnabled}
        setVoiceEnabled={setVoiceEnabled}
        toggleBuddyModal={() => setIsBuddyOpen(!isBuddyOpen)}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 pb-24">
        {activeTab === 'pomodoro' && (
          <PomodoroTimer
            tasks={tasks}
            setTasks={setTasks}
            stats={stats}
            setStats={setStats}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardStudio
            decks={decks}
            setDecks={setDecks}
            stats={stats}
            setStats={setStats}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizEngine
            quizzes={quizzes}
            setQuizzes={setQuizzes}
            decks={decks}
            stats={stats}
            setStats={setStats}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            stats={stats}
            badges={badges}
          />
        )}
      </main>

      {/* Interactive AI Study Buddy Drawer Widget */}
      <StudyBuddyWidget
        isOpen={isBuddyOpen}
        onClose={() => setIsBuddyOpen(false)}
        messages={buddyMessages}
        setMessages={setBuddyMessages}
        onActionTrigger={handleBuddyAction}
        soundEnabled={soundEnabled}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} StudyPulse PRO — Ultimate Study Buddy & Learning Studio</p>
          <p className="text-[11px] text-slate-600">Built with React, Vite & Web Audio API</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
