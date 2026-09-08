import { ShiftHandoverReport, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class ShiftHandoverService {
  public static generateShiftHandover(stationId: StationId, outgoingCommander: string = 'Commander R. Roy (Outgoing)', incomingCommander: string = 'Commander S. Deshmukh (Incoming)'): ShiftHandoverReport {
    const stationName = stationId === 'maitri' ? 'Maitri Research Station' : 'Bharati Research Station';
    const energy = inMemoryDb.energy.get(stationId);
    const eqList = inMemoryDb.equipment.get(stationId) || [];
    const activeIncidents = inMemoryDb.incidents.filter(i => i.stationId === stationId && i.status === 'ACTIVE');
    const resolvedIncidents = inMemoryDb.incidents.filter(i => i.stationId === stationId && i.status === 'RESOLVED');
    const offlineSensors = Array.from(inMemoryDb.sensors.values()).filter(s => s.stationId === stationId && s.operationalStatus === 'OFFLINE');
    const attentionEq = eqList.filter(e => e.status !== 'HEALTHY');

    const report: ShiftHandoverReport = {
      id: `SHR-${stationId.toUpperCase()}-${new Date().toISOString().slice(0, 10)}`,
      stationId,
      generatedAt: new Date().toISOString(),
      outgoingCommander,
      incomingCommander,
      shiftHours: '08:00 - 20:00 UTC (Day Shift Handover)',
      activeIncidentsCount: activeIncidents.length,
      resolvedIncidentsCount: resolvedIncidents.length,
      equipmentRequiringAttention: attentionEq.map(e => ({ id: e.id, name: e.name, status: e.status, health: e.healthPercent })),
      sensorFailuresCount: offlineSensors.length,
      offlineSensorsList: offlineSensors.map(s => s.name),
      powerGridSummary: {
        generationKw: energy?.powerGrid.generationKw || 310,
        demandKw: energy?.powerGrid.consumptionKw || 265,
        batterySoc: energy?.battery.stateOfCharge || 88
      },
      fuelReservesSummary: {
        daysRemaining: energy?.fuelStorage.estimatedDaysRemaining || 46.6,
        currentLiters: energy?.fuelStorage.currentFuelLiters || 62400
      },
      communicationStatus: 'Primary Ka-Band Satellite Link Operational (45ms latency)',
      scientificInstrumentsSummary: stationId === 'maitri' 
        ? 'PPM, DFM, and Broadband Seismometer continuous recording active. Zero data packet drop.'
        : 'CHP Co-Gen heat recovery and Seawater RO intake de-icer nominal at 2.4°C.',
      pendingMaintenanceTasks: [
        'Inspect Generator #1 lube oil filter differential pressure',
        'Verify Priyadarshini/Seawater pump trace heating continuity at 20:00 UTC'
      ],
      overallStationReadinessPercent: 94.5
    };

    inMemoryDb.shiftHandovers.unshift(report);
    return report;
  }

  public static generateShiftHandoverPdfHtml(report: ShiftHandoverReport): string {
    const stationName = report.stationId === 'maitri' ? 'Maitri Research Station' : 'Bharati Research Station';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Shift Handover Report - ${report.id}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0f172a; padding: 40px; margin: 0; background: #fff; }
    .header { border-bottom: 3px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .org { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; letter-spacing: 1px; }
    .title { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .badge { background: #0284c7; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
    .card-title { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; }
    .card-val { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 4px; }
    .sec { font-size: 14px; font-weight: bold; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 8px; margin: 20px 0 10px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 8px; }
    th { background: #f1f5f9; text-align: left; padding: 8px; border-bottom: 2px solid #cbd5e1; }
    td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
    ul { margin: 6px 0; padding-left: 20px; font-size: 12px; color: #334155; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 14px; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="org">Ministry of Earth Sciences (MoES) — NCPOR Mission Ops</div>
      <div class="title">Official Digital Shift Handover Report</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Report ID: <strong>${report.id}</strong> • Shift: ${report.shiftHours}</div>
    </div>
    <div class="badge">${stationName.toUpperCase()}</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Station Readiness Score</div>
      <div class="card-val" style="color: #16a34a;">${report.overallStationReadinessPercent}%</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">All Life Support Systems Nominal</div>
    </div>
    <div class="card">
      <div class="card-title">Outgoing Commander</div>
      <div class="card-val" style="font-size: 14px;">${report.outgoingCommander}</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">To: ${report.incomingCommander}</div>
    </div>
    <div class="card">
      <div class="card-title">Active / Resolved Incidents</div>
      <div class="card-val">${report.activeIncidentsCount} Active / ${report.resolvedIncidentsCount} Resolved</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${report.sensorFailuresCount} Sensor(s) offline</div>
    </div>
  </div>

  <div class="sec">Power Grid & Fuel Reserves Briefing</div>
  <div class="card" style="font-size: 12px; line-height: 1.6;">
    <div>Generation: <strong>${report.powerGridSummary.generationKw} kW</strong> | Demand: <strong>${report.powerGridSummary.demandKw} kW</strong> | Battery SOC: <strong>${report.powerGridSummary.batterySoc}%</strong></div>
    <div>Fuel Autonomy: <strong>${report.fuelReservesSummary.daysRemaining} days</strong> remaining (${report.fuelReservesSummary.currentLiters.toLocaleString()} Liters AN-8 Polar Diesel).</div>
    <div>Comms: <strong>${report.communicationStatus}</strong></div>
  </div>

  <div class="sec">Scientific Instrumentation & Subsystems Status</div>
  <div class="card" style="font-size: 12px; line-height: 1.5;">
    ${report.scientificInstrumentsSummary}
  </div>

  <div class="sec">Pending Maintenance Tasks & Orders</div>
  <ul>
    ${report.pendingMaintenanceTasks.map(t => `<li>${t}</li>`).join('')}
  </ul>

  <div class="footer">
    Antarctic Mission Control & Digital Twin Platform • National Centre for Polar and Ocean Research (NCPOR)
  </div>
</body>
</html>`;
  }
}
