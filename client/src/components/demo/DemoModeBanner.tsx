import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { X } from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { demoStep, stopDemo, simulationState } = useSimulation();

  if (!simulationState.demoModeActive || !demoStep) return null;

  const totalSteps = demoStep.totalSteps || 14;
  const badge = demoStep.badge || 'INFO';
  const headline = demoStep.headline || demoStep.title || 'Demo Step';
  const subtext = demoStep.subtext || demoStep.description || '';
  const activeComponent = demoStep.activeComponent || 'Station Subsystem';

  const getBadgeStyle = (b: string) => {
    switch (b) {
      case 'WARNING':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'CRITICAL':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'AUTOMATED_RESPONSE':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'AI_ADVICE':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      default:
        return 'bg-blue-950 text-blue-300 border-blue-800';
    }
  };

  const progressPercent = (demoStep.stepIndex / totalSteps) * 100;

  return (
    <div className="bg-charcoal-900 border-b border-charcoal-800 px-4 py-2 font-mono text-xs relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-blue-400 bg-charcoal-950 px-2 py-0.5 rounded border border-charcoal-800">
            DEMO SEQUENCE • STEP {demoStep.stepIndex}/{totalSteps}
          </span>
          
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeStyle(badge)}`}>
            {badge.replace('_', ' ')}
          </span>

          <span className="font-bold text-slate-100">{headline}</span>
          {subtext && <span className="hidden md:inline text-slate-400 text-[11px]">— {subtext}</span>}
        </div>

        <div className="flex items-center space-x-3">
          <span className="hidden lg:inline text-[10px] text-slate-400">Target: {activeComponent}</span>
          <button
            onClick={stopDemo}
            className="p-1 rounded bg-charcoal-800 hover:bg-charcoal-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="w-full bg-charcoal-950 h-0.5 mt-1.5 rounded overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
