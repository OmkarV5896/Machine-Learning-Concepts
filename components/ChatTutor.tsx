import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { ChatMessage } from '../types';
import { sendTutorMessage } from '../services/geminiService';

interface ChatTutorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopic: string;
}

export const ChatTutor: React.FC<ChatTutorProps> = ({ isOpen, onClose, currentTopic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      text: `Hi! I'm CIPHER 🤖. I'm here to help you hack through the confusion! Ask me anything about ${currentTopic || 'AI'}.`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Reset chat when topic changes
  useEffect(() => {
    setMessages([{
       id: `intro-${Date.now()}`,
       role: 'model',
       text: `Switching context to ${currentTopic}. Ready when you are!`,
       timestamp: Date.now()
    }]);
  }, [currentTopic]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendTutorMessage(input);

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col transition-transform duration-300">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <Icons.Bot className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100">CIPHER</h3>
            <p className="text-xs text-indigo-400 font-mono">AI COMPANION</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
          <Icons.X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/95">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-2 border border-slate-700">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-800 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for a hint or explanation..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors shadow-lg"
          >
            <Icons.Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};