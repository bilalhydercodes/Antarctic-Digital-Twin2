import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Zap, Battery, Fuel, Activity, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { PageExplainer } from '../components/common/PageExplainer';

export const EnergyPage: React.FC = () => {
  const { activeStationId, energy, dispatchSupply } = useSimulation();

  const gen1 = energy?.generators[0];
  const gen2 = energy?.generators[1];

  return (
    <div className="space-y-6 font-sans">
      {/* Plain English Guide Explainer */}
      <PageExplainer pageId="energy" defaultOpen={false} />

      {/* Header */}
      <div className="bg-white border border-[#e5e3dc] p-6 rounded-2xl shadow-polar flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="uppercase tracking-wide">ELECTRICAL POWER GRID & FUEL STORAGE</span>
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            415V 3-Phase 50Hz Station Microgrid • {activeStationId.toUpperCase()} Research Station
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => dispatchSupply()}
            className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition"
          >
            DISPATCH FUEL SHIPMENT
          </button>
        </div>
      </div>

      {/* Grid Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e5e3dc] p-5 rounded-2xl shadow-polar">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">POWER DEMAND</div>
          <div className="text-3xl font-extrabold text-stone-900 mt-2">{energy?.powerGrid.consumptionKw} kW</div>
          <div className="text-xs text-stone-500 mt-1 font-medium">Critical Load: {energy?.powerGrid.criticalLoadKw} kW</div>
        </div>

        <div className="bg-white border border-[#e5e3dc] p-5 rounded-2xl shadow-polar">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">POWER GENERATION</div>
          <div className="text-3xl font-extrabold text-blue-700 mt-2">{energy?.powerGrid.generationKw} kW</div>
          <div className="text-xs text-stone-500 mt-1 font-medium">Renewables Offset: {energy?.powerGrid.renewableContributionPercent}%</div>
        </div>

        <div className="bg-white border border-[#e5e3dc] p-5 rounded-2xl shadow-polar">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">BATTERY STORAGE</div>
          <div className={`text-3xl font-extrabold mt-2 ${energy?.battery.status === 'CRITICAL' ? 'text-rose-600' : 'text-emerald-600'}`}>
            {energy?.battery.stateOfCharge}%
          </div>
          <div className="text-xs text-stone-500 mt-1 font-medium">Autonomy: {energy?.battery.estimatedBackupHours} Hours</div>
        </div>

        <div className="bg-white border border-[#e5e3dc] p-5 rounded-2xl shadow-polar">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">FUEL RESERVES</div>
          <div className="text-3xl font-extrabold text-stone-900 mt-2">{energy?.fuelStorage.currentFuelLiters.toLocaleString()} L</div>
          <div className="text-xs text-stone-500 mt-1 font-medium">Autonomy Countdown: {energy?.fuelStorage.estimatedDaysRemaining} Days</div>
        </div>
      </div>

      {/* Generators Detailed Matrix */}
      <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-polar">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-3 mb-4">
          PRIMARY GENERATOR UNITS & CHP TELEMETRY
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gen 1 */}
          <div className={`p-5 rounded-2xl border ${gen1?.status === 'CRITICAL' ? 'bg-rose-50 border-rose-200' : 'bg-[#f8f7f4] border-[#e5e3dc]'}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-stone-900 text-sm">{gen1?.name}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${gen1?.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {gen1?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3 font-medium">
              <div>Load: <span className="font-bold text-stone-900">{gen1?.loadPercent}%</span></div>
              <div>Output: <span className="font-bold text-blue-700">{gen1?.powerKw} kW</span></div>
              <div>Temp: <span className="font-bold text-stone-900">{gen1?.temperature}°C</span></div>
              <div>Burn Rate: <span className="font-bold text-stone-900">{gen1?.fuelConsumptionRate} L/h</span></div>
            </div>

            <div className="text-xs text-stone-500 border-t border-stone-200/60 pt-2.5">
              Runtime: {gen1?.runtimeHours.toLocaleString()}h • Health Score: {gen1?.healthPercent}%
            </div>
          </div>

          {/* Gen 2 */}
          <div className={`p-5 rounded-2xl border ${gen2?.status === 'OFFLINE' || gen2?.status === 'CRITICAL' ? 'bg-rose-50 border-rose-200' : 'bg-[#f8f7f4] border-[#e5e3dc]'}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-stone-900 text-sm">{gen2?.name}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${gen2?.status === 'OFFLINE' ? 'bg-rose-600 text-white' : gen2?.status === 'CRITICAL' ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                {gen2?.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3 font-medium">
              <div>Load: <span className="font-bold text-stone-900">{gen2?.loadPercent}%</span></div>
              <div>Output: <span className="font-bold text-blue-700">{gen2?.powerKw} kW</span></div>
              <div>Temp: <span className="font-bold text-stone-900">{gen2?.temperature}°C</span></div>
              <div>Failure Risk: <span className="font-bold text-rose-600">{gen2?.failureProbability}%</span></div>
            </div>

            <div className="text-xs text-stone-500 border-t border-stone-200/60 pt-2.5">
              Runtime: {gen2?.runtimeHours.toLocaleString()}h • Health Score: {gen2?.healthPercent}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
