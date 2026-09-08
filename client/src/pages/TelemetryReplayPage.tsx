import React, { useState, useEffect, useRef } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  FastForward, 
  Thermometer, 
  Wind, 
  Zap, 
  Activity, 
  Layers, 
  Compass,
  AlertTriangle
} from 'lucide-react';

export const TelemetryReplayPage: React.FC = () => {
  const { activeStationId } = useSimulation();

  const [frames, setFrames] = useState<any[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    setLoading(true);
    setIsPlaying(false);
    api.getTelemetryReplay(activeStationId, 60).then(res => {
      if (res.success && Array.isArray(res.frames) && res.frames.length > 0) {
        setFrames(res.frames);
        setCurrentFrameIndex(0);
      }
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, [activeStationId]);

  useEffect(() => {
    if (isPlaying && frames.length > 0) {
      const intervalMs = Math.max(100, Math.round(1000 / replaySpeed));
      timerRef.current = setInterval(() => {
        setCurrentFrameIndex(prev => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, frames, replaySpeed]);

  const currentFrame = frames[currentFrameIndex] || null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" />
            <span>Layer 31: Historical Telemetry Replay Time Machine</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {activeStationId === 'maitri' ? 'Maitri' : 'Bharati'} Telemetry Replay Engine
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Reconstructs historical physical & environmental twin states sequentially. Scrub backwards and forwards through polar storm events, equipment trips, and automatic failovers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Frame Buffer: {frames.length} Snapshots
          </span>
        </div>
      </div>

      {/* Interactive Time Scrubber & Player Bar */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-md"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentFrameIndex(0);
              }}
              className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition"
              title="Rewind to start"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-1 bg-stone-800 p-1 rounded-xl border border-stone-700 font-mono text-xs">
              {[1, 2, 5, 10].map(s => (
                <button
                  key={s}
                  onClick={() => setReplaySpeed(s)}
                  className={`px-2.5 py-1 rounded-lg transition ${
                    replaySpeed === s ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Replay Historical Timestamp</div>
            <div className="text-sm font-mono font-bold text-amber-400">
              {currentFrame?.timestamp ? new Date(currentFrame.timestamp).toLocaleString() : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Scrubber slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400">
            <span>Frame {currentFrameIndex + 1} of {Math.max(1, frames.length)}</span>
            <span>{frames.length > 0 ? `${Math.round(((currentFrameIndex + 1) / frames.length) * 100)}% Replayed` : '0%'}</span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(0, frames.length - 1)}
            value={currentFrameIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentFrameIndex(Number(e.target.value));
            }}
            className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Historical Telemetry Frame Inspector */}
      {currentFrame ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase">
              <Thermometer className="w-4 h-4 text-blue-600" />
              <span>Historical Atmospheric State</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Temperature</div>
                <div className="text-lg font-black text-stone-900">{currentFrame.environment?.temperature ?? -28.4}°C</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Wind Speed</div>
                <div className="text-lg font-black text-stone-900">{currentFrame.environment?.windSpeed ?? 42} km/h</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Barometric</div>
                <div className="text-lg font-black text-stone-900">{currentFrame.environment?.pressure ?? 988} hPa</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Visibility</div>
                <div className="text-lg font-black text-stone-900">{currentFrame.environment?.visibility ?? 8500} m</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Historical Energy & Heating</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Power Demand</div>
                <div className="text-lg font-black text-stone-900">{currentFrame.energy?.powerGrid?.consumptionKw ?? 280} kW</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Generation</div>
                <div className="text-lg font-black text-stone-900">{currentFrame.energy?.powerGrid?.generationKw ?? 295} kW</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Heating Loop</div>
                <div className="text-lg font-black text-stone-900">{currentFrame.energy?.powerGrid?.chpThermalGenerationKw ?? 145} kW</div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#f8f7f4]">
                <div className="text-[10px] text-stone-400">Fuel Reserves</div>
                <div className="text-lg font-black text-emerald-700">{currentFrame.energy?.fuelStorage?.estimatedDaysRemaining ?? 52}d</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-stone-500 uppercase">
              <Activity className="w-4 h-4 text-purple-600" />
              <span>Historical Geomagnetic / Scientific</span>
            </div>
            <div className="p-3 rounded-xl bg-[#f8f7f4] text-xs font-mono space-y-1.5">
              <div>PPM Flux: <strong>{currentFrame.geomagnetic?.ppmTotalIntensity ?? 44250} nT</strong></div>
              <div>DFM Vector: <strong>X: {currentFrame.geomagnetic?.dfmX ?? 18450} | Y: {currentFrame.geomagnetic?.dfmY ?? -2120} | Z: {currentFrame.geomagnetic?.dfmZ ?? 40180}</strong></div>
              <div>GPS Time Synchronization: <strong className="text-emerald-700">LOCKED (1PPS)</strong></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-[#e5e3dc] text-center text-stone-500 text-xs">
          {loading ? 'Fetching historical telemetry frames from database...' : 'No historical frames recorded yet.'}
        </div>
      )}
    </div>
  );
};
