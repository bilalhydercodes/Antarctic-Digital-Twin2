import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Settings, ShieldCheck, Server, Cpu, Database, Info, Layers } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { activeStationId, isConnected } = useSimulation();

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-polar-900 p-6 rounded-2xl border border-polar-800 shadow-xl">
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="uppercase">SYSTEM CONFIGURATION & DATA PROVIDER ARCHITECTURE</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Ministry of Earth Sciences (MoES) • National Centre for Polar and Ocean Research (NCPOR)
        </p>
      </div>

      {/* DATA PROVIDER ARCHITECTURE CARD (PROMPT #37) */}
      <div className="bg-polar-900 p-6 rounded-2xl border border-polar-800 shadow-xl space-y-4 font-mono text-xs">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>DECOUPLED TELEMETRY PROVIDER ARCHITECTURE</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-polar-950 p-4 rounded-xl border border-cyan-800 shadow-glow-cyan">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-300">ACTIVE PROVIDER</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">CONNECTED</span>
            </div>
            <div className="text-slate-100 font-bold text-sm">SimulationTelemetryProvider v2.4</div>
            <p className="text-slate-400 text-[11px] mt-1">
              Time-series physics simulation engine driving Maitri & Bharati operational telemetry.
            </p>
          </div>

          <div className="bg-polar-950 p-4 rounded-xl border border-polar-800 opacity-60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-400">FUTURE DROP-IN PROVIDERS</span>
              <span className="px-2 py-0.5 rounded bg-polar-900 text-slate-500 font-bold text-[10px]">READY</span>
            </div>
            <div className="text-slate-300 font-bold text-sm">NCPORTelemetryProvider / MQTT / IoT</div>
            <p className="text-slate-400 text-[11px] mt-1">
              Clean interface abstraction (`ITelemetryProvider`) allows live NCPOR IoT MQTT feeds to replace simulation without frontend changes.
            </p>
          </div>
        </div>
      </div>

      {/* MANDATORY DATA DISCLAIMER CARD (PROMPT #38) */}
      <div className="bg-amber-950/40 p-6 rounded-2xl border border-amber-800/80 shadow-glow-amber space-y-3 font-mono text-xs text-amber-200">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5" />
          <span>IMPORTANT DATA SOURCE DISCLAIMER</span>
        </div>

        <p className="leading-relaxed text-[11px]">
          "This prototype uses simulated operational telemetry for demonstration. Environmental datasets may be integrated from authorized/public sources where available. Real station operational telemetry would require authorized access from the relevant authorities."
        </p>
      </div>

      {/* PLATFORM INFRASTRUCTURE SPECS */}
      <div className="bg-polar-900 p-6 rounded-2xl border border-polar-800 shadow-xl font-mono text-xs">
        <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <Server className="w-4 h-4 text-blue-400" />
          <span>PLATFORM STACK SPECS (PROBLEM STATEMENT 26060)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
          <div className="bg-polar-950 p-3 rounded-xl border border-polar-800">
            <span className="text-slate-500 text-[10px] block">FRONTEND</span>
            <span className="font-bold text-cyan-300">React + Vite + R3F</span>
          </div>
          <div className="bg-polar-950 p-3 rounded-xl border border-polar-800">
            <span className="text-slate-500 text-[10px] block">BACKEND</span>
            <span className="font-bold text-blue-300">Node.js + Socket.IO</span>
          </div>
          <div className="bg-polar-950 p-3 rounded-xl border border-polar-800">
            <span className="text-slate-500 text-[10px] block">DATABASE</span>
            <span className="font-bold text-emerald-300">MongoDB / In-Memory</span>
          </div>
          <div className="bg-polar-950 p-3 rounded-xl border border-polar-800">
            <span className="text-slate-500 text-[10px] block">SIMULATION</span>
            <span className="font-bold text-purple-300">Physics Graph v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
