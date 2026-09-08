import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { IncidentRecord } from '../../types';
import { FileText, Download, X, AlertTriangle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export const IncidentReportModal: React.FC<{
  incident: IncidentRecord | null;
  onClose: () => void;
}> = ({ incident, onClose }) => {
  const { getExportUrl } = useSimulation();

  if (!incident) return null;

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    const url = getExportUrl(incident.id, format);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 font-sans">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between rounded-t-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded tracking-wider">
                {incident.severity} SEVERITY INCIDENT
              </span>
              <span className="text-slate-400 font-mono text-xs">#{incident.id}</span>
            </div>
            <h2 className="text-lg font-black text-white mt-1.5">{incident.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Station: <strong className="text-slate-200">{incident.stationId.toUpperCase()}</strong> • Triggered by: <strong className="text-slate-200">{incident.triggeringSensorOrEquipment}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-slate-800">
          
          {/* Quick Metrics & Power Deficit */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-bold">Start Time</div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {new Date(incident.startTime).toLocaleTimeString()}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-500 font-bold">Status</div>
              <div className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                {incident.status}
              </div>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <div className="text-[11px] text-rose-800 font-bold">Power Deficit</div>
              <div className="text-sm font-bold text-rose-950 mt-1">
                {incident.powerDeficitKw || 85} kW
              </div>
            </div>
          </div>

          {/* Load Shedding Matrix */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200">
              <div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Shedded Non-Critical Loads
              </div>
              <ul className="text-xs text-amber-950 space-y-1 pl-4 list-disc">
                {(incident.sheddedLoads || ['Scientific Ionospheric Array', 'Summer Camp Auxiliary Heaters']).map((load, i) => (
                  <li key={i}>{load}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
              <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                Preserved Critical Life-Support
              </div>
              <ul className="text-xs text-emerald-950 space-y-1 pl-4 list-disc">
                {(incident.preservedLoads || ['Central Hydronic Heating Loop #1', 'Potable Water Anti-Freeze', 'Satellite Comms']).map((load, i) => (
                  <li key={i}>{load}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Timeline */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
              Automated Response Action Timeline
            </h3>
            <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
              {incident.actionsTaken.map((act, i) => (
                <div key={i} className="text-xs space-y-0.5">
                  <div className="text-[10px] text-slate-400 font-mono font-bold">{new Date(act.timestamp).toLocaleTimeString()} — {act.actor}</div>
                  <div className="font-bold text-slate-900">{act.action}</div>
                  <div className="text-slate-600">{act.result}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Summary */}
          {incident.aiAnalysis && (
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-xs space-y-2">
              <div className="font-bold text-sky-950 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                FrostByte AI Incident Diagnostic
              </div>
              <p className="text-sky-900">{incident.aiAnalysis.summary}</p>
              <div className="pt-2">
                <div className="font-bold text-sky-950">Recommended Response:</div>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-sky-800">
                  {incident.aiAnalysis.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with PDF/CSV/JSON Export */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 rounded-b-2xl flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Export Incident Operational Report</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('json')}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              JSON
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              EXPORT PDF REPORT
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
