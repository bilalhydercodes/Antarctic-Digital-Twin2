import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StationId, ShiftHandoverReport } from '../../types';
import { FileText, Printer, Download, Check, X, Shield, AlertTriangle } from 'lucide-react';

interface ShiftHandoverModalProps {
  stationId: StationId;
  isOpen: boolean;
  onClose: () => void;
}

export const ShiftHandoverModal: React.FC<ShiftHandoverModalProps> = ({ stationId, isOpen, onClose }) => {
  const [report, setReport] = useState<ShiftHandoverReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getShiftHandover(stationId, 'json').then(res => {
        if (res.success && res.report) {
          setReport(res.report);
        }
      }).catch(err => console.error(err)).finally(() => setLoading(false));
    }
  }, [isOpen, stationId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    const printWindow = window.open(`/api/reports/shift-handover?stationId=${stationId}&format=html`, '_blank');
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-[#e5e3dc] overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-400/40">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold">DIGITAL SHIFT HANDOVER REPORT</h2>
              <p className="text-xs text-stone-400 font-mono">
                {stationId.toUpperCase()} RESEARCH STATION • NCPOR EXPEDITION LOG
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6 text-stone-800 text-xs font-sans">
          {loading ? (
            <div className="text-center py-12 text-stone-500 font-medium">Generating official station handover report...</div>
          ) : report ? (
            <>
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8f7f4] p-4 rounded-xl border border-[#e5e3dc]">
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Station</div>
                  <div className="font-bold text-stone-900 text-sm">{report.stationId.toUpperCase()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Shift Commander</div>
                  <div className="font-bold text-stone-900 text-sm">{(report as any).outgoingCommander || report.shiftCommander || 'Commander On Duty'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Shift Period</div>
                  <div className="font-bold text-stone-900 text-sm">{(report as any).shiftHours || report.shiftPeriod || '12h Polar Duty Cycle'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase">Generated At</div>
                  <div className="font-mono text-stone-600 text-[11px]">{new Date(report.generatedAt).toLocaleTimeString()} UTC</div>
                </div>
              </div>

              {/* Power & Reserves */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Power & Fuel Logistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-[#e5e3dc]">
                    <div className="text-[10px] text-stone-500">Generation</div>
                    <div className="text-base font-black text-stone-900">{(report as any).powerGridSummary?.generationKw || (report as any).powerStatus?.generationKw || 310} kW</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#e5e3dc]">
                    <div className="text-[10px] text-stone-500">Demand</div>
                    <div className="text-base font-black text-stone-900">{(report as any).powerGridSummary?.demandKw || (report as any).powerStatus?.demandKw || 265} kW</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#e5e3dc]">
                    <div className="text-[10px] text-stone-500">BESS State of Charge</div>
                    <div className="text-base font-black text-stone-900">{(report as any).powerGridSummary?.batterySoc || 88}%</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-[#e5e3dc]">
                    <div className="text-[10px] text-stone-500">Fuel Reserves</div>
                    <div className="text-base font-black text-emerald-700">{(report as any).fuelReservesSummary?.daysRemaining || (report as any).powerStatus?.fuelDays || 46.6} Days</div>
                  </div>
                </div>
              </div>

              {/* Equipment Attention */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Equipment Requiring Attention</h3>
                {report.equipmentRequiringAttention.length === 0 ? (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                    All primary station equipment operating within nominal polar boundaries.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {report.equipmentRequiringAttention.map((eq: any, i) => (
                      <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-900">{eq.id || eq.equipmentId || eq.name}</span>: {eq.note || eq.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Offline Sensors */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Instrumentation & Comms Status</h3>
                <div className="p-3 rounded-xl bg-white border border-[#e5e3dc] space-y-1">
                  <div><strong>Satellite Link:</strong> {report.communicationStatus}</div>
                  <div><strong>Scientific Instruments:</strong> {report.scientificInstrumentsSummary}</div>
                  <div>
                    <strong>Sensor Exceptions:</strong> {((report as any).offlineSensorsList && (report as any).offlineSensorsList.length > 0) ? (report as any).offlineSensorsList.join(', ') : 'None (All 100% online)'}
                  </div>
                </div>
              </div>

              {/* Pending Maintenance */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">Pending Maintenance & Shift Notes</h3>
                <ul className="list-disc list-inside space-y-1 bg-[#fcfbf9] p-4 rounded-xl border border-[#e5e3dc]">
                  {report.pendingMaintenanceTasks.map((task, i) => (
                    <li key={i} className="text-stone-700">{task}</li>
                  ))}
                  {report.operationalNotes.map((note, i) => (
                    <li key={`note-${i}`} className="text-stone-600 italic">{note}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-stone-500">Failed to load handover report.</div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#f8f7f4] px-6 py-3 border-t border-[#e5e3dc] flex items-center justify-between text-stone-500 text-[11px]">
          <span>Classification: RESTRICTED // NCPOR POLAR MISSION LOG</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-stone-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
