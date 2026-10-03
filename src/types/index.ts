export type ThemeMode = 'cyberpunk' | 'midnight' | 'emerald' | 'sunset' | 'solar';

export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  estimatedPomodoros: number;
  completedPomodoros: number;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  codeSnippet?: string;
  masteryLevel: 'new' | 'learning' | 'mastered';
  lastReviewed?: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  description: string;
  category: string;
  color: string;
  cards: Flashcard[];
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  timeLimitSeconds: number; // 0 for unlimited
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSeconds: number;
  date: string;
}

export type BuddyAvatar = 'owl' | 'bot' | 'cat' | 'panda';

export interface BuddyMessage {
  id: string;
  sender: 'user' | 'buddy';
  text: string;
  timestamp: string;
  actionHint?: string;
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  lastStudyDate: string;
  totalFocusMinutes: number;
  pomodorosCompleted: number;
  cardsStudied: number;
  quizzesCompleted: number;
  perfectQuizzes: number;
  unlockedBadges: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
}
