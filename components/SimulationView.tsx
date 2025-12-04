
import React, { useEffect, useState } from 'react';
import { Icons } from './Icons';

interface SimulationViewProps {
  successLevel: 'high' | 'medium' | 'low'; // high = perfect data + model, low = bad data
  onAnimationComplete: () => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({ successLevel, onAnimationComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentEpoch, setCurrentEpoch] = useState(0);
  const maxEpochs = 50;

  // Generate points based on success level
  const generatePoints = () => {
    let points = "0,100 ";
    const variance = successLevel === 'high' ? 5 : successLevel === 'medium' ? 20 : 50;
    const finalValue = successLevel === 'high' ? 10 : successLevel === 'medium' ? 40 : 80;

    for (let i = 1; i <= 50; i++) {
      const x = (i / 50) * 100 * 4; // Scale width to 400
      // Simulate loss curve
      const idealY = 100 - ((100 - finalValue) * (i / 50)); // Linear descent approx
      const noise = (Math.random() - 0.5) * variance;
      const y = Math.max(10, Math.min(140, idealY + noise));
      points += `${x},${y} `;
    }
    return points;
  };

  const [points] = useState(generatePoints());

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const interval = 60; // 60ms updates
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const p = Math.min(step / steps, 1);
      setProgress(p);
      setCurrentEpoch(Math.floor(p * maxEpochs));

      if (p >= 1) {
        clearInterval(timer);
        setTimeout(onAnimationComplete, 1000); // Wait 1s before finishing
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = () => {
    if (successLevel === 'high') return 'text-emerald-400';
    if (successLevel === 'medium') return 'text-amber-400';
    return 'text-red-400';
  };

  const getStatusText = () => {
    if (progress < 1) return 'TRAINING_IN_PROGRESS...';
    if (successLevel === 'high') return 'MODEL_CONVERGED';
    if (successLevel === 'medium') return 'SUBOPTIMAL_CONVERGENCE';
    return 'DIVERGENCE_DETECTED';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-900/50 rounded-3xl border border-slate-700 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-between items-center mb-4 font-mono text-sm">
          <span className="text-slate-400">EPOCH: <span className="text-white">{currentEpoch}/{maxEpochs}</span></span>
          <span className={`animate-pulse ${getStatusColor()}`}>{getStatusText()}</span>
        </div>

        {/* The Graph */}
        <div className="relative h-64 w-full bg-black/40 border border-slate-700 rounded-lg overflow-hidden shadow-inner">
           <svg viewBox="0 0 400 150" className="w-full h-full" preserveAspectRatio="none">
             {/* Axis Lines */}
             <line x1="0" y1="140" x2="400" y2="140" stroke="#334155" strokeWidth="1" />
             <line x1="10" y1="0" x2="10" y2="150" stroke="#334155" strokeWidth="1" />
             
             {/* Animated Path */}
             <defs>
               <clipPath id="clip-graph">
                 <rect x="0" y="0" width={400 * progress} height="150" />
               </clipPath>
               <linearGradient id="gradient-line" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="0%" stopColor={successLevel === 'low' ? '#ef4444' : '#10b981'} />
                 <stop offset="100%" stopColor={successLevel === 'low' ? '#7f1d1d' : '#059669'} />
               </linearGradient>
             </defs>

             <path 
               d={points} 
               fill="none" 
               stroke="url(#gradient-line)" 
               strokeWidth="3" 
               strokeLinecap="round"
               clipPath="url(#clip-graph)"
               className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
             />
           </svg>

           {/* Scanning Line */}
           <div 
             className="absolute top-0 bottom-0 w-[2px] bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
             style={{ left: `${progress * 100}%`, display: progress < 1 ? 'block' : 'none' }}
           ></div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
            <span className="text-xs text-slate-500 font-mono mb-1">ACCURACY</span>
            <span className={`text-xl font-bold ${progress < 1 ? 'text-slate-300' : getStatusColor()}`}>
              {Math.floor((successLevel === 'high' ? 98 : successLevel === 'medium' ? 75 : 45) * progress)}%
            </span>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
            <span className="text-xs text-slate-500 font-mono mb-1">LOSS</span>
            <span className={`text-xl font-bold ${progress < 1 ? 'text-slate-300' : successLevel === 'low' ? 'text-red-400' : 'text-emerald-400'}`}>
              {( (successLevel === 'high' ? 0.02 : 0.5) + (1-progress)).toFixed(3)}
            </span>
          </div>
          <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex flex-col items-center">
             <span className="text-xs text-slate-500 font-mono mb-1">COMPUTE</span>
             <Icons.Cpu className={`w-6 h-6 ${progress < 1 ? 'text-indigo-400 animate-spin' : 'text-slate-600'}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
