import React, { useState } from 'react';
import { BookOpen, Plus, Shuffle, Download, Upload, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Flashcard, FlashcardDeck, UserStats } from '../types';
import { soundFX } from '../utils/soundEffects';

interface FlashcardStudioProps {
  decks: FlashcardDeck[];
  setDecks: React.Dispatch<React.SetStateAction<FlashcardDeck[]>>;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
  soundEnabled: boolean;
}

export const FlashcardStudio: React.FC<FlashcardStudioProps> = ({
  decks,
  setDecks,
  setStats,
  soundEnabled
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [studyFilter, setStudyFilter] = useState<'all' | 'unmastered'>('all');
  
  // Modals
  const [showCreateDeckModal, setShowCreateDeckModal] = useState<boolean>(false);
  const [showAddCardModal, setShowAddCardModal] = useState<boolean>(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckCategory, setNewDeckCategory] = useState('General');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [newCardHint, setNewCardHint] = useState('');
  const [newCardCode, setNewCardCode] = useState('');

  const activeDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];

  const cardsToStudy = activeDeck
    ? activeDeck.cards.filter((c) => (studyFilter === 'unmastered' ? c.masteryLevel !== 'mastered' : true))
    : [];

  const currentCard: Flashcard | undefined = cardsToStudy[currentCardIndex];

  const masteredCount = activeDeck ? activeDeck.cards.filter((c) => c.masteryLevel === 'mastered').length : 0;
  const masteryPercentage = activeDeck && activeDeck.cards.length > 0
    ? Math.round((masteredCount / activeDeck.cards.length) * 100)
    : 0;

  const handleFlip = () => {
    if (soundEnabled) soundFX.playCardFlip();
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (cardsToStudy.length > 0) {
      setCurrentCardIndex((prev) => (prev + 1) % cardsToStudy.length);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setShowHint(false);
    if (cardsToStudy.length > 0) {
      setCurrentCardIndex((prev) => (prev - 1 + cardsToStudy.length) % cardsToStudy.length);
    }
  };

  const handleShuffle = () => {
    if (!activeDeck) return;
    const shuffledCards = [...activeDeck.cards].sort(() => Math.random() - 0.5);
    setDecks((prev) =>
      prev.map((d) => (d.id === activeDeck.id ? { ...d, cards: shuffledCards } : d))
    );
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleMasteryRating = (level: 'new' | 'learning' | 'mastered') => {
    if (!currentCard || !activeDeck) return;

    // Update card mastery in state
    setDecks((prev) =>
      prev.map((d) => {
        if (d.id === activeDeck.id) {
          const updatedCards = d.cards.map((c) =>
            c.id === currentCard.id ? { ...c, masteryLevel: level } : c
          );
          return { ...d, cards: updatedCards };
        }
        return d;
      })
    );

    // Award XP on review
    setStats((prev) => {
      const addedXp = level === 'mastered' ? 15 : 5;
      const newXp = prev.xp + addedXp;
      const newLevel = Math.floor(newXp / 250) + 1;

      return {
        ...prev,
        cardsStudied: prev.cardsStudied + 1,
        xp: newXp,
        level: Math.max(prev.level, newLevel)
      };
    });

    handleNextCard();
  };

  const handleCreateDeck = () => {
    if (!newDeckTitle.trim()) return;

    const newDeck: FlashcardDeck = {
      id: `deck-${Date.now()}`,
      title: newDeckTitle,
      category: newDeckCategory || 'General',
      description: newDeckDesc || 'Custom user deck',
      color: '#8b5cf6',
      createdAt: new Date().toISOString(),
      cards: []
    };

    setDecks((prev) => [...prev, newDeck]);
    setSelectedDeckId(newDeck.id);
    setNewDeckTitle('');
    setNewDeckDesc('');
    setShowCreateDeckModal(false);
  };

  const handleAddCard = () => {
    if (!newCardFront.trim() || !newCardBack.trim() || !activeDeck) return;

    const newCard: Flashcard = {
      id: `card-${Date.now()}`,
      front: newCardFront,
      back: newCardBack,
      hint: newCardHint || undefined,
      codeSnippet: newCardCode || undefined,
      masteryLevel: 'new'
    };

    setDecks((prev) =>
      prev.map((d) =>
        d.id === activeDeck.id ? { ...d, cards: [...d.cards, newCard] } : d
      )
    );

    setNewCardFront('');
    setNewCardBack('');
    setNewCardHint('');
    setNewCardCode('');
    setShowAddCardModal(false);
  };

  const handleExportDeck = () => {
    if (!activeDeck) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeDeck, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeDeck.title.toLowerCase().replace(/\s+/g, '_')}_deck.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportDeck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as FlashcardDeck;
        if (imported && imported.title && Array.isArray(imported.cards)) {
          imported.id = `imported-${Date.now()}`;
          setDecks((prev) => [...prev, imported]);
          setSelectedDeckId(imported.id);
        }
      } catch {
        alert('Invalid deck JSON file structure.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Top Deck Bar & Creator Controls */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Deck Select Dropdown & Deck Stats */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64">
            <label className="text-[11px] font-semibold text-slate-400 block mb-1 uppercase tracking-wider">
              Select Deck
            </label>
            <select
              value={selectedDeckId}
              onChange={(e) => {
                setSelectedDeckId(e.target.value);
                setCurrentCardIndex(0);
                setIsFlipped(false);
              }}
              className="w-full bg-slate-950 text-slate-100 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.title} ({deck.cards.length} cards)
                </option>
              ))}
            </select>
          </div>

          {/* Mastery Progress pill */}
          {activeDeck && (
            <div className="hidden sm:block">
              <span className="text-[11px] text-slate-400 block mb-1">Mastery Progress</span>
              <div className="flex items-center gap-2">
                <div className="w-28 bg-slate-950 h-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="bg-emerald-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${masteryPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-emerald-400">{masteryPercentage}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          
          <button
            onClick={() => setShowCreateDeckModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 border border-white/10 hover:border-white/20 text-slate-200 text-xs font-semibold transition-all hover:bg-slate-700"
          >
            <Plus className="w-4 h-4 text-indigo-400" /> New Deck
          </button>

          <button
            onClick={() => setShowAddCardModal(true)}
            disabled={!activeDeck}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" /> Add Card
          </button>

          {/* Export & Import buttons */}
          <button
            onClick={handleExportDeck}
            title="Export JSON Deck"
            className="p-2 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all"
          >
            <Download className="w-4 h-4" />
          </button>

          <label
            title="Import JSON Deck"
            className="p-2 rounded-xl bg-slate-800 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImportDeck} className="hidden" />
          </label>
        </div>

      </div>

      {/* Main Flashcard Stage */}
      {cardsToStudy.length === 0 ? (
        <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-indigo-400 mx-auto animate-bounce" />
          <h3 className="font-bold text-slate-200 text-base">No cards available in this filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            All cards in this deck might be mastered, or no cards have been added yet! Click "Add Card" to build your study deck.
          </p>
          <button
            onClick={() => setStudyFilter('all')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Reset Filter to All Cards
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Controls Bar (Filter, Shuffle, Count) */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStudyFilter(studyFilter === 'all' ? 'unmastered' : 'all')}
                className={`px-3 py-1 rounded-full border text-xs transition-all ${
                  studyFilter === 'unmastered'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-white/10 text-slate-400'
                }`}
              >
                {studyFilter === 'unmastered' ? '🎯 Drill Unmastered Only' : '📚 All Cards'}
              </button>

              <button
                onClick={handleShuffle}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-all"
              >
                <Shuffle className="w-3.5 h-3.5" /> Shuffle
              </button>
            </div>

            <span className="font-mono text-slate-400">
              Card {currentCardIndex + 1} of {cardsToStudy.length}
            </span>
          </div>

          {/* 3D PERSPECTIVE FLIP CARD CONTAINER */}
          <div className="perspective-1000 w-full min-h-[360px] cursor-pointer" onClick={handleFlip}>
            <div
              className={`relative w-full min-h-[360px] duration-500 transition-transform transform-style-3d rounded-3xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 flex flex-col justify-between backface-hidden shadow-2xl shadow-indigo-950/40">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-500/30">
                    {activeDeck.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Click card or Spacebar to flip</span>
                </div>

                <div className="my-auto py-6 text-center space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
                    {currentCard?.front}
                  </h2>

                  {/* Hint Toggle */}
                  {currentCard?.hint && (
                    <div className="pt-2">
                      {showHint ? (
                        <p className="text-xs text-amber-300/90 italic bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl inline-block max-w-md">
                          💡 Hint: {currentCard.hint}
                        </p>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowHint(true);
                          }}
                          className="text-xs text-amber-400/80 hover:text-amber-300 underline font-medium flex items-center gap-1 mx-auto"
                        >
                          <HelpCircle className="w-3.5 h-3.5" /> Show Hint
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5 pt-3">
                  <span>Front Side</span>
                  <span className="text-indigo-400 font-semibold">Click to reveal answer ➔</span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border border-indigo-500/30 rounded-3xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 shadow-2xl shadow-purple-950/40">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-500/30">
                    Answer Reveal
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Click to flip back</span>
                </div>

                <div className="my-auto py-4 space-y-4 text-center">
                  <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed max-w-2xl mx-auto">
                    {currentCard?.back}
                  </p>

                  {/* Optional Code Snippet block */}
                  {currentCard?.codeSnippet && (
                    <div className="bg-slate-950 p-3 rounded-2xl border border-white/10 text-left overflow-x-auto text-xs font-mono text-indigo-300 max-w-xl mx-auto">
                      <pre>{currentCard.codeSnippet}</pre>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/5 pt-3">
                  <span>Back Side</span>
                  <span className="text-purple-300 font-semibold">Rate your recall below 👇</span>
                </div>
              </div>

            </div>
          </div>

          {/* Spaced Repetition Mastery Rating Bar */}
          <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Prev / Next Card Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCard}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title="Previous Card"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextCard}
                className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                title="Next Card"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Mastery Level Rating Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleMasteryRating('new')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all"
              >
                🔴 Need Review
              </button>

              <button
                onClick={() => handleMasteryRating('learning')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
              >
                🟡 Good (+5 XP)
              </button>

              <button
                onClick={() => handleMasteryRating('mastered')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
              >
                🟢 Mastered! (+15 XP)
              </button>
            </div>

          </div>

        </div>
      )}

      {/* CREATE NEW DECK MODAL */}
      {showCreateDeckModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-100 text-base">Create New Flashcard Deck</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Deck Title *</label>
                <input
                  type="text"
                  placeholder="e.g. World History & Empires"
                  value={newDeckTitle}
                  onChange={(e) => setNewDeckTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. History, Biology, Language"
                  value={newDeckCategory}
                  onChange={(e) => setNewDeckCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  placeholder="Short summary of this deck's scope..."
                  value={newDeckDesc}
                  onChange={(e) => setNewDeckDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCreateDeckModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeck}
                disabled={!newDeckTitle.trim()}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold disabled:opacity-50"
              >
                Create Deck
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CARD MODAL */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-100 text-base">Add Flashcard to "{activeDeck?.title}"</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Front (Question or Term) *</label>
                <textarea
                  placeholder="What is the function of..."
                  value={newCardFront}
                  onChange={(e) => setNewCardFront(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Back (Answer & Explanation) *</label>
                <textarea
                  placeholder="Detailed explanation..."
                  value={newCardBack}
                  onChange={(e) => setNewCardBack(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Optional Hint</label>
                <input
                  type="text"
                  placeholder="Think of..."
                  value={newCardHint}
                  onChange={(e) => setNewCardHint(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Optional Code Snippet</label>
                <textarea
                  placeholder="const example = () => ..."
                  value={newCardCode}
                  onChange={(e) => setNewCardCode(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-indigo-300 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddCardModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCard}
                disabled={!newCardFront.trim() || !newCardBack.trim()}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold disabled:opacity-50"
              >
                Save Card
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
