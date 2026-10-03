import React, { useState, useEffect } from 'react';
import { HelpCircle, Clock, CheckCircle, XCircle, RotateCcw, Sparkles, Plus, Play, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Quiz, QuizQuestion, FlashcardDeck, UserStats } from '../types';
import { soundFX } from '../utils/soundEffects';

interface QuizEngineProps {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
  decks: FlashcardDeck[];
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  soundEnabled: boolean;
}

export const QuizEngine: React.FC<QuizEngineProps> = ({
  quizzes,
  setQuizzes,
  decks,
  setStats,
  soundEnabled
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizTimer, setQuizTimer] = useState<number>(0);
  const [timeTaken, setTimeTaken] = useState<number>(0);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);

  // Custom Quiz Builder Modal
  const [showCreateQuizModal, setShowCreateQuizModal] = useState<boolean>(false);
  const [selectedDeckForQuiz, setSelectedDeckForQuiz] = useState<string>('');

  // Quiz Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isQuizActive && !quizSubmitted) {
      interval = setInterval(() => {
        setQuizTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuizActive, quizSubmitted]);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setUserAnswers(new Array(quiz.questions.length).fill(null));
    setQuizSubmitted(false);
    setQuizTimer(0);
    setTimeTaken(0);
    setIsQuizActive(true);
  };

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || quizSubmitted) return;
    setSelectedOption(idx);

    const currentQ = activeQuiz?.questions[currentQuestionIdx];
    const isCorrect = currentQ && idx === currentQ.correctAnswer;

    if (soundEnabled) {
      if (isCorrect) soundFX.playCorrect();
      else soundFX.playWrong();
    }

    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIdx] = idx;
    setUserAnswers(updatedAnswers);
  };

  const handleNextQuestion = () => {
    if (!activeQuiz) return;

    if (currentQuestionIdx < activeQuiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(userAnswers[currentQuestionIdx + 1]);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;

    setIsQuizActive(false);
    setQuizSubmitted(true);
    setTimeTaken(quizTimer);

    // Calculate score
    let correctCount = 0;
    activeQuiz.questions.forEach((q, i) => {
      if (userAnswers[i] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / activeQuiz.questions.length) * 100);
    const isPerfect = percentage === 100;

    // Trigger confetti if high score
    if (percentage >= 75) {
      confetti({
        particleCount: isPerfect ? 120 : 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (soundEnabled) soundFX.playLevelUp();
    }

    // Award XP
    const earnedXp = correctCount * 20 + (isPerfect ? 50 : 0);
    setStats((prev) => {
      const newXp = prev.xp + earnedXp;
      const newLevel = Math.floor(newXp / 250) + 1;

      return {
        ...prev,
        quizzesCompleted: prev.quizzesCompleted + 1,
        perfectQuizzes: isPerfect ? prev.perfectQuizzes + 1 : prev.perfectQuizzes,
        xp: newXp,
        level: Math.max(prev.level, newLevel)
      };
    });
  };

  const handleGenerateQuizFromDeck = () => {
    const deck = decks.find((d) => d.id === selectedDeckForQuiz);
    if (!deck || deck.cards.length < 2) {
      alert('Please select a deck with at least 2 flashcards!');
      return;
    }

    const generatedQuestions: QuizQuestion[] = deck.cards.map((card, idx) => {
      const otherBacks = deck.cards.filter((c) => c.id !== card.id).map((c) => c.back);
      const shuffledWrong = otherBacks.sort(() => Math.random() - 0.5).slice(0, 3);
      
      const allOptions = [card.back, ...shuffledWrong].sort(() => Math.random() - 0.5);
      const correctIdx = allOptions.indexOf(card.back);

      return {
        id: `q-gen-${idx}`,
        question: card.front,
        options: allOptions,
        correctAnswer: correctIdx,
        explanation: card.hint ? `Hint: ${card.hint}` : 'Direct answer from flashcard deck.'
      };
    });

    const newQuiz: Quiz = {
      id: `quiz-gen-${Date.now()}`,
      title: `${deck.title} Auto-Quiz`,
      description: `Auto-generated quiz based on ${deck.cards.length} flashcards in ${deck.title}.`,
      category: deck.category,
      timeLimitSeconds: 180,
      questions: generatedQuestions
    };

    setQuizzes((prev) => [...prev, newQuiz]);
    setShowCreateQuizModal(false);
    handleStartQuiz(newQuiz);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // QUIZ LOBBY
  if (!activeQuiz) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Header Bar */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-extrabold text-xl text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-indigo-400" /> Interactive Quiz Arena
            </h2>
            <p className="text-xs text-slate-400">Test your knowledge, earn XP, and unlock achievement badges!</p>
          </div>

          <button
            onClick={() => setShowCreateQuizModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:scale-105 transition-all"
          >
            <Plus className="w-4 h-4" /> Quiz from Flashcard Deck
          </button>
        </div>

        {/* Quizzes List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all shadow-xl hover:shadow-indigo-950/40 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30">
                    {quiz.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> {quiz.timeLimitSeconds ? `${Math.round(quiz.timeLimitSeconds / 60)}m limit` : 'No limit'}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-300 transition-colors">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{quiz.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <span className="text-xs font-mono text-slate-400">
                  ❓ {quiz.questions.length} Questions
                </span>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
                >
                  <Play className="w-4 h-4 fill-current" /> Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CREATE QUIZ FROM DECK MODAL */}
        {showCreateQuizModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h3 className="font-bold text-slate-100 text-base">Generate Quiz from Flashcard Deck</h3>
              <p className="text-xs text-slate-400">
                Select one of your saved flashcard decks to automatically generate a 4-choice multiple choice quiz!
              </p>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Select Source Deck *</label>
                <select
                  value={selectedDeckForQuiz}
                  onChange={(e) => setSelectedDeckForQuiz(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose a deck --</option>
                  {decks.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.title} ({d.cards.length} cards)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowCreateQuizModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGenerateQuizFromDeck}
                  disabled={!selectedDeckForQuiz}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold disabled:opacity-50"
                >
                  Generate Quiz Now
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ACTIVE QUIZ / SUMMARY SCREEN
  const currentQ = activeQuiz.questions[currentQuestionIdx];
  const totalQuestions = activeQuiz.questions.length;
  const progressPercent = Math.round(((currentQuestionIdx + 1) / totalQuestions) * 100);

  let correctAnswersCount = 0;
  activeQuiz.questions.forEach((q, i) => {
    if (userAnswers[i] === q.correctAnswer) correctAnswersCount++;
  });
  const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Quiz Top Header */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
            {activeQuiz.category}
          </span>
          <h2 className="font-bold text-lg text-slate-100">{activeQuiz.title}</h2>
        </div>

        {!quizSubmitted ? (
          <div className="flex items-center gap-3 font-mono text-sm bg-slate-950 px-3.5 py-1.5 rounded-2xl border border-white/10 text-indigo-300">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>{formatTimer(quizTimer)}</span>
          </div>
        ) : (
          <button
            onClick={() => setActiveQuiz(null)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
          >
            ← Exit Arena
          </button>
        )}
      </div>

      {!quizSubmitted ? (
        /* QUESTION CARD */
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400 font-mono">
              <span>Question {currentQuestionIdx + 1} of {totalQuestions}</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Question Text */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optionIdx) => {
              const isSelected = selectedOption === optionIdx;
              const isCorrectOption = optionIdx === currentQ.correctAnswer;
              
              let btnStyle = 'bg-slate-950/60 border-white/10 text-slate-200 hover:border-indigo-500/50 hover:bg-slate-800/40';

              if (selectedOption !== null) {
                if (isCorrectOption) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrectOption) {
                  btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                }
              }

              return (
                <button
                  key={optionIdx}
                  onClick={() => handleSelectOption(optionIdx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center border border-white/5">
                      {String.fromCharCode(65 + optionIdx)}
                    </span>
                    <span>{opt}</span>
                  </span>

                  {selectedOption !== null && isCorrectOption && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {selectedOption !== null && (
            <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 space-y-2 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Explanation
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end pt-4 border-t border-white/5">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md shadow-indigo-600/20 disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
            >
              {currentQuestionIdx < totalQuestions - 1 ? 'Next Question ➔' : 'Finish Quiz 🎯'}
            </button>
          </div>

        </div>
      ) : (
        /* SUMMARY SCREEN */
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-500">
          
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-xl shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                <span className="font-extrabold text-2xl text-slate-100">{scorePercentage}%</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-2xl text-slate-100">
              {scorePercentage === 100 ? '🎉 Perfect Score!' : scorePercentage >= 75 ? '🌟 Great Job!' : '💪 Good Attempt!'}
            </h3>
            <p className="text-xs text-slate-400">
              You answered {correctAnswersCount} out of {totalQuestions} questions correctly in {formatTimer(timeTaken)}.
            </p>
          </div>

          {/* Rewards Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Earned +{correctAnswersCount * 20 + (scorePercentage === 100 ? 50 : 0)} XP!</span>
          </div>

          {/* Detailed Question Review */}
          <div className="text-left space-y-3 pt-4 border-t border-white/10">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider">Answer Review</h4>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
              {activeQuiz.questions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const isRight = userAns === q.correctAnswer;

                return (
                  <div key={q.id} className="p-3 rounded-2xl bg-slate-950 border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">Q{idx + 1}: {q.question}</span>
                      {isRight ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">Correct Answer: {q.options[q.correctAnswer]}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleStartQuiz(activeQuiz)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Retake Quiz
            </button>
            <button
              onClick={() => setActiveQuiz(null)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              Back to Quiz Arena
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
