import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { AlertTriangle, ShieldCheck, CheckCircle2, Flame, Zap, Droplets, Clock } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { activeStationId, alerts, automatedLogs, acknowledgeAlert } = useSimulation();

  const stationAlerts = alerts.filter(a => a.stationId === activeStationId);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-polar flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="uppercase tracking-wide">ALARMS CONSOLE & FAILOVER AUDIT LOG</span>
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Real-Time Operational Incidents & Automated Switchgear Response Audit • {activeStationId.toUpperCase()} Station
          </p>
        </div>
      </div>

      {/* Automated Failover Response Audit Log */}
      {automatedLogs.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-polar">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm mb-3">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>AUTOMATED SWITCHGEAR FAILOVER EXECUTION HISTORY</span>
          </div>

          <div className="space-y-3">
            {automatedLogs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-white border border-rose-200 text-xs text-stone-800">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span className="text-rose-700">{log.actionExecuted}</span>
                  <span className="text-stone-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-stone-700">{log.details}</p>
                <div className="text-[11px] text-stone-400 mt-2 font-mono">
                  Trigger Reason: {log.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Incidents List */}
      <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-polar">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide border-b border-stone-100 pb-3 mb-4">
          STATION ALARMS & INCIDENTS ({stationAlerts.length})
        </h3>

        <div className="space-y-3">
          {stationAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                alert.severity === 'CRITICAL' || alert.severity === 'EMERGENCY'
                  ? 'bg-rose-50 border-rose-200'
                  : alert.severity === 'WARNING'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-[#f8f7f4] border-[#e5e3dc]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                    alert.severity === 'CRITICAL' || alert.severity === 'EMERGENCY'
                      ? 'bg-rose-600 text-white'
                      : alert.severity === 'WARNING'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-600 text-white'
                  }`}>
                    {alert.severity}
                  </span>
                  <h4 className="text-xs font-bold text-stone-900">{alert.title}</h4>
                </div>
                <p className="text-xs text-stone-700">{alert.description}</p>
                <div className="text-[11px] text-stone-500 font-mono">Component: {alert.component}</div>
              </div>

              {!alert.acknowledged ? (
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shrink-0"
                >
                  ACKNOWLEDGE
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ACKNOWLEDGED</span>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
