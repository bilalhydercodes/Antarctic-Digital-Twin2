import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

export interface PageExplainerData {
  title: string;
  badge?: string;
  summary: string;
  whyItMatters: string;
  quickTips: string[];
}

const EXPLAINER_CONTENT: Record<string, PageExplainerData> = {
  dashboard: {
    title: 'Command Center & Mission Control',
    badge: 'START HERE',
    summary: 'This is the main cockpit of the Antarctic station. It shows real-time life support: electricity consumption, outside blizzard temperature, and how many days of heating fuel remain before resupply is needed.',
    whyItMatters: 'Antarctica is the coldest, windiest place on Earth (-89.2°C). Without continuous power and heat, station indoor temperatures would plunge below freezing in under 3 hours.',
    quickTips: [
      'Switch between Maitri (1988 inland station) and Bharati (2012 modern coastal station) in the top bar.',
      'Click "3D Digital Twin View" to inspect the station buildings and container architecture.',
      'Notice the Fuel Storage: 46+ days of fuel ensures safety through the harsh polar winter.'
    ]
  },
  twin: {
    title: '3D Interactive Digital Twin',
    badge: '3D MODEL',
    summary: 'A 3D virtual copy of the physical research station in Antarctica. You can rotate, zoom, and inspect living modules, generator rooms, fuel tanks, and solar panels in real time.',
    whyItMatters: 'Engineers in India (NCPOR Goa) use this 3D model to inspect equipment health and plan maintenance without flying 11,000 km through polar blizzards.',
    quickTips: [
      'Click and drag with your mouse to rotate the station 360 degrees.',
      'Scroll to zoom in close to individual modules and container pods.',
      'Click on buildings to see live power consumption and room temperatures.'
    ]
  },
  energy: {
    title: 'Power Grid & Fuel Storage',
    badge: 'LIFE SUPPORT',
    summary: 'Monitors the station microgrid—a hybrid system combining solar panels, wind turbines, and heavy-duty diesel generators to generate electricity and heat.',
    whyItMatters: 'Diesel fuel (Jet A-1 polar grade) must be shipped once a year by icebreaker. Excess heat from generator exhaust is recycled to melt snow for drinking water.',
    quickTips: [
      'Check the Renewable Energy percentage (green indicates clean solar and wind contribution).',
      'Examine the generator thermal status—if a generator overheats, the backup starts automatically.',
      'Look at fuel autonomy: how many liters are consumed per hour.'
    ]
  },
  environment: {
    title: 'Meteorological & Polar Weather Suite',
    badge: 'CLIMATE',
    summary: 'Live atmospheric weather instruments measuring extreme sub-zero temperatures, wind chill, barometric pressure, and katabatic winds rushing off the polar ice cap.',
    whyItMatters: 'Antarctic blizzards (whiteouts) can exceed 150 km/h with zero visibility. Scientific teams cannot leave the station when wind speeds cross safety thresholds.',
    quickTips: [
      'Toggle "REAL MET LIVE" in the top bar to switch between simulation and real satellite weather.',
      'Watch wind speed and wind chill: -30°C feels like -50°C during heavy gusts.',
      'Check UV index and solar irradiance during 24-hour polar summer days.'
    ]
  },
  incidents: {
    title: 'Incident Command Post & Emergency Response',
    badge: 'CRISIS POST',
    summary: 'Real-time emergency management for sudden crises—such as a generator cooling failure, a power deficit, or severe blizzard damage.',
    whyItMatters: 'In Antarctica, rescue is impossible for 8 months of the polar winter. The station must be self-healing with automated failover systems.',
    quickTips: [
      'View the step-by-step resolution SOP (Standard Operating Procedure) for active emergencies.',
      'Notice how non-essential loads (like laundry and hobby rooms) are automatically shed to protect life support.',
      'Audio alarms alert the crew when critical thresholds are crossed.'
    ]
  },
  glaciology: {
    title: 'Glaciology & Ice Radar Matrix',
    badge: 'EARTH SCIENCE',
    summary: 'Sub-surface radar sensors monitoring the Antarctic ice sheet, crevasse movement, and subglacial lake depths.',
    whyItMatters: 'Antarctica holds 70% of the world’s freshwater ice. Melting ice shelves directly impact global sea levels and ocean currents worldwide.',
    quickTips: [
      'Inspect ice sheet thickness (over 2,000 meters thick in central Antarctica).',
      'Monitor crevasse movement near vehicle traverse routes to prevent snowcat accidents.',
      'Explore ice core drilling data revealing past atmospheric conditions over 800,000 years.'
    ]
  },
  assistant: {
    title: 'FrostByte AI Polar Assistant',
    badge: 'AI COPILOT',
    summary: 'An intelligent AI assistant trained on Antarctic expedition manuals, engineering specifications, and station telemetry.',
    whyItMatters: 'Station commanders and scientists can ask questions in plain English to diagnose anomalies, look up safety protocols, or understand system alerts.',
    quickTips: [
      'Type any question in plain English, e.g. "What is our current fuel level?" or "How cold is it outside?".',
      'Ask "Explain how the microgrid works" or "What happens if a generator fails?".',
      'Use quick suggestion chips to run instant diagnostics.'
    ]
  },
  scenarios: {
    title: 'Scenario Stress Lab',
    badge: 'SIMULATION',
    summary: 'A virtual testing ground where you can safely trigger extreme weather, generator failures, or solar blackouts to see how the base responds.',
    whyItMatters: 'Testing emergency responses in a computer simulation prevents real-world disasters in the harsh Antarctic environment.',
    quickTips: [
      'Click "Trigger Severe Polar Blizzard" to test high wind load and solar panel cutoff.',
      'Click "Primary Generator Overload" to watch automated backup generators kick in.',
      'Reset the simulation anytime using the reset button in the header.'
    ]
  },
  compare: {
    title: 'Dual-Station Comparison: Maitri vs Bharati',
    badge: 'BENCHMARK',
    summary: 'Side-by-side comparison of India’s two operational Antarctic stations: Maitri (commissioned 1988) and Bharati (commissioned 2012).',
    whyItMatters: 'Maitri is an established inland base in the Schirmacher rocky oasis, while Bharati is an ultra-modern modular base built on stilts from 134 ISO containers.',
    quickTips: [
      'Compare renewable energy adoption between the older and newer station designs.',
      'See differences in fuel efficiency, building insulation, and scientific payload capacity.',
      'Check upcoming plans for the proposed Maitri-II modernization.'
    ]
  }
};

interface PageExplainerProps {
  pageId: string;
  defaultOpen?: boolean;
  onOpenHelp?: () => void;
  onOpenTour?: () => void;
}

export const PageExplainer: React.FC<PageExplainerProps> = ({
  pageId,
  defaultOpen = false,
  onOpenHelp,
  onOpenTour
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const data = EXPLAINER_CONTENT[pageId] || {
    title: 'System Operational View',
    summary: 'This module provides specialized monitoring and control telemetry for polar station operations.',
    whyItMatters: 'Every system is monitored 24/7 to maintain safety and scientific output in extreme Antarctic conditions.',
    quickTips: ['Review the indicators on this page.', 'Use the filters to inspect specific parameters.']
  };

  return (
    <div className="mb-4 bg-gradient-to-r from-blue-50/80 via-sky-50/60 to-white border border-sky-200/80 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 font-sans">
      {/* Header bar / Toggle Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-sky-100/40 select-none transition"
      >
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Lightbulb className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                Plain English Guide: {data.title}
              </span>
              {data.badge && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold font-mono bg-blue-100 text-blue-800 border border-blue-200">
                  {data.badge}
                </span>
              )}
            </div>
            {!isOpen && (
              <p className="text-[11px] text-stone-600 truncate max-w-xl font-normal">
                {data.summary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-bold text-blue-700 hover:text-blue-900 hidden sm:inline">
            {isOpen ? 'Collapse Guide' : 'What is this page?'}
          </span>
          <div className="w-6 h-6 rounded-lg bg-white border border-sky-200 flex items-center justify-center text-blue-700">
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-5 pb-4 pt-1 border-t border-sky-100 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          {/* Main Explanation Column */}
          <div className="md:col-span-8 space-y-2.5">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>What you are looking at:</span>
              </div>
              <p className="text-stone-700 font-medium leading-relaxed mt-0.5">
                {data.summary}
              </p>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <span>❄️ Why this matters in Antarctica:</span>
              </div>
              <p className="text-stone-600 leading-relaxed mt-0.5">
                {data.whyItMatters}
              </p>
            </div>
          </div>

          {/* Quick Tips & Suggested Actions Column */}
          <div className="md:col-span-4 bg-white/80 p-3 rounded-xl border border-sky-200/60 flex flex-col justify-between space-y-2">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                <span>🎯 What you can try:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-stone-600">
                {data.quickTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="leading-snug">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
              {onOpenTour && (
                <button
                  onClick={onOpenTour}
                  className="font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
                >
                  <span>2-min Tour</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              {onOpenHelp && (
                <button
                  onClick={onOpenHelp}
                  className="font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-sky-600" />
                  <span>Glossary</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
