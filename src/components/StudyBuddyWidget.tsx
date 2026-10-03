import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX, Sparkles, X, Zap, Lightbulb, HelpCircle } from 'lucide-react';
import type { BuddyAvatar, BuddyMessage } from '../types';
import { speechHelper } from '../utils/speech';

interface StudyBuddyWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  messages: BuddyMessage[];
  setMessages: React.Dispatch<React.SetStateAction<BuddyMessage[]>>;
  onActionTrigger?: (action: string) => void;
  soundEnabled: boolean;
}

export const StudyBuddyWidget: React.FC<StudyBuddyWidgetProps> = ({
  isOpen,
  onClose,
  messages,
  setMessages,
  onActionTrigger,
  soundEnabled
}) => {
  const [inputText, setInputText] = useState('');
  const [avatar, setAvatar] = useState<BuddyAvatar>('owl');
  const [mood, setMood] = useState<'idle' | 'thinking' | 'happy' | 'encouraging'>('idle');
  const [voiceOn, setVoiceOn] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const promptPills = [
    { label: '🔥 Study Motivation', prompt: 'Give me a powerful study motivation boost right now!' },
    { label: '💡 Active Recall Tip', prompt: 'How do I use active recall and spaced repetition effectively?' },
    { label: '⏱️ Pomodoro Hack', prompt: 'What is the best way to handle breaks during Pomodoro?' },
    { label: '🧠 Explain a Concept', prompt: 'Explain how memory consolidation works during study sleep.' },
    { label: '⚡ Quick Quiz Challenge', prompt: 'Give me a 1-question surprise quiz to test my brain!' }
  ];

  const generateBuddyResponse = (userPrompt: string): { reply: string; actionHint?: string } => {
    const text = userPrompt.toLowerCase();

    if (text.includes('motivation') || text.includes('boost') || text.includes('tired') || text.includes('lazy')) {
      return {
        reply: "🚀 **You've got this!** Remember: consistency beats intensity every single time. 25 minutes of focused effort right now is worth 3 hours of distracted scrolling. Start a Pomodoro timer and give it 100%! I'm right here cheering for you! 🌟",
        actionHint: 'start_pomo'
      };
    } else if (text.includes('active recall') || text.includes('spaced repetition') || text.includes('flashcard')) {
      return {
        reply: "🎴 **Active Recall & Spaced Repetition Masterclass:**\n\n1. **Active Recall**: Don't just re-read notes! Test yourself before checking the answer. That brain strain is where real synaptic connections form!\n2. **Spaced Repetition**: Review cards right when you're about to forget them (1 day, 3 days, 1 week).\n3. **Use our Flashcard Studio**: Mark cards as 'Need Review' or 'Mastered' to auto-schedule your practice!",
        actionHint: 'go_flashcards'
      };
    } else if (text.includes('pomodoro') || text.includes('break') || text.includes('timer')) {
      return {
        reply: "⏱️ **Pomodoro Best Practices:**\n\n- **Work (25m)**: Single-tasking only! Close extra tabs.\n- **Short Break (5m)**: Stand up, stretch, drink water, look out the window.\n- **Long Break (15-30m)**: After 4 rounds, take a real break away from screens!\n\nWant me to kick off a 25-minute focus session for you?",
        actionHint: 'start_pomo'
      };
    } else if (text.includes('quiz') || text.includes('test')) {
      return {
        reply: "🎯 **Surprise Quiz Time!**\n\n*Question:* What is the cognitive phenomenon where retrieving information from memory strengthens the memory trace more than simple restudying?\n\nA) The Primacy Effect\nB) The Testing / Active Recall Effect\nC) Cognitive Dissonance\nD) Serial Position Effect\n\n*(Type your answer A, B, C, or D!)*",
        actionHint: 'go_quiz'
      };
    } else if (text === 'b' || text.includes('b)') || text.includes('testing')) {
      return {
        reply: "🎉 **CORRECT!** Option B: The Testing Effect! Testing yourself forces your brain to reconstruct memory pathways, making future retrieval drastically faster. +50 XP for you! 🏆"
      };
    } else if (text.includes('concept') || text.includes('memory') || text.includes('sleep')) {
      return {
        reply: "🧠 **Memory Consolidation & Sleep:**\nDuring Non-REM and REM sleep, your brain's hippocampus transfers short-term study data to the neocortex for long-term storage. Studying right before a good night's sleep increases retention by up to 40%!"
      };
    } else {
      return {
        reply: `✨ Great thought! Key to mastering "${userPrompt}" is breaking it down into bite-sized 5-minute study chunks. Try adding it to your Tasks tab, or turn it into flashcards in the Flashcard Studio so we can quiz you on it later! 📚`
      };
    }
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: BuddyMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setMood('thinking');

    setTimeout(() => {
      const response = generateBuddyResponse(textToSend);
      const buddyMsg: BuddyMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'buddy',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionHint: response.actionHint
      };

      setMessages((prev) => [...prev, buddyMsg]);
      setMood('happy');

      if (voiceOn && soundEnabled) {
        speechHelper.speak(response.reply);
      }

      setTimeout(() => setMood('idle'), 3000);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl shadow-2xl shadow-indigo-950/80 overflow-hidden flex flex-col h-[560px] transition-all animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Buddy Header */}
      <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 p-4 border-b border-white/10 flex items-center justify-between">
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                {avatar === 'owl' && '🦉'}
                {avatar === 'bot' && '🤖'}
                {avatar === 'cat' && '🐱'}
                {avatar === 'panda' && '🐼'}
              </div>
            </div>
            <span
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                mood === 'thinking' ? 'bg-amber-400 animate-ping' : mood === 'happy' ? 'bg-emerald-400' : 'bg-indigo-400'
              }`}
            ></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm">Pulse AI Study Buddy</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">Online</span>
            </div>
            <p className="text-[11px] text-slate-400">Your 24/7 personal learning assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={avatar}
            onChange={(e) => setAvatar(e.target.value as BuddyAvatar)}
            className="bg-slate-800 text-xs text-slate-200 border border-white/10 rounded-lg px-1.5 py-1 focus:outline-none cursor-pointer"
            title="Choose companion pet"
          >
            <option value="owl">🦉 Owl</option>
            <option value="bot">🤖 Bot</option>
            <option value="cat">🐱 Cat</option>
            <option value="panda">🐼 Panda</option>
          </select>

          <button
            onClick={() => setVoiceOn(!voiceOn)}
            className={`p-1.5 rounded-lg border transition-all ${
              voiceOn ? 'bg-purple-600/30 border-purple-500/40 text-purple-300' : 'bg-slate-800 border-white/10 text-slate-500'
            }`}
            title={voiceOn ? 'Voice Enabled' : 'Voice Muted'}
          >
            {voiceOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Message Chat Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 border border-white/10 text-slate-200 rounded-bl-none'
              }`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                }}
              />
            </div>

            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>

            {msg.actionHint && onActionTrigger && (
              <div className="mt-2">
                {msg.actionHint === 'start_pomo' && (
                  <button
                    onClick={() => {
                      onActionTrigger('start_pomo');
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-semibold transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" /> Start Pomodoro Session Now
                  </button>
                )}
                {msg.actionHint === 'go_flashcards' && (
                  <button
                    onClick={() => {
                      onActionTrigger('go_flashcards');
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 text-xs font-semibold transition-all"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Open Flashcard Studio
                  </button>
                )}
                {msg.actionHint === 'go_quiz' && (
                  <button
                    onClick={() => {
                      onActionTrigger('go_quiz');
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-all"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Open Quiz Center
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {mood === 'thinking' && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/40 p-2.5 rounded-2xl w-max border border-indigo-500/20 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pulse is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Pills Carousel */}
      <div className="px-3 py-2 bg-slate-950/70 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
        {promptPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(pill.prompt)}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-600/30 text-[11px] font-medium text-slate-300 hover:text-indigo-200 border border-white/10 hover:border-indigo-500/40 whitespace-nowrap transition-all flex-shrink-0"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-slate-900 border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Pulse anything..."
          className="flex-1 bg-slate-950 text-slate-100 border border-white/10 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
