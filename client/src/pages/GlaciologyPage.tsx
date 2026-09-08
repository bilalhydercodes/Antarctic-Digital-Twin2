import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ShieldAlert, 
  Activity, 
  Compass, 
  Map, 
  Thermometer, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  FileSpreadsheet,
  Zap,
  TrendingDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const GlaciologyPage: React.FC = () => {
  const { activeStationId, environment } = useSimulation();
  const isMaitri = activeStationId === 'maitri';
  const [selectedZone, setSelectedZone] = useState<string>('zone-1');

  const temp = environment?.temperature ?? (isMaitri ? -24.5 : -21.8);
  const wind = environment?.windSpeed ?? (isMaitri ? 28 : 38);

  const meanThickness = isMaitri ? (241.5 - (wind * 0.02)).toFixed(1) : (185.2 - (wind * 0.03)).toFixed(1);
  const bedrockTemp = (temp + 9.7).toFixed(1);
  const seaIceRadius = Math.max(5, (isMaitri ? 22 : 18) - (wind * 0.25)).toFixed(1);

  // Dynamic SAR Satellite radar ice thickness data
  const iceShelfData = [
    { time: '00:00', iceThicknessM: Number(meanThickness) + 3.5, strainRate: 1.2, crevasseRisk: 'LOW' },
    { time: '04:00', iceThicknessM: Number(meanThickness) + 2.1, strainRate: 1.4, crevasseRisk: 'LOW' },
    { time: '08:00', iceThicknessM: Number(meanThickness) + 0.8, strainRate: 2.1, crevasseRisk: 'MODERATE' },
    { time: '12:00', iceThicknessM: Number(meanThickness) - 2.5, strainRate: 3.5, crevasseRisk: 'HIGH' },
    { time: '16:00', iceThicknessM: Number(meanThickness) - 1.2, strainRate: 2.8, crevasseRisk: 'MODERATE' },
    { time: '20:00', iceThicknessM: Number(meanThickness) + 1.8, strainRate: 1.6, crevasseRisk: 'LOW' },
  ];

  const crevasseZones = [
    { id: 'zone-1', name: isMaitri ? 'Schirmacher Glacier Fracture A' : 'Prydz Bay Shelf Strain Zone', depth: '18.4 m', width: '2.1 m', status: 'CRITICAL', GPS: isMaitri ? '70.78°S, 11.65°E' : '69.38°S, 76.22°E' },
    { id: 'zone-2', name: isMaitri ? 'Lake Priyadarshini Ice Margin' : 'Larsemann Ridge Calving Wall', depth: '12.1 m', width: '1.4 m', status: 'WARNING', GPS: isMaitri ? '70.75°S, 11.78°E' : '69.42°S, 76.15°E' },
    { id: 'zone-3', name: isMaitri ? 'South Runway Permafrost Rift' : 'Helipad Bedrock Anchor Fracture', depth: '6.8 m', width: '0.8 m', status: 'STABLE', GPS: isMaitri ? '70.76°S, 11.71°E' : '69.40°S, 76.19°E' },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-stone-100">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/50 text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-100">
                Glaciology & Sentinel-1 SAR Radar Suite
              </h1>
              <p className="text-xs text-stone-400">
                Synthetic Aperture Radar Ice Shelf Deformation & Crevasse Risk Analysis • {activeStationId.toUpperCase()} Station
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs font-mono text-stone-300">
            SAR PASS: <span className="text-cyan-400 font-bold">SENTINEL-1A (2.4 GHz)</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-xs font-mono text-emerald-300 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>ICE RADAR ACTIVE</span>
          </div>
        </div>
      </div>

      {/* ── TOP METRIC CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Mean Ice Sheet Thickness</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">{meanThickness} m</div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center space-x-1">
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
            <span>-0.4m seasonal melt rate</span>
          </div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Crevasse Propagation Index</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{(3.5 + wind * 0.02).toFixed(1)} strain/yr</div>
          <div className="text-[11px] text-amber-300/80 mt-1">Moderate calving risk detected</div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Sea Ice Fastness Radius</span>
            <Compass className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">{seaIceRadius} km</div>
          <div className="text-[11px] text-stone-400 mt-1">Safe vessel mooring zone</div>
        </div>

        <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Permafrost Bedrock Temp</span>
            <Thermometer className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-300 font-mono">{bedrockTemp} °C</div>
          <div className="text-[11px] text-emerald-400 mt-1">Stilts structural anchor optimal</div>
        </div>
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive SAR Radar & Thickness Graph */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulated SAR Radar Viewport */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-stone-200 uppercase tracking-wider flex items-center space-x-2">
                <Map className="w-4 h-4 text-cyan-400" />
                <span>SAR Interferometry & Fracture Heatmap</span>
              </h2>
              <span className="text-xs text-stone-400 font-mono">Resolution: 5m/pixel</span>
            </div>

            {/* Radar Canvas Graphic Container */}
            <div className="relative w-full h-72 bg-slate-950 rounded-xl border border-cyan-900/40 overflow-hidden flex items-center justify-center">
              {/* Radar Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#0891b2_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
              <div className="absolute w-48 h-48 border border-cyan-500/20 rounded-full animate-ping"></div>
              <div className="absolute w-32 h-32 border border-cyan-500/40 rounded-full"></div>

              {/* Station Anchor Dot */}
              <div className="absolute flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-cyan-400 ring-4 ring-cyan-500/30 animate-pulse"></div>
                <span className="text-[10px] font-bold font-mono text-cyan-200 mt-1 bg-stone-900/90 px-2 py-0.5 rounded border border-cyan-700/50">
                  {activeStationId.toUpperCase()} CORE
                </span>
              </div>

              {/* Crevasse Hazard Pins */}
              <div className="absolute top-12 left-20 flex items-center space-x-1 cursor-pointer" onClick={() => setSelectedZone('zone-1')}>
                <div className="w-3 h-3 rounded-full bg-rose-500 animate-bounce"></div>
                <span className="text-[9px] font-mono font-bold bg-rose-950/90 text-rose-200 px-1.5 py-0.5 rounded border border-rose-600">FRACTURE A</span>
              </div>

              <div className="absolute bottom-16 right-28 flex items-center space-x-1 cursor-pointer" onClick={() => setSelectedZone('zone-2')}>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-[9px] font-mono font-bold bg-amber-950/90 text-amber-200 px-1.5 py-0.5 rounded border border-amber-600">CALVING WALL</span>
              </div>

              {/* Sweep Line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-cyan-400 to-transparent animate-spin origin-bottom"></div>
            </div>
          </div>

          {/* Ice Sheet Thickness Time-Series Chart */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-stone-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Diurnal Ice Sheet Thickness & Strain Velocity</span>
            </h2>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={iceShelfData}>
                  <defs>
                    <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
                  <YAxis domain={[230, 250]} stroke="#71717a" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '0.75rem', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="iceThicknessM" stroke="#06b6d4" fillOpacity={1} fill="url(#iceGrad)" name="Ice Thickness (m)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Crevasse Hazard Inspector */}
        <div className="space-y-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-sm font-bold text-stone-200 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Crevasse Risk Register</span>
            </h2>

            <div className="space-y-3">
              {crevasseZones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedZone === zone.id
                      ? 'bg-stone-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-stone-900/60 border-stone-800 hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200">{zone.name}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded ${
                      zone.status === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-700'
                      : zone.status === 'WARNING' ? 'bg-amber-950 text-amber-300 border border-amber-700'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                    }`}>
                      {zone.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px] font-mono text-stone-400">
                    <div>Depth: <span className="text-stone-200 font-bold">{zone.depth}</span></div>
                    <div>Width: <span className="text-stone-200 font-bold">{zone.width}</span></div>
                  </div>
                  <div className="text-[10px] text-stone-500 font-mono mt-1">GPS: {zone.GPS}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics Route Safety Protocol Card */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>PistenBully Route Clearance</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Ground Penetrating Radar (GPR) autonomous rover scanning is active along the primary snow-vehicle supply trail.
            </p>
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 font-mono flex items-center justify-between">
              <span>Primary Runway Trail</span>
              <span className="font-bold text-emerald-400">100% CLEAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlaciologyPage;
