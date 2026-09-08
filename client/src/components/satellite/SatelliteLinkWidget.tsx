import React from 'react';
import { Radio, Signal, ShieldCheck, ArrowUpRight, Cpu } from 'lucide-react';
import { StationId } from '../../types';

interface SatelliteLinkWidgetProps {
  stationId: StationId;
}

export const SatelliteLinkWidget: React.FC<SatelliteLinkWidgetProps> = ({ stationId }) => {
  return (
    <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-polar font-sans">
      <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
              NCPOR GOA HQ SATELLITE GROUND LINK
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">
              C-Band Transponder • INSAT-4B / GSAT Polar Telemetry
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-sans text-[11px] font-bold border border-emerald-200 flex items-center space-x-1">
          <Signal className="w-3.5 h-3.5" />
          <span>LINK 98.4% EXCELLENT</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-medium">
        <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
          <span className="text-stone-400 block text-[10px] uppercase font-bold">LATENCY</span>
          <span className="text-base font-extrabold text-stone-900">540 ms</span>
          <span className="text-[10px] text-stone-500 block">Round-trip Goa HQ</span>
        </div>

        <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
          <span className="text-stone-400 block text-[10px] uppercase font-bold">DOWNLINK FREQ</span>
          <span className="text-base font-extrabold text-blue-700">3.825 GHz</span>
          <span className="text-[10px] text-stone-500 block">C-Band Polar Beam</span>
        </div>

        <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
          <span className="text-stone-400 block text-[10px] uppercase font-bold">PACKET LOSS</span>
          <span className="text-base font-extrabold text-emerald-600">0.02%</span>
          <span className="text-[10px] text-stone-500 block">FEC Reed-Solomon</span>
        </div>

        <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
          <span className="text-stone-400 block text-[10px] uppercase font-bold">AURORAL NOISE</span>
          <span className="text-base font-extrabold text-stone-900">LOW</span>
          <span className="text-[10px] text-stone-500 block">KP-Index: 2 (Quiet)</span>
        </div>
      </div>
    </div>
  );
};
