import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Radio, 
  RefreshCw, 
  ShieldAlert, 
  Sliders, 
  Zap,
  Filter,
  Info
} from 'lucide-react';
import { SensorQualityFlag } from '../types';

export const SensorHealthPage: React.FC = () => {
  const { 
    activeStationId, 
    sensors, 
    sensorHealthMap, 
    injectSensorFault, 
    refreshSensorHealth, 
    userRole 
  } = useSimulation();

  const [selectedSensorId, setSelectedSensorId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isInjecting, setIsInjecting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const categories = ['ALL', 'METEOROLOGY', 'GEOMAGNETISM', 'SEISMOLOGY', 'ATMOSPHERE', 'UTILITY', 'LIFE_SUPPORT'];

  const filteredSensors = sensors.filter(s => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    return true;
  });

  const totalSensors = sensors.length;
  const onlineCount = sensors.filter(s => s.operationalStatus === 'OPERATIONAL').length;
  const offlineCount = sensors.filter(s => s.operationalStatus === 'OFFLINE').length;
  const stuckCount = Object.values(sensorHealthMap).filter(h => h.isStuck).length;
  
  const avgHealth = totalSensors > 0
    ? Math.round(Object.values(sensorHealthMap).reduce((acc, h) => acc + (h.healthPercent || 0), 0) / Math.max(1, Object.keys(sensorHealthMap).length))
    : 100;

  const handleFault = async (faultType: 'STUCK' | 'NOISY' | 'OFFLINE' | 'RESTORE') => {
    if (!selectedSensorId) return;
    setIsInjecting(true);
    try {
      await injectSensorFault(selectedSensorId, faultType);
      setActionMessage(`Fault [${faultType}] injected into ${selectedSensorId}. Telemetry engine updated.`);
      setTimeout(() => setActionMessage(null), 4000);
    } catch (e: any) {
      setActionMessage(`Error: ${e.message}`);
    } finally {
      setIsInjecting(false);
    }
  };

  const getQualityBadge = (quality: SensorQualityFlag) => {
    switch (quality) {
      case 'GOOD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">GOOD</span>;
      case 'SUSPECT':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">SUSPECT</span>;
      case 'BAD':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300">BAD</span>;
      case 'STALE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-300">STALE</span>;
      case 'MISSING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-stone-200 text-stone-800 border border-stone-400">MISSING</span>;
      case 'SIMULATED':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-100 text-sky-800 border border-sky-300">SIMULATED</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Layer 2: Sensor Health & Quality Engine</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {activeStationId === 'maitri' ? 'Maitri' : 'Bharati'} Sensor Health Matrix
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Autonomous health auditing calculating freshness, stuck value detection, statistical noise, missing packet counts, and ISO-compatible data quality flags.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => refreshSensorHealth()}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll Health</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Station Health Score</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${avgHealth >= 90 ? 'text-emerald-600' : avgHealth >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
              {avgHealth}%
            </span>
            <span className="text-xs text-stone-500 font-medium">Fleet Mean</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${avgHealth >= 90 ? 'bg-emerald-500' : avgHealth >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} 
              style={{ width: `${avgHealth}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Active Instrumentation</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-blue-900">{onlineCount}</span>
            <span className="text-xs text-stone-500 font-medium">/ {totalSensors} Online</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{totalSensors - offlineCount} reporting telemetry</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Stuck / Noisy Values</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${stuckCount > 0 ? 'text-amber-600' : 'text-stone-800'}`}>
              {stuckCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">Flagged</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            {stuckCount > 0 ? 'POSSIBLE STUCK SENSOR' : 'Nominal variability'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Offline / Stale Timeouts</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${offlineCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {offlineCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">Unresponsive</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Heartbeat threshold: 15.0s
          </div>
        </div>
      </div>

      {/* Interactive Fault Injection Box (For Demo & Verification) */}
      <div className="bg-stone-900 text-white p-5 rounded-2xl shadow-md border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase">Interactive Sensor Fault Injection & Quality Verification</h2>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
            Role: {userRole} (Authorized)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-400 mb-1">Select Target Sensor</label>
            <select
              value={selectedSensorId}
              onChange={(e) => setSelectedSensorId(e.target.value)}
              className="w-full bg-stone-800 text-stone-100 border border-stone-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Choose Sensor from Registry --</option>
              {sensors.map((s) => (
                <option key={s.sensorId} value={s.sensorId}>
                  {s.sensorId} ({s.name} - {s.location})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex flex-wrap items-end gap-2">
            <button
              onClick={() => handleFault('STUCK')}
              disabled={!selectedSensorId || isInjecting}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs transition"
            >
              Simulate STUCK Value
            </button>
            <button
              onClick={() => handleFault('NOISY')}
              disabled={!selectedSensorId || isInjecting}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs transition"
            >
              Simulate NOISE / Spike
            </button>
            <button
              onClick={() => handleFault('OFFLINE')}
              disabled={!selectedSensorId || isInjecting}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs transition"
            >
              Simulate OFFLINE Drop
            </button>
            <button
              onClick={() => handleFault('RESTORE')}
              disabled={!selectedSensorId || isInjecting}
              className="flex-1 min-w-[120px] px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs transition"
            >
              RESTORE Nominal
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-stone-800 border border-amber-500/40 text-amber-300 text-xs font-mono">
            {actionMessage}
          </div>
        )}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-[#e5e3dc] hover:bg-[#edebe4]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Sensor Table */}
      <div className="bg-white rounded-2xl border border-[#e5e3dc] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium border-collapse">
            <thead>
              <tr className="bg-[#f8f7f4] border-b border-[#e5e3dc] text-stone-500 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Sensor ID & Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Live Value</th>
                <th className="py-3 px-4">Quality Flag</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Freshness</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceae2]">
              {filteredSensors.map((s) => {
                const health = sensorHealthMap[s.sensorId] || {
                  healthPercent: 98,
                  dataQuality: s.quality || 'GOOD',
                  operationalStatus: s.operationalStatus,
                  calibrationStatus: s.calibrationStatus,
                  isStuck: false,
                  isNoisy: false,
                  missingPacketsCount: 0
                };

                const secondsAgo = Math.max(0, Math.round((Date.now() - new Date(s.lastPacketTimestamp || Date.now()).getTime()) / 1000));

                return (
                  <tr key={s.sensorId} className="hover:bg-[#fcfbf9] transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{s.sensorId}</div>
                      <div className="text-[11px] text-stone-500">{s.name} • {s.location}</div>
                    </td>

                    <td className="py-3 px-4 text-stone-600">
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-bold">
                        {s.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      {s.currentValue !== undefined ? `${s.currentValue} ${s.unit}` : 'N/A'}
                    </td>

                    <td className="py-3 px-4">
                      {getQualityBadge(health.dataQuality)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-bold ${health.healthPercent >= 90 ? 'text-emerald-700' : health.healthPercent >= 70 ? 'text-amber-700' : 'text-rose-700'}`}>
                          {health.healthPercent}%
                        </span>
                        <div className="w-16 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${health.healthPercent >= 90 ? 'bg-emerald-500' : health.healthPercent >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                            style={{ width: `${health.healthPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                      {secondsAgo < 5 ? (
                        <span className="text-emerald-600 font-semibold">{secondsAgo}s ago</span>
                      ) : secondsAgo < 15 ? (
                        <span className="text-amber-600 font-semibold">{secondsAgo}s ago</span>
                      ) : (
                        <span className="text-rose-600 font-bold">{secondsAgo}s (STALE)</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        s.priority === 'P0_LIFE_SAFETY' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        s.priority === 'P1_CRITICAL_INFRASTRUCTURE' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        s.priority === 'P2_STATION_OPERATIONS' ? 'bg-blue-100 text-blue-800' :
                        'bg-stone-100 text-stone-600'
                      }`}>
                        {s.priority.split('_')[0]}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {health.isStuck && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold animate-pulse">
                            STUCK
                          </span>
                        )}
                        {s.operationalStatus === 'OFFLINE' ? (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                            OFFLINE
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            LIVE
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSensorId(s.sensorId);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold"
                        >
                          Inject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
