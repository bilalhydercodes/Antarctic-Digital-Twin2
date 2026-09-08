import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Wifi, Radio, WifiOff, RefreshCw, Zap, Database, Clock } from 'lucide-react';
import { ConnectivityMode } from '../../types';

export const SatelliteBandwidthBanner: React.FC = () => {
  const { 
    connectivityMode, 
    setConnectivityMode, 
    simulationState, 
    offlineQueueSize, 
    offlineSyncStatus, 
    flushOfflineQueue 
  } = useSimulation();

  const stats = simulationState.satelliteStats || {
    fullPayloadSize: 2450,
    deltaPayloadSize: 180,
    compressionRatio: 92.6,
    queueSize: 0,
    lastSyncTimestamp: new Date().toISOString(),
    simulatedLatencyMs: 45,
    bandwidthKbps: 1024
  };

  return (
    <div className="bg-[#0f172a] text-slate-100 border-b border-slate-800 px-4 py-2.5 shadow-md font-sans text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Mode Selection Controls */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-1">
            ANTARCTIC CONNECTIVITY MODE:
          </span>

          <button
            onClick={() => setConnectivityMode('LOCAL')}
            className={`px-3 py-1 rounded font-bold flex items-center gap-1.5 transition-all text-xs ${
              connectivityMode === 'LOCAL'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            LOCAL / HIGH BANDWIDTH
          </button>

          <button
            onClick={() => setConnectivityMode('SATELLITE')}
            className={`px-3 py-1 rounded font-bold flex items-center gap-1.5 transition-all text-xs ${
              connectivityMode === 'SATELLITE'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            SATELLITE / LOW BANDWIDTH
          </button>

          <button
            onClick={() => setConnectivityMode('OFFLINE')}
            className={`px-3 py-1 rounded font-bold flex items-center gap-1.5 transition-all text-xs ${
              connectivityMode === 'OFFLINE'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            OFFLINE
          </button>
        </div>

        {/* Center: Live Payload Metrics (Full vs Delta) */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-3 py-1 rounded border border-slate-800">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>FULL: <strong className="text-white">{(stats.fullPayloadSize / 1024).toFixed(2)} KB</strong></span>
          </div>

          <div className="text-slate-600">|</div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>DELTA: <strong className="text-cyan-400">{stats.deltaPayloadSize} B</strong></span>
          </div>

          <div className="text-slate-600">|</div>

          <div className="bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
            ⚡ {stats.compressionRatio}% PAYLOAD REDUCTION
          </div>
        </div>

        {/* Right: Latency, Queue Status & Sync Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>LATENCY: <strong className="text-slate-200">{connectivityMode === 'SATELLITE' ? '450ms' : connectivityMode === 'OFFLINE' ? 'INF' : '45ms'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Database className="w-3 h-3 text-slate-400" />
            <span>QUEUE: <strong className={offlineQueueSize > 0 ? "text-amber-400 font-bold" : "text-slate-200"}>{offlineQueueSize} PKTS</strong></span>
          </div>

          {offlineQueueSize > 0 && (
            <button
              onClick={flushOfflineQueue}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1 rounded font-bold flex items-center gap-1 transition-all text-xs"
            >
              <RefreshCw className="w-3 h-3 animate-spin" />
              SYNC QUEUE NOW ({offlineQueueSize})
            </button>
          )}

          {offlineSyncStatus && (
            <span className="text-[10px] text-amber-300 italic font-mono max-w-[150px] truncate">
              {offlineSyncStatus}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
