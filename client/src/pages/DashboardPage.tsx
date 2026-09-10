import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { NavTab } from '../components/layout/Sidebar';
import { Station3DCanvas } from '../components/digitaltwin/Station3DCanvas';
import { SatelliteLinkWidget } from '../components/satellite/SatelliteLinkWidget';
import { GreenAntarcticWidget } from '../components/environmental/GreenAntarcticWidget';
import { MaitriStationDashboard } from '../components/dashboards/MaitriStationDashboard';
import { BharatiStationDashboard } from '../components/dashboards/BharatiStationDashboard';
import { IncidentReportModal } from '../components/incidents/IncidentReportModal';
import { 
  Zap, Thermometer, Droplets, Radio, AlertTriangle, CheckCircle2, Clock, ArrowRight,
  TrendingUp, Compass, Plus, Minus, Navigation, Flame, FileText, Activity, Microscope
} from 'lucide-react';
import { IncidentRecord } from '../types';

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { 
    activeStationId, 
    environment, 
    energy, 
    equipment, 
    alerts, 
    incidents,
    triggerScenario 
  } = useSimulation();

  const [activeSubTab, setActiveSubTab] = useState<'3D' | 'telemetry'>('3D');
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);

  const stationTitle = activeStationId === 'maitri' ? '🏔️ Maitri Research Station (Est. 1988)' : '🏔️ Bharati Research Station (Est. 2012)';
  const stationRegion = activeStationId === 'maitri' 
    ? 'Schirmacher Oasis, Queen Maud Land (70°45\'52"S 11°44\'03"E) • Elevation: ~50m ASL • Crew: 47 Base / 72 Summer Cap' 
    : 'Larsemann Hills, Prydz Bay (69°24\'41"S 76°11\'72"E) • Elevation: ~35m ASL • Crew: 47 Main / 72 Summer Cap (134 ISO Containers)';

  const powerLoadPercent = Math.round((energy?.powerGrid.consumptionKw || 195) / (energy?.powerGrid.generationKw || 310) * 100);
  const gen2 = energy?.generators[1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Incident Modal Popup */}
      <IncidentReportModal 
        incident={selectedIncident} 
        onClose={() => setSelectedIncident(null)} 
      />

      {/* ========================================================= */}
      {/* MAIN LEFT/CENTER CONTENT COLUMN (8/12) */}
      {/* ========================================================= */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* View Mode Switcher (3D Twin View vs Detailed Telemetry Dashboard) */}
        <div className="bg-white border border-[#e5e3dc] rounded-2xl p-2 flex items-center justify-between shadow-polar">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('3D')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                activeSubTab === '3D'
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              3D DIGITAL TWIN VIEW
            </button>

            <button
              onClick={() => setActiveSubTab('telemetry')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                activeSubTab === 'telemetry'
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              STATION TELEMETRY & SCIENTIFIC SUITE
            </button>

            <button
              onClick={() => onNavigate('research')}
              className="px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200"
            >
              <Microscope className="w-3.5 h-3.5 text-indigo-600" />
              OFFICIAL NCPOR DOSSIER
            </button>
          </div>

          {incidents.length > 0 && (
            <button
              onClick={() => setSelectedIncident(incidents[0])}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 animate-pulse shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              ACTIVE INCIDENT ({incidents.length})
            </button>
          )}
        </div>

        {activeSubTab === '3D' ? (
          /* 1. HERO INTERACTIVE 3D TWIN SHOWCASE */
          <div className="bg-white border border-[#e5e3dc] rounded-2xl overflow-hidden shadow-polar">
            {/* Header */}
            <div className="px-5 py-3 border-b border-[#e5e3dc] bg-gradient-to-r from-stone-50 to-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-stone-900 leading-tight">
                  {stationTitle}
                </h2>
                <p className="text-[11px] text-stone-500 font-medium">
                  {stationRegion}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-1.5 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Station Main: Operational</span>
                </div>
                {gen2 && gen2.status === 'CRITICAL' && (
                  <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-1.5 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-rose-600" />
                    <span>DG-02 Thermal Anomaly</span>
                  </div>
                )}
              </div>
            </div>

            {/* 3D Canvas Render Area */}
            <div className="h-[460px] relative bg-stone-900">
              <Station3DCanvas onNavigate={onNavigate} />
            </div>
          </div>
        ) : (
          /* 2. STATION-SPECIFIC DETAILED TELEMETRY DASHBOARD */
          activeStationId === 'maitri' ? <MaitriStationDashboard /> : <BharatiStationDashboard />
        )}

        {/* 2. REAL-TIME TELEMETRY METRIC GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-polar hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Hybrid Power Demand
              </span>
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl font-black text-stone-900 font-mono">
                {energy?.powerGrid.consumptionKw || 265} <span className="text-sm font-semibold text-stone-500">kW</span>
              </div>
              <div className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                {energy?.powerGrid.renewableContributionPercent || 25.8}% Renewables
              </div>
            </div>
            <div className="mt-3 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${powerLoadPercent > 85 ? 'bg-rose-500' : powerLoadPercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, powerLoadPercent)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-polar hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Ambient Environment
              </span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                <Thermometer className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl font-black text-stone-900 font-mono">
                {environment?.temperature ?? -32.4}°C
              </div>
              <div className="text-xs font-semibold text-stone-500">
                Wind: {environment?.windSpeed ?? 14.2} km/h
              </div>
            </div>
            <div className="mt-3 text-xs text-stone-500 flex justify-between">
              <span>Pressure: {environment?.pressure ?? 982.4} hPa</span>
              <span>Humidity: {environment?.humidity ?? 61.2}%</span>
            </div>
          </div>

          <div className="bg-white border border-[#e5e3dc] rounded-2xl p-5 shadow-polar hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Fuel Reserves Autonomy
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <Droplets className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl font-black text-stone-900 font-mono">
                {energy?.fuelStorage.estimatedDaysRemaining || 46.6} <span className="text-sm font-semibold text-stone-500">Days</span>
              </div>
              <div className="text-xs font-bold text-emerald-600">
                {energy?.fuelStorage.fuelPercent || 78}% Storage
              </div>
            </div>
            <div className="mt-3 text-xs text-stone-500 flex justify-between">
              <span>Current: {(energy?.fuelStorage.currentFuelLiters || 62400).toLocaleString()} L</span>
              <span>Rate: {energy?.fuelStorage.consumptionRateLitersPerHour || 55.7} L/h</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDEBAR COLUMN (4/12) */}
      {/* ========================================================= */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Satellite Link & Connectivity Widget */}
        <SatelliteLinkWidget stationId={activeStationId} />

        {/* Environmental & Carbon Offsetting Widget */}
        <GreenAntarcticWidget energy={energy} />

        {/* Active Emergency Incidents List */}
        {incidents.length > 0 && (
          <div className="bg-white border border-rose-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Active Emergency Incidents ({incidents.length})
              </h3>
            </div>

            {incidents.map((inc, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedIncident(inc)}
                className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80 hover:bg-rose-100/60 cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-rose-950">
                  <span>{inc.title}</span>
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="text-[11px] text-rose-800">
                  Triggered: {new Date(inc.startTime).toLocaleTimeString()} • Power Deficit: {inc.powerDeficitKw} kW
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
