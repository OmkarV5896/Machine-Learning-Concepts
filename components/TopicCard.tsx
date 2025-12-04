import React from 'react';
import { Topic } from '../types';
import { Icons } from './Icons';

interface TopicCardProps {
  topic: Topic;
  onSelect: (topic: Topic) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onSelect }) => {
  const IconComponent = topic.id === 'supervised' ? Icons.Target :
                        topic.id === 'unsupervised' ? Icons.ScatterChart :
                        topic.id === 'neural-nets' ? Icons.Network : Icons.Bot;

  return (
    <button
      onClick={() => onSelect(topic)}
      className="group relative flex flex-col items-start p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-900/10 hover:-translate-y-1 text-left w-full h-full overflow-hidden"
    >
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
         <IconComponent className="w-24 h-24 text-white" />
      </div>
      
      <div className={`p-3 rounded-lg bg-gradient-to-br ${topic.color} mb-4 shadow-lg`}>
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-wide">
        {topic.name}
      </h3>
      
      <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
        {topic.description}
      </p>

      <div className="w-full pt-4 border-t border-slate-800 group-hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 group-hover:text-indigo-400">
          <span>STATUS: READY</span>
          <span className="flex items-center gap-1">
            INITIATE <Icons.ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </button>
  );
};