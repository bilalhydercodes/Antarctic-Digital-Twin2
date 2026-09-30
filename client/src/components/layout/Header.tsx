import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { audioService, AudioAlarmState } from '../../services/AudioService';
import { 
  Bell, 
  Search, 
  User, 
  ChevronDown, 
  Radio, 
  Clock, 
  ShieldCheck, 
  Snowflake,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  FileText,
  Activity,
  Home
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
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    return audioService.subscribe(setAlarmState);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Real format: 30-SEP-2026 12:27:00 IST
      const day = String(now.getDate()).padStart(2, '0');
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${day}-${month}-${year} ${hours}:${minutes}:${seconds} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
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
    isConnected,
    alerts,
    userRole,
    setUserRole
  } = useSimulation();

  const unhandledAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className="bg-[#ffffff] border-b border-[#cbd5e1] text-[#0f172a] px-3 py-1.5 flex items-center justify-between gap-3 sticky top-0 z-50 font-sans text-xs select-none">
      
      {/* ─── 1. OFFICIAL GOVT OF INDIA & NCPOR IDENTITY ─── */}
      <div 
        onClick={onOpenLanding}
        title="Open Government of India NCPOR Portal Home"
        className="flex items-center space-x-3 shrink-0 cursor-pointer hover:opacity-95 transition"
      >
        {/* Lion Capital of India Official Emblem */}
        <div className="flex items-center space-x-2 border-r border-[#cbd5e1] pr-3">
          <svg className="w-6 h-8 text-[#0f172a] shrink-0" viewBox="0 0 40 50" fill="currentColor">
            <path d="M20 2C16 2 13 4 11 7C10 8.5 10 10 10.5 11.5C9 12 8 13.5 8 15C8 17 9.5 18.5 11.5 19C10.5 20.5 10.5 22.5 11.5 24C10 25 9 26.5 9 28.5C9 31 11 33 13.5 33.5C13 34.5 13 35.5 13.5 36.5C12 37.5 11 39 11 41C11 43.5 13 45.5 15.5 46L20 47L24.5 46C27 45.5 29 43.5 29 41C29 39 28 37.5 26.5 36.5C27 35.5 27 34.5 26.5 33.5C29 33 31 31 31 28.5C31 26.5 30 25 28.5 24C29.5 22.5 29.5 20.5 28.5 19C30.5 18.5 32 17 32 15C32 13.5 31 12 29.5 11.5C30 10 30 8.5 29 7C27 4 24 2 20 2ZM18 43H22V45H18V43ZM15 39H25V41H15V39ZM14 31C14 29.5 15.5 28 17.5 28H22.5C24.5 28 26 29.5 26 31C26 32.5 24.5 34 22.5 34H17.5C15.5 34 14 32.5 14 31Z" />
          </svg>
          <div className="leading-tight text-left">
            <div className="text-[9px] font-bold text-slate-700">भारत सरकार</div>
            <div className="text-[10px] font-black text-slate-950 tracking-tight">GOVERNMENT OF INDIA</div>
            <div className="text-[8px] font-semibold text-slate-600">पृथ्वी विज्ञान मंत्रालय</div>
            <div className="text-[9px] font-bold text-slate-800">MINISTRY OF EARTH SCIENCES</div>
          </div>
        </div>

        {/* NCPOR Official Emblem & Title */}
        <div className="flex items-center space-x-2 border-r border-[#cbd5e1] pr-3">
          <div className="w-7 h-7 rounded-sm bg-[#102a43] text-white flex items-center justify-center font-bold text-[11px] shrink-0 border border-slate-300">
            <Snowflake className="w-4 h-4 text-sky-300" />
          </div>
          <div className="leading-tight text-left">
            <div className="text-[10px] font-black text-[#102a43] tracking-tight">NCPOR • राष्ट्रीय ध्रुवीय एवं समुद्री अनुसंधान केंद्र</div>
            <div className="text-[8px] font-medium text-slate-500">NATIONAL CENTRE FOR POLAR AND OCEAN RESEARCH, GOA</div>
          </div>
        </div>

        {/* Platform Name */}
        <div className="hidden lg:block pl-1 text-left leading-tight">
          <div className="text-xs font-black tracking-tight text-[#102a43] flex items-center gap-1.5">
            <span>ANTARCTIC DIGITAL TWIN</span>
            <span className="text-[9px] px-1 py-0.2 bg-slate-100 text-slate-700 border border-slate-300 rounded-xs font-mono">OP-OPS-26060</span>
          </div>
          <div className="text-[9px] text-slate-500 font-medium">Integrated Station Monitoring & Simulation Platform</div>
        </div>
      </div>

      {/* ─── 2. SEARCH BAR (COMPACT INSTITUTIONAL) ─── */}
      <div className="hidden md:flex items-center relative w-56">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
        <input 
          type="text" 
          placeholder="Search telemetry, sensor, log..."
          className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-[11px] pl-7 pr-2 py-1 rounded-sm focus:outline-none focus:border-blue-600 font-sans"
        />
      </div>

      {/* ─── 3. CONTROLS, CLOCK, ALERTS, PROFILE ─── */}
      <div className="flex items-center space-x-2.5 shrink-0 font-sans">
        
        {/* Real-time Clock (IST) */}
        <div className="hidden xl:flex items-center space-x-1.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-sm text-[11px] font-mono text-slate-700">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{currentTime || '30-SEP-2026 12:27:00 IST'}</span>
        </div>

        {/* Portal Home Button */}
        <button
          onClick={onOpenLanding}
          title="Return to Official Government Portal"
          className="px-2 py-1 rounded-sm border border-slate-300 bg-slate-50 hover:bg-slate-100 text-[#102a43] text-[10px] font-bold flex items-center space-x-1 transition cursor-pointer"
        >
          <Home className="w-3 h-3 text-blue-800" />
          <span>PORTAL</span>
        </button>

        {/* Active Station Selector */}
        <div className="flex items-center border border-slate-300 rounded-sm overflow-hidden bg-slate-50 text-[11px] font-bold">
          <button
            onClick={() => setActiveStationId('maitri')}
            className={`px-2 py-0.5 transition ${
              activeStationId === 'maitri' 
                ? 'bg-[#102a43] text-white' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            MAITRI
          </button>
          <button
            onClick={() => setActiveStationId('bharati')}
            className={`px-2 py-0.5 transition ${
              activeStationId === 'bharati' 
                ? 'bg-[#102a43] text-white' 
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            BHARATI
          </button>
        </div>

        {/* Simulation / Real Met Mode Toggle */}
        <button
          onClick={() => setUseRealWeatherMode(!useRealWeatherMode)}
          title={useRealWeatherMode ? 'Real Satellite MET Active' : 'Physics Simulation Active'}
          className={`px-2 py-1 rounded-sm border text-[10px] font-bold flex items-center space-x-1 ${
            useRealWeatherMode
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-700 border-slate-300'
          }`}
        >
          <Radio className="w-3 h-3 text-emerald-600" />
          <span>{useRealWeatherMode ? 'REAL MET' : 'SIM MET'}</span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button 
            title="System Notifications & Alerts"
            className="p-1 rounded-sm border border-slate-200 hover:bg-slate-100 text-slate-700"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>
          {unhandledAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white font-bold text-[8px] rounded-full flex items-center justify-center">
              {unhandledAlerts}
            </span>
          )}
        </div>

        {/* Audio Siren Toggle */}
        <button
          onClick={() => {
            const next = !isMutedState;
            setIsMutedState(next);
            audioService.setMuted(next);
          }}
          title={isMutedState ? "Unmute Voice/Siren Alerts" : "Mute Alerts"}
          className="p-1 rounded-sm border border-slate-200 hover:bg-slate-100 text-slate-600"
        >
          {isMutedState ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-700" />}
        </button>

        {/* User Profile / Role (Institutional Commander Profile) */}
        <div className="flex items-center space-x-1.5 px-2 py-0.5 bg-[#f8fafc] border border-slate-300 rounded-sm">
          <div className="w-5 h-5 rounded-full bg-[#102a43] text-white flex items-center justify-center text-[9px] font-bold">
            <User className="w-3 h-3" />
          </div>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold text-slate-900">CDR. R. SHARMA</div>
            <div className="text-[8px] font-medium text-slate-500">STATION COMMANDER</div>
          </div>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as RBACRole)}
            className="bg-transparent text-[9px] font-bold text-slate-700 border-none focus:outline-none cursor-pointer"
          >
            <option value="COMMANDER">CMD</option>
            <option value="OPERATOR">OPR</option>
            <option value="SCIENTIST">SCI</option>
            <option value="ADMIN">ADM</option>
            <option value="VIEWER">VIEW</option>
          </select>
        </div>

      </div>
    </header>
  );
};
