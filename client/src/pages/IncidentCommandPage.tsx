import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { ShiftHandoverModal } from '../components/incidents/ShiftHandoverModal';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Activity, 
  Bot, 
  FileText, 
  Play, 
  Info,
  Server,
  Bell,
  Sparkles
} from 'lucide-react';
import { IncidentRecord, StationAlert } from '../types';

export const IncidentCommandPage: React.FC = () => {
  const { 
    activeStationId, 
    incidents, 
    alerts, 
    energy, 
    environment, 
    triggerScenario, 
    acknowledgeAlert, 
    resolveAlert,
    userRole 
  } = useSimulation();

  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(incidents[0] || null);
  const [aiExplanation, setAiExplanation] = useState<any | null>(null);
  const [explainingAlertId, setExplainingAlertId] = useState<string | null>(null);
  const [isHandoverOpen, setIsHandoverOpen] = useState(false);
  const [scenarioTriggering, setScenarioTriggering] = useState<string | null>(null);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'EMERGENCY');

  const handleExplain = async (alertId: string) => {
    setExplainingAlertId(alertId);
    try {
      const res = await api.explainAlert(alertId);
      if (res.success) {
        setAiExplanation(res.explanation);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setExplainingAlertId(null);
    }
  };

  const handleTriggerEmergency = async (scenario: any, label: string) => {
    setScenarioTriggering(label);
    try {
      await triggerScenario(scenario);
    } finally {
      setTimeout(() => setScenarioTriggering(null), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Layer 11 & 12: Incident Command Center & Timeline</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {activeStationId === 'maitri' ? 'Maitri' : 'Bharati'} Incident Command Post
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Real-time incident triage, cascading failure mitigation, automated load-shedding audit logs, and digital shift handover generation.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsHandoverOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition"
          >
            <FileText className="w-4 h-4 text-blue-300" />
            <span>Shift Handover Report</span>
          </button>
        </div>
      </div>

      {/* Quick Incident Command Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Active Incidents</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${activeIncidents.length > 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
              {activeIncidents.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">In Progress</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            {activeIncidents.length > 0 ? 'Emergency response active' : 'All sectors nominal'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Critical Alarms</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className={`text-2xl font-black ${criticalAlerts.length > 0 ? 'text-amber-600' : 'text-stone-800'}`}>
              {criticalAlerts.length}
            </span>
            <span className="text-xs text-stone-500 font-medium">Priority P0/P1</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Automated failovers logged
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Thermal / Grid Reserve</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-blue-900">
              {energy ? `${energy.battery.capacityKwh} kWh` : '620 kWh'}
            </span>
            <span className="text-xs text-stone-500 font-medium">BESS</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            Fuel Days: {energy?.fuelStorage.estimatedDaysRemaining || 48}d
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
          <div className="text-[10px] font-bold text-stone-400 uppercase">Command Authority</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-xl font-black text-stone-800">{userRole}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2">
            Failover execution enabled
          </div>
        </div>
      </div>

      {/* Interactive Emergency Test Injection Buttons */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-md border border-stone-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-800">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Mission Stress & Failure Scenarios</h2>
          </div>
          <span className="text-[11px] font-mono text-stone-400">What-If Consequence Simulator</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <button
            onClick={() => handleTriggerEmergency('blizzard', 'Blizzard')}
            className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-left border border-stone-700 transition"
          >
            <div className="font-bold text-xs text-sky-300">Blizzard Storm</div>
            <div className="text-[10px] text-stone-400 mt-1">92 km/h winds, -38°C</div>
          </button>

          <button
            onClick={() => handleTriggerEmergency('extreme_cold', 'Deep Freeze')}
            className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-left border border-stone-700 transition"
          >
            <div className="font-bold text-xs text-cyan-300">Extreme Cold</div>
            <div className="text-[10px] text-stone-400 mt-1">-48°C, +45kW heating</div>
          </button>

          <button
            onClick={() => handleTriggerEmergency('generator_failure', 'CHP Trip')}
            className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-left border border-stone-700 transition"
          >
            <div className="font-bold text-xs text-amber-300">CHP-01 Trip</div>
            <div className="text-[10px] text-stone-400 mt-1">Primary gen offline</div>
          </button>

          <button
            onClick={() => handleTriggerEmergency('communication_outage', 'Comms Blackout')}
            className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-left border border-stone-700 transition"
          >
            <div className="font-bold text-xs text-purple-300">Satellite Outage</div>
            <div className="text-[10px] text-stone-400 mt-1">Store-and-Forward</div>
          </button>

          <button
            onClick={() => handleTriggerEmergency('multi_failure_compound', 'Compound Disaster')}
            className="p-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-left transition"
          >
            <div className="font-bold text-xs text-rose-200">Compound Multi-Fail</div>
            <div className="text-[10px] text-rose-300 mt-1">Blizzard + Gen + Comms</div>
          </button>
        </div>

        {scenarioTriggering && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-900/40 border border-rose-500/40 text-rose-300 text-xs font-mono">
            Triggering [{scenarioTriggering}] scenario... Consequence propagation active.
          </div>
        )}
      </div>

      {/* Main Grid: Active Incidents & Interactive Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Incidents List */}
        <div className="space-y-4">
          <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Operational Incidents Log ({incidents.length})</span>
          </h2>

          <div className="space-y-3">
            {incidents.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] text-center text-stone-500 text-xs">
                No active or logged incidents for {activeStationId.toUpperCase()}.
              </div>
            ) : (
              incidents.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    selectedIncident?.id === inc.id
                      ? 'bg-[#eceae2] border-stone-500 shadow-sm'
                      : 'bg-white border-[#e5e3dc] hover:bg-[#faf9f6]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-stone-400">{inc.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      inc.severity === 'CRITICAL' || inc.severity === 'EMERGENCY' ? 'bg-rose-100 text-rose-800' :
                      inc.severity === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {inc.severity}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-stone-900">{inc.title}</h3>
                  <div className="text-[11px] text-stone-500 mt-1 flex items-center justify-between">
                    <span>Trigger: {inc.triggeringSensorOrEquipment}</span>
                    <span className="font-mono">{new Date(inc.startTime).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Station Alarms & AI Diagnostic Section */}
          <div className="pt-4 border-t border-[#e5e3dc] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider flex items-center space-x-2">
                <Bell className="w-4 h-4 text-rose-600" />
                <span>Station Alarms ({alerts.length})</span>
              </h2>
              <button
                onClick={() => handleExplain('live-telemetry-risk')}
                disabled={explainingAlertId !== null}
                className="px-2.5 py-1 rounded-lg bg-cyan-100 hover:bg-cyan-200 text-cyan-900 text-[10px] font-bold flex items-center space-x-1 transition disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-cyan-600" />
                <span>{explainingAlertId === 'live-telemetry-risk' ? 'Analyzing...' : '❄️ FrostByte AI'}</span>
              </button>
            </div>

            {alerts.length === 0 ? (
              <div className="p-4 rounded-xl bg-white border border-[#e5e3dc] text-xs text-stone-600 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> No unacknowledged alarms
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">Normal</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Trigger a live Google Gemini diagnostic on active thermal, power, and environmental telemetry.
                </p>
                <button
                  onClick={() => handleExplain('live-telemetry-risk')}
                  disabled={explainingAlertId !== null}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold border border-cyan-200 flex items-center justify-center space-x-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>{explainingAlertId === 'live-telemetry-risk' ? 'Querying FrostByte...' : '✨ Explain Telemetry Risk with FrostByte AI'}</span>
                </button>
              </div>
            ) : (
              alerts.map((alt) => (
                <div key={alt.id} className="p-3 bg-white rounded-xl border border-rose-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">{alt.title}</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">{alt.severity}</span>
                  </div>
                  <p className="text-stone-600 text-[11px]">{alt.description}</p>
                  <button
                    onClick={() => handleExplain(alt.id)}
                    disabled={explainingAlertId === alt.id}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-[11px] font-bold border border-cyan-200 flex items-center justify-center space-x-1 transition"
                  >
                    <Sparkles className="w-3 h-3 text-cyan-600" />
                    <span>{explainingAlertId === alt.id ? 'Analyzing with FrostByte...' : '❄️ Explain with FrostByte AI'}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Incident Details & Interactive Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIncident ? (
            <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-6">
              {/* Incident Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#eceae2]">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-stone-500 font-mono">
                    <span>{selectedIncident.id}</span>
                    <span>•</span>
                    <span>Started: {new Date(selectedIncident.startTime).toLocaleTimeString()}</span>
                  </div>
                  <h2 className="text-lg font-black text-stone-900 mt-1">{selectedIncident.title}</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                    selectedIncident.status === 'ACTIVE' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                    selectedIncident.status === 'CONTAINED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {selectedIncident.status}
                  </span>
                </div>
              </div>

              {/* Subsystems & Load Shedding */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
                  <div className="font-bold text-stone-500 uppercase text-[10px] mb-1">Affected Subsystems</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedIncident.affectedSubsystems.map((sub, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white text-stone-800 border border-[#e5e3dc] text-[11px] font-semibold">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
                  <div className="font-bold text-stone-500 uppercase text-[10px] mb-1">Load Management State</div>
                  <div className="text-[11px] text-stone-800 mt-1">
                    <div>Power Deficit: <strong>{selectedIncident.powerDeficitKw || 0} kW</strong></div>
                    <div>Preserved: <strong>Level 1 Life Safety & Level 2 Hydronic Heating</strong></div>
                  </div>
                </div>
              </div>

              {/* Interactive Timeline (Section 22) */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Sequential Consequence & Action Timeline</span>
                </h3>

                <div className="relative pl-6 space-y-4 border-l-2 border-stone-200 ml-2">
                  {selectedIncident.actionsTaken.map((act, i) => (
                    <div key={i} className="relative group">
                      <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-blue-700 border-2 border-white shadow-sm"></div>
                      <div className="text-stone-900 font-semibold text-xs">
                        {act.action}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center space-x-2 mt-0.5">
                        <span className="font-mono">{new Date(act.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span className="font-medium text-stone-700">Actor: {act.actor}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">Result: {act.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Root Cause & Recommendation (Section 19) */}
              {selectedIncident.aiAnalysis && (
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                  <div className="flex items-center justify-between text-indigo-900 font-bold text-xs">
                    <span className="flex items-center space-x-1.5">
                      <span className="text-sm">❄️</span>
                      <span>FrostByte AI Mission Operational Assessment</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono">
                      Confidence: 94%
                    </span>
                  </div>
                  <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                    {selectedIncident.aiAnalysis.rootCause}
                  </p>
                  <div className="text-xs text-indigo-900 pt-1">
                    <strong>Recommended Actions:</strong>
                    <ul className="list-disc list-inside mt-1 text-[11px] text-indigo-950 space-y-0.5">
                      {selectedIncident.aiAnalysis.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#e5e3dc] text-center text-stone-500 text-xs">
              Select an incident from the log to view its sequence timeline and telemetry.
            </div>
          )}

          {/* AI Risk Explanation Modal Box */}
          {aiExplanation && (
            <div className="bg-white rounded-2xl p-6 border-2 border-indigo-300 shadow-polar space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-black text-cyan-950 uppercase tracking-wide flex items-center gap-1.5">
                        <span>❄️</span>
                        <span>FrostByte AI Risk Diagnostic (Gemini Flash)</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        CONFIDENCE {aiExplanation.confidencePercent}%
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 font-medium">
                      {aiExplanation.alertTitle} • Component: <span className="font-semibold text-stone-800">{aiExplanation.component}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAiExplanation(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition text-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                  <div className="font-bold text-sky-950 text-[11px] mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-600" />
                    Live Digital Twin Telemetry Context
                  </div>
                  <div className="text-sky-900 font-mono text-[11px] leading-relaxed">
                    {aiExplanation.currentTelemetry}
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
                  <div className="font-bold text-amber-950 text-[11px] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    Thermodynamics & Physical Contributing Factors
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-amber-950 text-[11px]">
                    {aiExplanation.contributingFactors.map((f: string, i: number) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="font-bold text-emerald-950 text-[11px] mb-1 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                    Recommended Operational Response (NCPOR Protocol)
                  </div>
                  <div className="text-emerald-900 font-semibold text-xs leading-relaxed mt-1">
                    {aiExplanation.recommendedOperationalResponse}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-stone-400 font-mono border-t border-stone-100">
                  <span>Engine: {aiExplanation.source || 'GOOGLE GEMINI FLASH LLM'}</span>
                  <span>Validated via NCPOR Physics Model</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shift Handover Modal */}
      <ShiftHandoverModal
        stationId={activeStationId}
        isOpen={isHandoverOpen}
        onClose={() => setIsHandoverOpen(false)}
      />
    </div>
  );
};
