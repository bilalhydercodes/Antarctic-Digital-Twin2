import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Compass, 
  Mountain, 
  Box, 
  Zap, 
  AlertTriangle, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSwitchStation: (stationId: 'maitri' | 'bharati') => void;
}

interface TourStep {
  stepNumber: number;
  title: string;
  tag: string;
  badgeColor: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  whyItMatters: string;
  tryItAction?: {
    label: string;
    action: () => void;
  };
  highlightTip: string;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onSwitchStation
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps: TourStep[] = [
    {
      stepNumber: 1,
      title: 'Welcome to Antarctica',
      tag: 'THE MISSION',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <Mountain className="w-8 h-8 text-sky-500" />,
      headline: 'India’s National Polar Research Digital Twin',
      description: 'Antarctica is the coldest (-89.2°C) and most isolated continent on Earth. India operates two year-round permanent scientific stations: Maitri (commissioned 1988) and Bharati (commissioned 2012).',
      whyItMatters: 'A "Digital Twin" is a live, computerized replica of these stations that mirrors life-support, power generators, heating, and weather so scientists in Antarctica and mission control in Goa, India can prevent equipment failure before it happens.',
      tryItAction: {
        label: 'Go to Command Center',
        action: () => {
          onNavigateTab('dashboard');
        }
      },
      highlightTip: '💡 You have full access to both stations, 3D models, live weather, and emergency simulators!'
    },
    {
      stepNumber: 2,
      title: 'Two Distinct Stations',
      tag: 'EXPLORE STATIONS',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      icon: <Compass className="w-8 h-8 text-cyan-600" />,
      headline: 'Switch Between Maitri & Bharati Anytime',
      description: 'Look at the top header bar. You can switch between Maitri (1988) and Bharati (2012) with a single click.',
      whyItMatters: '• Maitri is nestled inland in the Schirmacher Oasis among rocky hills.\n• Bharati is a futuristic, aerodynamically elevated base built from 134 ISO containers on the Larsemann Hills coast.',
      tryItAction: {
        label: 'Switch to Bharati Station',
        action: () => {
          onSwitchStation('bharati');
          onNavigateTab('dashboard');
        }
      },
      highlightTip: '💡 Notice how weather and power statistics update immediately when switching stations.'
    },
    {
      stepNumber: 3,
      title: '3D Interactive Base',
      tag: 'VISUAL TWIN',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: <Box className="w-8 h-8 text-indigo-600" />,
      headline: 'Walk Through Real Polar Buildings in 3D',
      description: 'Explore the architectural layout of the stations. You can rotate 360°, zoom in to living quarters, medical bays, labs, fuel tanks, and generator rooms.',
      whyItMatters: 'If a storm damages an external antenna or fuel line, engineers in India use this exact 3D layout to guide technicians on the ice.',
      tryItAction: {
        label: 'Open Full 3D Digital Twin',
        action: () => {
          onNavigateTab('twin');
          onClose();
        }
      },
      highlightTip: '💡 Click and drag anywhere on the 3D model to rotate. Use your mouse scroll wheel to zoom in!'
    },
    {
      stepNumber: 4,
      title: 'Life Support & Power Grid',
      tag: 'SURVIVAL TECH',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      headline: 'Generating Heat & Electricity in -89°C',
      description: 'The station runs on a hybrid microgrid combining clean solar panels, wind turbines, and polar-grade diesel generators. Waste heat from generator exhaust is recycled to melt snow for fresh water and warm indoor radiators.',
      whyItMatters: 'Watch the "Fuel Reserves Autonomy" metric. Stations keep over 45 days of emergency fuel reserve to survive when supply ships cannot reach them in winter.',
      tryItAction: {
        label: 'View Power Grid & Fuel',
        action: () => {
          onNavigateTab('energy');
          onClose();
        }
      },
      highlightTip: '💡 If outside temperature drops to -40°C, heat demand surges automatically.'
    },
    {
      stepNumber: 5,
      title: 'Emergency Failover & Blizzards',
      tag: 'CRISIS TEST',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <AlertTriangle className="w-8 h-8 text-rose-500" />,
      headline: 'Safe Crisis Testing in the Digital Twin',
      description: 'What happens if a 140 km/h blizzard knocks out solar arrays or the primary generator overheats? The Digital Twin simulates real-time crisis scenarios.',
      whyItMatters: 'You can watch the automated AI load-shedder instantly cut non-essential power (like saunas and laundry) to keep the life-support heaters online.',
      tryItAction: {
        label: 'Open Scenario Lab',
        action: () => {
          onNavigateTab('scenarios');
          onClose();
        }
      },
      highlightTip: '💡 You can trigger a polar blizzard in Scenario Lab or click "RUN DEMO" in the top bar to watch a crisis unfold!'
    },
    {
      stepNumber: 6,
      title: 'FrostByte AI Copilot',
      tag: 'AI ASSISTANT',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <Bot className="w-8 h-8 text-emerald-600" />,
      headline: 'Ask Any Question in Plain English',
      description: 'Have a question about the polar base? FrostByte AI is trained on Antarctic operations and station telemetry.',
      whyItMatters: 'You do not need to be an engineer or polar scientist. Just type things like "How do scientists get water?", "Is generator 1 healthy?", or "What is the temperature today?".',
      tryItAction: {
        label: 'Chat with FrostByte AI',
        action: () => {
          onNavigateTab('assistant');
          onClose();
        }
      },
      highlightTip: '💡 Click "VOICE SITREP" in the top bar to hear the AI speak a live situation briefing!'
    }
  ];

  const step = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 font-sans select-none">
      <div className="relative w-full max-w-2xl bg-white border border-[#e5e3dc] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                  Quick Explorer Tour
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Step {currentStep + 1} of {tourSteps.length}
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white">
                How to Understand the Antarctic Digital Twin
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            title="Close Tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 flex">
          {tourSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Main Step Content Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Step Badge & Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                {step.icon}
              </div>
              <div>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${step.badgeColor}`}>
                  {step.tag}
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-1">
                  {step.headline}
                </h3>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p className="font-normal whitespace-pre-line">
              {step.description}
            </p>
            
            <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs text-sky-950 space-y-1">
              <div className="font-bold uppercase tracking-wider text-[10px] text-sky-800">
                Why this matters:
              </div>
              <p className="leading-normal font-medium whitespace-pre-line">
                {step.whyItMatters}
              </p>
            </div>

            {/* Quick Action button for this step if available */}
            {step.tryItAction && (
              <div className="pt-1 flex items-center justify-between">
                <button
                  onClick={step.tryItAction.action}
                  className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs shadow-sm transition"
                >
                  <span>{step.tryItAction.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>

                <span className="text-[11px] text-stone-500 font-medium">
                  {step.highlightTip}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="px-6 py-4 bg-[#f8f7f4] border-t border-[#e5e3dc] flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold transition ${
              currentStep === 0
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Step Indicator Dots */}
          <div className="flex items-center space-x-1.5">
            {tourSteps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep ? 'bg-blue-600 w-6' : 'bg-stone-300 hover:bg-stone-400'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-900 transition"
            >
              Skip Tour
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition"
            >
              <span>{currentStep === tourSteps.length - 1 ? 'Finish & Explore' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
