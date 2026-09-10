import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  ShieldAlert, 
  Fuel, 
  BatteryCharging, 
  Zap, 
  Thermometer, 
  Users, 
  Clock, 
  Printer, 
  Radio, 
  AlertTriangle, 
  CheckCircle, 
  Crosshair, 
  HeartHandshake,
  Snowflake,
  LifeBuoy
} from 'lucide-react';

export const CommanderPage: React.FC = () => {
  const { 
    activeStationId, 
    setActiveStationId,
    environment, 
    energy, 
    equipment, 
    inventory, 
    alerts, 
    simulationState,
    acknowledgeAlert,
    resolveAlert,
    triggerScenario
  } = useSimulation();

  const [sosNote, setSosNote] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const isMaitri = activeStationId === 'maitri';
  const stationName = isMaitri ? 'MAITRI STATION (Schirmacher Oasis)' : 'BHARATI STATION (Larsemann Hills)';
  const crewCount = 47;

  // Equipment breakdown
  const totalEquip = equipment.length || 1;
  const healthyCount = equipment.filter(e => e.status === 'HEALTHY').length;
  const warningCount = equipment.filter(e => e.status === 'WARNING').length;
  const criticalCount = equipment.filter(e => e.status === 'CRITICAL' || e.status === 'OFFLINE').length;
  const overallHealthPercent = Math.round((healthyCount / totalEquip) * 100);

  // Runway metrics
  const fuelDays = energy?.fuelStorage?.estimatedDaysRemaining ?? 45;
  const foodItem = inventory.find(i => i.category === 'FOOD');
  const foodDays = foodItem?.daysRemaining ?? 120;
  const waterItem = inventory.find(i => i.category === 'WATER');
  const waterDays = waterItem?.daysRemaining ?? 60;
  const medItem = inventory.find(i => i.category === 'MEDICAL');
  const medDays = medItem?.daysRemaining ?? 180;

  const handlePrintReport = () => {
    window.print();
  };

  const handleSendSOS = () => {
    setBroadcastSent(true);
    triggerScenario('multi_system_failure');
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  return (
    <div className="space-y-6 print:space-y-4 font-sans">
      
      {/* ── SITREP COMMAND HEADER ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`p-3.5 rounded-2xl ${isMaitri ? 'bg-blue-50 text-blue-700' : 'bg-cyan-50 text-cyan-700'}`}>
            <Crosshair className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-stone-900 text-amber-300 uppercase tracking-widest">
                SITREP LEVEL 1
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                simulationState.activeScenario === 'normal' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-rose-100 text-rose-800 animate-pulse'
              }`}>
                {simulationState.scenarioTitle}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-stone-900 mt-1 tracking-tight">
              {stationName}
            </h1>
            <div className="flex items-center space-x-4 text-xs text-stone-500 mt-1 font-medium">
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span>Station Crew: <strong>{crewCount} Personnel</strong> {isMaitri ? '(Wintering Base, +25 Summer Camp = 72 Cap)' : '(Main Complex 47, +25 Summer = 72 Cap)'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Sim Time: {new Date(simulationState.simulatedTime).toUTCString().slice(0, 22)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveStationId(isMaitri ? 'bharati' : 'maitri')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f8f7f4] border border-[#e5e3dc] text-stone-700 hover:bg-stone-100 transition shadow-sm"
          >
            Switch to {isMaitri ? 'Bharati' : 'Maitri'}
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-stone-300" />
            <span>Print SITREP Report</span>
          </button>
        </div>
      </div>

      {/* ── CRITICAL 4 GAUGES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gauge 1: Fuel Runway */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Fuel Runway</span>
            <Fuel className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{fuelDays} <span className="text-sm font-semibold text-stone-500">Days</span></div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full ${fuelDays < 20 ? 'bg-rose-500' : fuelDays < 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (fuelDays / 90) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 mt-1.5 font-bold">
            <span>Storage: {energy?.fuelStorage?.currentFuelLiters?.toLocaleString() ?? 45000} L</span>
            <span>Target: 90 Days</span>
          </div>
        </div>

        {/* Gauge 2: Battery Storage */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Battery Grid SOC</span>
            <BatteryCharging className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {energy?.battery?.stateOfCharge ?? 84}%
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full rounded-full ${(energy?.battery?.stateOfCharge ?? 84) < 25 ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${energy?.battery?.stateOfCharge ?? 84}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 mt-1.5 font-bold">
            <span>Backup: {energy?.battery?.estimatedBackupHours ?? 14}h Autonomous</span>
            <span>{energy?.battery?.status ?? 'HEALTHY'}</span>
          </div>
        </div>

        {/* Gauge 3: Power Load */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Power Load</span>
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {energy?.powerGrid?.consumptionKw?.toFixed(1) ?? '142.5'} <span className="text-sm font-semibold text-stone-500">kW</span>
          </div>
          <div className="w-full bg-stone-100 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full bg-blue-600"
              style={{ width: `${Math.min(100, ((energy?.powerGrid?.consumptionKw ?? 140) / 250) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 mt-1.5 font-bold">
            <span>Gen: {energy?.powerGrid?.generationKw?.toFixed(1) ?? '160.0'} kW</span>
            <span>Renewable: {energy?.powerGrid?.renewableContributionPercent ?? (isMaitri ? 12 : 38)}%</span>
          </div>
        </div>

        {/* Gauge 4: External Environment */}
        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Outside Weather</span>
            <Thermometer className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {environment?.temperature?.toFixed(1) ?? '-18.5'}°C
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-stone-600 mt-3">
            <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
            <span>Wind: {environment?.windSpeed?.toFixed(0) ?? '32'} km/h {environment?.windDirection ?? 'ESE'}</span>
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-bold">
            <span>Feels: {environment?.feelsLike?.toFixed(1) ?? '-28.0'}°C</span>
            <span>Pressure: {environment?.pressure ?? 988} hPa</span>
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW: SURVIVAL RUNWAY & ASSET MATRIX ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Survival Runway Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-tight flex items-center space-x-2">
              <LifeBuoy className="w-4 h-4 text-blue-600" />
              <span>Station Survival Runway</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Autonomous</span>
          </div>

          <div className="space-y-3 font-medium text-xs">
            {/* Diesel */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-700 font-bold">⛽ Arctic Diesel Fuel</span>
                <span className={`font-extrabold ${fuelDays < 30 ? 'text-rose-600' : 'text-stone-900'}`}>{fuelDays} Days Left</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, (fuelDays / 120) * 100)}%` }} />
              </div>
            </div>

            {/* Food */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-700 font-bold">🍱 Food & Rations</span>
                <span className="font-extrabold text-stone-900">{foodDays} Days Left</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, (foodDays / 180) * 100)}%` }} />
              </div>
            </div>

            {/* Potable Water */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-700 font-bold">💧 Potable Meltwater</span>
                <span className="font-extrabold text-stone-900">{waterDays} Days Left</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${Math.min(100, (waterDays / 90) * 100)}%` }} />
              </div>
            </div>

            {/* Medical */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-stone-700 font-bold">💊 Medical Supplies</span>
                <span className="font-extrabold text-stone-900">{medDays} Days Left</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(100, (medDays / 200) * 100)}%` }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#f8f7f4] rounded-xl border border-[#e5e3dc] text-[11px] text-stone-600">
            💡 <strong>Next Planned Resupply:</strong> MV Vasiliy Golovnin scheduled delivery in <strong>42 Days</strong> (Maitri Ice Shelf Berth).
          </div>
        </div>

        {/* Station Asset Health Matrix */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-tight flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Asset Health Matrix</span>
            </h3>
            <span className="text-xs font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {overallHealthPercent}% Optimal
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
              <div className="text-lg font-black text-emerald-600">{healthyCount}</div>
              <div className="text-[10px] font-bold text-stone-500 uppercase">Healthy</div>
            </div>
            <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
              <div className="text-lg font-black text-amber-600">{warningCount}</div>
              <div className="text-[10px] font-bold text-stone-500 uppercase">Warning</div>
            </div>
            <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
              <div className="text-lg font-black text-rose-600">{criticalCount}</div>
              <div className="text-[10px] font-bold text-stone-500 uppercase">Critical</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Top Subsystem Status</div>
            {equipment.slice(0, 4).map((eq) => (
              <div key={eq.id} className="flex items-center justify-between p-2 rounded-lg bg-[#f8f7f4] border border-[#e5e3dc]">
                <div className="font-bold text-stone-800 truncate max-w-[150px]">{eq.name}</div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] text-stone-500">{eq.temperature}°C</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    eq.status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-800' :
                    eq.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {eq.healthPercent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOS / MAYDAY Emergency Command Panel */}
        <div className="bg-rose-950 p-6 rounded-2xl border border-rose-800 text-white shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 mb-1">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span className="text-xs font-black tracking-widest uppercase">EMERGENCY PROTOCOL</span>
            </div>
            <h3 className="text-base font-extrabold tracking-tight">SOS / Station Mayday Broadcaster</h3>
            <p className="text-xs text-rose-200 mt-1 leading-relaxed">
              Triggers highest priority satcom beacon to NCPOR Goa HQ, McMurdo Rescue Center, and Russian Novolazarevskaya Station.
            </p>
          </div>

          <div className="space-y-3">
            <textarea
              value={sosNote}
              onChange={(e) => setSosNote(e.target.value)}
              placeholder="Optional SITREP notes (e.g. Blizzard structural damage / Gen 1 offline)..."
              className="w-full p-2.5 rounded-xl bg-rose-900/60 border border-rose-700 text-xs text-white placeholder-rose-400/70 focus:outline-none focus:ring-1 focus:ring-rose-400 resize-none h-16"
            />

            <button
              onClick={handleSendSOS}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow-lg flex items-center justify-center space-x-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{broadcastSent ? '✓ BEACON BROADCAST TRANSMITTED' : 'BROADCAST EMERGENCY MAYDAY'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* ── MULTI-STATION COMPARISON MATRIX (Maitri vs Bharati) ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm">
        <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-tight mb-4 flex items-center space-x-2">
          <HeartHandshake className="w-4 h-4 text-indigo-600" />
          <span>Inter-Station Operational Comparison (Maitri vs Bharati)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5e3dc] text-[10px] font-black text-stone-400 uppercase tracking-wider">
                <th className="pb-3">Operational Parameter</th>
                <th className="pb-3 text-blue-700">🏔️ Maitri (Schirmacher Oasis)</th>
                <th className="pb-3 text-cyan-700">🌊 Bharati (Larsemann Hills)</th>
                <th className="pb-3 text-stone-500">Benchmark / Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e3dc] font-medium text-stone-700">
              <tr>
                <td className="py-2.5 font-bold text-stone-900">Grid Architecture</td>
                <td>4× 62.5 kVA Diesel Generator Array</td>
                <td>2× Combined Heat & Power + Solar + Wind</td>
                <td>Continuous N+1 Redundancy</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-stone-900">Renewable Energy Penetration</td>
                <td><span className="font-bold text-amber-600">~12%</span> (Wind Turbines)</td>
                <td><span className="font-bold text-emerald-600">~38%</span> (Solar + 3× Wind)</td>
                <td>&gt;30% Antarctic Clean Energy Goal</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-stone-900">Potable Water Source</td>
                <td>Priyadarshini Lake Pump Station</td>
                <td>RO Desalination & Sea Ice Melt</td>
                <td>120 Liters / Person / Day</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-stone-900">Satellite Link SLA</td>
                <td>99.4% (ISRO Inmarsat BGAN)</td>
                <td>99.9% (Dedicated High-Gain Ku/C-Band)</td>
                <td>&gt;99.0% Mission Critical</td>
              </tr>
              <tr>
                <td className="py-2.5 font-bold text-stone-900">Winter Crew Capacity</td>
                <td>25 Scientists & Logisticians</td>
                <td>22 Scientists & Logisticians</td>
                <td>Full Life Support System</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── UNRESOLVED ALERTS AUDIT FEED ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-stone-900 uppercase tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Station Alarm Triage Feed ({alerts.length} Active)</span>
          </h3>
          <span className="text-[10px] text-stone-400 font-bold">1-Click Commander Authorization</span>
        </div>

        <div className="space-y-2">
          {alerts.slice(0, 5).map((a) => (
            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc] gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                    a.severity === 'CRITICAL' || a.severity === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' :
                    a.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="text-xs font-bold text-stone-900">{a.title}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{a.component}</span>
                </div>
                <p className="text-xs text-stone-600 mt-1">{a.description}</p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {!a.acknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(a.id)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white transition"
                  >
                    Acknowledge
                  </button>
                )}
                {!a.resolved && (
                  <button
                    onClick={() => resolveAlert(a.id)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                  >
                    Resolve & Clear
                  </button>
                )}
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-6 text-xs text-stone-400 font-medium">
              No active alarms. All station life-support systems operating within nominal tolerances.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
