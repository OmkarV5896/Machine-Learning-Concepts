
export enum GamePhase {
  MENU = 'MENU',
  DIFFICULTY_SELECT = 'DIFFICULTY_SELECT',
  LOADING_LEVEL = 'LOADING_LEVEL',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export enum Difficulty {
  BEGINNER = 'Junior Engineer',
  INTERMEDIATE = 'Senior Architect',
  ADVANCED = 'Lead Researcher',
  EXPERT = 'CTO'
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface FeatureItem {
  id: string;
  name: string;
  iconType: string;
  isRelevant: boolean;
  reason: string; // Why it's relevant or noise
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  isOptimal: boolean;
  reason: string;
}

export interface Mission {
  id: string;
  title: string;
  briefing: string;
  features: FeatureItem[];
  models: ModelOption[];
  difficulty: Difficulty;
  learningTip: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface PlayerStats {
  score: number;
  streak: number;
  completedMissions: number;
  level: number;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
