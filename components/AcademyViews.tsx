
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';

interface AcademyViewProps {
  moduleId: string;
  onExit: () => void;
}

// --- MODULE 1: THE PERCEPTRON ---
const PerceptronLab: React.FC = () => {
  const [input1, setInput1] = useState(0.5);
  const [input2, setInput2] = useState(0.5);
  const [weight1, setWeight1] = useState(1.0);
  const [weight2, setWeight2] = useState(0.5);
  const [bias, setBias] = useState(0);
  
  const weightedSum = (input1 * weight1) + (input2 * weight2) + bias;
  const activation = weightedSum > 1.5 ? 1 : 0; // Simple Step Function

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-indigo-400 mb-2 flex items-center gap-2">
          <Icons.Cpu className="w-5 h-5" /> The Perceptron
        </h3>
        <p className="text-slate-300 text-sm">
          A neuron decides to "fire" if the weighted inputs exceed a threshold. 
          Adjust inputs (signals) and weights (importance) to activate the core.
          <br/>
          <span className="text-xs font-mono text-slate-500 mt-2 block">GOAL: Make the Output Node turn GREEN (Output = 1). Threshold is 1.5.</span>
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 relative">
        {/* Visualization */}
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
          <svg className="w-full h-full overflow-visible">
            {/* Connections */}
            <line x1="50" y1="100" x2="200" y2="200" stroke={weight1 > 0 ? "#6366f1" : "#ef4444"} strokeWidth={Math.abs(weight1) * 8} strokeOpacity="0.6" />
            <line x1="50" y1="300" x2="200" y2="200" stroke={weight2 > 0 ? "#6366f1" : "#ef4444"} strokeWidth={Math.abs(weight2) * 8} strokeOpacity="0.6" />
            
            {/* Animated Pulses */}
            <circle r="4" fill="white">
              <animateMotion dur={`${2/Math.max(0.1, Math.abs(input1))}s`} repeatCount="indefinite" path="M50,100 L200,200" />
            </circle>
            <circle r="4" fill="white">
              <animateMotion dur={`${2/Math.max(0.1, Math.abs(input2))}s`} repeatCount="indefinite" path="M50,300 L200,200" />
            </circle>

            {/* Input Nodes */}
            <circle cx="50" cy="100" r="30" className="fill-slate-800 stroke-indigo-500 stroke-2" />
            <text x="50" y="105" textAnchor="middle" fill="white" fontSize="12">x1</text>
            <text x="50" y="140" textAnchor="middle" fill="#94a3b8" fontSize="10">{input1.toFixed(1)}</text>

            <circle cx="50" cy="300" r="30" className="fill-slate-800 stroke-indigo-500 stroke-2" />
            <text x="50" y="305" textAnchor="middle" fill="white" fontSize="12">x2</text>
            <text x="50" y="340" textAnchor="middle" fill="#94a3b8" fontSize="10">{input2.toFixed(1)}</text>

            {/* Neuron Core */}
            <circle cx="200" cy="200" r="45" className={`${activation ? 'fill-indigo-600 animate-pulse' : 'fill-slate-800'} stroke-white stroke-2 transition-colors duration-300`} />
            <text x="200" y="195" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SUM</text>
            <text x="200" y="215" textAnchor="middle" fill="white" fontSize="14">{weightedSum.toFixed(2)}</text>

            {/* Output Line */}
            <line x1="245" y1="200" x2="350" y2="200" stroke={activation ? "#10b981" : "#475569"} strokeWidth="4" />

            {/* Output Node */}
            <circle cx="350" cy="200" r="25" className={`${activation ? 'fill-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'fill-slate-700'} transition-all duration-300`} />
            <text x="350" y="205" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{activation}</text>
          </svg>
        </div>

        {/* Controls */}
        <div className="w-full max-w-xs space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>Input 1 (Value)</span>
              <span>{input1.toFixed(1)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={input1} onChange={e => setInput1(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>Weight 1 (Importance)</span>
              <span>{weight1.toFixed(1)}</span>
            </div>
            <input type="range" min="-1" max="2" step="0.1" value={weight1} onChange={e => setWeight1(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <div className="w-full h-[1px] bg-slate-700 my-4"></div>

          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>Input 2 (Value)</span>
              <span>{input2.toFixed(1)}</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={input2} onChange={e => setInput2(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
          </div>

           <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>Weight 2 (Importance)</span>
              <span>{weight2.toFixed(1)}</span>
            </div>
            <input type="range" min="-1" max="2" step="0.1" value={weight2} onChange={e => setWeight2(parseFloat(e.target.value))} className="w-full accent-blue-500" />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>Bias (Base Activation)</span>
              <span>{bias.toFixed(1)}</span>
            </div>
            <input type="range" min="-1" max="1" step="0.1" value={bias} onChange={e => setBias(parseFloat(e.target.value))} className="w-full accent-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MODULE 2: GRADIENT DESCENT ---
const DescentLab: React.FC = () => {
  const [learningRate, setLearningRate] = useState(0.1);
  const [position, setPosition] = useState(-0.9); // X position on parabola
  const [history, setHistory] = useState<number[]>([-0.9]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [steps, setSteps] = useState(0);

  // Parabola: y = x^2
  // Gradient: dy/dx = 2x
  // Update: x_new = x - (lr * 2x)

  const step = () => {
    const currentX = history[history.length - 1];
    const gradient = 2 * currentX;
    const nextX = currentX - (learningRate * gradient);
    
    // Bounds check to prevent infinite explosion visually
    if (Math.abs(nextX) > 2.5) {
      setIsPlaying(false);
      return;
    }

    setHistory(prev => [...prev, nextX]);
    setPosition(nextX);
    setSteps(s => s + 1);

    // Stop if converged
    if (Math.abs(gradient) < 0.01) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(step, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, history, learningRate]);

  const reset = () => {
    setPosition(-0.9);
    setHistory([-0.9]);
    setSteps(0);
    setIsPlaying(false);
  };

  // Coord helper
  const toCanvas = (x: number, y: number) => {
    // Canvas: 400x300. Center (200, 250). Scale 1 unit = 100px.
    return { cx: 200 + x * 100, cy: 250 - y * 100 };
  };

  // Generate Path for y=x^2
  const generateCurve = () => {
    let d = "";
    for (let x = -2; x <= 2; x += 0.1) {
      const { cx, cy } = toCanvas(x, x*x);
      d += `${x === -2 ? 'M' : 'L'}${cx},${cy} `;
    }
    return d;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">
          <Icons.Descent className="w-5 h-5" /> Gradient Descent
        </h3>
        <p className="text-slate-300 text-sm">
          Models learn by minimizing error (Loss). Imagine a ball trying to find the lowest point of a valley.
          <br/>
          <strong className="text-white">Learning Rate</strong> controls step size. Too small = slow. Too big = overshoots.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="relative w-[400px] h-[300px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
           <svg className="w-full h-full">
             <path d={generateCurve()} fill="none" stroke="#475569" strokeWidth="2" />
             
             {/* History Dots */}
             {history.map((h, i) => {
               const { cx, cy } = toCanvas(h, h*h);
               return <circle key={i} cx={cx} cy={cy} r="3" fill="#64748b" opacity="0.5" />;
             })}

             {/* The Ball */}
             {(() => {
               const { cx, cy } = toCanvas(position, position*position);
               return (
                 <g className="transition-all duration-500 ease-out" style={{ transform: `translate(${cx}px, ${cy}px)` }}>
                    {/* Use translate on group because cx/cy animation directly is jittery in React sometimes */}
                   <circle cx="0" cy="0" r="10" fill="#f59e0b" className="shadow-[0_0_15px_rgba(245,158,11,0.6)]" />
                 </g>
               );
             })()}
           </svg>
           <div className="absolute top-4 right-4 text-xs font-mono text-slate-500">
             STEPS: {steps}<br/>
             LOSS: {(position * position).toFixed(4)}
           </div>
        </div>

        <div className="w-full max-w-xs space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>Learning Rate (Step Size)</span>
              <span>{learningRate.toFixed(2)}</span>
            </div>
            <input 
              type="range" min="0.05" max="1.1" step="0.05" 
              value={learningRate} 
              onChange={e => {
                setLearningRate(parseFloat(e.target.value));
                reset();
              }} 
              className="w-full accent-amber-500" 
            />
            <div className="text-[10px] text-slate-500 mt-2">
              {learningRate < 0.2 ? "Slow convergence" : learningRate > 0.9 ? "Warning: Might explode!" : "Balanced"}
            </div>
          </div>

          <div className="flex gap-4">
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className={`flex-1 py-3 rounded-lg font-bold text-sm transition-colors ${isPlaying ? 'bg-slate-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-black'}`}
             >
               {isPlaying ? 'PAUSE' : 'START TRAINING'}
             </button>
             <button onClick={reset} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-white">
               <Icons.RefreshCw className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MODULE 3: OVERFITTING ---
const OverfittingLab: React.FC = () => {
  const [complexity, setComplexity] = useState(2); // 1 = Line, 5 = Crazy
  
  // Noisy data roughly following a quadratic curve
  const dataPoints = [
    {x: 10, y: 250}, {x: 50, y: 200}, {x: 100, y: 150}, {x: 150, y: 100}, 
    {x: 200, y: 120}, {x: 250, y: 80}, {x: 300, y: 90}, {x: 350, y: 40}
  ];

  // Generate path based on complexity
  const generateFit = () => {
    if (complexity === 1) {
      // Underfit: Straight line
      return "M0,260 L400,30";
    } else if (complexity === 3) {
      // Good fit: Smooth curve
      return "M0,260 Q150,220 200,120 T400,40";
    } else {
      // Overfit: Connects every dot frantically
      let d = `M${dataPoints[0].x},${dataPoints[0].y} `;
      for(let i=1; i<dataPoints.length; i++) {
        d += `L${dataPoints[i].x},${dataPoints[i].y} `;
      }
      return d;
    }
  };

  const getStatus = () => {
    if (complexity === 1) return { text: "UNDERFITTING", color: "text-red-400", desc: "Model is too simple. It misses the pattern." };
    if (complexity === 3) return { text: "OPTIMAL FIT", color: "text-emerald-400", desc: "Captures the trend, ignores the noise." };
    return { text: "OVERFITTING", color: "text-purple-400", desc: "Memorizing noise. Fails on new data." };
  };

  const status = getStatus();

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center gap-2">
          <Icons.Fit className="w-5 h-5" /> Model Complexity
        </h3>
        <p className="text-slate-300 text-sm">
          A good model finds the signal (trend) and ignores the noise (randomness). 
          <br/>
          Adjust the <strong>Polynomial Degree</strong> to see how complexity affects generalization.
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12">
        <div className="relative w-[400px] h-[300px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <svg className="w-full h-full">
             {/* Data Points */}
             {dataPoints.map((p, i) => (
               <circle key={i} cx={p.x} cy={p.y} r="4" fill="#94a3b8" />
             ))}

             {/* The Fit Line */}
             <path 
               d={generateFit()} 
               fill="none" 
               stroke={complexity === 1 ? '#f87171' : complexity === 3 ? '#34d399' : '#a78bfa'} 
               strokeWidth="3" 
               className="transition-all duration-500 ease-in-out"
             />
          </svg>
          <div className="absolute top-4 left-4 bg-slate-900/80 p-2 rounded border border-slate-700 text-xs font-mono">
             STATUS: <span className={status.color}>{status.text}</span>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-6 bg-slate-900 p-6 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1 text-slate-400">
              <span>Model Complexity</span>
              <span>Level {complexity}</span>
            </div>
            <input 
              type="range" min="1" max="5" step="2" 
              value={complexity} 
              onChange={e => setComplexity(parseInt(e.target.value))} 
              className="w-full accent-purple-500" 
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-2 px-1">
              <span>Simple</span>
              <span>Balanced</span>
              <span>Complex</span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg bg-slate-800 border ${complexity === 1 ? 'border-red-900' : complexity === 3 ? 'border-emerald-900' : 'border-purple-900'}`}>
             <p className="text-sm text-slate-300">{status.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN WRAPPER ---
export const AcademyViews: React.FC<AcademyViewProps> = ({ moduleId, onExit }) => {
  const renderModule = () => {
    switch (moduleId) {
      case 'perceptron': return <PerceptronLab />;
      case 'descent': return <DescentLab />;
      case 'overfitting': return <OverfittingLab />;
      default: return <div>Module not found</div>;
    }
  };

  return (
    <div className="w-full h-full max-w-5xl mx-auto flex flex-col p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <Icons.ArrowLeft className="w-5 h-5" /> Back to Academy
        </button>
        <div className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">
          INTERACTIVE SESSION
        </div>
      </div>
      
      <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-2xl overflow-hidden">
         {renderModule()}
      </div>
    </div>
  );
};
