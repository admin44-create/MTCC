import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  HelpCircle, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle2,
  Minimize2
} from 'lucide-react';
import { Language } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface AiSahayakDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AiSahayakDrawer: React.FC<AiSahayakDrawerProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: isBn
        ? 'নমস্কার! আমি "মা তারা সাইবার ক্যাফে (MTCC)"-র ডিজিটাল এআই সহায়ক। পিভিসি কার্ড প্রিন্টিং, পাসপোর্ট ছবি, বায়োডাটা, প্যান, ভোটার, রেশন কার্ড, চাকরির ফর্ম ফিলাপ বা যেকোনো সরকারি স্কিম সম্পর্কে আমাকে প্রশ্ন করতে পারেন।'
        : 'Namaskar! I am your 24/7 "Ma Tara Cyber Cafe (MTCC)" AI Assistant. Feel free to ask me anything about smart PVC cards, photo printing, required documents, government services, or job form fill-ups in Mangalbari, Malda & West Bengal.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = isBn
    ? [
        'প্যান কার্ডের জন্য কী কী ডকুমেন্ট লাগবে?',
        'ভোটার কার্ডে নাম ভুল থাকলে কীভাবে সংশোধন করব?',
        'রেশন কার্ডে আধার e-KYC করার নিয়ম কী?',
        'জন্ম শংসাপত্র পেতে কতদিন সময় লাগে?',
        'WBSEDCL বিদ্যুৎ বিলের রসিদ কীভাবে ডাউনলোড করব?',
      ]
    : [
        'What documents are needed for PAN Card?',
        'How to correct name/address in Voter ID Form 8?',
        'How to link Aadhaar with Ration Card (e-KYC)?',
        'What is the procedure for new Birth Certificate?',
        'How to pay WBSEDCL electricity bill online?',
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || (isBn ? 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি।' : 'Sorry, could not fetch reply.'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: isBn
          ? 'সার্ভারের সাথে সাময়িক যোগাযোগে বিলম্ব হচ্ছে। আপনি যে কোনো পরিষেবার তথ্যের জন্য উপরের "ফি তালিকা (রেট চার্ট)" দেখতে পারেন বা আমাদের টোল-ফ্রি নম্বর 1800-399-7382 তে কল করতে পারেন।'
          : 'Unable to reach backend right now. You can check the "Fee Rate Card" tab or reach our toll-free helpline at 1800-399-7382.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0a0a1a]/95 backdrop-blur-2xl h-full shadow-2xl flex flex-col border-l border-white/10 text-white">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-white/5 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-base text-white">
                  {isBn ? 'এআই সেবা সহায়ক' : 'AI Seva Sahayak'}
                </h3>
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded border border-blue-400/30">
                  24/7 AI
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-medium">
                {isBn ? 'নাগরিক পরিষেবা ও ফর্ম সহায়িকা' : 'Citizen Documents & Schemes Guide'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="p-1.5 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Help Prompts Strip */}
        <div className="p-3 bg-white/[0.02] border-b border-white/10 shrink-0">
          <div className="text-[11px] font-bold text-white/70 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-blue-400" />
            <span>{isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্ন:' : 'Frequent Inquiries:'}</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] bg-white/5 border border-white/10 hover:border-blue-400 hover:text-blue-300 text-white/80 px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs transition-colors shrink-0 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-transparent">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isUser ? 'bg-white/15 text-white border border-white/20' : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`max-w-[82%] space-y-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-blue-600/80 backdrop-blur-md text-white border border-blue-400/30 rounded-tr-none shadow-lg shadow-blue-600/20'
                        : 'bg-white/5 backdrop-blur-md border border-white/10 text-white/90 rounded-tl-none shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                  <div className="text-[10px] text-white/40 px-1">{msg.time}</div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/30">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl rounded-tl-none p-3 shadow-md">
                <div className="flex items-center gap-1.5 text-xs text-white/70 font-medium">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="ml-1 text-[11px] text-white/50">
                    {isBn ? 'সহায়ক তথ্য যাচাই করছে...' : 'Searching citizen guidelines...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollEndRef} />
        </div>

        {/* Input Box */}
        <div className="p-3 bg-white/[0.02] border-t border-white/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isBn
                  ? 'আপনার প্রশ্ন এখানে লিখুন (বাংলা বা English)...'
                  : 'Ask question here (English or Bengali)...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs sm:text-sm focus:outline-hidden focus:border-blue-400 text-white placeholder-white/40 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl shrink-0 transition-all shadow-lg shadow-blue-600/30 border border-blue-400/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-[10px] text-center text-white/40 mt-1.5">
            {isBn ? 'সকল সরকারি নিয়ম ও নথির নির্দেশিকা মেনে উত্তর দেওয়া হয়।' : 'Grounded in official state & national citizen service rules.'}
          </div>
        </div>
      </div>
    </div>
  );
};
