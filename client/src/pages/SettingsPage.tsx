import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ROLE_METADATA, RBACRole } from '../types';
import { audioService } from '../services/AudioService';
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
  HardDrive,
  LogOut,
  UserCheck,
  Shield,
  RotateCcw,
  KeyRound,
  AlertTriangle,
  Building,
  User
} from 'lucide-react';

interface SettingsPageProps {
  onLogout?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const { 
    activeStationId, 
    isConnected, 
    userRole, 
    setUserRole, 
    resetSimulation 
  } = useSimulation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [resetSuccessToast, setResetSuccessToast] = useState(false);

  const handlePerformLogout = () => {
    audioService.playClick();
    localStorage.removeItem('ant_active_tab');
    sessionStorage.clear();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/?portal=true';
    }
  };

  const handleResetSystem = async () => {
    audioService.playClick();
    await resetSimulation();
    setResetSuccessToast(true);
    setTimeout(() => setResetSuccessToast(false), 3500);
  };

  const roles: RBACRole[] = ['ADMIN', 'COMMANDER', 'OPERATOR', 'SCIENTIST', 'VIEWER'];

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 font-sans text-slate-800 text-xs">
      
      {/* ─── 1. PAGE HEADER ─── */}
      <div className="bg-white rounded-xs p-4 border border-[#cbd5e1] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-bold text-[#102a43] uppercase tracking-wider mb-0.5">
            <Settings className="w-3.5 h-3.5 text-blue-800" />
            <span>Problem Statement 26060 • System Configuration & Access Control</span>
          </div>
          <h1 className="text-lg font-black text-[#102a43] tracking-tight">
            Mission Control Settings & Security Credentials
          </h1>
          <p className="text-[11px] text-slate-500 font-medium">
            Ministry of Earth Sciences (MoES) • National Centre for Polar and Ocean Research (NCPOR), Goa
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`px-2.5 py-1 rounded-xs text-[10px] font-mono font-bold flex items-center space-x-1.5 ${
            isConnected
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
              : 'bg-amber-50 text-amber-800 border border-amber-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isConnected ? 'LIVE SCADA CONNECTED' : 'OFFLINE MODE'}</span>
          </span>
          <span className="px-2.5 py-1 rounded-xs text-[10px] font-mono font-bold bg-slate-100 text-[#102a43] border border-slate-300 uppercase">
            STATION: {activeStationId}
          </span>
        </div>
      </div>

      {/* ─── 2. USER SESSION & AUTHENTICATED LOGOUT CARD ─── */}
      <div className="bg-white rounded-xs p-4 border border-[#cbd5e1] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-blue-800" />
            <h2 className="text-xs font-black text-[#102a43] tracking-wide uppercase">
              Authenticated Operator Session & Access Control
            </h2>
          </div>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-mono font-bold rounded-xs">
            SECURE NIC/MoES AUTH TOKEN ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Profile Overview (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-start space-x-3 bg-slate-50 border border-slate-200 p-3 rounded-xs">
              <div className="w-10 h-10 rounded-xs bg-[#102a43] text-white flex items-center justify-center font-bold text-xs shrink-0">
                <User className="w-5 h-5 text-sky-300" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">
                    Active Profile: {ROLE_METADATA[userRole]?.badge}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    UID: MoES-NCPOR-2026-098
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {ROLE_METADATA[userRole]?.description}
                </p>
                <div className="pt-1.5 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
                  <span>Terminal: <strong>NCPOR-GOA-HQ-01</strong></span>
                  <span>•</span>
                  <span>Auth Scope: <strong>Maitri (IN-MTR-01) & Bharati (IN-BHR-02)</strong></span>
                  <span>•</span>
                  <span>Clearance: <strong>CONFIDENTIAL / POLAR-OPERATIONAL</strong></span>
                </div>
              </div>
            </div>

            {/* Switch Role Quick Bar */}
            <div>
              <label className="text-[10px] font-bold text-slate-700 block uppercase mb-1">
                Switch Operational Profile (RBAC Simulation)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      audioService.playClick();
                      setUserRole(r);
                    }}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-xs border transition ${
                      userRole === r 
                        ? 'bg-[#102a43] text-white border-[#102a43] shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Session Actions & Logout Box (4 cols) */}
          <div className="lg:col-span-4 bg-rose-50/50 border border-rose-200 rounded-xs p-3.5 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center space-x-1.5 text-rose-900 font-bold text-xs uppercase mb-1">
                <LogOut className="w-3.5 h-3.5 text-rose-700" />
                <span>Session Termination</span>
              </div>
              <p className="text-[10px] text-rose-800 leading-snug">
                Log out of the Antarctic Digital Twin Mission Control platform. This terminates your authenticated telemetry session and returns you to the public Government of India portal.
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full py-2 px-3 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xs shadow-xs border border-rose-900 flex items-center justify-center space-x-2 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOG OUT FROM MISSION CONTROL</span>
              </button>

              <button
                type="button"
                onClick={handleResetSystem}
                className="w-full py-1.5 px-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[10px] rounded-xs border border-slate-300 flex items-center justify-center space-x-1.5 transition"
              >
                <RotateCcw className="w-3 h-3 text-slate-600" />
                <span>Reset Simulation Telemetry Data</span>
              </button>
            </div>

            {resetSuccessToast && (
              <div className="p-1.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xs text-[10px] font-semibold text-center animate-fade-in">
                Telemetry and physics engine state reset to nominal.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── 3. DECOUPLED DATA PROVIDER ARCHITECTURE CARD ─── */}
      <div className="bg-white rounded-xs p-4 border border-[#cbd5e1] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-800" />
            <h2 className="text-xs font-black text-[#102a43] tracking-wide uppercase">
              Decoupled Telemetry Provider Architecture
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Interface: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-semibold">ITelemetryProvider</code>
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          The Antarctic Digital Twin architecture decouples the operational frontend and physics engines from the telemetry ingestion layer. This allows pluggable, real-time data adapters without altering any simulation models or visual displays.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Active Provider */}
          <div className="bg-slate-50 p-3 rounded-xs border border-slate-300 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono font-bold text-[10px] text-blue-900 tracking-wider">ACTIVE INGESTION PROVIDER</span>
              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-mono font-bold text-[9px] border border-emerald-300 rounded-xs">
                CONNECTED
              </span>
            </div>
            <div className="text-slate-900 font-bold text-xs">SimulationTelemetryProvider v2.4</div>
            <p className="text-slate-600 text-[10px] mt-1 leading-snug">
              Deterministic time-series physics engine simulating Maitri & Bharati station thermal loops, generator multi-bus power, fuel burn, and life support dynamics.
            </p>
            <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 font-mono text-[9px]">
              <span className="px-1.5 py-0.2 bg-white rounded-xs border border-slate-300 text-slate-800">Tick: 1000ms</span>
              <span className="px-1.5 py-0.2 bg-white rounded-xs border border-slate-300 text-slate-800">Jitter: ±2%</span>
              <span className="px-1.5 py-0.2 bg-white rounded-xs border border-slate-300 text-slate-800">Euler Integrator</span>
            </div>
          </div>

          {/* Future Provider */}
          <div className="bg-slate-50 p-3 rounded-xs border border-slate-300 shadow-2xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono font-bold text-[10px] text-slate-600 tracking-wider">FUTURE DROP-IN ADAPTERS</span>
              <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 font-mono font-bold text-[9px] border border-slate-300 rounded-xs">
                READY FOR DEPLOYMENT
              </span>
            </div>
            <div className="text-slate-900 font-bold text-xs">NCPORTelemetryProvider / MQTT / IoT</div>
            <p className="text-slate-600 text-[10px] mt-1 leading-snug">
              Drop-in live driver adhering to the exact same contract. Connects directly to NCPOR station broker over secure MQTT (Port 8883) with no frontend modifications.
            </p>
            <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 font-mono text-[9px]">
              <span className="px-1.5 py-0.2 bg-white rounded-xs border border-slate-300 text-slate-700">MQTT 5.0 TLS</span>
              <span className="px-1.5 py-0.2 bg-white rounded-xs border border-slate-300 text-slate-700">Protobuf / JSON</span>
              <span className="px-1.5 py-0.2 bg-white rounded-xs border border-slate-300 text-slate-700">Edge Store & Forward</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 4. MANDATORY DATA DISCLAIMER & COMPLIANCE ─── */}
      <div className="bg-amber-50 p-3.5 rounded-xs border border-amber-300 shadow-2xs space-y-2 font-sans">
        <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Important Data Source & Legal Disclaimer</span>
        </div>

        <p className="leading-relaxed text-[11px] text-amber-950 font-medium">
          &ldquo;This prototype uses simulated operational telemetry for demonstration. Environmental datasets may be integrated from authorized/public sources where available (e.g. Open-Meteo Antarctic synoptic stations). Real station operational telemetry would require authorized access from the relevant authorities.&rdquo;
        </p>

        <div className="flex items-center space-x-4 text-[10px] font-mono text-amber-900/80 pt-0.5">
          <span>• Non-classified research prototype</span>
          <span>• Compliant with Antarctic Treaty System (ATS) environmental guidelines</span>
          <span>• MoES / NCPOR Security Standard Tier-3</span>
        </div>
      </div>

      {/* ─── 5. PLATFORM INFRASTRUCTURE SPECS ─── */}
      <div className="bg-white rounded-xs p-4 border border-[#cbd5e1] shadow-2xs font-sans">
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2 mb-3">
          <Server className="w-4 h-4 text-blue-800" />
          <h2 className="text-xs font-black text-[#102a43] tracking-wide uppercase">
            Platform Stack Specifications (Problem Statement 26060)
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <div className="bg-slate-50 p-2.5 rounded-xs border border-slate-300">
            <span className="text-slate-500 font-mono text-[9px] font-bold block uppercase tracking-wider">FRONTEND</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">React 18 + Vite + Leaflet</div>
            <p className="text-slate-500 text-[10px] mt-0.5">Vanilla CSS, Tailwind tokens, Three.js</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xs border border-slate-300">
            <span className="text-slate-500 font-mono text-[9px] font-bold block uppercase tracking-wider">BACKEND</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Node.js + Express</div>
            <p className="text-slate-500 text-[10px] mt-0.5">Socket.IO 4.8 real-time bus</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xs border border-slate-300">
            <span className="text-slate-500 font-mono text-[9px] font-bold block uppercase tracking-wider">DATABASE</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">MongoDB Atlas / In-Memory</div>
            <p className="text-slate-500 text-[10px] mt-0.5">Timeseries telemetry ledger</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xs border border-slate-300">
            <span className="text-slate-500 font-mono text-[9px] font-bold block uppercase tracking-wider">SIMULATION</span>
            <div className="font-bold text-slate-900 text-xs mt-0.5">Physics Graph v2.4</div>
            <p className="text-slate-500 text-[10px] mt-0.5">Multi-bus power, hydronic thermal</p>
          </div>
        </div>
      </div>

      {/* ─── 6. LOGOUT CONFIRMATION MODAL ─── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xs border border-slate-300 w-full max-w-md overflow-hidden shadow-2xl animate-scale-in font-sans">
            <div className="bg-[#102a43] text-white p-3 flex items-center justify-between border-b border-slate-300">
              <div className="flex items-center space-x-2">
                <LogOut className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-tight">Confirm Session Termination</h3>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Are you sure you want to log out?</h4>
                  <p className="text-[11px] text-slate-600 mt-1 leading-normal">
                    This will end your active session for <strong>{userRole}</strong> on <strong>{activeStationId.toUpperCase()} Station</strong> and redirect you to the public Government of India NCPOR Portal.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-3 py-1.5 rounded-xs border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePerformLogout}
                  className="px-3 py-1.5 rounded-xs bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs border border-rose-900 flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Yes, Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
