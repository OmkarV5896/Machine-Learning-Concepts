
import React, { useState, useEffect } from 'react';
import { Icons } from './components/Icons';
import { GamePhase, Topic, Mission, Difficulty, PlayerStats } from './types';
import { TOPICS, INITIAL_STATS, DIFFICULTY_LEVELS, DIFFICULTY_META } from './constants';
import { generateMission, initializeTutorChat } from './services/geminiService';
import { TopicCard } from './components/TopicCard';
import { DifficultySelect } from './components/DifficultySelect';
import { GameInterface } from './components/GameInterface';
import { ChatTutor } from './components/ChatTutor';
import { AcademyMenu } from './components/AcademyMenu';
import { AcademyViews } from './components/AcademyViews';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.MENU);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Academy State
  const [academyModuleId, setAcademyModuleId] = useState<string | null>(null);

  // Initialize tutor when topic changes
  useEffect(() => {
    if (selectedTopic) {
      initializeTutorChat(selectedTopic.name);
    } else if (phase === GamePhase.ACADEMY) {
      initializeTutorChat("Machine Learning Fundamentals");
    }
  }, [selectedTopic, phase]);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setPhase(GamePhase.DIFFICULTY_SELECT);
  };

  const handleDifficultySelect = async (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setPhase(GamePhase.LOADING_LEVEL);
    setLoadingError(null);
    if (selectedTopic) {
      await loadNextMission(selectedTopic, difficulty);
    }
  };

  const loadNextMission = async (topic: Topic, difficulty: Difficulty) => {
    try {
      setPhase(GamePhase.LOADING_LEVEL);
      const mission = await generateMission(topic.name, difficulty);
      setCurrentMission(mission);
      setPhase(GamePhase.PLAYING);
    } catch (err) {
      console.error("Failed to load scenario", err);
      setLoadingError("Connection interrupted. The AI core is unresponsive.");
      setPhase(GamePhase.MENU);
    }
  };

  const handleMissionComplete = (baseScore: number, isSuccess: boolean) => {
    const multiplier = DIFFICULTY_META[selectedDifficulty].multiplier;
    const finalScore = Math.round(baseScore * multiplier);
    
    setStats(prev => ({
      ...prev,
      score: prev.score + finalScore,
      streak: isSuccess ? prev.streak + 1 : 0,
      completedMissions: prev.completedMissions + 1
    }));
  };

  const handleNextLevel = () => {
    if (selectedTopic) {
      loadNextMission(selectedTopic, selectedDifficulty);
    }
  };

  const handleExit = () => {
    setPhase(GamePhase.MENU);
    setSelectedTopic(null);
    setStats(INITIAL_STATS);
    setIsChatOpen(false);
    setAcademyModuleId(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px]" />
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black_40%,transparent_100%)] z-0"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleExit}>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 group-hover:border-indigo-500 transition-colors">
                <Icons.Brain className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="font-bold text-lg tracking-tight font-mono">NEURAL<span className="text-indigo-400">ARCHITECT</span>_</span>
            </div>
            
            <div className="flex items-center gap-6">
              {phase === GamePhase.PLAYING && (
                <div className="hidden md:flex items-center gap-6 text-sm font-mono border-l border-slate-800 pl-6">
                  <div className="flex items-center gap-2">
                    <Icons.Trophy className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">CREDITS: {stats.score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icons.Zap className={`w-4 h-4 ${stats.streak > 1 ? 'text-amber-500 animate-pulse' : 'text-slate-600'}`} />
                    <span className="text-slate-400">STREAK: {stats.streak}</span>
                  </div>
                   <div className="flex items-center gap-2 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 text-xs">LEVEL: {DIFFICULTY_META[selectedDifficulty].label.toUpperCase()}</span>
                  </div>
                </div>
              )}
              
              {(phase === GamePhase.PLAYING || phase === GamePhase.ACADEMY) && (
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 rounded text-indigo-300 text-xs font-mono transition-colors"
                >
                  <Icons.MessageSquare className="w-4 h-4" />
                  MENTOR_LINK
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full">
          {phase === GamePhase.MENU && (
            <div className="px-6 py-8 space-y-8 animate-in fade-in duration-700 pt-10">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-indigo-400">
                  SYSTEM VERSION 3.1 // ACADEMY ONLINE
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white">
                  Build the Intelligence
                </h1>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
                  Select a domain to start a mission, or enter the Academy to master the core concepts interactively.
                </p>
                
                <div className="flex justify-center gap-4">
                   <button 
                     onClick={() => setPhase(GamePhase.ACADEMY)}
                     className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold border border-slate-700 flex items-center gap-3 transition-all hover:-translate-y-1 shadow-lg"
                   >
                     <Icons.Academy className="w-5 h-5 text-indigo-400" />
                     ENTER ACADEMY
                   </button>
                </div>

                {loadingError && (
                   <div className="mt-8 p-4 bg-red-950/30 border border-red-500/30 text-red-300 rounded-lg text-sm font-mono">
                     ERROR: {loadingError}
                   </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-white px-2 mb-4 border-b border-slate-800 pb-2">Active Contracts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TOPICS.map((topic) => (
                  <TopicCard 
                    key={topic.id} 
                    topic={topic} 
                    onSelect={handleTopicSelect} 
                  />
                ))}
              </div>
            </div>
          )}

          {phase === GamePhase.ACADEMY && !academyModuleId && (
            <AcademyMenu 
              onSelect={(id) => setAcademyModuleId(id)} 
              onBack={() => setPhase(GamePhase.MENU)}
            />
          )}

          {phase === GamePhase.ACADEMY && academyModuleId && (
            <AcademyViews 
              moduleId={academyModuleId}
              onExit={() => setAcademyModuleId(null)}
            />
          )}

          {phase === GamePhase.DIFFICULTY_SELECT && (
            <div className="px-6 py-8">
              <DifficultySelect 
                onSelect={handleDifficultySelect}
                onBack={() => setPhase(GamePhase.MENU)}
              />
            </div>
          )}

          {phase === GamePhase.LOADING_LEVEL && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-300">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-2 border-slate-800 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-full animate-pulse border border-indigo-500/30"></div>
                </div>
              </div>
              <h2 className="text-xl font-mono text-indigo-400 animate-pulse uppercase tracking-widest">Generating Mission_</h2>
              <div className="flex flex-col items-center mt-4 space-y-1">
                <p className="text-slate-600 text-xs font-mono">FETCHING CLIENT SPECS FOR: {selectedTopic?.name.toUpperCase()}</p>
                <p className="text-slate-600 text-xs font-mono">COMPILING DATASETS...</p>
              </div>
            </div>
          )}

          {phase === GamePhase.PLAYING && currentMission && (
            <div className="px-6 py-8 animate-in slide-in-from-right-4 duration-500">
              <GameInterface 
                scenario={currentMission}
                currentDifficulty={selectedDifficulty}
                onComplete={handleMissionComplete}
                onNext={handleNextLevel}
                onExit={handleExit}
              />
            </div>
          )}
        </main>
      </div>

      {/* Tutor Chat Side Panel */}
      <ChatTutor 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        currentTopic={phase === GamePhase.ACADEMY ? (academyModuleId ? `Interactive Lab: ${academyModuleId}` : 'Academy') : (selectedTopic?.name || '')}
      />
    </div>
  );
}
