import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { NavTab } from '../components/layout/Sidebar';
import { DashboardDigitalTwinEmbed } from '../components/digitaltwin/DashboardDigitalTwinEmbed';
import { AntarcticRealMap } from '../components/map/AntarcticRealMap';
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
  Bot, 
  CloudSnow,
  Users,
  Fuel,
  BatteryCharging,
  Maximize2,
  Layers,
  Rotate3d,
  ZoomIn,
  Move,
  Ruler,
  Bell,
  Mic,
  PlayCircle,
  FileText,
  ShieldAlert,
  Wifi,
  Package,
  Box,
  Map as MapIcon,
  Send,
  Database,
  CheckCircle,
  AlertCircle
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
    simulationState
  } = useSimulation();

  const [view3DMode, setView3DMode] = useState<'exterior' | 'interior' | 'thermal'>('exterior');
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('map');
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'system' | 'user'; text: string; time: string }>>([
    {
      role: 'system',
      text: 'Telemetry nominal across all 12 monitored subsystems. Priyadarshini water trace heating verified at +3.2°C. Fuel burn rate stable at 42.4 L/h.',
      time: '12:25:00 IST'
    }
  ]);

  const handleCopilotSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;
    
    const userMsg = copilotInput.trim();
    setCopilotMessages(prev => [
      ...prev,
      { role: 'user', text: userMsg, time: new Date().toLocaleTimeString() + ' IST' }
    ]);
    setCopilotInput('');

    setTimeout(() => {
      let reply = 'Evaluating operational parameters: No critical threshold deviations detected. DG-01 and DG-02 load balancing within normal envelope.';
      if (userMsg.toLowerCase().includes('fuel') || userMsg.toLowerCase().includes('generator')) {
        reply = 'Current fuel consumption rate: 42.4 L/h. At current load (310 kW), remaining AN-8 polar diesel reserve stands at 48.6 days autonomy.';
      } else if (userMsg.toLowerCase().includes('water') || userMsg.toLowerCase().includes('temp') || userMsg.toLowerCase().includes('freeze')) {
        reply = 'Submersible lake pump line loop temperature is +3.2°C (Minimum safe limit: +2.0°C). Trace heating active at 100% capacity.';
      }

      setCopilotMessages(prev => [
        ...prev,
        { role: 'system', text: reply, time: new Date().toLocaleTimeString() + ' IST' }
      ]);
    }, 600);
  };

  const currentTemp = environment?.temperature?.toFixed(1) || '-32.4';
  const windSpeed = environment?.windSpeed?.toFixed(0) || '27';
  const pressure = environment?.pressure?.toFixed(1) || '981.7';
  const maitriPower = activeStationId === 'maitri' ? (energy?.powerGrid.consumptionKw || 310.0) : 310.0;
  const bharatiPower = activeStationId === 'bharati' ? (energy?.powerGrid.consumptionKw || 284.0) : 284.0;

  return (
    <div className="space-y-2.5 font-sans select-none text-slate-800 text-xs">
      
      {/* ─── TOP SYSTEM STATUS STRIP (REAL-TIME SCADA BANNER) ─── */}
      <div className="bg-[#ffffff] border border-[#cbd5e1] rounded-sm px-3 py-1.5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-sans">
        <div className="flex items-center space-x-4 flex-wrap">
          
          {/* Maitri Status */}
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="font-bold text-slate-900">Maitri (IN-MTR-01):</span>
            <span className="text-emerald-700 font-semibold font-mono">OPERATIONAL</span>
          </div>

          {/* Bharati Status */}
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="font-bold text-slate-900">Bharati (IN-BHR-02):</span>
            <span className="text-emerald-700 font-semibold font-mono">OPERATIONAL</span>
          </div>

          {/* Satellite Link Status */}
          <div className="flex items-center space-x-1.5 border-l border-slate-200 pl-3">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="font-bold text-slate-900">SatLink:</span>
            <span className="text-emerald-700 font-semibold font-mono">CONNECTED (VSAT-C)</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-slate-600 font-mono text-[10px] flex-wrap">
          <div><strong className="text-slate-800">MET:</strong> {currentTemp}°C | {windSpeed} km/h WSW | {pressure} hPa</div>
          <div><strong className="text-slate-800">LATENCY:</strong> 45 ms</div>
          <div><strong className="text-slate-800">QUEUE:</strong> 0 pkts</div>
          <div><strong className="text-slate-800">LINK MODE:</strong> Primary / High BW</div>
        </div>
      </div>

      {/* ─── SECTION 1: STATION SUMMARY (2 INSTITUTIONAL CARDS) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        
        {/* Card 1: MAITRI STATION */}
        <div 
          onClick={() => setActiveStationId('maitri')}
          className={`bg-white border rounded-sm p-2.5 transition cursor-pointer ${
            activeStationId === 'maitri' ? 'border-[#102a43] bg-slate-50/50' : 'border-[#cbd5e1] hover:border-slate-400'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-16 h-12 rounded-xs overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                <img 
                  src="/maitri-3d-station-view.jpg" 
                  alt="Maitri Station" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-black text-[#102a43] tracking-tight">
                  MAITRI STATION — Schirmacher Oasis
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  70°45'52"S, 11°44'03"E • Elevation: ~50m ASL • Est. 1988
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-slate-200 text-center font-mono">
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Personnel</div>
              <div className="text-xs font-bold text-slate-900">47 Crew</div>
            </div>
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Power Load</div>
              <div className="text-xs font-bold text-slate-900">{maitriPower} kW</div>
            </div>
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Fuel Reserve</div>
              <div className="text-xs font-bold text-slate-900">48.6 Days</div>
            </div>
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Battery SOC</div>
              <div className="text-xs font-bold text-emerald-700">88.4%</div>
            </div>
          </div>
        </div>

        {/* Card 2: BHARATI STATION */}
        <div 
          onClick={() => setActiveStationId('bharati')}
          className={`bg-white border rounded-sm p-2.5 transition cursor-pointer ${
            activeStationId === 'bharati' ? 'border-[#102a43] bg-slate-50/50' : 'border-[#cbd5e1] hover:border-slate-400'
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-16 h-12 rounded-xs overflow-hidden border border-slate-300 bg-slate-100 shrink-0">
                <img 
                  src="/bharati-station-view.jpg" 
                  alt="Bharati Station" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-black text-[#102a43] tracking-tight">
                  BHARATI STATION — Larsemann Hills
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  69°24'41"S, 76°11'72"E • Elevation: ~35m ASL • Est. 2012
                </div>
              </div>
            </div>
            <span className="px-1.5 py-0.5 rounded-xs text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              OPERATIONAL
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-slate-200 text-center font-mono">
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Personnel</div>
              <div className="text-xs font-bold text-slate-900">35 Crew</div>
            </div>
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Power Load</div>
              <div className="text-xs font-bold text-slate-900">{bharatiPower} kW</div>
            </div>
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Fuel Reserve</div>
              <div className="text-xs font-bold text-slate-900">62.3 Days</div>
            </div>
            <div className="p-1 bg-slate-50 border border-slate-200 rounded-xs">
              <div className="text-[9px] text-slate-500">Battery SOC</div>
              <div className="text-xs font-bold text-emerald-700">92.1%</div>
            </div>
          </div>
        </div>

      </div>

      {/* ─── SECTION 2: EXPANDED ANTARCTIC GIS MAP & MISSION CONTROL ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        
        {/* 2A. EXPANDED ANTARCTIC STATION LOCATION & SATELLITE MAP (8/12) */}
        <div className="lg:col-span-8 flex flex-col">
          <AntarcticRealMap 
            onSelectStation={(stationId) => setActiveStationId(stationId)}
            heightClass="h-[430px]"
          />
        </div>

        {/* 2B. EMERGENCY PROTOCOL & QUICK ACTIONS (4/12) */}
        <div className="lg:col-span-4 space-y-2 flex flex-col justify-between">
          
          {/* Emergency Protocol Box */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm p-2.5">
            <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-[11px] uppercase tracking-tight pb-1 border-b border-slate-200 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
              <span>EMERGENCY PROTOCOL</span>
            </div>
            
            <div className="text-[11px] font-bold text-slate-900">
              SOS / Station Mayday Broadcaster
            </div>
            <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">
              Triggers highest-priority satcom beacon to NCPOR Goa HQ, McMurdo Rescue Center, and designated Antarctic stations.
            </p>

            <button
              onClick={() => audioService.startCriticalAlarmLoop("EMERGENCY DISTRESS BEACON ACTIVE. POLAR SITREP DISPATCHED TO NCPOR GOA HQ.", "sos-beacon")}
              className="w-full mt-2 py-1.5 px-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-xs transition flex items-center justify-center space-x-1.5 border border-rose-900"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>TRIGGER SOS BEACON</span>
            </button>
          </div>

          {/* Quick Actions (Compact Industrial Buttons) */}
          <div className="bg-white border border-[#cbd5e1] rounded-sm p-2.5">
            <div className="text-[10px] font-bold uppercase text-slate-700 pb-1 mb-1.5 border-b border-slate-200">
              Quick Actions
            </div>
            <div className="grid grid-cols-2 gap-1 font-sans">
              <button
                onClick={() => audioService.startCriticalAlarmLoop("Audio alarm test nominal.", "test-alarm")}
                className="p-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xs text-left text-[11px] font-semibold text-slate-800 flex items-center space-x-1"
              >
                <Bell className="w-3 h-3 text-slate-600" />
                <span>Test Alarm</span>
              </button>

              <button
                onClick={() => audioService.speakSITREP(`All station life support systems operating nominally at ${activeStationId.toUpperCase()} Research Station.`)}
                className="p-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xs text-left text-[11px] font-semibold text-slate-800 flex items-center space-x-1"
              >
                <Mic className="w-3 h-3 text-slate-600" />
                <span>Voice SITREP</span>
              </button>

              <button
                onClick={() => onNavigate('scenarios')}
                className="p-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xs text-left text-[11px] font-semibold text-slate-800 flex items-center space-x-1"
              >
                <PlayCircle className="w-3 h-3 text-slate-600" />
                <span>Run Simulation</span>
              </button>

              <button
                onClick={() => onNavigate('compare')}
                className="p-1.5 border border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xs text-left text-[11px] font-semibold text-slate-800 flex items-center space-x-1"
              >
                <FileText className="w-3 h-3 text-slate-600" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ─── SECTION 3: LIVE TELEMETRY + SURVIVAL RUNWAY + ASSET HEALTH + SATELLITE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        
        {/* 3A. LIVE TELEMETRY TABLE (4/12) */}
        <div className="lg:col-span-4 bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase text-[#102a43]">
              LIVE TELEMETRY ({activeStationId.toUpperCase()})
            </span>
            <button 
              onClick={() => onNavigate('analytics')}
              className="text-[10px] font-semibold text-blue-700 hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>

          <table className="w-full text-[10px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                <th className="pb-1">Parameter</th>
                <th className="pb-1">Current Value</th>
                <th className="pb-1">Status</th>
                <th className="pb-1 text-right">24h Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Air Temperature</td>
                <td className="py-0.5 font-bold">{currentTemp} °C</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,8 10,6 20,9 30,5 40,7 50,4" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Wind Speed</td>
                <td className="py-0.5 font-bold">{windSpeed} km/h</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,9 10,8 20,4 30,6 40,3 50,5" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Wind Direction</td>
                <td className="py-0.5 font-bold">WSW (247°)</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,6 10,6 20,7 30,5 40,6 50,6" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Pressure</td>
                <td className="py-0.5 font-bold">{pressure} hPa</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,7 10,7 20,6 30,6 40,5 50,5" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Power Load</td>
                <td className="py-0.5 font-bold">{maitriPower} kW</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,8 10,7 20,9 30,8 40,7 50,7" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Battery SOC</td>
                <td className="py-0.5 font-bold">88.4%</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,5 10,6 20,5 30,6 40,6 50,7" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Fuel Reserve</td>
                <td className="py-0.5 font-bold">48.6 Days</td>
                <td className="py-0.5"><span className="text-amber-700 font-bold">MONITOR</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,3 10,4 20,5 30,6 40,7 50,8" fill="none" stroke="#d97706" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">Indoor Temp (Lab)</td>
                <td className="py-0.5 font-bold">18.2 °C</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,6 10,6 20,6 30,6 40,6 50,6" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900">CO₂ Level</td>
                <td className="py-0.5 font-bold">612 ppm</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">NORMAL</span></td>
                <td className="py-0.5 text-right text-slate-400">
                  <svg className="w-12 h-3 inline" viewBox="0 0 50 12">
                    <polyline points="0,7 10,6 20,7 30,6 40,6 50,5" fill="none" stroke="#2563eb" strokeWidth="1.5" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 3B. STATION SURVIVAL RUNWAY (3/12) */}
        <div className="lg:col-span-3 bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase text-[#102a43]">
              STATION SURVIVAL RUNWAY
            </span>
            <span className="text-[9px] font-mono font-bold text-slate-600 bg-slate-100 px-1 py-0.2 border border-slate-300 rounded-xs">
              AUTONOMOUS
            </span>
          </div>

          <div className="space-y-2 font-sans">
            <div>
              <div className="flex items-center justify-between text-[10px] font-medium text-slate-700 mb-0.5">
                <span>Arctic Diesel Fuel (AN-8)</span>
                <span className="font-mono font-bold text-slate-900">48.6 Days Remaining</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded-xs overflow-hidden">
                <div className="bg-[#2b6cb0] h-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-medium text-slate-700 mb-0.5">
                <span>Food & Expedition Rations</span>
                <span className="font-mono font-bold text-slate-900">180 Days Remaining</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded-xs overflow-hidden">
                <div className="bg-[#2b6cb0] h-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-medium text-slate-700 mb-0.5">
                <span>Potable Meltwater Reserves</span>
                <span className="font-mono font-bold text-slate-900">60 Days Remaining</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded-xs overflow-hidden">
                <div className="bg-[#2b6cb0] h-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[10px] font-medium text-slate-700 mb-0.5">
                <span>Medical Supplies & Trauma Kit</span>
                <span className="font-mono font-bold text-slate-900">115 Days Remaining</span>
              </div>
              <div className="w-full bg-slate-100 border border-slate-200 h-2 rounded-xs overflow-hidden">
                <div className="bg-[#2b6cb0] h-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-100 flex justify-between">
            <span>CONSUMPTION: 42.4 L/h</span>
            <span>THRESHOLD: NOMINAL</span>
          </div>
        </div>

        {/* 3C. ASSET HEALTH MATRIX (2/12) */}
        <div className="lg:col-span-2 bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase text-[#102a43]">
              ASSET HEALTH
            </span>
            <span className="text-[9px] text-slate-500 font-mono">12/12 Systems</span>
          </div>

          {/* Donut Gauge */}
          <div className="flex flex-col items-center justify-center my-1">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-600 border-t-emerald-200 flex flex-col items-center justify-center">
              <span className="text-xs font-black text-slate-900">100%</span>
              <span className="text-[7px] font-bold text-emerald-800 uppercase">HEALTHY</span>
            </div>
          </div>

          <div className="text-[10px] space-y-0.5 text-slate-700 font-sans border-t border-slate-100 pt-1">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-600">Healthy:</span>
              <strong className="text-emerald-700">12</strong>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-600">Warning:</span>
              <strong className="text-slate-800">0</strong>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-600">Critical:</span>
              <strong className="text-slate-800">0</strong>
            </div>
          </div>
        </div>

        {/* 3D. SATELLITE CONNECTIVITY (3/12) */}
        <div className="lg:col-span-3 bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase text-[#102a43]">
              SATELLITE CONNECTIVITY
            </span>
            <span className="px-1 py-0.2 rounded-xs bg-emerald-50 text-emerald-800 text-[9px] font-mono font-bold border border-emerald-300">
              CONNECTED
            </span>
          </div>

          <div className="text-[10px] space-y-1 divide-y divide-slate-100 font-mono">
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 font-sans">Mode:</span>
              <strong className="text-slate-900">VSAT-Primary (C-Band)</strong>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 font-sans">Uplink:</span>
              <strong className="text-slate-900">207 B/s</strong>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 font-sans">Downlink:</span>
              <strong className="text-slate-900">0.26 KB/s</strong>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 font-sans">Latency:</span>
              <strong className="text-slate-900">45 ms</strong>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 font-sans">Queue:</span>
              <strong className="text-slate-900">0 Pkts</strong>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-slate-500 font-sans">Payload Reduction:</span>
              <strong className="text-emerald-700">92.4% (Delta-Encoded)</strong>
            </div>
          </div>
        </div>

      </div>

      {/* ─── SECTION 4: RECENT ALERTS, AI COPILOT & SCIENTIFIC PAYLOADS ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        
        {/* 4A. RECENT ALERTS & EVENTS TABLE (4/12) */}
        <div className="lg:col-span-4 bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase text-[#102a43]">
              RECENT ALERTS & LOGGED EVENTS
            </span>
            <span className="text-[9px] text-slate-500 font-mono">Real-Time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[10px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                  <th className="pb-1">Timestamp</th>
                  <th className="pb-1">Severity</th>
                  <th className="pb-1">Event Description</th>
                  <th className="pb-1 text-right">Station</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                <tr>
                  <td className="py-1 text-slate-500">12:26:10</td>
                  <td className="py-1"><span className="px-1 py-0.2 bg-blue-50 text-blue-800 rounded-xs text-[8px] font-bold">INFO</span></td>
                  <td className="py-1 font-sans text-slate-900 truncate max-w-[130px]">Priyadarshini loop test OK</td>
                  <td className="py-1 text-right">Maitri</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">12:24:45</td>
                  <td className="py-1"><span className="px-1 py-0.2 bg-emerald-50 text-emerald-800 rounded-xs text-[8px] font-bold">NORMAL</span></td>
                  <td className="py-1 font-sans text-slate-900 truncate max-w-[130px]">DG-01 fuel injector sync</td>
                  <td className="py-1 text-right">Maitri</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">12:20:12</td>
                  <td className="py-1"><span className="px-1 py-0.2 bg-blue-50 text-blue-800 rounded-xs text-[8px] font-bold">INFO</span></td>
                  <td className="py-1 font-sans text-slate-900 truncate max-w-[130px]">RO intake salinity nominal</td>
                  <td className="py-1 text-right">Bharati</td>
                </tr>
                <tr>
                  <td className="py-1 text-slate-500">12:15:00</td>
                  <td className="py-1"><span className="px-1 py-0.2 bg-emerald-50 text-emerald-800 rounded-xs text-[8px] font-bold">NORMAL</span></td>
                  <td className="py-1 font-sans text-slate-900 truncate max-w-[130px]">VSAT delta packet burst synced</td>
                  <td className="py-1 text-right">Maitri</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4B. AI COPILOT (SUBTLE SCADA TERMINAL) (4/12) */}
        <div className="lg:col-span-4 bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase text-[#102a43] flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-slate-700" />
              <span>FROSTBYTE OPERATIONAL ASSISTANT</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1 rounded-xs border border-emerald-200 font-bold">
              Groq-LPU Online
            </span>
          </div>

          {/* Operational Log Box */}
          <div className="h-28 overflow-y-auto space-y-1.5 p-1.5 bg-slate-50 border border-slate-200 rounded-xs font-mono text-[10px]">
            {copilotMessages.map((msg, i) => (
              <div key={i} className="leading-tight">
                <span className="text-slate-400">[{msg.time}]</span>{' '}
                <strong className={msg.role === 'system' ? 'text-blue-900' : 'text-slate-900'}>
                  {msg.role === 'system' ? 'FROSTBYTE:' : 'COMMANDER:'}
                </strong>{' '}
                <span className="text-slate-700 font-sans">{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleCopilotSend} className="mt-1.5 flex items-center gap-1">
            <input 
              type="text"
              placeholder="Query station parameters (e.g. check fuel autonomy, trace heating)..."
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              className="flex-1 bg-white border border-slate-300 px-2 py-1 rounded-xs text-[11px] text-slate-800 focus:outline-none focus:border-[#102a43]"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-[#102a43] hover:bg-[#1f3a56] text-white rounded-xs text-[11px] font-bold"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

        {/* 4C. SCIENTIFIC PAYLOADS REGISTRY (4/12) */}
        <div className="lg:col-span-4 bg-white border border-[#cbd5e1] rounded-sm p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
            <span className="text-[11px] font-bold uppercase text-[#102a43]">
              SCIENTIFIC PAYLOADS REGISTRY
            </span>
            <button 
              onClick={() => onNavigate('research')}
              className="text-[10px] font-semibold text-blue-700 hover:underline"
            >
              Dossier ➔
            </button>
          </div>

          <table className="w-full text-[10px] text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[9px]">
                <th className="pb-1">Instrument</th>
                <th className="pb-1">Agency</th>
                <th className="pb-1">Status</th>
                <th className="pb-1 text-right">Last Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900 truncate max-w-[110px]">AWS Array (Katabatic)</td>
                <td className="py-0.5 font-sans text-slate-600">IMD</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">OPERATIONAL</span></td>
                <td className="py-0.5 text-right text-slate-500">12:26:40 IST</td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900 truncate max-w-[110px]">Brewer Ozone Spectro</td>
                <td className="py-0.5 font-sans text-slate-600">IMD</td>
                <td className="py-0.5"><span className="text-blue-700 font-bold">ACTIVE SCAN</span></td>
                <td className="py-0.5 text-right text-slate-500">12:24:10 IST</td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900 truncate max-w-[110px]">Fluxgate Magnetometer</td>
                <td className="py-0.5 font-sans text-slate-600">IIG</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">CALIBRATED</span></td>
                <td className="py-0.5 text-right text-slate-500">12:20:00 IST</td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900 truncate max-w-[110px]">Broadband Seismograph</td>
                <td className="py-0.5 font-sans text-slate-600">NGRI</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">RECORDING</span></td>
                <td className="py-0.5 text-right text-slate-500">12:27:00 IST</td>
              </tr>
              <tr>
                <td className="py-0.5 font-sans font-medium text-slate-900 truncate max-w-[110px]">Geodetic GPS Pillar</td>
                <td className="py-0.5 font-sans text-slate-600">Survey of India</td>
                <td className="py-0.5"><span className="text-emerald-700 font-bold">TRACKING</span></td>
                <td className="py-0.5 text-right text-slate-500">12:25:30 IST</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
