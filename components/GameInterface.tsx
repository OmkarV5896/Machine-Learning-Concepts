import React, { useState, useEffect } from 'react';
import { Mission, Difficulty, FeatureItem, ModelOption } from '../types';
import { Icons, IconName } from './Icons';
import { SimulationView } from './SimulationView';

interface GameInterfaceProps {
  scenario: Mission;
  currentDifficulty: Difficulty;
  onComplete: (scoreChange: number, isSuccess: boolean) => void;
  onNext: () => void;
  onExit: () => void;
}

const getIcon = (type: string) => {
  const map: Record<string, any> = {
    'User': Icons.User,
    'Money': Icons.Money,
    'Location': Icons.Location,
    'Date': Icons.Date,
    'Image': Icons.Image,
    'FileText': Icons.FileText,
    'Activity': Icons.Activity,
    'Zap': Icons.Zap,
    'Book': Icons.Book
  };
  return map[type] || Icons.Database;
};

export const GameInterface: React.FC<GameInterfaceProps> = ({ 
  scenario: mission, 
  currentDifficulty, 
  onComplete, 
  onNext,
  onExit
}) => {
  const [phase, setPhase] = useState<'BRIEFING' | 'DATA_SELECT' | 'MODEL_SELECT' | 'SIMULATION' | 'RESULTS'>('BRIEFING');
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<'high' | 'medium' | 'low'>('medium');

  const calculateResult = () => {
    const correctFeatures = mission.features.filter(f => f.isRelevant).map(f => f.id);
    const selectedCorrect = correctFeatures.filter(id => selectedFeatures.has(id)).length;
    const selectedWrong = selectedFeatures.size - selectedCorrect;
    
    const model = mission.models.find(m => m.id === selectedModel);
    const isModelOptimal = model?.isOptimal || false;

    if (selectedCorrect === 3 && selectedWrong === 0 && isModelOptimal) return 'high';
    if (selectedCorrect >= 2 && selectedWrong <= 1 && isModelOptimal) return 'medium';
    if (selectedCorrect >= 2 && !isModelOptimal) return 'medium';
    return 'low';
  };

  const handleDataSubmit = () => {
    setPhase('MODEL_SELECT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModelSubmit = (modelId: string) => {
    setSelectedModel(modelId);
    setPhase('SIMULATION');
  };

  useEffect(() => {
    if (phase === 'SIMULATION') {
      const result = calculateResult();
      setSimulationResult(result);
    }
  }, [phase]);

  const finishSimulation = () => {
    const result = simulationResult;
    let score = 0;
    if (result === 'high') score = 100;
    else if (result === 'medium') score = 50;
    else score = 10;
    
    onComplete(score, result === 'high');
    setPhase('RESULTS');
  };

  const toggleFeature = (id: string) => {
    const next = new Set(selectedFeatures);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedFeatures(next);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-full min-h-[calc(100vh-100px)] pb-20 md:pb-0">
      
      {/* Header HUD - Responsive */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-slate-900/90 backdrop-blur p-4 rounded-2xl border border-slate-700 sticky top-16 md:top-0 z-30">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start mb-4 md:mb-0">
          <div className="flex items-center gap-4">
            <button onClick={onExit} className="text-slate-400 hover:text-white p-1"><Icons.X /></button>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">MISSION</div>
              <div className="text-sm font-bold text-white max-w-[150px] md:max-w-none truncate">{mission.title}</div>
            </div>
          </div>
          {/* Mobile Phase Indicator */}
          <div className="md:hidden text-xs font-mono font-bold text-indigo-400">
            {phase === 'BRIEFING' && 'BRIEF'}
            {phase === 'DATA_SELECT' && '1. DATA'}
            {phase === 'MODEL_SELECT' && '2. MODEL'}
            {phase === 'SIMULATION' && '3. TEST'}
            {phase === 'RESULTS' && 'DONE'}
          </div>
        </div>

        {/* Desktop Phase Indicator */}
        <div className="hidden md:flex items-center gap-6">
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            phase === 'DATA_SELECT' ? 'bg-indigo-500 text-white' : 'text-slate-600'
          }`}>1. DATA</div>
          <div className="w-8 h-[1px] bg-slate-700"></div>
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            phase === 'MODEL_SELECT' ? 'bg-indigo-500 text-white' : 'text-slate-600'
          }`}>2. MODEL</div>
          <div className="w-8 h-[1px] bg-slate-700"></div>
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
            phase === 'SIMULATION' ? 'bg-indigo-500 text-white' : 'text-slate-600'
          }`}>3. TEST</div>
        </div>
      </div>

      {/* BRIEFING PHASE */}
      {phase === 'BRIEFING' && (
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 px-2">
           <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
             <Icons.Target className="w-12 h-12 text-indigo-500 mb-6" />
             <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Incoming Contract</h1>
             <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8">{mission.briefing}</p>
             <button 
               onClick={() => setPhase('DATA_SELECT')}
               className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
             >
               ACCEPT MISSION <Icons.ChevronRight />
             </button>
           </div>
        </div>
      )}

      {/* DATA PHASE */}
      {phase === 'DATA_SELECT' && (
        <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Select Data</h2>
            <p className="text-slate-400 text-sm md:text-base">Tap 3 relevant signals. Ignore noise.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-24 md:mb-8">
            {mission.features.map(feature => {
              const Icon = getIcon(feature.iconType);
              const isSelected = selectedFeatures.has(feature.id);
              return (
                <button
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`p-4 md:p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all duration-200 group relative overflow-hidden active:scale-95 ${
                    isSelected 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)]' 
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <div className={`p-3 md:p-4 rounded-full ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <span className={`font-mono text-sm md:text-base font-bold text-center leading-tight ${isSelected ? 'text-white' : 'text-slate-400'}`}>{feature.name}</span>
                  {isSelected && <div className="absolute top-2 right-2 text-indigo-400"><Icons.Check className="w-5 h-5" /></div>}
                </button>
              );
            })}
          </div>
          
          <div className="fixed md:static bottom-6 left-0 right-0 p-4 md:p-0 flex justify-center z-40 bg-gradient-to-t from-slate-950 md:bg-none">
             <button
               onClick={handleDataSubmit}
               disabled={selectedFeatures.size === 0}
               className="w-full md:w-auto px-12 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95"
             >
               CONFIRM SELECTION ({selectedFeatures.size})
             </button>
          </div>
        </div>
      )}

      {/* MODEL PHASE */}
      {phase === 'MODEL_SELECT' && (
        <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-500">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Choose Model</h2>
            <p className="text-slate-400">Select the architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto w-full mb-8">
            {mission.models.map(model => (
              <button
                key={model.id}
                onClick={() => handleModelSubmit(model.id)}
                className="group relative bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-3xl p-6 md:p-8 text-left transition-all active:scale-95 active:bg-slate-700"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Icons.Layers className="w-24 h-24 md:w-32 md:h-32" />
                </div>
                <div className="relative z-10">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 md:mb-6 border border-slate-700">
                    <Icons.Cpu className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">{model.name}</h3>
                  <p className="text-slate-400 text-sm md:text-base leading-relaxed">{model.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SIMULATION & RESULTS */}
      {(phase === 'SIMULATION' || phase === 'RESULTS') && (
        <div className="flex-1 animate-in zoom-in-95 duration-500 relative min-h-[400px]">
          <SimulationView 
            successLevel={simulationResult} 
            onAnimationComplete={finishSimulation} 
          />
          
          {phase === 'RESULTS' && (
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500 z-50 p-4">
                <div className="bg-slate-900 border border-slate-700 p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl">
                   <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 rounded-full ${simulationResult === 'high' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'}`}>
                         {simulationResult === 'high' ? <Icons.Trophy className="w-8 h-8" /> : <Icons.Alert className="w-8 h-8" />}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          {simulationResult === 'high' ? 'SUCCESS' : 'OPTIMIZE'}
                        </h2>
                        <span className="text-slate-400 text-sm font-mono">
                          {simulationResult === 'high' ? '+100 CREDITS' : 'PARTIAL CREDIT'}
                        </span>
                      </div>
                   </div>
                   
                   <div className="bg-indigo-900/20 p-4 rounded-xl border border-indigo-500/30 mb-6">
                      <h4 className="text-indigo-300 font-bold mb-1 text-sm uppercase flex items-center gap-2">
                        <Icons.Bot className="w-4 h-4" /> Insight
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{mission.learningTip}</p>
                   </div>

                   <div className="space-y-3 mb-8 max-h-[150px] overflow-y-auto">
                      <p className="text-sm font-bold text-slate-500 uppercase">System Audit</p>
                      {mission.features.map(f => (
                         (f.isRelevant && !selectedFeatures.has(f.id)) ? (
                           <div key={f.id} className="text-xs text-amber-400 flex items-center gap-2">
                             <Icons.Alert className="w-3 h-3 flex-shrink-0" /> Missed: {f.name}
                           </div>
                         ) : (!f.isRelevant && selectedFeatures.has(f.id)) ? (
                           <div key={f.id} className="text-xs text-red-400 flex items-center gap-2">
                             <Icons.X className="w-3 h-3 flex-shrink-0" /> Noise: {f.name}
                           </div>
                         ) : null
                      ))}
                      {mission.models.find(m => m.id === selectedModel && !m.isOptimal) && (
                         <div className="text-xs text-amber-400 flex items-center gap-2">
                            <Icons.Alert className="w-3 h-3 flex-shrink-0" /> Wrong Model: {mission.models.find(m => m.id === selectedModel)?.reason}
                         </div>
                      )}
                   </div>

                   <button onClick={onNext} className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-transform">
                     NEXT MISSION
                   </button>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};