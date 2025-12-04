
import React from 'react';
import { Icons, IconName } from './Icons';

interface AcademyMenuProps {
  onSelect: (moduleId: string) => void;
  onBack: () => void;
}

const MODULES = [
  {
    id: 'perceptron',
    title: 'The Perceptron',
    description: 'Understand the building block of all Neural Networks. Inputs, Weights, and Bias.',
    icon: 'Cpu',
    color: 'from-indigo-500 to-blue-500',
    difficulty: 'Basic'
  },
  {
    id: 'descent',
    title: 'Gradient Descent',
    description: 'Interactive physics sim. Learn how AI minimizes error to "learn" from data.',
    icon: 'Descent',
    color: 'from-amber-500 to-orange-500',
    difficulty: 'Core'
  },
  {
    id: 'overfitting',
    title: 'Fit & Complexity',
    description: 'The golden rule of ML: Generalization vs Memorization. Find the balance.',
    icon: 'Fit',
    color: 'from-purple-500 to-pink-500',
    difficulty: 'Concept'
  }
];

export const AcademyMenu: React.FC<AcademyMenuProps> = ({ onSelect, onBack }) => {
  return (
    <div className="w-full max-w-5xl mx-auto pt-10 px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Neural Academy</h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Interactive laboratories to visualize the mathematics of intelligence. 
            No code, just concepts.
          </p>
        </div>
        <button 
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-5 py-3 rounded-xl border border-slate-700 transition-colors flex items-center gap-2"
        >
          <Icons.ArrowLeft className="w-5 h-5" /> Main Menu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {MODULES.map((module) => {
          const Icon = Icons[module.icon as IconName] || Icons.Book;
          return (
            <button
              key={module.id}
              onClick={() => onSelect(module.id)}
              className="group relative flex flex-col items-start p-8 bg-slate-900 border border-slate-800 rounded-3xl hover:border-slate-600 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden text-left"
            >
              {/* Background gradient splash */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 blur-2xl rounded-full transform translate-x-10 -translate-y-10 transition-opacity`}></div>

              <div className={`p-4 rounded-2xl bg-gradient-to-br ${module.color} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                {module.title}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
                {module.description}
              </p>

              <div className="w-full flex items-center justify-between border-t border-slate-800 pt-4">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  {module.difficulty}
                </span>
                <span className="flex items-center gap-2 text-sm text-white font-bold group-hover:translate-x-1 transition-transform">
                  Enter Lab <Icons.ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
