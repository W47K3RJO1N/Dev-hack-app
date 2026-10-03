import type { FlashcardDeck, Quiz, Task, UserStats, Badge, BuddyMessage } from '../types';

const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-js',
    title: 'JavaScript & Modern React',
    description: 'Master core JS concepts, closure, promises, and React hooks.',
    category: 'Computer Science',
    color: '#3b82f6',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'card-1',
        front: 'What is a Closure in JavaScript?',
        back: 'A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In JS, closures give inner functions access to outer function variables even after the outer function has returned.',
        hint: 'Think of lexical scope and outer variable access.',
        codeSnippet: 'function outer() {\n  const secret = "42";\n  return function inner() {\n    console.log(secret);\n  };\n}',
        masteryLevel: 'learning'
      },
      {
        id: 'card-2',
        front: 'What is the Event Loop in JavaScript?',
        back: 'The Event Loop is a constantly running process that monitors the Call Stack and the Callback Queue / Microtask Queue. When the Call Stack is empty, it pushes queued callbacks to the stack for execution.',
        hint: 'Single-threaded async concurrency model.',
        masteryLevel: 'new'
      },
      {
        id: 'card-3',
        front: 'Difference between `useEffect` and `useLayoutEffect` in React?',
        back: '`useEffect` runs asynchronously after the DOM has been painted to the screen. `useLayoutEffect` runs synchronously after all DOM mutations but before browser paint, making it ideal for measuring layout bounds before render.',
        hint: 'Think about when paint occurs in the browser.',
        masteryLevel: 'mastered'
      },
      {
        id: 'card-4',
        front: 'What is a JavaScript Promise and its 3 states?',
        back: 'A Promise represents the eventual completion or failure of an asynchronous operation. Its 3 states are: 1) Pending, 2) Fulfilled, and 3) Rejected.',
        hint: 'States: Pending, Fulfilled, Rejected',
        codeSnippet: 'const p = new Promise((resolve, reject) => {\n  setTimeout(() => resolve("Done!"), 1000);\n});',
        masteryLevel: 'learning'
      },
      {
        id: 'card-5',
        front: 'What is memoization in React using `useMemo` vs `useCallback`?',
        back: '`useMemo` caches the calculated RESULT of a expensive function between re-renders. `useCallback` caches a FUNCTION DEFINITION itself to prevent child components from unnecessary re-renders when passed as props.',
        hint: 'Value vs Function reference.',
        masteryLevel: 'new'
      }
    ]
  },
  {
    id: 'deck-bio',
    title: 'Cellular Biology & Genetics',
    description: 'Key cellular processes, DNA structure, and metabolic pathways.',
    category: 'Biology',
    color: '#10b981',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'card-b1',
        front: 'What is the primary function of Mitochondria?',
        back: 'Mitochondria produce ATP (adenosine triphosphate) through cellular respiration, earning them the title "powerhouse of the cell".',
        hint: 'Cellular energy currency.',
        masteryLevel: 'mastered'
      },
      {
        id: 'card-b2',
        front: 'What is the chemical equation for Photosynthesis?',
        back: '6CO₂ + 6H₂O + Light Energy ➔ C₆H₁₂O₆ (Glucose) + 6O₂',
        hint: 'Carbon Dioxide + Water + Light -> Glucose + Oxygen',
        masteryLevel: 'learning'
      },
      {
        id: 'card-b3',
        front: 'What four nitrogenous bases make up DNA?',
        back: 'Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). Adenine pairs with Thymine (A-T), and Cytosine pairs with Guanine (C-G).',
        hint: 'A-T and C-G base pairing.',
        masteryLevel: 'learning'
      },
      {
        id: 'card-b4',
        front: 'What is the difference between Mitosis and Meiosis?',
        back: 'Mitosis results in two identical diploid daughter cells (used for growth/repair). Meiosis results in four genetically diverse haploid gametes (sperm/egg cells for sexual reproduction).',
        hint: 'Somatic vs Reproductive cell division.',
        masteryLevel: 'new'
      }
    ]
  },
  {
    id: 'deck-history',
    title: 'World History & Civilizations',
    description: 'Major historical eras, revolutions, and monumental discoveries.',
    category: 'History',
    color: '#f59e0b',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'card-h1',
        front: 'When was the printing press invented and by whom?',
        back: 'Johannes Gutenberg invented the movable type printing press around 1440 in Mainz, Germany, democratizing knowledge across Europe.',
        hint: '15th Century German inventor.',
        masteryLevel: 'mastered'
      },
      {
        id: 'card-h2',
        front: 'What event marked the beginning of the French Revolution in 1789?',
        back: 'The Storming of the Bastille on July 14, 1789, a royal fortress and prison in Paris, symbolizing royal tyranny.',
        hint: 'July 14th, Paris prison.',
        masteryLevel: 'learning'
      },
      {
        id: 'card-h3',
        front: 'What was the Silk Road?',
        back: 'An ancient network of Eurasian trade routes established during the Han Dynasty (130 BCE) connecting East Asia with the Mediterranean, facilitating trade, culture, and technological exchange.',
        hint: 'Ancient Eurasian trade network.',
        masteryLevel: 'learning'
      }
    ]
  }
];

const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-webdev',
    title: 'Web Dev & JavaScript Quiz',
    description: 'Test your understanding of modern JavaScript, asynchronous operations, and DOM manipulation.',
    category: 'Computer Science',
    timeLimitSeconds: 120,
    questions: [
      {
        id: 'q1',
        question: 'Which method converts a JSON string into a JavaScript object?',
        options: ['JSON.stringify()', 'JSON.parse()', 'JSON.toObject()', 'Object.parse()'],
        correctAnswer: 1,
        explanation: '`JSON.parse()` takes a valid JSON string and parses it into a JavaScript data structure/object.'
      },
      {
        id: 'q2',
        question: 'What is the result of `typeof NaN` in JavaScript?',
        options: ['"number"', '"nan"', '"undefined"', '"object"'],
        correctAnswer: 0,
        explanation: 'In JavaScript, `NaN` stands for "Not-a-Number", but its data type according to the `typeof` operator is actually "number".'
      },
      {
        id: 'q3',
        question: 'Which CSS unit is relative to the root HTML element font size?',
        options: ['em', 'rem', 'vh', 'px'],
        correctAnswer: 1,
        explanation: '`rem` stands for Root EM. It is scaled relative to the root `<html>` element\'s font-size.'
      },
      {
        id: 'q4',
        question: 'What keyword creates a block-scoped variable that cannot be reassigned?',
        options: ['var', 'let', 'const', 'static'],
        correctAnswer: 2,
        explanation: '`const` creates a read-only reference to a value within block scope.'
      }
    ]
  },
  {
    id: 'quiz-science',
    title: 'Universe & Physics Challenge',
    description: 'Explore fundamental forces, astronomy, and classical physics.',
    category: 'Physics',
    timeLimitSeconds: 150,
    questions: [
      {
        id: 'sq1',
        question: 'What is the speed of light in a vacuum (approximate)?',
        options: ['300,000 km/s', '150,000 km/s', '1,000,000 km/s', '30,000 km/s'],
        correctAnswer: 0,
        explanation: 'The speed of light in a vacuum is approximately 299,792,458 meters per second, or ~300,000 km/s.'
      },
      {
        id: 'sq2',
        question: 'Who formulated the Three Laws of Motion?',
        options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Nikola Tesla'],
        correctAnswer: 1,
        explanation: 'Sir Isaac Newton published his three laws of motion in Philosophiæ Naturalis Principia Mathematica in 1687.'
      },
      {
        id: 'sq3',
        question: 'What subatomic particle carries a negative electric charge?',
        options: ['Proton', 'Neutron', 'Electron', 'Photon'],
        correctAnswer: 2,
        explanation: 'Electrons carry a negative charge (-1e), while protons are positive and neutrons are neutral.'
      }
    ]
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Review React Hooks & Closures Flashcards',
    category: 'Computer Science',
    completed: false,
    estimatedPomodoros: 2,
    completedPomodoros: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 't2',
    title: 'Complete Web Dev Quiz Challenge',
    category: 'Quiz Prep',
    completed: false,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 't3',
    title: 'Deep Focus Session: Biology Notes',
    category: 'Biology',
    completed: true,
    estimatedPomodoros: 3,
    completedPomodoros: 3,
    createdAt: new Date().toISOString()
  }
];

const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-first-pomo',
    name: 'Pomodoro Starter',
    description: 'Complete your very first focus session.',
    icon: '⚡',
    requirement: '1 Pomodoro completed',
    unlocked: true
  },
  {
    id: 'b-card-master',
    name: 'Flashcard Wizard',
    description: 'Review 10 flashcards in study mode.',
    icon: '🎴',
    requirement: '10 cards reviewed',
    unlocked: true
  },
  {
    id: 'b-quiz-whiz',
    name: 'Quiz Master',
    description: 'Complete a quiz with a perfect 100% score.',
    icon: '🎯',
    requirement: '100% Quiz Accuracy',
    unlocked: false
  },
  {
    id: 'b-streak-3',
    name: 'Streak Flame',
    description: 'Maintain an active study streak.',
    icon: '🔥',
    requirement: 'Active Streak',
    unlocked: true
  },
  {
    id: 'b-level-5',
    name: 'Scholar Elite',
    description: 'Reach Level 5 Scholar Rank.',
    icon: '👑',
    requirement: 'Reach Level 5',
    unlocked: false
  }
];

const INITIAL_STATS: UserStats = {
  xp: 340,
  level: 2,
  streakDays: 3,
  lastStudyDate: new Date().toISOString().split('T')[0],
  totalFocusMinutes: 75,
  pomodorosCompleted: 3,
  cardsStudied: 18,
  quizzesCompleted: 2,
  perfectQuizzes: 1,
  unlockedBadges: ['b-first-pomo', 'b-card-master', 'b-streak-3']
};

const INITIAL_MESSAGES: BuddyMessage[] = [
  {
    id: 'm1',
    sender: 'buddy',
    text: "👋 Hey there, study partner! I'm **Pulse**, your interactive Study Buddy! I'm here to help you focus, learn flashcards, test your knowledge with quizzes, and keep your streak alive! What would you like to tackle today?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export const loadDecks = (): FlashcardDeck[] => {
  const saved = localStorage.getItem('studypulse_decks');
  return saved ? JSON.parse(saved) : INITIAL_DECKS;
};

export const saveDecks = (decks: FlashcardDeck[]) => {
  localStorage.setItem('studypulse_decks', JSON.stringify(decks));
};

export const loadQuizzes = (): Quiz[] => {
  const saved = localStorage.getItem('studypulse_quizzes');
  return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
};

export const saveQuizzes = (quizzes: Quiz[]) => {
  localStorage.setItem('studypulse_quizzes', JSON.stringify(quizzes));
};

export const loadTasks = (): Task[] => {
  const saved = localStorage.getItem('studypulse_tasks');
  return saved ? JSON.parse(saved) : INITIAL_TASKS;
};

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem('studypulse_tasks', JSON.stringify(tasks));
};

export const loadStats = (): UserStats => {
  const saved = localStorage.getItem('studypulse_stats');
  return saved ? JSON.parse(saved) : INITIAL_STATS;
};

export const saveStats = (stats: UserStats) => {
  localStorage.setItem('studypulse_stats', JSON.stringify(stats));
};

export const loadBadges = (): Badge[] => {
  const saved = localStorage.getItem('studypulse_badges');
  if (saved) return JSON.parse(saved);
  return INITIAL_BADGES;
};

export const saveBadges = (badges: Badge[]) => {
  localStorage.setItem('studypulse_badges', JSON.stringify(badges));
};

export const loadBuddyMessages = (): BuddyMessage[] => {
  const saved = localStorage.getItem('studypulse_buddy_msgs');
  return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
};

export const saveBuddyMessages = (msgs: BuddyMessage[]) => {
  localStorage.setItem('studypulse_buddy_msgs', JSON.stringify(msgs));
};
