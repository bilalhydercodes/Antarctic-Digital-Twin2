import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Settings, 
  ShieldCheck, 
  Server, 
  Cpu, 
  Database, 
  Layers, 
  Radio, 
  CheckCircle2, 
  Clock, 
  Network,
  Activity,
  HardDrive
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { activeStationId, isConnected } = useSimulation();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* HEADER */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4 text-sky-600" />
            <span>Problem Statement 26060 • Technical Architecture</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            System Configuration & Data Architecture
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl font-medium">
            Ministry of Earth Sciences (MoES) • National Centre for Polar and Ocean Research (NCPOR)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 ${
            isConnected
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-amber-50 text-amber-800 border border-amber-300'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isConnected ? 'LIVE ENGINE CONNECTED' : 'DISCONNECTED / OFFLINE'}</span>
          </span>
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-300 uppercase">
            Station: {activeStationId}
          </span>
        </div>
      </div>

      {/* DATA PROVIDER ARCHITECTURE CARD (PROMPT #37) */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-sky-600" />
            <h2 className="text-sm font-bold text-stone-900 tracking-wide uppercase">
              Decoupled Telemetry Provider Architecture
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">
            Interface Abstraction: <code className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-800 font-semibold">ITelemetryProvider</code>
          </span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          The Antarctic Digital Twin architecture decouples the operational frontend and physics engines from the telemetry ingestion layer. This allows pluggable, real-time data adapters without altering any simulation models or visual displays.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Active Provider */}
          <div className="bg-sky-50/50 p-5 rounded-xl border border-sky-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-extrabold text-xs text-sky-800 tracking-wider">ACTIVE INGESTION PROVIDER</span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-extrabold text-[10px] border border-emerald-300 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                <span>CONNECTED</span>
              </span>
            </div>
            <div className="text-stone-900 font-extrabold text-base">SimulationTelemetryProvider v2.4</div>
            <p className="text-stone-600 text-xs mt-1.5 leading-relaxed">
              Deterministic time-series physics engine simulating Maitri & Bharati station thermal loops, generator multi-bus power, fuel burn, and life support dynamics.
            </p>
            <div className="mt-3 pt-3 border-t border-sky-200/60 flex flex-wrap gap-2 font-mono text-[10px]">
              <span className="px-2 py-0.5 bg-white rounded border border-sky-200 text-sky-900 font-semibold">Tick: 1000ms</span>
              <span className="px-2 py-0.5 bg-white rounded border border-sky-200 text-sky-900 font-semibold">Jitter: &plusmn;2%</span>
              <span className="px-2 py-0.5 bg-white rounded border border-sky-200 text-sky-900 font-semibold">Euler Integrator</span>
            </div>
          </div>

          {/* Future Provider */}
          <div className="bg-[#fcfbf9] p-5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono font-bold text-xs text-stone-600 tracking-wider">FUTURE DROP-IN ADAPTERS</span>
              <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono font-bold text-[10px] border border-stone-300">
                READY FOR DEPLOYMENT
              </span>
            </div>
            <div className="text-stone-800 font-extrabold text-base">NCPORTelemetryProvider / MQTT / IoT</div>
            <p className="text-stone-600 text-xs mt-1.5 leading-relaxed">
              Drop-in live driver adhering to the exact same contract. Connects directly to NCPOR station broker over secure MQTT (Port 8883) with no frontend modifications.
            </p>
            <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap gap-2 font-mono text-[10px]">
              <span className="px-2 py-0.5 bg-white rounded border border-stone-200 text-stone-700 font-semibold">MQTT 5.0 TLS</span>
              <span className="px-2 py-0.5 bg-white rounded border border-stone-200 text-stone-700 font-semibold">Protobuf / JSON</span>
              <span className="px-2 py-0.5 bg-white rounded border border-stone-200 text-stone-700 font-semibold">Edge Store & Forward</span>
            </div>
          </div>
        </div>
      </div>

      {/* MANDATORY DATA DISCLAIMER CARD (PROMPT #38) */}
      <div className="bg-amber-50/80 p-6 rounded-2xl border border-amber-300 shadow-sm space-y-3 font-sans">
        <div className="flex items-center space-x-2 text-amber-900 font-extrabold text-sm tracking-wide uppercase">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span>Important Data Source Disclaimer</span>
        </div>

        <p className="leading-relaxed text-xs text-amber-900/90 font-medium">
          &ldquo;This prototype uses simulated operational telemetry for demonstration. Environmental datasets may be integrated from authorized/public sources where available (e.g. Open-Meteo Antarctic synoptic stations). Real station operational telemetry would require authorized access from the relevant authorities.&rdquo;
        </p>

        <div className="flex items-center space-x-4 text-[11px] font-mono text-amber-800/80 pt-1">
          <span>• Non-classified research prototype</span>
          <span>• Compliant with Antarctic Treaty System (ATS) environmental guidelines</span>
        </div>
      </div>

      {/* PLATFORM INFRASTRUCTURE SPECS */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm font-sans">
        <div className="flex items-center space-x-2 border-b border-stone-200 pb-3 mb-4">
          <Server className="w-5 h-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-stone-900 tracking-wide uppercase">
            Platform Stack Specifications (Problem Statement 26060)
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#fcfbf9] p-4 rounded-xl border border-[#e5e3dc]">
            <span className="text-stone-500 font-mono text-[10px] font-bold block uppercase tracking-wider">FRONTEND</span>
            <div className="font-extrabold text-stone-900 text-sm mt-1">React 18 + Vite</div>
            <p className="text-stone-500 text-[11px] mt-1 font-medium">TailwindCSS, Lucide Icons, R3F 3D Engine</p>
          </div>

          <div className="bg-[#fcfbf9] p-4 rounded-xl border border-[#e5e3dc]">
            <span className="text-stone-500 font-mono text-[10px] font-bold block uppercase tracking-wider">BACKEND</span>
            <div className="font-extrabold text-stone-900 text-sm mt-1">Node.js + Express</div>
            <p className="text-stone-500 text-[11px] mt-1 font-medium">Socket.IO 4.8 WebSocket real-time bus</p>
          </div>

          <div className="bg-[#fcfbf9] p-4 rounded-xl border border-[#e5e3dc]">
            <span className="text-stone-500 font-mono text-[10px] font-bold block uppercase tracking-wider">DATABASE</span>
            <div className="font-extrabold text-stone-900 text-sm mt-1">MongoDB Atlas</div>
            <p className="text-stone-500 text-[11px] mt-1 font-medium">Timeseries collections + in-memory resilience</p>
          </div>

          <div className="bg-[#fcfbf9] p-4 rounded-xl border border-[#e5e3dc]">
            <span className="text-stone-500 font-mono text-[10px] font-bold block uppercase tracking-wider">SIMULATION</span>
            <div className="font-extrabold text-stone-900 text-sm mt-1">Physics Graph v2.4</div>
            <p className="text-stone-500 text-[11px] mt-1 font-medium">Multi-bus power, hydronic thermal, fuel burn</p>
          </div>
        </div>

        {/* Extended architectural specifications */}
        <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-stone-500 text-[10px] block uppercase font-bold">Edge Protocol</span>
            <span className="text-stone-800 font-bold text-xs mt-0.5 block">Store-and-Forward (P0-P4)</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-stone-500 text-[10px] block uppercase font-bold">Resilience Mode</span>
            <span className="text-stone-800 font-bold text-xs mt-0.5 block">Zero-Data-Loss Failover</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-stone-500 text-[10px] block uppercase font-bold">Deployment Targets</span>
            <span className="text-stone-800 font-bold text-xs mt-0.5 block">Vercel (Client) + Render (API)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

