import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  Wind, Thermometer, Gauge, Zap, Flame, Droplets, Radio, Compass, Sun, Cpu, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';

export const BharatiStationDashboard: React.FC = () => {
  const { 
    aws, geomagnetic, atmospheric, subsystems, environment, energy, alerts, triggerScenario 
  } = useSimulation();

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
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-600 text-white rounded-md tracking-wider">
              IN-BHR-02
            </span>
            <h1 className="text-xl font-black text-slate-900">BHARATI RESEARCH STATION DIGITAL TWIN</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Larsemann Hills, Prydz Bay (69°24'41"S 76°11'72"E) • Est. 2012 • Elevation: ~35m ASL • Crew: 47 Main Complex / 72 Summer Cap • CHP 185kW Thermal Co-Gen
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerScenario('blizzard')}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
          >
            Trigger Katabatic Storm
          </button>
          <button
            onClick={() => triggerScenario('generator_failure')}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm"
          >
            Trigger CHP Generator Trip
          </button>
        </div>
      </div>

      {/* 1. WEATHER AWS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">AWS Air Temperature</span>
            <Thermometer className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.temperature ?? environment?.temperature ?? -28.6}°C
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Feels like: {environment?.feelsLike ?? -36.4}°C</span>
            {getStatusBadge(aws?.status || 'OPERATIONAL')}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Wind Velocity</span>
            <Wind className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.windSpeed ?? environment?.windSpeed ?? 18.5} <span className="text-sm font-semibold">km/h</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Dir: {aws?.windDirection ?? environment?.windDirection ?? 'ESE'}</span>
            {getStatusBadge('OPERATIONAL')}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Pressure / Humidity</span>
            <Gauge className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.pressure ?? environment?.pressure ?? 991.2} <span className="text-sm font-semibold">hPa</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Humidity: {aws?.humidity ?? environment?.humidity ?? 58.4}%</span>
            {getStatusBadge('OPERATIONAL')}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Solar Radiation</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">
            {aws?.solarRadiation ?? environment?.solarRadiation ?? 480} <span className="text-sm font-semibold">W/m²</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>Visibility: {aws?.visibility ?? environment?.visibility ?? 15.0} km</span>
            {getStatusBadge('OPERATIONAL')}
          </div>
        </div>

      </div>

      {/* 2. BHARATI CHP POWER ARCHITECTURE & SEAWATER RO PLANT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHP Combined Heat & Power Co-Generation System */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              CHP (Combined Heat & Power) Co-Gen Grid
            </h2>
            {getStatusBadge('OPERATIONAL')}
          </div>

          <p className="text-xs text-slate-500">
            Bharati's energy architecture utilizes MAN 200kW CHP diesel engines co-generating electrical power and thermal waste-heat for building HVAC.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-xs text-amber-800 font-bold">Electrical Power Output</div>
              <div className="text-xl font-black text-amber-950 mt-1">
                {energy?.powerGrid.generatorGenerationKw ?? 320} <span className="text-xs font-semibold">kW</span>
              </div>
              <div className="text-[10px] text-amber-700 mt-1">Demand: {energy?.powerGrid.consumptionKw ?? 340} kW</div>
            </div>

            <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
              <div className="text-xs text-rose-800 font-bold">CHP Thermal Recovery Output</div>
              <div className="text-xl font-black text-rose-950 mt-1">
                {energy?.powerGrid.chpThermalGenerationKw ?? 185} <span className="text-xs font-semibold">kW</span>
              </div>
              <div className="text-[10px] text-rose-700 mt-1">Heating Load: {energy?.powerGrid.heatingLoadKw ?? 170} kW</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-700">CHP Units Status:</div>
            {(energy?.generators || [
              { name: 'CHP Co-Gen Unit #1 (MAN 200kW)', status: 'ONLINE', temperature: 78, loadPercent: 80, thermalOutputKw: 95 },
              { name: 'CHP Co-Gen Unit #2 (MAN 200kW)', status: 'ONLINE', temperature: 76, loadPercent: 80, thermalOutputKw: 90 }
            ]).slice(0, 2).map((gen, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">{gen.name}</span>
                <span className="text-slate-600 font-mono">Load: {gen.loadPercent}% | Temp: {gen.temperature}°C</span>
                {getStatusBadge(gen.status)}
              </div>
            ))}
          </div>
        </div>

        {/* Seawater Intake & RO Desalination + Satellite Comms */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Droplets className="w-5 h-5 text-sky-600" />
              Seawater Pump & Reverse Osmosis Plant
            </h2>
            {getStatusBadge('OPERATIONAL')}
          </div>

          <div className="p-3.5 bg-sky-50 rounded-lg border border-sky-100 text-xs space-y-2">
            <div className="flex justify-between font-bold text-sky-950">
              <span>Seawater Intake Pump (Prydz Bay):</span>
              <span className="text-emerald-700">2.4°C Intake Fluid</span>
            </div>
            <p className="text-sky-800 text-[11px]">
              Thermal waste heat from CHP loop #1 recirculates through intake manifold to prevent frazil ice lockup.
            </p>
            <div className="flex justify-between text-sky-900 font-mono text-[11px] pt-1 border-t border-sky-200/60">
              <span>RO Membrane Pressure: 58 bar</span>
              <span>Daily Production: 3,500 L/day</span>
            </div>
          </div>

          {/* Geomagnetic Suite */}
          <div className="p-3.5 bg-indigo-50/60 rounded-lg border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-indigo-600" />
                Bharati Geomagnetic & GPS Suite
              </span>
              {getStatusBadge('OPERATIONAL')}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-white p-2 rounded border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">PPM Intensity</span>
                <strong className="text-slate-800">{geomagnetic?.ppmTotalIntensity ?? 44120.8} nT</strong>
              </div>
              <div className="bg-white p-2 rounded border border-indigo-100">
                <span className="text-slate-400 block text-[10px]">GPS Time Sync</span>
                <strong className="text-emerald-600">LOCKED (Atomic)</strong>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. BHARATI INFRASTRUCTURE DIGITAL TWIN SUBSYSTEMS */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            Bharati Subsystems & Life Support Digital Twin
          </h2>
          <span className="text-xs text-slate-500 font-medium">15 Subsystems Monitored Live</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(subsystems.length > 0 ? subsystems : [
            { equipmentId: 'BHARATI-MAIN-BUILDING', name: 'Main Station Complex', type: 'MAIN_BUILDING', status: 'RUNNING', loadPercent: 71, temperature: 22.0, healthPercent: 98 },
            { equipmentId: 'BHARATI-CHP-POWER', name: 'CHP Co-Gen Grid', type: 'POWER', status: 'RUNNING', loadPercent: 76, temperature: 72.0, healthPercent: 95 },
            { equipmentId: 'BHARATI-SEAWATER-PUMP', name: 'Seawater Intake & RO Plant', type: 'WATER_PUMP', status: 'RUNNING', loadPercent: 68, temperature: 2.4, healthPercent: 93 },
            { equipmentId: 'BHARATI-HVAC', name: 'Central HVAC & Air Conditioning', type: 'HVAC', status: 'RUNNING', loadPercent: 64, temperature: 21.0, healthPercent: 95 },
            { equipmentId: 'BHARATI-SATCOMM', name: 'Dedicated Satellite Earth Station', type: 'COMMS', status: 'RUNNING', loadPercent: 52, temperature: 24.0, healthPercent: 99 },
            { equipmentId: 'BHARATI-WASTEWATER', name: 'Bioreactor Wastewater Treatment', type: 'WASTEWATER', status: 'RUNNING', loadPercent: 60, temperature: 18.0, healthPercent: 94 }
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
