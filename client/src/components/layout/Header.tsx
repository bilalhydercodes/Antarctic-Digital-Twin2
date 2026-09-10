import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { audioService, AudioAlarmState } from '../../services/AudioService';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Radio,
  Snowflake,
  Mountain,
  PlayCircle,
  StopCircle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  ShieldCheck,
  Square,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import { RBACRole } from '../../types';

interface HeaderProps {
  onOpenLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLanding }) => {
  const [isMutedState, setIsMutedState] = useState(false);
  const [alarmState, setAlarmState] = useState<AudioAlarmState>(audioService.getAlarmState());

  useEffect(() => {
    return audioService.subscribe(setAlarmState);
  }, []);
  const { 
    activeStationId, 
    setActiveStationId, 
    environment,
    alerts,
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

  const unhandledAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className="bg-white border-b border-[#e5e3dc] px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 shadow-sm font-sans">
      {/* 1. BRANDING & TITLE & WELCOME PORTAL BUTTON */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-blue-900 text-white flex items-center justify-center shadow-md">
          <Mountain className="w-6 h-6 text-sky-300" />
        </div>
        <div>
          <h1 className="text-base font-extrabold text-stone-900 leading-tight">
            Antarctic Digital Twin
          </h1>
          <p className="text-xs text-stone-500 font-semibold">
            Ministry of Earth Sciences • NCPOR #26060
          </p>
        </div>

        {onOpenLanding && (
          <button
            onClick={onOpenLanding}
            title="Return to Welcome Portal & Role Demo Access"
            className="hidden sm:flex items-center space-x-1.5 ml-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold text-xs shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PORTAL</span>
          </button>
        )}

        <a
          href="/presentation.html"
          target="_blank"
          rel="noopener noreferrer"
          title="Open Official Feature Showcase Presentation Deck"
          className="hidden sm:flex items-center space-x-1.5 ml-1 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs shadow-sm transition"
        >
          <span>📽️</span>
          <span>DECK PPT</span>
        </a>
      </div>

      {/* 2. PROMINENT MAITRI & BHARATI STATION SWITCHER */}
      <div className="flex items-center bg-[#f4f3f0] p-1 rounded-2xl border border-[#e5e3dc]">
        <button
          onClick={() => setActiveStationId('maitri')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
            activeStationId === 'maitri'
              ? 'bg-blue-700 text-white shadow-md'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#edebe4]'
          }`}
        >
          <span className="text-sm">🏔️</span>
          <span>MAITRI (70.76°S)</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeStationId === 'maitri' ? 'bg-blue-800 text-blue-100' : 'bg-stone-200 text-stone-700'}`}>
            1988
          </span>
        </button>

        <button
          onClick={() => setActiveStationId('bharati')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
            activeStationId === 'bharati'
              ? 'bg-sky-600 text-white shadow-md'
              : 'text-stone-600 hover:text-stone-900 hover:bg-[#edebe4]'
          }`}
        >
          <span className="text-sm">🏔️</span>
          <span>BHARATI (69.40°S)</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeStationId === 'bharati' ? 'bg-sky-700 text-sky-100' : 'bg-stone-200 text-stone-700'}`}>
            2012
          </span>
        </button>
      </div>

      {/* 3. SIMULATION SPEED CLOCK & CONTROLS */}
      <div className="flex items-center space-x-3">
        {/* Real Antarctic Satellite Weather Toggle */}
        <button
          onClick={() => setUseRealWeatherMode(!useRealWeatherMode)}
          title="Toggle Real Weather Satellite Data"
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
            useRealWeatherMode
              ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-sm'
              : 'bg-stone-100 text-stone-600 border-stone-300'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${useRealWeatherMode ? 'text-sky-600 animate-pulse' : 'text-stone-400'}`} />
          <span>{useRealWeatherMode ? 'REAL MET LIVE' : 'SIM MET'}</span>
        </button>

        {/* Live Link Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#f8f7f4] border border-[#e5e3dc] rounded-xl text-xs font-semibold text-stone-700">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          <span>{isConnected ? 'LIVE TELEMETRY' : 'CONNECTING...'}</span>
        </div>

        {/* RBAC Role Selector */}
        <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs border font-bold shadow-sm transition ${
          userRole === 'ADMIN' ? 'bg-rose-50 border-rose-300 text-rose-900' :
          userRole === 'COMMANDER' ? 'bg-amber-50 border-amber-300 text-amber-900' :
          userRole === 'OPERATOR' ? 'bg-blue-50 border-blue-300 text-blue-900' :
          userRole === 'SCIENTIST' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' :
          'bg-stone-100 border-stone-300 text-stone-800'
        }`}>
          <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${
            userRole === 'ADMIN' ? 'text-rose-600' :
            userRole === 'COMMANDER' ? 'text-amber-600' :
            userRole === 'OPERATOR' ? 'text-blue-600' :
            userRole === 'SCIENTIST' ? 'text-emerald-600' :
            'text-stone-600'
          }`} />
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as RBACRole)}
            className="bg-transparent font-black text-xs focus:outline-none cursor-pointer uppercase"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="COMMANDER">COMMANDER</option>
            <option value="OPERATOR">OPERATOR</option>
            <option value="SCIENTIST">SCIENTIST</option>
            <option value="VIEWER">VIEWER</option>
          </select>
        </div>

        {/* Speed Controls (Locked to Read-Only stream for VIEWER role) */}
        {userRole !== 'VIEWER' ? (
          <div className="flex items-center space-x-1 bg-[#f8f7f4] p-1 rounded-xl border border-[#e5e3dc]">
            <button
              onClick={toggleSimulation}
              title={simulationState.isRunning ? 'Pause' : 'Start'}
              className="p-1.5 rounded-lg bg-white border border-[#e5e3dc] text-stone-700 hover:bg-stone-50 transition"
            >
              {simulationState.isRunning ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
            <button
              onClick={resetSimulation}
              title="Reset"
              className="p-1.5 rounded-lg bg-white border border-[#e5e3dc] text-stone-700 hover:bg-stone-50 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center space-x-0.5 px-1 font-mono text-xs font-bold">
              {[1, 5, 20].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded-md transition ${
                    simulationState.speedMultiplier === s
                      ? 'bg-blue-700 text-white'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-500 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-stone-400"></span>
            <span>READ-ONLY VIEW</span>
          </div>
        )}

        {/* AUDIO MUTE TOGGLE & VOICE ALARM CONTROLS */}
        {alarmState.isAlarmLoopActive ? (
          <button
            onClick={() => audioService.stopCriticalAlarmLoop()}
            title="Stop Repeating AI Voice Alarm Immediately"
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg transition animate-pulse border-2 border-white ring-4 ring-rose-600/40"
          >
            <Square className="w-3.5 h-3.5 fill-white" />
            <span>STOP VOICE ALARM</span>
          </button>
        ) : (
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                const muted = audioService.toggleMute();
                setIsMutedState(muted);
                if (!muted) audioService.playClick();
              }}
              title={isMutedState ? 'Unmute Audio & Alerts' : 'Mute Audio & Alerts'}
              className={`p-2 rounded-xl border transition ${
                isMutedState
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
              }`}
            >
              {isMutedState ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                audioService.speakSITREP(
                  `Attention Operator. This is the Antarctic Digital Twin Commander SITREP briefing for ${activeStationId.toUpperCase()} Research Station. All grid switchgears operating within nominal polar parameters. Telemetry packet streaming active.`
                );
              }}
              title="Listen to AI Voice SITREP Briefing"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold text-xs shadow-sm transition"
            >
              <Mic className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>VOICE SITREP</span>
            </button>

            <button
              onClick={() => {
                audioService.resetSilencedAlerts();
                audioService.startCriticalAlarmLoop(
                  `Primary generator cooling loop failure at ${activeStationId.toUpperCase()} Station. Thermal overload trip. Engage secondary co-generation loop immediately`,
                  `demo-alarm-${Date.now()}`
                );
              }}
              title="Test Repeating AI Voice Alarm Loop (Repeats until Stop is clicked)"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] shadow-sm transition"
            >
              <span>🚨 TEST ALARM</span>
            </button>
          </div>
        )}

        {/* RUN DEMO BUTTON */}
        {!simulationState.demoModeActive ? (
          <button
            onClick={startDemo}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            <PlayCircle className="w-4 h-4" />
            <span>RUN DEMO</span>
          </button>
        ) : (
          <button
            onClick={stopDemo}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
          >
            <StopCircle className="w-4 h-4" />
            <span>STOP DEMO</span>
          </button>
        )}
      </div>
    </header>
  );
};
