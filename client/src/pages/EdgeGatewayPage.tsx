import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Radio, 
  Cpu, 
  HardDrive, 
  Layers, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  Sliders, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export const EdgeGatewayPage: React.FC = () => {
  const { 
    activeStationId, 
    edgeGateway, 
    configureSatelliteLink, 
    offlineQueueSize, 
    flushOfflineQueue 
  } = useSimulation();

  const [selectedMode, setSelectedMode] = useState<string>(edgeGateway?.satelliteLink?.mode || 'LOCAL');
  const [customLatency, setCustomLatency] = useState<number>(edgeGateway?.satelliteLink?.latencyMs || 45);
  const [customLoss, setCustomLoss] = useState<number>(edgeGateway?.satelliteLink?.packetLossPercent || 0);
  const [customBandwidth, setCustomBandwidth] = useState<number>(edgeGateway?.satelliteLink?.bandwidthKbps || 1024);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const applySatelliteMode = async (mode: 'LOCAL' | 'VSAT' | 'LOW_BANDWIDTH' | 'DEGRADED' | 'OFFLINE') => {
    setIsUpdating(true);
    setSelectedMode(mode);

    let latency = 45;
    let loss = 0;
    let bw = 1024;
    let jitter = 5;

    if (mode === 'VSAT') {
      latency = 820;
      loss = 3.2;
      bw = 64;
      jitter = 140;
    } else if (mode === 'LOW_BANDWIDTH') {
      latency = 450;
      loss = 1.5;
      bw = 128;
      jitter = 60;
    } else if (mode === 'DEGRADED') {
      latency = 1450;
      loss = 12.0;
      bw = 32;
      jitter = 320;
    } else if (mode === 'OFFLINE') {
      latency = 9999;
      loss = 100;
      bw = 0;
      jitter = 0;
    }

    setCustomLatency(latency);
    setCustomLoss(loss);
    setCustomBandwidth(bw);

    try {
      await configureSatelliteLink({
        mode,
        latencyMs: latency,
        packetLossPercent: loss,
        bandwidthKbps: bw,
        jitterMs: jitter
      });
      setStatusNotice(`Satellite link profile updated to [${mode}]. Edge priority scheduler reconfigured.`);
      setTimeout(() => setStatusNotice(null), 4000);
    } catch (e: any) {
      setStatusNotice(`Error: ${e.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const activeLink = edgeGateway?.activeDegradation || edgeGateway?.satelliteLink;
  const currentMode = activeLink?.mode || 'LOCAL';
  const tx = edgeGateway?.priorityTransmissionStats ? {
    p0LifeSafetyPercent: edgeGateway.priorityTransmissionStats.p0TransmitPercent,
    p1CriticalInfraPercent: edgeGateway.priorityTransmissionStats.p1TransmitPercent,
    p2StationOpsPercent: edgeGateway.priorityTransmissionStats.p2TransmitPercent,
    p3ScientificPercent: edgeGateway.priorityTransmissionStats.p3TransmitPercent,
    p4AnalyticsPercent: edgeGateway.priorityTransmissionStats.p4TransmitPercent
  } : edgeGateway?.priorityTransmission || {
    p0LifeSafetyPercent: 100,
    p1CriticalInfraPercent: 98,
    p2StationOpsPercent: 72,
    p3ScientificPercent: 35,
    p4AnalyticsPercent: 15
  };

  const cpuDisplay = edgeGateway?.cpuLoadPercent ?? edgeGateway?.cpuPercent ?? 28;
  const memoryDisplay = edgeGateway?.memoryUsagePercent ?? edgeGateway?.memoryPercent ?? 42;
  const queueDisplay = edgeGateway?.localBufferQueueSize ?? edgeGateway?.queueSize ?? offlineQueueSize ?? 0;
  const compressionDisplay = edgeGateway?.compressionRatioPercent ?? edgeGateway?.compressionRatio ?? 92.4;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4" />
            <span>Layer 4 & 5: Edge Gateway & Polar Satellite Comms</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {activeStationId === 'maitri' ? 'Maitri' : 'Bharati'} Edge Computing Gateway
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Simulates onboard station computing node performing local deduplication, delta-compression, store-and-forward queuing, and strict P0–P4 priority transmission over degraded satellite links.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
            currentMode === 'LOCAL' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
            currentMode === 'VSAT' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
            currentMode === 'DEGRADED' ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
            'bg-rose-100 text-rose-800 border border-rose-300'
          }`}>
            Link: {currentMode}
          </span>
        </div>
      </div>

      {/* Gateway Hardware Telemetry KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase">
            <span>Edge CPU Utilization</span>
            <Cpu className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-stone-900">{cpuDisplay}%</span>
            <span className="text-xs text-stone-500 font-medium">Polar Node</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-blue-600" 
              style={{ width: `${cpuDisplay}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase">
            <span>Local Buffer Memory</span>
            <HardDrive className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-stone-900">{memoryDisplay}%</span>
            <span className="text-xs text-stone-500 font-medium">8.0 GB RAM</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-indigo-600" 
              style={{ width: `${memoryDisplay}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase">
            <span>Offline Store-and-Forward Queue</span>
            <Layers className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${queueDisplay > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {queueDisplay}
            </span>
            <span className="text-xs text-stone-500 font-medium">Packets Buffered</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Auto-syncs on satellite lock
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-stone-400 uppercase">
            <span>Compression Savings</span>
            <Zap className="w-3.5 h-3.5 text-stone-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">
              {compressionDisplay}%
            </span>
            <span className="text-xs text-stone-500 font-medium">Delta Ratio</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            2.4KB → 180B per payload
          </div>
        </div>
      </div>

      {/* Satellite Communication Simulator Controls */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase">Satellite Uplink Simulation Profiles</h2>
          </div>
          <div className="text-xs text-stone-400 font-mono">
            Link Latency: {edgeGateway?.satelliteLink?.latencyMs || customLatency}ms • Bandwidth: {edgeGateway?.satelliteLink?.bandwidthKbps || customBandwidth} kbps
          </div>
        </div>

        {/* Mode Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
          <button
            onClick={() => applySatelliteMode('LOCAL')}
            disabled={isUpdating}
            className={`p-3 rounded-xl text-left border transition ${
              currentMode === 'LOCAL'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-md'
                : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <div className="font-bold text-xs">LOCAL FIBRE</div>
            <div className="text-[10px] text-stone-400 mt-1">1024 kbps • 45ms</div>
            <div className="text-[10px] text-emerald-400 font-semibold mt-1">100% Telemetry</div>
          </button>

          <button
            onClick={() => applySatelliteMode('VSAT')}
            disabled={isUpdating}
            className={`p-3 rounded-xl text-left border transition ${
              currentMode === 'VSAT'
                ? 'bg-blue-950/70 border-blue-500 text-blue-200 shadow-md'
                : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <div className="font-bold text-xs">VSAT STANDARD</div>
            <div className="text-[10px] text-stone-400 mt-1">64 kbps • 820ms</div>
            <div className="text-[10px] text-blue-300 font-semibold mt-1">P0-P2 Prioritized</div>
          </button>

          <button
            onClick={() => applySatelliteMode('LOW_BANDWIDTH')}
            disabled={isUpdating}
            className={`p-3 rounded-xl text-left border transition ${
              currentMode === 'LOW_BANDWIDTH'
                ? 'bg-indigo-950/70 border-indigo-500 text-indigo-200 shadow-md'
                : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <div className="font-bold text-xs">LOW BANDWIDTH</div>
            <div className="text-[10px] text-stone-400 mt-1">128 kbps • 450ms</div>
            <div className="text-[10px] text-indigo-300 font-semibold mt-1">Delta Mode</div>
          </button>

          <button
            onClick={() => applySatelliteMode('DEGRADED')}
            disabled={isUpdating}
            className={`p-3 rounded-xl text-left border transition ${
              currentMode === 'DEGRADED'
                ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md'
                : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <div className="font-bold text-xs">DEGRADED / SOLAR</div>
            <div className="text-[10px] text-stone-400 mt-1">32 kbps • 1450ms</div>
            <div className="text-[10px] text-amber-400 font-semibold mt-1">Heavy Queueing</div>
          </button>

          <button
            onClick={() => applySatelliteMode('OFFLINE')}
            disabled={isUpdating}
            className={`p-3 rounded-xl text-left border transition ${
              currentMode === 'OFFLINE'
                ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md'
                : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <div className="font-bold text-xs">OFFLINE BLACKOUT</div>
            <div className="text-[10px] text-stone-400 mt-1">0 kbps • Outage</div>
            <div className="text-[10px] text-rose-400 font-semibold mt-1">Store-and-Forward</div>
          </button>
        </div>

        {statusNotice && (
          <div className="p-3 rounded-xl bg-stone-800 border border-sky-500/40 text-sky-300 text-xs font-mono mb-4">
            {statusNotice}
          </div>
        )}

        {/* Satellite Sync Action Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs text-stone-400">
          <div>
            Last Ground Station Sync: {edgeGateway?.lastSatelliteSync ? new Date(edgeGateway.lastSatelliteSync).toLocaleTimeString() : 'Active'}
          </div>
          <button
            onClick={() => flushOfflineQueue()}
            disabled={currentMode === 'OFFLINE' || (!edgeGateway?.queueSize && !offlineQueueSize)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 font-semibold border border-stone-600 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Force Buffer Flush</span>
          </button>
        </div>
      </div>

      {/* Priority-Based Telemetry Transmission (Section 6) */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#eceae2]">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              Priority-Based Telemetry Scheduler (P0 – P4)
            </h2>
            <p className="text-xs text-stone-500">
              When bandwidth degrades, P0 Life Safety telemetry is strictly guaranteed 100% transmission while lower classes are queued or delta-compressed.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-stone-100 text-stone-700">
            Scheduler: Active
          </span>
        </div>

        <div className="space-y-4">
          {/* P0 */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-2 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>P0 — LIFE SAFETY (Fire alarms, oxygen, personnel beacon, vital heaters)</span>
              </span>
              <span className="font-mono text-rose-700">{tx.p0LifeSafetyPercent}% Transmitted</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-rose-600 transition-all duration-500" style={{ width: `${tx.p0LifeSafetyPercent}%` }}></div>
            </div>
          </div>

          {/* P1 */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-2 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>P1 — CRITICAL INFRASTRUCTURE (Main generators, grid switchboard, AWS weather)</span>
              </span>
              <span className="font-mono text-amber-700">{tx.p1CriticalInfraPercent}% Transmitted</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${tx.p1CriticalInfraPercent}%` }}></div>
            </div>
          </div>

          {/* P2 */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-2 text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>P2 — STATION OPERATIONS (Fuel tank levels, lake pumps, HVAC recirculators)</span>
              </span>
              <span className="font-mono text-blue-700">{tx.p2StationOpsPercent}% Transmitted</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${tx.p2StationOpsPercent}%` }}></div>
            </div>
          </div>

          {/* P3 */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-2 text-cyan-700">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>P3 — SCIENTIFIC INSTRUMENTATION (PPM, DFM, ICM, Seismometer, Riometer, All-Sky)</span>
              </span>
              <span className="font-mono text-cyan-700">{tx.p3ScientificPercent}% Transmitted {tx.p3ScientificPercent < 100 && '(Delta Queued)'}</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${tx.p3ScientificPercent}%` }}></div>
            </div>
          </div>

          {/* P4 */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="flex items-center space-x-2 text-stone-600">
                <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                <span>P4 — ANALYTICS & NON-CRITICAL (High-rate historical dumps, video snapshots)</span>
              </span>
              <span className="font-mono text-stone-600">{tx.p4AnalyticsPercent}% Transmitted {tx.p4AnalyticsPercent < 100 && '(Buffered)'}</span>
            </div>
            <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-stone-400 transition-all duration-500" style={{ width: `${tx.p4AnalyticsPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
