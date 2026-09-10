import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ScenarioId, WhatIfResult } from '../types';
import { 
  FlaskConical, 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Thermometer, 
  Wind, 
  Zap, 
  Flame, 
  Waves, 
  Radio, 
  Layers, 
  CheckCircle2, 
  AlertOctagon,
  RefreshCw,
  Play
} from 'lucide-react';
import { PageExplainer } from '../components/common/PageExplainer';

export const ScenarioLabPage: React.FC = () => {
  const { triggerScenario, runWhatIf, simulationState, activeStationId, userRole } = useSimulation();

  // What-If Form State
  const [tempDelta, setTempDelta] = useState<number>(-15);
  const [windDelta, setWindDelta] = useState<number>(35);
  const [demandMult, setDemandMult] = useState<number>(1.25);
  const [gen2Offline, setGen2Offline] = useState<boolean>(false);
  const [fuelReservePercent, setFuelReservePercent] = useState<number>(85);
  const [satelliteDegraded, setSatelliteDegraded] = useState<boolean>(false);
  const [whatIfResult, setWhatIfResult] = useState<WhatIfResult | null>(null);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [executingScenario, setExecutingScenario] = useState<string | null>(null);

  const scenarioCards: { 
    id: ScenarioId; 
    title: string; 
    subtitle: string;
    desc: string; 
    category: 'WEATHER' | 'POWER' | 'HEATING' | 'WATER' | 'COMMS' | 'COMPOUND';
    severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY';
  }[] = [
    { 
      id: 'normal', 
      title: 'Normal Polar Operations', 
      subtitle: 'Baseline Seasonal Profile',
      desc: 'Standard nominal climate (-18°C), stable hybrid renewable-diesel generation, and verified thermal loops.', 
      category: 'WEATHER',
      severity: 'INFO'
    },
    { 
      id: 'blizzard', 
      title: 'Severe Antarctic Blizzard', 
      subtitle: 'Katabatic Winds 95 km/h',
      desc: 'Visibility drops below 300m, solar PV arrays stowed, heating thermal load increases +35%.', 
      category: 'WEATHER',
      severity: 'CRITICAL'
    },
    { 
      id: 'extreme_cold', 
      title: 'Polar Deep Freeze (-48°C)', 
      subtitle: 'Continental Radiation Cooling',
      desc: 'Rapid temperature plunge triggering maximum HVAC heating load and generator thermal strain.', 
      category: 'WEATHER',
      severity: 'WARNING'
    },
    { 
      id: 'generator_failure', 
      title: 'Primary Generator Trip & Failover', 
      subtitle: 'Winding Overheat 94°C',
      desc: 'Primary Generator #2 trips. Smart grid response executes automated transfer to Backup Gen #1.', 
      category: 'POWER',
      severity: 'EMERGENCY'
    },
    { 
      id: 'heating_failure', 
      title: 'Hydronic Boiler Circulation Anomaly', 
      subtitle: 'Boiler Pressure Loss',
      desc: 'Circulation pressure drop detected on primary heat exchanger. Emergency electric trace heating loops engaged.', 
      category: 'HEATING',
      severity: 'CRITICAL'
    },
    { 
      id: 'pump_failure', 
      title: 'Lake / Seawater Pump Freezing Risk', 
      subtitle: 'Intake Fluid Temp ≤ 0.8°C',
      desc: 'Intake line at freezing risk. Secondary trace heating recirculator engaged to avoid ice blockage.', 
      category: 'WATER',
      severity: 'WARNING'
    },
    { 
      id: 'communication_outage', 
      title: 'Satellite Earth Station Outage', 
      subtitle: 'Ka-Band Uplink Drop',
      desc: 'Ground transceiver signal lost. Edge Gateway transitions to store-and-forward queueing.', 
      category: 'COMMS',
      severity: 'WARNING'
    },
    { 
      id: 'fuel_system_alert', 
      title: 'Fuel Farm Day-Tank Transfer Fault', 
      subtitle: 'Day-Tank Line Pressure Drop',
      desc: 'Differential pressure drop on day-tank fuel line. Automated isolation solenoid valves locked.', 
      category: 'POWER',
      severity: 'WARNING'
    },
    { 
      id: 'battery_low', 
      title: 'Energy Storage Grid Depletion', 
      subtitle: 'Battery SOC < 20%',
      desc: 'BESS capacity critical. Automated Priority Level 4 non-critical load shedding executed.', 
      category: 'POWER',
      severity: 'CRITICAL'
    },
    { 
      id: 'sensor_failure', 
      title: 'Multiple Sensor Bus Failure', 
      subtitle: 'Telemetry Bus Drop',
      desc: 'Environmental telemetry sensors transition to OFFLINE. Data quality flags set to MISSING.', 
      category: 'COMMS',
      severity: 'WARNING'
    },
    { 
      id: 'multi_failure_compound', 
      title: 'Cascading Multi-System Emergency', 
      subtitle: 'Blizzard + Gen Trip + Satellite Lag',
      desc: 'Simultaneous 92 km/h blizzard, CHP-01 thermal trip, and degraded satellite link testing priority load preservation.', 
      category: 'COMPOUND',
      severity: 'EMERGENCY'
    }
  ];

  const handleExecute = async (id: ScenarioId, title: string) => {
    setExecutingScenario(title);
    try {
      await triggerScenario(id);
    } finally {
      setTimeout(() => setExecutingScenario(null), 2500);
    }
  };

  const handleCalculateWhatIf = async () => {
    setCalculating(true);
    try {
      const res = await runWhatIf({
        stationId: activeStationId,
        temperatureDelta: tempDelta,
        windSpeedDelta: windDelta,
        powerDemandMultiplier: demandMult,
        generator2Offline: gen2Offline,
        fuelReservePercent: fuelReservePercent
      });
      setWhatIfResult(res);
    } catch (err) {
      console.error('What-If calculation failed');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans text-stone-800">
      {/* Plain English Guide Explainer */}
      <PageExplainer pageId="scenarios" defaultOpen={false} />

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4" />
            <span>Layer 15 & 16: Scenario Stress Testing & Predictive What-If Lab</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {activeStationId === 'maitri' ? 'Maitri' : 'Bharati'} Scenario Stress Lab
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Simulate severe polar weather, mechanical generator trips, satellite link dropouts, and cascading multi-failure emergencies with automated consequence propagation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
            Active: {simulationState.activeScenario.toUpperCase()}
          </span>
        </div>
      </div>

      {executingScenario && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center space-x-2 animate-pulse shadow-sm">
          <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Executing Scenario: [{executingScenario}]. Propagating physics and electrical load updates across Digital Twin state...</span>
        </div>
      )}

      {/* 1. SCENARIO PRESETS GRID (Section 15 & 28 Requirements) */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eceae2]">
          <div>
            <h2 className="text-base font-extrabold text-stone-900">
              Station Operational Scenarios & Failure Presets
            </h2>
            <p className="text-xs text-stone-500">
              Select any scenario to inject its physical consequences directly into the real-time telemetry stream.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-stone-500">
            11 Documented Presets
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarioCards.map((sc) => {
            const isActive = simulationState.activeScenario === sc.id;
            return (
              <div
                key={sc.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-300/60'
                    : 'bg-[#fcfbf9] border-[#e5e3dc] hover:bg-white hover:border-stone-400 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      sc.severity === 'EMERGENCY' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                      sc.severity === 'CRITICAL' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      sc.severity === 'WARNING' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {sc.severity}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 font-mono">{sc.category}</span>
                  </div>

                  <h3 className="text-xs font-black text-stone-900">{sc.title}</h3>
                  <div className="text-[11px] font-semibold text-blue-800 mt-0.5">{sc.subtitle}</div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">{sc.desc}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#eceae2] flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400">
                    {isActive ? '● CURRENTLY ACTIVE' : 'Standby'}
                  </span>
                  <button
                    onClick={() => handleExecute(sc.id, sc.title)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
                      isActive 
                        ? 'bg-blue-800 text-white' 
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3" />
                    <span>Trigger</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. WHAT-IF SIMULATION ENGINE (Section 15 Requirements) */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-6">
        <div className="pb-3 border-b border-[#eceae2]">
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Analytical What-If Prediction Engine</span>
          </div>
          <h2 className="text-base font-extrabold text-stone-900">
            Interactive Parametric What-If Simulator
          </h2>
          <p className="text-xs text-stone-500">
            Adjust arbitrary weather parameters, generation availability, and load multipliers to simulate system consequences without altering physical station state.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Form */}
          <div className="lg:col-span-5 bg-[#f8f7f4] p-5 rounded-2xl border border-[#e5e3dc] space-y-4">
            <div className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">
              Input Stress Parameters
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Ambient Temperature Drop</span>
                <span className="font-mono font-bold text-blue-700">{tempDelta}°C</span>
              </div>
              <input 
                type="range" 
                min="-35" 
                max="10" 
                value={tempDelta} 
                onChange={(e) => setTempDelta(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>-35°C (Extreme Deep Freeze)</span>
                <span>+10°C (Summer Thaw)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Katabatic Wind Velocity Surge</span>
                <span className="font-mono font-bold text-sky-700">+{windDelta} km/h</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="90" 
                value={windDelta} 
                onChange={(e) => setWindDelta(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>+0 km/h (Calm)</span>
                <span>+90 km/h (Katabatic Gale)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Power Demand Multiplier</span>
                <span className="font-mono font-bold text-amber-700">{demandMult}x</span>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="2.2" 
                step="0.05"
                value={demandMult} 
                onChange={(e) => setDemandMult(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>1.0x (Normal)</span>
                <span>2.2x (Peak Strain)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Fuel Farm Reserve Level</span>
                <span className="font-mono font-bold text-emerald-700">{fuelReservePercent}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={fuelReservePercent} 
                onChange={(e) => setFuelReservePercent(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <div className="pt-2 border-t border-[#e5e3dc] space-y-2">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-stone-800">
                <input 
                  type="checkbox"
                  checked={gen2Offline}
                  onChange={(e) => setGen2Offline(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-stone-300"
                />
                <span>Simulate Primary Generator #2 Offline (Trip)</span>
              </label>

              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-stone-800">
                <input 
                  type="checkbox"
                  checked={satelliteDegraded}
                  onChange={(e) => setSatelliteDegraded(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-stone-300"
                />
                <span>Simulate Satellite Earth Station Link Degraded</span>
              </label>
            </div>

            <button
              onClick={handleCalculateWhatIf}
              disabled={calculating}
              className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
            >
              {calculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating System Consequences...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>RUN WHAT-IF SIMULATION</span>
                </>
              )}
            </button>
          </div>

          {/* Predicted Consequences Output */}
          <div className="lg:col-span-7 bg-[#f8f7f4] p-5 rounded-2xl border border-[#e5e3dc] flex flex-col justify-between">
            {whatIfResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#e5e3dc] pb-3">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase">Predicted Risk Status</span>
                    <div className="text-lg font-black text-stone-900 mt-0.5">Physical Consequence Analysis</div>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-extrabold uppercase border ${
                    whatIfResult.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse' :
                    whatIfResult.riskLevel === 'HIGH' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                    'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {whatIfResult.riskLevel} RISK
                  </span>
                </div>

                {/* Consequence Impact KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm text-center">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Predicted Total Power</span>
                    <span className="text-lg font-black text-stone-900 mt-1 block">{whatIfResult.predictedTotalPowerKw} kW</span>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">Heating: {whatIfResult.predictedHeatingLoadKw} kW</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm text-center">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Generator Load</span>
                    <span className={`text-lg font-black mt-1 block ${
                      whatIfResult.generator1LoadPercent > 85 ? 'text-rose-600' : 'text-stone-900'
                    }`}>
                      {whatIfResult.generator1LoadPercent}%
                    </span>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">Risk: {whatIfResult.generator1Risk}</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm text-center">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">BESS Autonomy</span>
                    <span className="text-lg font-black text-blue-700 mt-1 block">{whatIfResult.batteryBackupHours} Hours</span>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">Emergency Reserve</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm text-center">
                    <span className="text-[10px] font-bold text-stone-400 block uppercase">Fuel Reserves</span>
                    <span className="text-lg font-black text-emerald-700 mt-1 block">{whatIfResult.fuelDaysRemaining} Days</span>
                    <span className="text-[10px] text-stone-500 mt-0.5 block">Burn Rate: +{whatIfResult.fuelBurnRateIncreasePercent}%</span>
                  </div>
                </div>

                {/* Consequence Propagation Chain */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                  <span className="text-xs font-bold text-blue-950 uppercase tracking-wide block mb-1.5">
                    Consequence Propagation Chain:
                  </span>
                  <div className="text-xs text-blue-900 flex flex-wrap items-center gap-1.5 font-medium">
                    <span className="px-2 py-0.5 rounded bg-white border border-blue-200 font-bold">Temperature Plunge ({tempDelta}°C)</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span className="px-2 py-0.5 rounded bg-white border border-blue-200 font-bold">Heating Demand +{whatIfResult.predictedHeatingLoadKw - 150}kW</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span className="px-2 py-0.5 rounded bg-white border border-blue-200 font-bold">Total Load {whatIfResult.predictedTotalPowerKw}kW</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span className={`px-2 py-0.5 rounded font-bold ${whatIfResult.riskLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-900' : 'bg-white text-blue-900 border border-blue-200'}`}>
                      {whatIfResult.riskLevel === 'CRITICAL' ? 'Emergency Shedding' : 'Reserve Normal'}
                    </span>
                  </div>
                </div>

                {/* Recommended Mitigations */}
                <div className="p-4 rounded-xl bg-white border border-[#e5e3dc] shadow-sm space-y-2">
                  <span className="font-bold text-stone-900 block text-xs uppercase tracking-wide">
                    Automated Decision Support Recommendations:
                  </span>
                  <ul className="list-disc list-inside text-stone-700 space-y-1 text-xs">
                    {whatIfResult.recommendedActions.map((act, i) => (
                      <li key={i} className="leading-relaxed">{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-stone-500 text-xs text-center p-8 space-y-2">
                <Sliders className="w-8 h-8 text-stone-300" />
                <div className="font-bold text-stone-700">Parametric Stress Simulator Ready</div>
                <p className="max-w-md text-stone-500 text-[11px]">
                  Adjust the temperature drop, wind velocity, and generator trip parameters on the left, then click <strong>"RUN WHAT-IF SIMULATION"</strong> to compute cascading consequences across power, heating, and fuel autonomy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
