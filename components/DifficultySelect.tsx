
import React from 'react';
import { Difficulty } from '../types';
import { DIFFICULTY_LEVELS, DIFFICULTY_META } from '../constants';
import { Icons, IconName } from './Icons';

interface DifficultySelectProps {
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

export const DifficultySelect: React.FC<DifficultySelectProps> = ({ onSelect, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center animate-in slide-in-from-bottom-8 duration-500 max-w-5xl mx-auto w-full pt-8">
      <button 
        onClick={onBack}
        className="self-start mb-8 text-slate-400 hover:text-white flex items-center gap-2 transition-colors px-4"
      >
        <Icons.ArrowLeft className="w-5 h-5" /> Back to Missions
      </button>

      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Select Clearance Level</h2>
        <p className="text-slate-400">Higher clearance yields greater rewards but requires precise architecture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 w-full">
        {DIFFICULTY_LEVELS.map((diff) => {
          const meta = DIFFICULTY_META[diff];
          const Icon = Icons[meta.icon as IconName] || Icons.User;
          
          return (
            <button
              key={diff}
              onClick={() => onSelect(diff)}
              className={`group relative flex flex-col p-6 rounded-2xl border transition-all duration-300 text-left hover:-translate-y-2 hover:shadow-2xl h-full ${meta.color.replace('bg-', 'hover:bg-').replace('text-', 'data-unused-')}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl bg-gradient-to-b ${meta.color.split(' ')[2]} to-transparent -z-10`} />
              
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 border-2 ${meta.color}`}>
                <Icon className="w-7 h-7" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{meta.label}</h3>
                <p className="text-sm font-mono text-slate-400 mb-4 uppercase tracking-wider">{diff}</p>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {meta.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/50 w-full flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">REWARD MULTIPLIER</span>
                <span className="text-white font-bold bg-slate-800 px-2 py-1 rounded">x{meta.multiplier}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
