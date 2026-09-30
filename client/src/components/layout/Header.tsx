import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { audioService, AudioAlarmState } from '../../services/AudioService';
import { 
  Snowflake,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  ShieldCheck,
  Square,
  Sparkles,
  HelpCircle,
  Radio,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { RBACRole } from '../../types';

interface HeaderProps {
  onOpenLanding?: () => void;
  onOpenTour?: () => void;
  onOpenHelp?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLanding, onOpenTour, onOpenHelp }) => {
  const [isMutedState, setIsMutedState] = useState(false);
  const [alarmState, setAlarmState] = useState<AudioAlarmState>(audioService.getAlarmState());

  useEffect(() => {
    return audioService.subscribe(setAlarmState);
  }, []);

  const { 
    activeStationId, 
    setActiveStationId, 
    useRealWeatherMode,
    setUseRealWeatherMode,
    simulationState,
    toggleSimulation,
    setSpeed,
    resetSimulation,
    startDemo,
    stopDemo,
    isConnected,
    userRole,
    setUserRole
  } = useSimulation();

  return (
    <header className="bg-white border-b border-[#dce3ec] px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-xs font-sans select-none">
      
      {/* 1. BRANDING: GOVT OF INDIA & NCPOR OFFICIAL EMBLEMS */}
      <div className="flex items-center space-x-3 shrink-0">
        {/* Lion Capital of India Official Emblem */}
        <div className="flex items-center space-x-2 border-r border-[#e2e8f0] pr-3">
          <svg className="w-7 h-9 text-stone-900 shrink-0" viewBox="0 0 40 50" fill="currentColor">
            <path d="M20 2C16 2 13 4 11 7C10 8.5 10 10 10.5 11.5C9 12 8 13.5 8 15C8 17 9.5 18.5 11.5 19C10.5 20.5 10.5 22.5 11.5 24C10 25 9 26.5 9 28.5C9 31 11 33 13.5 33.5C13 34.5 13 35.5 13.5 36.5C12 37.5 11 39 11 41C11 43.5 13 45.5 15.5 46L20 47L24.5 46C27 45.5 29 43.5 29 41C29 39 28 37.5 26.5 36.5C27 35.5 27 34.5 26.5 33.5C29 33 31 31 31 28.5C31 26.5 30 25 28.5 24C29.5 22.5 29.5 20.5 28.5 19C30.5 18.5 32 17 32 15C32 13.5 31 12 29.5 11.5C30 10 30 8.5 29 7C27 4 24 2 20 2ZM18 43H22V45H18V43ZM15 39H25V41H15V39ZM14 31C14 29.5 15.5 28 17.5 28H22.5C24.5 28 26 29.5 26 31C26 32.5 24.5 34 22.5 34H17.5C15.5 34 14 32.5 14 31Z" />
          </svg>
          <div className="leading-tight text-left">
            <div className="text-[10px] font-bold tracking-wider text-stone-700">भारत सरकार</div>
            <div className="text-[11px] font-black text-stone-950 tracking-tight">GOVERNMENT OF INDIA</div>
            <div className="text-[9px] font-semibold text-stone-600">पृथ्वी विज्ञान मंत्रालय</div>
            <div className="text-[9px] font-bold text-stone-800 tracking-tight">MINISTRY OF EARTH SCIENCES</div>
          </div>
        </div>

        {/* NCPOR Official Insignia */}
        <div className="flex items-center space-x-2 border-r border-[#e2e8f0] pr-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-900 to-sky-700 p-0.5 shadow-2xs shrink-0 flex items-center justify-center text-white border border-sky-300">
            <Snowflake className="w-4 h-4 text-sky-200 animate-spin-slow" />
          </div>
          <div className="leading-tight text-left">
            <div className="text-[11px] font-black tracking-tight text-blue-950">NCPOR</div>
            <div className="text-[9px] font-bold text-stone-700">राष्ट्रीय ध्रुवीय एवं समुद्री अनुसंधान केंद्र</div>
            <div className="text-[8px] font-semibold text-stone-500">NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH</div>
            <div className="text-[8px] text-stone-400">Ministry of Earth Sciences, Govt. of India</div>
          </div>
        </div>

        {/* Quick Utilities */}
        <div className="hidden xl:flex items-center space-x-1 pl-1">
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              title="Return to Welcome Portal & Role Demo Access"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold text-[11px] shadow-2xs transition"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>PORTAL</span>
            </button>
          )}

          {onOpenTour && (
            <button
              onClick={onOpenTour}
              title="Start interactive 2-minute tour"
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-700 hover:bg-blue-600 text-white font-bold text-[11px] shadow-2xs transition"
            >
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>TOUR</span>
            </button>
          )}

          <a
            href="/presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            title="Open Official Feature Showcase Presentation Deck"
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[11px] shadow-2xs transition"
          >
            <span>📽️</span>
            <span>DECK</span>
          </a>
        </div>
      </div>

      {/* 2. CENTER: PLATFORM TITLE */}
      <div className="hidden lg:flex flex-col items-center justify-center text-center px-4 py-1 rounded-xl bg-gradient-to-r from-sky-50 via-white to-sky-50 border border-sky-100 shadow-2xs">
        <h1 className="text-base font-black tracking-tight text-blue-950 uppercase flex items-center gap-1.5">
          <span>ANTARCTIC DIGITAL TWIN</span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">PS #26060</span>
        </h1>
        <p className="text-[10px] text-stone-500 font-semibold tracking-wide">
          Integrated Station Monitoring & Simulation Platform
        </p>
      </div>

      {/* 3. RIGHT CONTROLS: INDIAN FLAG, TIME, STATION SWITCHER & RBAC */}
      <div className="flex items-center space-x-2.5">
        {/* Real Weather & Live Stream Indicators */}
        <div className="hidden sm:flex items-center space-x-2 bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setUseRealWeatherMode(!useRealWeatherMode)}
            title={useRealWeatherMode ? 'Using live satellite feeds' : 'Using physics simulation model'}
            className={`flex items-center space-x-1 text-[11px] font-bold transition ${
              useRealWeatherMode ? 'text-sky-700' : 'text-stone-600'
            }`}
          >
            <Radio className={`w-3 h-3 ${useRealWeatherMode ? 'text-sky-600 animate-pulse' : 'text-stone-400'}`} />
            <span>{useRealWeatherMode ? 'REAL MET' : 'SIM MET'}</span>
          </button>
          <span className="text-stone-300">|</span>
          <div className="flex items-center space-x-1 text-[11px] font-semibold text-stone-700">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span>{isConnected ? 'LIVE' : 'SYNCING'}</span>
          </div>
        </div>

        {/* Live Date/Time Clock (IST) */}
        <div className="hidden 2xl:flex items-center space-x-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-mono font-semibold text-stone-700">
          <Clock className="w-3 h-3 text-stone-500" />
          <span>Wed, 30 Sep 2026 12:27 IST</span>
        </div>

        {/* Mission Control Indicator */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          <span>⚙️ Mission Control</span>
        </div>

        {/* Indian Flag Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-orange-50 via-white to-green-50 border border-stone-200 shadow-2xs">
          <div className="w-5 h-3.5 rounded-xs overflow-hidden border border-stone-300 flex flex-col">
            <div className="h-1/3 bg-[#FF9933]"></div>
            <div className="h-1/3 bg-white flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#000080]"></div>
            </div>
            <div className="h-1/3 bg-[#128807]"></div>
          </div>
          <div className="text-[10px] font-extrabold text-stone-800 leading-none">
            <div>भारत</div>
            <div className="text-[8px] text-stone-500">INDIA</div>
          </div>
        </div>

        {/* RBAC Role Selector Dropdown */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900 text-white border border-slate-700 rounded-xl text-xs font-bold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as RBACRole)}
            className="bg-transparent font-extrabold text-xs focus:outline-none cursor-pointer uppercase text-cyan-200"
          >
            <option value="OPERATOR" className="bg-slate-900 text-white">Station Operator</option>
            <option value="COMMANDER" className="bg-slate-900 text-white">Station Commander</option>
            <option value="SCIENTIST" className="bg-slate-900 text-white">Research Scientist</option>
            <option value="ADMIN" className="bg-slate-900 text-white">System Admin</option>
            <option value="VIEWER" className="bg-slate-900 text-white">Remote Viewer</option>
          </select>
        </div>
      </div>
    </header>
  );
};
