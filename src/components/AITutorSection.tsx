import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  ArrowRight,
  TrendingUp,
  History,
  Lightbulb,
} from 'lucide-react';
import { ChatMessage, LearningLevel, MistakeItem } from '../types/index.ts';
import { speechService } from '../services/speechService.ts';
import { StorageService } from '../services/storageService.ts';

interface AITutorSectionProps {
  currentLevel: LearningLevel;
  showHindi: boolean;
  onInteraction: () => void;
}

export const AITutorSection: React.FC<AITutorSectionProps> = ({
  currentLevel,
  showHindi,
  onInteraction,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      sender: 'ai',
      text: "Namaste & Hello! I am SpeakUp AI Teacher, your personal English tutor. Speak or type any sentence—even if you're not sure if it's correct! I'll gently correct any grammar mistakes, explain in simple English & Hindi, and help you speak with 100% confidence.",
      timestamp: 'Just now',
      teacherReply: "What did you do today, or what would you like to talk about?",
      encouragement: "Never hesitate to make mistakes; that is how we master English!",
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showHistoryPane, setShowHistoryPane] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionStopperRef = useRef<{ stop: () => void } | null>(null);

  // Load mistakes from storage
  useEffect(() => {
    const progress = StorageService.getProgress();
    setMistakes(progress.mistakeHistory);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeakText = (text: string) => {
    speechService.speak(text, { rate: 0.95 });
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionStopperRef.current) {
        recognitionStopperRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const stopper = speechService.startListening({
        onResult: (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            setIsRecording(false);
          }
        },
        onError: () => setIsRecording(false),
        onEnd: () => setIsRecording(false),
      });
      recognitionStopperRef.current = stopper;
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isSending) return;

    if (isRecording) {
      toggleRecording();
    }

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
          userLevel: currentLevel,
          topic: 'Friendly Conversation & Grammar Mastery',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: 'ai_' + Date.now(),
          sender: 'ai',
          text: data.teacherReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          hasMistake: data.hasMistake,
          incorrectPart: data.incorrectPart || (data.hasMistake ? query : undefined),
          correctedSentence: data.correctedSentence,
          mistakeExplanation: data.mistakeExplanation,
          hindiExplanation: data.hindiExplanation,
          naturalAlternative: data.naturalAlternative,
          vocabularyTip: data.vocabularyTip,
          encouragement: data.encouragement,
        };

        setMessages((prev) => [...prev, aiMsg]);
        onInteraction();

        // If mistake found, store it in persistent mistake history
        if (data.hasMistake) {
          const recorded = StorageService.addMistake({
            wrong: data.incorrectPart || query,
            correct: data.correctedSentence,
            explanation: data.mistakeExplanation,
            hindiExplanation: data.hindiExplanation,
            topic: 'AI Tutor Conversation',
            category: 'grammar',
          });
          const p = StorageService.getProgress();
          setMistakes(p.mistakeHistory);
        }

        // Auto-speak teacher's conversational reply if desired
        if (data.teacherReply) {
          speechService.speak(data.teacherReply, { rate: 0.95 });
        }
      } else {
        throw new Error('Server returned error');
      }
    } catch (e) {
      // Fallback response
      const fallbackMsg: ChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: `I understood you! Keep practicing with full confidence. What else would you like to talk about?`,
        timestamp: 'Just now',
        hasMistake: false,
        correctedSentence: query,
        mistakeExplanation: "Your sentence was understandable! Focus on keeping a steady speaking rhythm.",
        hindiExplanation: "Aapki baat bilkul samajh aayi! Aise hi practice karte rahein.",
        encouragement: "Consistency is your superpower!",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      onInteraction();
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    'I am go to office.',
    'She do not like coffee.',
    'I will meet you in Monday.',
    'Can you check my sentence: "Yesterday I have gone to market"?',
    'How do I introduce myself in a job interview?',
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Personal English Teacher</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Speak & Chat Without Fear
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Your 24/7 patient tutor. Say anything: if you make a mistake, you'll receive the exact correction, English & Hindi explanations, and native phrasing!
          </p>
        </div>

        <button
          onClick={() => setShowHistoryPane(!showHistoryPane)}
          className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-xs font-bold text-white transition flex items-center gap-2 shrink-0"
        >
          <History className="w-4 h-4 text-violet-400" />
          <span>Mistake History ({mistakes.length})</span>
        </button>
      </div>

      {/* Main Container: Chat Studio + Optional Mistake History Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Studio */}
        <div className={showHistoryPane ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* Chat Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md ${
                        isUser
                          ? 'bg-indigo-600'
                          : 'bg-gradient-to-tr from-violet-600 to-indigo-600'
                      }`}
                    >
                      {isUser ? '👤' : <Bot className="w-5 h-5" />}
                    </div>

                    {/* Bubble Content */}
                    <div className={`space-y-2 max-w-xl ${isUser ? 'items-end' : 'items-start'}`}>
                      {/* Text */}
                      <div
                        className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                          isUser
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>

                      {/* AI Correction Card (If mistake was detected) */}
                      {!isUser && msg.hasMistake && (
                        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-2.5 animate-in fade-in">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Grammar Feedback:
                            </span>
                            <button
                              onClick={() => handleSpeakText(msg.correctedSentence || '')}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Volume2 className="w-3 h-3" /> Hear Correction
                            </button>
                          </div>

                          {/* Incorrect vs Correct */}
                          <div className="space-y-1">
                            <div className="text-rose-700 dark:text-rose-300">
                              <strong className="text-rose-800 dark:text-rose-200">Incorrect:</strong>{' '}
                              <span className="line-through">{msg.incorrectPart}</span>
                            </div>
                            <div className="text-emerald-700 dark:text-emerald-300 font-bold">
                              <strong className="text-emerald-800 dark:text-emerald-200">Correct:</strong>{' '}
                              <span>{msg.correctedSentence}</span>
                            </div>
                          </div>

                          {/* Explanation */}
                          {msg.mistakeExplanation && (
                            <p className="text-slate-700 dark:text-slate-300">
                              <strong>Why:</strong> {msg.mistakeExplanation}
                            </p>
                          )}

                          {/* Hindi Explanation */}
                          {showHindi && msg.hindiExplanation && (
                            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 font-medium">
                              💡 <strong>हिंदी में समझें:</strong> {msg.hindiExplanation}
                            </div>
                          )}

                          {/* Natural Alternative */}
                          {msg.naturalAlternative && (
                            <div className="text-violet-700 dark:text-violet-300 text-[11px]">
                              <strong>Native Alternative:</strong> "{msg.naturalAlternative}"
                            </div>
                          )}
                        </div>
                      )}

                      {/* Audio listen button for AI responses */}
                      {!isUser && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleSpeakText(msg.text)}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-0.5"
                          >
                            <Volume2 className="w-3 h-3" /> Play
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-violet-600 text-white flex items-center justify-center">
                    <Bot className="w-5 h-5 animate-bounce" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500 animate-pulse">
                    AI Teacher is analyzing grammar & replying...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
                Try:
              </span>
              {samplePrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(p)}
                  className="px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-violet-400 whitespace-nowrap transition"
                >
                  "{p}"
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              <button
                onClick={toggleRecording}
                className={`p-3 rounded-2xl transition ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                }`}
                title={isRecording ? 'Listening...' : 'Voice Input'}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type or speak any English sentence to check..."
                className="flex-1 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-violet-500 text-slate-900 dark:text-white"
              />

              <button
                disabled={!inputText.trim() || isSending}
                onClick={() => handleSendMessage()}
                className="p-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 transition shadow-md shadow-violet-600/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mistake History Sidebar */}
        {showHistoryPane && (
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 max-h-[650px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <History className="w-4 h-4 text-violet-500" />
                Mistake History
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                {mistakes.length} Logged
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reviewing mistakes makes them disappear permanently from your speech.
            </p>

            <div className="space-y-3">
              {mistakes.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                      Repeated {m.repeatCount}x
                    </span>
                    <button
                      onClick={() => handleSendMessage(m.correct)}
                      className="text-violet-600 dark:text-violet-400 hover:underline text-[10px] font-bold"
                    >
                      Practice in Chat
                    </button>
                  </div>
                  <div>
                    <span className="line-through text-rose-600 dark:text-rose-400 font-semibold">
                      "{m.wrong}"
                    </span>
                    <p className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">
                      ✓ "{m.correct}"
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {m.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
