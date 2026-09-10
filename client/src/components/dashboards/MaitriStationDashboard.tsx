import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  Wind, Thermometer, Gauge, Activity, ShieldAlert, Zap, Flame, Droplets, Radio, Compass, Sun, Eye, ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MaitriStationDashboard: React.FC = () => {
  const { 
    aws, geomagnetic, atmospheric, seismic, subsystems, environment, energy, alerts, incidents, triggerScenario 
  } = useSimulation();

  // Simulated seismic live graph data
  const seismicWaveform = [
    { time: '10:00', x: 0.002, y: 0.001, z: 0.008 },
    { time: '10:05', x: 0.005, y: -0.002, z: 0.012 },
    { time: '10:10', x: -0.003, y: 0.004, z: 0.005 },
    { time: '10:15', x: 0.001, y: -0.003, z: -0.002 },
    { time: '10:20', x: -0.004, y: 0.002, z: 0.003 },
    { time: '10:25', x: 0.006, y: -0.001, z: -0.006 },
    { time: '10:30', x: -0.002, y: 0.003, z: 0.004 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
      case 'RUNNING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">OPERATIONAL</span>;
      case 'SIMULATED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">SIMULATED</span>;
      case 'MAINTENANCE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">MAINTENANCE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 bg-cyan-600 text-white rounded-md tracking-wider">
              IN-MTR-01
            </span>
            <h1 className="text-xl font-black text-slate-900">MAITRI RESEARCH STATION DIGITAL TWIN</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Schirmacher Oasis, Queen Maud Land (70°45'S 11°44'E) • Est. 1988 • Elevation: ~50m • Crew: 47 Wintering (+25 Summer Camp = 72 Cap)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerScenario('blizzard')}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
          >
            Trigger Blizzard
          </button>
          <button
            onClick={() => triggerScenario('generator_failure')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
          >
            Trigger Generator Failover
          </button>
        </div>
      </div>

      {/* 1. AWS WEATHER & ATMOSPHERIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Air Temp */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">AWS Air Temperature</span>
            <Thermometer className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.temperature ?? environment?.temperature ?? -32.4}°C
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Feels like: {environment?.feelsLike ?? -42.1}°C</span>
            {getStatusBadge(aws?.status || 'OPERATIONAL')}
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Wind Velocity</span>
            <Wind className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.windSpeed ?? environment?.windSpeed ?? 14.2} <span className="text-sm font-semibold">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Dir: {aws?.windDirection ?? environment?.windDirection ?? 'WSW'}</span>
            {getStatusBadge('OPERATIONAL')}
          </div>
        </div>

        {/* Pressure & Humidity */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pressure / Humidity</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.pressure ?? environment?.pressure ?? 982.4} <span className="text-sm font-semibold">hPa</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Humidity: {aws?.humidity ?? environment?.humidity ?? 61.2}%</span>
            {getStatusBadge('OPERATIONAL')}
          </div>
        </div>

        {/* Solar Radiation */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Solar Radiation</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.solarRadiation ?? environment?.solarRadiation ?? 410} <span className="text-sm font-semibold">W/m²</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Visibility: {aws?.visibility ?? environment?.visibility ?? 12.5} km</span>
            {getStatusBadge('OPERATIONAL')}
          </div>
        </div>

      </div>

      {/* 2. GEOMAGNETIC SUITE & SEISMIC MONITORING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geomagnetic Instrumentation Panel */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Maitri Geomagnetic Suite
            </h2>
            {getStatusBadge('OPERATIONAL')}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* PPM */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 font-bold">Proton Precession Magnetometer (PPM)</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {geomagnetic?.ppmTotalIntensity ?? 43250.4} <span className="text-xs font-normal">nT</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Total Field Intensity</div>
            </div>

            {/* DIM */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-xs text-slate-500 font-bold">Declination-Inclination (DIM)</div>
              <div className="text-lg font-black text-slate-900 mt-1">
                {geomagnetic?.dimDeclination ?? -18.4}° / {geomagnetic?.dimInclination ?? -64.7}°
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Magnetic Declination / Inclination</div>
            </div>
          </div>

          {/* DFM 3-Component */}
          <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100">
            <div className="text-xs font-bold text-indigo-900 mb-2">Digital Fluxgate Magnetometer (DFM 3-Axis)</div>
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              <div className="bg-white p-2 rounded text-center border border-indigo-100">
                <span className="text-slate-400 block text-[9px]">X (N-S)</span>
                <strong className="text-indigo-950">{geomagnetic?.dfmX ?? 18420.2} nT</strong>
              </div>
              <div className="bg-white p-2 rounded text-center border border-indigo-100">
                <span className="text-slate-400 block text-[9px]">Y (E-W)</span>
                <strong className="text-indigo-950">{geomagnetic?.dfmY ?? -2150.8} nT</strong>
              </div>
              <div className="bg-white p-2 rounded text-center border border-indigo-100">
                <span className="text-slate-400 block text-[9px]">Z (Vert)</span>
                <strong className="text-indigo-950">{geomagnetic?.dfmZ ?? -38950.6} nT</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Live Seismic Monitoring (Broadband Seismometer) */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-rose-600" />
              Broadband Seismic Monitoring (3-Channel)
            </h2>
            {getStatusBadge(seismic?.broadbandStatus || 'OPERATIONAL')}
          </div>

          <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-lg">
            <div>Activity: <strong className="text-slate-900">{seismic?.activityLevel || 'QUIET'}</strong></div>
            <div>Magnitude: <strong className="text-rose-600">M {seismic?.magnitude || 1.2}</strong></div>
            <div>GPS Time Sync: <strong className="text-emerald-600">LOCKED</strong></div>
            <div>Buffer: <strong className="text-slate-700">{seismic?.localBufferUsagePercent || 12.4}%</strong></div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seismicWaveform}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="x" stroke="#dc2626" strokeWidth={2} dot={false} name="Channel X (N-S)" />
                <Line type="monotone" dataKey="y" stroke="#2563eb" strokeWidth={2} dot={false} name="Channel Y (E-W)" />
                <Line type="monotone" dataKey="z" stroke="#16a34a" strokeWidth={2} dot={false} name="Channel Z (Vert)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3. MAITRI INFRASTRUCTURE DIGITAL TWIN SUBSYSTEMS */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-sky-600" />
            Maitri Infrastructure & Life-Support Subsystems
          </h2>
          <span className="text-xs text-slate-500 font-medium">13 Subsystems Monitored Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(subsystems.length > 0 ? subsystems : [
            { equipmentId: 'MAITRI-MAIN-BUILDING', name: 'Main Station Building', type: 'MAIN_BUILDING', status: 'RUNNING', loadPercent: 68, temperature: 21.4, healthPercent: 96 },
            { equipmentId: 'MAITRI-FUEL-FARM', name: 'Fuel Farm (80,000L Storage)', type: 'FUEL_FARM', status: 'RUNNING', loadPercent: 78, temperature: -12.0, healthPercent: 98 },
            { equipmentId: 'MAITRI-PUMP-LAKE', name: 'Priyadarshini Lake Water Pump House', type: 'WATER_PUMP', status: 'RUNNING', loadPercent: 62, temperature: 3.8, healthPercent: 91 },
            { equipmentId: 'MAITRI-HEATING-01', name: 'Central Hydronic Heating System', type: 'HEATING', status: 'RUNNING', loadPercent: 75, temperature: 68.4, healthPercent: 94 },
            { equipmentId: 'MAITRI-POWER-REG', name: 'Regulated Electrical Power Grid', type: 'POWER', status: 'RUNNING', loadPercent: 72, temperature: 48.0, healthPercent: 96 },
            { equipmentId: 'MAITRI-HOT-WATER', name: 'Hot Water Circulation Loop', type: 'HOT_WATER', status: 'RUNNING', loadPercent: 65, temperature: 62.0, healthPercent: 95 }
          ]).map((sub, i) => (
            <div key={i} className="p-3.5 bg-slate-50/70 rounded-lg border border-slate-200/80 hover:bg-slate-50 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 truncate">{sub.name}</span>
                {getStatusBadge(sub.status)}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Load: <strong className="text-slate-800">{sub.loadPercent}%</strong></span>
                <span>Temp: <strong className="text-slate-800">{sub.temperature}°C</strong></span>
                <span>Health: <strong className="text-emerald-700">{sub.healthPercent}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
