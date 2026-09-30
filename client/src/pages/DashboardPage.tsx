import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { NavTab } from '../components/layout/Sidebar';
import { Station3DCanvas } from '../components/digitaltwin/Station3DCanvas';
import { Antarctic2DMap } from '../components/map/Antarctic2DMap';
import { audioService } from '../services/AudioService';
import { 
  Zap, 
  Thermometer, 
  Droplets, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp, 
  Compass, 
  Flame, 
  Activity, 
  Sparkles, 
  Bot, 
  CloudSnow,
  Users,
  Fuel,
  BatteryCharging,
  Maximize2,
  Layers,
  Rotate3d,
  ZoomIn,
  Bell,
  Mic,
  PlayCircle,
  FileText,
  ShieldAlert,
  Wifi,
  Package,
  PlusCircle,
  MinusCircle,
  ExternalLink
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { 
    activeStationId, 
    setActiveStationId,
    environment, 
    energy, 
    equipment, 
    alerts, 
    incidents,
    triggerScenario,
    simulationState,
    startDemo
  } = useSimulation();

  const [view3DMode, setView3DMode] = useState<'exterior' | 'interior' | 'thermal'>('exterior');
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
  const [sosTriggered, setSosTriggered] = useState(false);

  // Station Stats Dynamic Data
  const maitriPower = activeStationId === 'maitri' ? (energy?.powerGrid.consumptionKw || 310.0) : 310.0;
  const bharatiPower = activeStationId === 'bharati' ? (energy?.powerGrid.consumptionKw || 284.0) : 284.0;
  const currentTemp = environment?.temperature?.toFixed(1) || '-32.4';
  const windSpeed = environment?.windSpeed?.toFixed(0) || '27';
  const pressure = environment?.pressure?.toFixed(1) || '981.7';

  return (
    <div className="space-y-4 font-sans select-none text-slate-800">
      
      {/* ========================================================================= */}
      {/* 1. TOP ROW: DUAL STATION SUMMARY CARDS + ANTARCTIC WEATHER (3-COLUMN GRID) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Card 1: MAITRI STATION (Schirmacher Oasis) */}
        <div 
          onClick={() => setActiveStationId('maitri')}
          className={`lg:col-span-4 bg-white rounded-xl border p-3.5 shadow-xs transition cursor-pointer relative overflow-hidden ${
            activeStationId === 'maitri' ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-14 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                <img 
                  src="/maitri-3d-station-view.jpg" 
                  alt="Maitri Station" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback gradient if image not loaded
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>MAITRI STATION</span>
                  <span className="text-[10px] font-normal text-slate-500">(Schirmacher Oasis)</span>
                </div>
                <div className="text-[10px] font-mono font-medium text-slate-500 flex items-center gap-1">
                  <span>📍 70.76°S, 11.73°E</span>
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>OPERATIONAL</span>
            </span>
          </div>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-center">
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-blue-600 mb-0.5">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Crew</div>
              <div className="text-xs font-black text-slate-800">47</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-amber-500 mb-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Power Load</div>
              <div className="text-xs font-black text-slate-800">{maitriPower} kW</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-orange-600 mb-0.5">
                <Fuel className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Fuel Reserve</div>
              <div className="text-xs font-black text-slate-800">48.6 Days</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-emerald-600 mb-0.5">
                <BatteryCharging className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Battery SOC</div>
              <div className="text-xs font-black text-slate-800">88%</div>
            </div>
          </div>
        </div>

        {/* Card 2: BHARATI STATION (Coastal Modern) */}
        <div 
          onClick={() => setActiveStationId('bharati')}
          className={`lg:col-span-4 bg-white rounded-xl border p-3.5 shadow-xs transition cursor-pointer relative overflow-hidden ${
            activeStationId === 'bharati' ? 'border-sky-600 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-14 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                <img 
                  src="/bharati-station-view.jpg" 
                  alt="Bharati Station" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>BHARATI STATION</span>
                  <span className="text-[10px] font-normal text-slate-500">(Coastal Modern)</span>
                </div>
                <div className="text-[10px] font-mono font-medium text-slate-500 flex items-center gap-1">
                  <span>📍 69.40°S, 76.32°E</span>
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>OPERATIONAL</span>
            </span>
          </div>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-center">
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-blue-600 mb-0.5">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Crew</div>
              <div className="text-xs font-black text-slate-800">35</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-amber-500 mb-0.5">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Power Load</div>
              <div className="text-xs font-black text-slate-800">{bharatiPower} kW</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-orange-600 mb-0.5">
                <Fuel className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Fuel Reserve</div>
              <div className="text-xs font-black text-slate-800">62.3 Days</div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-50">
              <div className="flex items-center justify-center text-emerald-600 mb-0.5">
                <BatteryCharging className="w-3.5 h-3.5" />
              </div>
              <div className="text-[9px] text-slate-500 font-medium">Battery SOC</div>
              <div className="text-xs font-black text-slate-800">92%</div>
            </div>
          </div>
        </div>

        {/* Card 3: ANTARCTIC WEATHER (MAITRI / BHARATI) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">
              ANTARCTIC WEATHER ({activeStationId.toUpperCase()})
            </span>
            <button 
              onClick={() => onNavigate('environment')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>View Forecast</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between my-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <CloudSnow className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 leading-none">
                  {currentTemp}°C
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Feels like -39.5°C
                </div>
              </div>
            </div>

            {/* Weather Metrics List */}
            <div className="text-right text-[10px] text-slate-600 font-medium space-y-0.5">
              <div><span className="text-slate-400">Wind:</span> <strong className="text-slate-800">{windSpeed} km/h WSW</strong></div>
              <div><span className="text-slate-400">Pressure:</span> <strong className="text-slate-800">{pressure} hPa</strong></div>
              <div><span className="text-slate-400">Humidity:</span> <strong className="text-slate-800">62%</strong></div>
              <div><span className="text-slate-400">Visibility:</span> <strong className="text-slate-800">8 km</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MIDDLE ROW: 3D DIGITAL TWIN + REGIONAL MAP + EMERGENCY & QUICK ACTIONS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Column 1: 3D DIGITAL TWIN CANVAS (5/12) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Box className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-black uppercase text-slate-900 tracking-tight">
                3D DIGITAL TWIN — {activeStationId.toUpperCase()} STATION
              </span>
            </div>

            {/* View Toggles */}
            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
              <button
                onClick={() => setView3DMode('exterior')}
                className={`px-2 py-0.5 rounded-md transition ${view3DMode === 'exterior' ? 'bg-white text-blue-800 shadow-2xs' : 'text-slate-600'}`}
              >
                Exterior View
              </button>
              <button
                onClick={() => setView3DMode('interior')}
                className={`px-2 py-0.5 rounded-md transition ${view3DMode === 'interior' ? 'bg-white text-blue-800 shadow-2xs' : 'text-slate-600'}`}
              >
                Interior View
              </button>
              <button
                onClick={() => setView3DMode('thermal')}
                className={`px-2 py-0.5 rounded-md transition ${view3DMode === 'thermal' ? 'bg-white text-blue-800 shadow-2xs' : 'text-slate-600'}`}
              >
                Thermal View
              </button>
              <button 
                onClick={() => onNavigate('twin')} 
                title="Full Screen 3D Twin"
                className="p-1 text-slate-500 hover:text-slate-800"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3D Visualizer Canvas */}
          <div className="h-60 rounded-xl overflow-hidden relative border border-slate-200 bg-slate-900">
            <Station3DCanvas stationId={activeStationId} />

            {/* On-Canvas Tag Overlays */}
            <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
              <span className="px-2 py-0.5 rounded bg-blue-900/80 backdrop-blur-xs text-sky-200 text-[9px] font-mono font-bold border border-blue-500/40">
                • Power House (2x Kirloskar)
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[9px] font-mono font-bold border border-slate-700">
                • Living & Accommodation
              </span>
            </div>

            <div className="absolute top-2 right-2 flex flex-col gap-1 pointer-events-none text-right">
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[9px] font-mono font-bold border border-emerald-600/40">
                • Priyadarshini Trace Loop: +3.2°C
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950/80 backdrop-blur-xs text-amber-300 text-[9px] font-mono font-bold border border-amber-600/40">
                • AN-8 Tank Farm (80kL)
              </span>
            </div>

            {/* Bottom 3D Canvas Controls */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] text-slate-300 font-mono">
              <span>30 Sep 2026 12:27 IST | Live Simulation</span>
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="hover:text-white cursor-pointer">🔄 Rotate</span>
                <span className="hover:text-white cursor-pointer">🔍 Zoom</span>
                <span className="hover:text-white cursor-pointer">📑 Layers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: ANTARCTIC MAP & SATELLITE TRACKING (4/12) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Map className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-black uppercase text-slate-900 tracking-tight">
                ANTARCTIC MAP & SATELLITE TRACKING
              </span>
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
              <button
                onClick={() => setMapMode('map')}
                className={`px-2 py-0.5 rounded-md transition ${mapMode === 'map' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'}`}
              >
                Map View
              </button>
              <button
                onClick={() => setMapMode('satellite')}
                className={`px-2 py-0.5 rounded-md transition ${mapMode === 'satellite' ? 'bg-white text-emerald-800 shadow-2xs' : 'text-slate-600'}`}
              >
                Satellite View
              </button>
            </div>
          </div>

          {/* Map Viewer Canvas */}
          <div className="h-60 rounded-xl overflow-hidden relative border border-slate-200 bg-[#091528]">
            <Antarctic2DMap />

            {/* Satellite Pass Tag */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
              🛰️ Satellite Pass in 12 min
            </div>

            {/* Map Legend */}
            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between bg-slate-950/80 backdrop-blur-xs px-2 py-1 rounded-lg text-[9px] text-slate-300">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Maitri</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Bharati</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Satellite</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> UAV Patrol</span>
            </div>
          </div>
        </div>

        {/* Column 3: EMERGENCY PROTOCOL & QUICK ACTIONS (3/12) */}
        <div className="lg:col-span-3 space-y-3 flex flex-col justify-between">
          
          {/* Emergency SOS Box */}
          <div className="bg-rose-50 rounded-xl border border-rose-200 p-3 text-left shadow-2xs">
            <div className="flex items-center space-x-1.5 text-rose-800 font-extrabold text-[11px] uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>EMERGENCY PROTOCOL</span>
            </div>
            <div className="text-[11px] font-black text-slate-900 leading-snug">
              SOS / Station Mayday Broadcaster
            </div>
            <p className="text-[10px] text-slate-600 mt-1 leading-normal">
              Triggers highest priority satcom beacon to NCPOR Goa HQ, McMurdo Rescue Center, and Novolazarevskaya.
            </p>
            
            <button
              onClick={() => {
                setSosTriggered(true);
                audioService.startCriticalAlarmLoop("EMERGENCY DISTRESS BEACON ACTIVATED. TRANSMITTING POLAR SITREP TO NCPOR GOA HEADQUARTERS", "sos-beacon");
              }}
              className="w-full mt-2.5 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-black text-xs shadow-xs transition flex items-center justify-center space-x-1.5"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>((•)) TRIGGER SOS BEACON</span>
            </button>
          </div>

          {/* Quick Actions 4-Button Grid */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
            <div className="text-[11px] font-black uppercase text-slate-900 tracking-tight mb-2">
              QUICK ACTIONS
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => audioService.startCriticalAlarmLoop("Test alarm active. All life support nominal.", "test-alarm")}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center space-x-1.5 text-xs font-bold text-slate-800"
              >
                <Bell className="w-3.5 h-3.5 text-amber-600" />
                <span>Test Alarm</span>
              </button>
              
              <button
                onClick={() => audioService.speakSITREP(`All station systems nominal at ${activeStationId.toUpperCase()}. Power grid stable at ${maitriPower} kW.`)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center space-x-1.5 text-xs font-bold text-slate-800"
              >
                <Mic className="w-3.5 h-3.5 text-blue-600" />
                <span>Voice SITREP</span>
              </button>

              <button
                onClick={() => onNavigate('scenarios')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center space-x-1.5 text-xs font-bold text-slate-800"
              >
                <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Run Simulation</span>
              </button>

              <button
                onClick={() => onNavigate('compare')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition flex items-center space-x-1.5 text-xs font-bold text-slate-800"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM ROW: LIVE TELEMETRY TABLE + RUNWAY + ASSET HEALTH + SATELLITE   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Table 1: LIVE TELEMETRY (MAITRI) (4/12) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-slate-900 tracking-tight">
              LIVE TELEMETRY ({activeStationId.toUpperCase()})
            </span>
            <button 
              onClick={() => onNavigate('analytics')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase">
                  <th className="pb-1 font-semibold">Parameter</th>
                  <th className="pb-1 font-semibold">Current Value</th>
                  <th className="pb-1 font-semibold">Status</th>
                  <th className="pb-1 font-semibold text-right">Trend (24h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-1 font-medium">Air Temperature</td>
                  <td className="py-1 font-bold">{currentTemp}°C</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Wind Speed</td>
                  <td className="py-1 font-bold">{windSpeed} km/h</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Wind Direction</td>
                  <td className="py-1 font-bold">WSW (247°)</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Pressure</td>
                  <td className="py-1 font-bold">{pressure} hPa</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Power Load</td>
                  <td className="py-1 font-bold">{maitriPower} kW</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Battery SOC</td>
                  <td className="py-1 font-bold">88%</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Fuel Reserve</td>
                  <td className="py-1 font-bold">48.6 days</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold">Monitor</span></td>
                  <td className="py-1 text-right text-amber-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">Indoor Temp (Lab)</td>
                  <td className="py-1 font-bold">18.2 °C</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
                <tr>
                  <td className="py-1 font-medium">CO₂ Level</td>
                  <td className="py-1 font-bold">612 ppm</td>
                  <td className="py-1"><span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold">Normal</span></td>
                  <td className="py-1 text-right text-emerald-600 font-mono">───</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 2: STATION SURVIVAL RUNWAY (3/12) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-slate-900 tracking-tight">
              STATION SURVIVAL RUNWAY
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[9px] font-bold">
              Autonomous
            </span>
          </div>

          <div className="space-y-3 my-1">
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">⛽ Arctic Diesel Fuel</span>
                <span className="text-orange-600">48.6 Days Left</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">🍞 Food & Rations</span>
                <span className="text-amber-600">8 Days Left</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">💧 Potable Meltwater</span>
                <span className="text-blue-600">60 Days Left</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">🩹 Medical Supplies</span>
                <span className="text-rose-600">115 Days Left</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-rose-500 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: ASSET HEALTH MATRIX (2/12) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-black uppercase text-slate-900 tracking-tight">
              ASSET HEALTH
            </span>
            <button 
              onClick={() => onNavigate('infrastructure')}
              className="text-[10px] font-bold text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>

          {/* Donut / Circular Gauge */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-t-emerald-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-sm font-black text-slate-900">100%</span>
              <span className="text-[8px] font-bold text-emerald-600 uppercase">Optimal</span>
            </div>
          </div>

          <div className="text-[10px] space-y-1 text-slate-600 font-medium">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Healthy</span>
              <strong>4</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Warning</span>
              <strong>0</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical</span>
              <strong>0</strong>
            </div>
          </div>
        </div>

        {/* Card 4: SATELLITE CONNECTIVITY (3/12) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase text-slate-900 tracking-tight">
              SATELLITE CONNECTIVITY
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-bold flex items-center gap-1 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>CONNECTED</span>
            </span>
          </div>

          <div className="text-[10px] space-y-1.5 divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Mode:</span>
              <strong className="text-slate-800">Local / High Bandwidth</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Uplink:</span>
              <strong className="text-slate-800 font-mono">207 B/s</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Downlink:</span>
              <strong className="text-slate-800 font-mono">0.26 KB/s</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Latency:</span>
              <strong className="text-slate-800 font-mono">45 ms</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Queue:</span>
              <strong className="text-slate-800 font-mono">0 Pkts</strong>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Payload Reduction:</span>
              <strong className="text-emerald-600 font-mono">92.4%</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
