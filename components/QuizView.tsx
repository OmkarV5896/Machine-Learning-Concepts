import React, { useState } from 'react';
import { Question, Difficulty } from '../types';
import { Icons } from './Icons';

interface QuizViewProps {
  question: Question;
  currentDifficulty: Difficulty;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
  onExit: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ 
  question, 
  currentDifficulty, 
  onAnswer, 
  onNext,
  onExit
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleOptionClick = (index: number) => {
    if (hasSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setHasSubmitted(true);
    onAnswer(selectedOption === question.correctIndex);
  };

  const getOptionStyles = (index: number) => {
    const baseStyle = "w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group relative overflow-hidden";
    
    if (hasSubmitted) {
      if (index === question.correctIndex) {
        return `${baseStyle} bg-emerald-500/10 border-emerald-500 text-emerald-200`;
      }
      if (index === selectedOption && index !== question.correctIndex) {
        return `${baseStyle} bg-red-500/10 border-red-500 text-red-200`;
      }
      return `${baseStyle} bg-slate-800/50 border-slate-700 text-slate-500 opacity-50`;
    }

    if (selectedOption === index) {
      return `${baseStyle} bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-500/50`;
    }

    return `${baseStyle} bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-750`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onExit}
          className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          <Icons.X className="w-4 h-4" /> Exit
        </button>
        <div className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300 uppercase tracking-wider">
          {currentDifficulty} Protocol
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <h2 className="text-2xl font-bold text-white leading-relaxed mb-8">
          {question.text}
        </h2>

        <div className="space-y-4">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              className={getOptionStyles(idx)}
              disabled={hasSubmitted}
            >
              <span className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                  selectedOption === idx && !hasSubmitted ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium">{option}</span>
              </span>
              
              {hasSubmitted && idx === question.correctIndex && (
                <Icons.Check className="w-6 h-6 text-emerald-500" />
              )}
              {hasSubmitted && idx === selectedOption && idx !== question.correctIndex && (
                <Icons.Wrong className="w-6 h-6 text-red-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Controls & Feedback */}
      <div className="min-h-[160px]"> {/* Fixed height container to prevent layout jumping */}
        {!hasSubmitted ? (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-indigo-900/20"
            >
              Confirm Answer
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-2xl border mb-6 ${
              selectedOption === question.correctIndex 
                ? 'bg-emerald-900/20 border-emerald-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {selectedOption === question.correctIndex ? (
                    <Icons.Check className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Icons.Brain className="w-6 h-6 text-red-400" />
                  )}
                </div>
                <div>
                  <h4 className={`font-bold mb-2 ${
                    selectedOption === question.correctIndex ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {selectedOption === question.correctIndex ? 'Neural Pathway Reinforced!' : 'Model Divergence Detected'}
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-sm">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={onNext}
                className="group px-8 py-3 bg-white text-slate-900 hover:bg-indigo-50 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-white/5"
              >
                Next Challenge <Icons.ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};