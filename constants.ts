
import { Topic, Difficulty } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'supervised',
    name: 'Prediction Systems',
    description: 'Build regression and classification models for finance, healthcare, and sales.',
    icon: 'target',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'unsupervised',
    name: 'Pattern Discovery',
    description: 'Uncover hidden structures in customer data using clustering and dimensionality reduction.',
    icon: 'scatter-chart',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'neural-nets',
    name: 'Deep Learning Labs',
    description: 'Architect neural networks for complex vision and language tasks.',
    icon: 'network',
    color: 'from-emerald-500 to-green-500'
  },
  {
    id: 'rl',
    name: 'Autonomous Agents',
    description: 'Train agents to make decisions in dynamic environments like robotics and games.',
    icon: 'bot',
    color: 'from-orange-500 to-red-500'
  }
];

export const INITIAL_STATS = {
  score: 0,
  streak: 0,
  completedMissions: 0,
  level: 1
};

export const DIFFICULTY_LEVELS = [
  Difficulty.BEGINNER,
  Difficulty.INTERMEDIATE,
  Difficulty.ADVANCED,
  Difficulty.EXPERT
];

export const DIFFICULTY_META: Record<Difficulty, { label: string; multiplier: number; desc: string; icon: string; color: string }> = {
  [Difficulty.BEGINNER]: { 
    label: 'Junior', 
    multiplier: 1.0, 
    desc: 'Guided missions. Clear distinctions between useful data and noise.', 
    icon: 'User',
    color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10'
  },
  [Difficulty.INTERMEDIATE]: { 
    label: 'Senior', 
    multiplier: 1.5, 
    desc: 'Complex scenarios. Some features look relevant but are tricky distractors.', 
    icon: 'Medal',
    color: 'text-blue-400 border-blue-500/50 bg-blue-500/10'
  },
  [Difficulty.ADVANCED]: { 
    label: 'Lead', 
    multiplier: 2.5, 
    desc: 'Ambiguous data. Trade-offs required between accuracy and efficiency.', 
    icon: 'Shield',
    color: 'text-purple-400 border-purple-500/50 bg-purple-500/10'
  },
  [Difficulty.EXPERT]: { 
    label: 'CTO', 
    multiplier: 5.0, 
    desc: 'High stakes. Unforgiving optimization. Perfect architectural choices only.', 
    icon: 'Crown',
    color: 'text-amber-400 border-amber-500/50 bg-amber-500/10'
  }
};
