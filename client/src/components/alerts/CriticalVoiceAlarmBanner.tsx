import React, { useEffect, useState } from 'react';
import { audioService, AudioAlarmState } from '../../services/AudioService';
import { Volume2, VolumeX, ShieldAlert, Square, AlertOctagon, Sparkles } from 'lucide-react';

export const CriticalVoiceAlarmBanner: React.FC = () => {
  const [alarmState, setAlarmState] = useState<AudioAlarmState>(audioService.getAlarmState());
  const [justSilenced, setJustSilenced] = useState(false);

  useEffect(() => {
    const unsubscribe = audioService.subscribe((state) => {
      setAlarmState(state);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!justSilenced) return;
    const t = setTimeout(() => {
      setJustSilenced(false);
    }, 4000);
    return () => clearTimeout(t);
  }, [justSilenced]);

  const handleStop = () => {
    audioService.stopCriticalAlarmLoop();
    setJustSilenced(true);
  };

  const handleTestAlarm = () => {
    setJustSilenced(false);
    audioService.resetSilencedAlerts();
    audioService.startCriticalAlarmLoop(
      'Primary generator thermal overload trip at Maitri Station. Katabatic winds exceeding 90 kilometers per hour. Initiate emergency load shedding protocol',
      `test-${Date.now()}`
    );
  };

  if (alarmState.isAlarmLoopActive) {
    return (
      <aside 
        aria-label="Critical AI Voice Alarm" 
        className="relative z-50 bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-b-2 border-rose-500 text-white shadow-2xl px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 animate-in slide-in-from-top duration-300"
      >
        {/* Left: Siren & Pulsing Beacon */}
        <div className="flex items-center space-x-3 text-left">
          <div className="relative p-2.5 rounded-2xl bg-rose-600 text-white shadow-lg shrink-0 animate-bounce">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black tracking-widest uppercase text-rose-200 flex items-center gap-1.5">
                <span>🚨 FROSTBYTE AI VOICE ALARM ACTIVE</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-800 text-white font-mono text-[10px] border border-rose-500">
                  REPEATING (CYCLE #{alarmState.repeatCount + 1})
                </span>
              </span>
            </div>

            <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
              <span className="line-clamp-1">{alarmState.currentAlarmText}</span>
            </div>

            <div className="text-[11px] text-rose-300/80 font-medium flex items-center space-x-2 mt-0.5">
              <span>Speaking continuously until operator intervention</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-1.5 h-3 bg-rose-400 animate-pulse"></span>
                <span className="inline-block w-1.5 h-4 bg-rose-300 animate-pulse delay-75"></span>
                <span className="inline-block w-1.5 h-2 bg-rose-400 animate-pulse delay-150"></span>
                <span>Audio Repeating Loop Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Big Prominent STOP Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleStop}
            className="group px-6 py-2.5 rounded-xl bg-white hover:bg-rose-100 text-rose-950 font-black text-xs tracking-wider uppercase shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2 border-2 border-white ring-4 ring-rose-600/50"
          >
            <Square className="w-4 h-4 fill-rose-600 text-rose-600 group-hover:scale-110 transition-transform" />
            <span>STOP VOICE ALARM</span>
          </button>
        </div>
      </aside>
    );
  }

  if (justSilenced) {
    return (
      <aside 
        aria-label="Alarm Silenced Notification"
        className="bg-emerald-950 border-b border-emerald-600/50 text-white px-6 py-2 flex items-center justify-between text-xs animate-in fade-in duration-300"
      >
        <div className="flex items-center space-x-2">
          <span className="text-emerald-400">✅</span>
          <span className="font-bold text-emerald-200">AI Voice Alarm Silenced by Operator.</span>
          <span className="text-emerald-400/80 text-[11px]">Subsequent loop iterations stopped. System monitoring continues.</span>
        </div>
        <button
          onClick={() => setJustSilenced(false)}
          className="text-emerald-400 hover:text-white text-[11px] underline"
        >
          Dismiss
        </button>
      </aside>
    );
  }

  return null;
};
