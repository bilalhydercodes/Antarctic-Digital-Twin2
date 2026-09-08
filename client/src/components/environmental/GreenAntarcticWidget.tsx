import React from 'react';
import { Leaf, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { EnergyData } from '../../types';

interface GreenAntarcticWidgetProps {
  energy: EnergyData | null;
}

export const GreenAntarcticWidget: React.FC<GreenAntarcticWidgetProps> = ({ energy }) => {
  const fuelBurnLitersPerHour = energy?.fuelStorage.consumptionRateLitersPerHour || 42.5;
  // Diesel produces approx 2.68 kg CO2 per liter burned
  const co2EmissionKgPerHour = Number((fuelBurnLitersPerHour * 2.68).toFixed(1));
  const renewableContributionPercent = energy?.powerGrid.renewableContributionPercent || 25;

  return (
    <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-polar font-sans">
      <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              GREEN ANTARCTIC INDEX & CO₂ EMISSIONS
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Protocol on Environmental Protection to the Antarctic Treaty Compliance
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-sans text-[11px] font-bold border border-emerald-200 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>TREATY COMPLIANT</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
        <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
          <span className="text-stone-400 block text-[10px] uppercase font-bold">CURRENT CO₂ EMISSIONS</span>
          <span className="text-xl font-extrabold text-stone-900">{co2EmissionKgPerHour} kg/h</span>
          <span className="text-[10px] text-stone-500 block">From Diesel Combustion</span>
        </div>

        <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
          <span className="text-stone-400 block text-[10px] uppercase font-bold">RENEWABLE OFFSET</span>
          <span className="text-xl font-extrabold text-emerald-600">{renewableContributionPercent}%</span>
          <span className="text-[10px] text-stone-500 block">Solar Array + Wind Microgrid</span>
        </div>

        <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
          <span className="text-stone-400 block text-[10px] uppercase font-bold">ENVIRONMENTAL RATING</span>
          <span className="text-xl font-extrabold text-blue-700">CLASS-A POLAR</span>
          <span className="text-[10px] text-stone-500 block">Zero Soil Leakage Registered</span>
        </div>
      </div>
    </div>
  );
};
