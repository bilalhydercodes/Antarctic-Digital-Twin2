import { IncidentRecord, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class ReportGeneratorService {
  public static generateIncidentJson(incidentId: string): object {
    const incident = inMemoryDb.incidents.find(i => i.id === incidentId) || inMemoryDb.incidents[0];
    if (!incident) {
      throw new Error(`Incident with ID ${incidentId} not found.`);
    }

    const stationId = incident.stationId;
    const auditLogs = inMemoryDb.auditLogs.filter(a => a.stationId === stationId);
    const alerts = inMemoryDb.alerts.filter(a => a.stationId === stationId);
    const telemetryHistory = inMemoryDb.historicalTelemetry.filter(h => h.stationId === stationId).slice(-20);

    return {
      organization: "Ministry of Earth Sciences (MoES) / NCPOR India",
      platform: "Antarctic Digital Twin Operational Platform",
      station: stationId === 'maitri' ? 'Maitri Research Station' : 'Bharati Research Station',
      reportType: "INCIDENT_AND_AUDIT_REPORT",
      generatedAt: new Date().toISOString(),
      incident,
      auditLogs,
      alerts,
      telemetryTimeline: telemetryHistory
    };
  }

  public static generateIncidentCsv(incidentId: string): string {
    const incident = inMemoryDb.incidents.find(i => i.id === incidentId) || inMemoryDb.incidents[0];
    if (!incident) {
      return "Error,Incident Not Found";
    }

    const rows: string[] = [];
    rows.push("NCPOR ANTARCTIC DIGITAL TWIN - INCIDENT AUDIT REPORT");
    rows.push(`Incident ID,${incident.id}`);
    rows.push(`Station,${incident.stationId.toUpperCase()}`);
    rows.push(`Title,${incident.title.replace(/,/g, ' ')}`);
    rows.push(`Start Time,${incident.startTime}`);
    rows.push(`Status,${incident.status}`);
    rows.push(`Triggering Component,${incident.triggeringSensorOrEquipment}`);
    rows.push(`Severity,${incident.severity}`);
    rows.push("");
    rows.push("ACTIONS TAKEN TIMELINE");
    rows.push("Timestamp,Actor,Action,Result");

    incident.actionsTaken.forEach(act => {
      rows.push(`"${act.timestamp}","${act.actor}","${act.action.replace(/"/g, '""')}","${act.result.replace(/"/g, '""')}"`);
    });

    rows.push("");
    rows.push("RECENT AUDIT TRAIL LOGS");
    rows.push("Timestamp,Actor,Event,Component,Action,Result");

    const logs = inMemoryDb.auditLogs.filter(a => a.stationId === incident.stationId);
    logs.forEach(log => {
      rows.push(`"${log.timestamp}","${log.actor}","${log.event}","${log.component}","${log.action.replace(/"/g, '""')}","${log.result.replace(/"/g, '""')}"`);
    });

    return rows.join("\n");
  }

  public static generateIncidentPdfHtml(incidentId: string): string {
    const data = this.generateIncidentJson(incidentId) as any;
    const incident: IncidentRecord = data.incident;
    const stationName = incident.stationId === 'maitri' ? 'Maitri Research Station' : 'Bharati Research Station';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Incident Report - ${incident.id}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; margin: 0; }
    .header { border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
    .org-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: bold; }
    .doc-title { font-size: 24px; color: #0f172a; margin: 4px 0 0 0; font-weight: 800; }
    .station-badge { background: #0284c7; color: #fff; padding: 6px 14px; border-radius: 4px; font-weight: bold; font-size: 13px; letter-spacing: 1px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; }
    .card-title { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 8px; }
    .card-value { font-size: 16px; font-weight: bold; color: #0f172a; }
    .critical-badge { color: #dc2626; background: #fef2f2; border: 1px solid #fecaca; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
    .section-heading { font-size: 16px; font-weight: bold; color: #0f172a; margin-top: 30px; margin-bottom: 12px; border-left: 4px solid #0284c7; padding-left: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    th { background: #f1f5f9; text-align: left; padding: 10px; border-bottom: 2px solid #cbd5e1; color: #475569; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .timeline-item { padding: 10px 0; border-left: 2px solid #94a3b8; padding-left: 15px; margin-left: 10px; margin-bottom: 10px; }
    .timeline-time { font-size: 11px; color: #64748b; font-weight: bold; }
    .timeline-action { font-weight: bold; color: #0f172a; margin-top: 2px; }
    .timeline-result { font-size: 12px; color: #334155; margin-top: 2px; }
    .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="org-title">Ministry of Earth Sciences (MoES) — NCPOR India</div>
      <div class="doc-title">Official Incident Operational Report</div>
    </div>
    <div class="station-badge">${stationName.toUpperCase()}</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Incident Identification</div>
      <div class="card-value">${incident.id}</div>
      <div style="margin-top: 6px;"><span class="critical-badge">${incident.severity} SEVERITY</span></div>
    </div>
    <div class="card">
      <div class="card-title">Event Timestamp & Status</div>
      <div class="card-value">${new Date(incident.startTime).toLocaleString()}</div>
      <div style="margin-top: 6px; font-size: 13px; color: #16a34a; font-weight: bold;">Status: ${incident.status}</div>
    </div>
  </div>

  <div class="card" style="margin-bottom: 20px;">
    <div class="card-title">Incident Summary & Triggering Component</div>
    <div style="font-size: 15px; font-weight: bold; color: #0f172a; margin-bottom: 6px;">${incident.title}</div>
    <div style="font-size: 13px; color: #475569;">Triggering Component: <strong>${incident.triggeringSensorOrEquipment}</strong></div>
    ${incident.powerDeficitKw ? `<div style="font-size: 13px; color: #dc2626; font-weight: bold; margin-top: 4px;">Power Grid Deficit: ${incident.powerDeficitKw} kW</div>` : ''}
  </div>

  <div class="section-heading">Automated Emergency Actions Executed</div>
  <div style="margin-top: 15px;">
    ${incident.actionsTaken.map(act => `
      <div class="timeline-item">
        <div class="timeline-time">${new Date(act.timestamp).toLocaleTimeString()} — ${act.actor}</div>
        <div class="timeline-action">${act.action}</div>
        <div class="timeline-result">${act.result}</div>
      </div>
    `).join('')}
  </div>

  ${incident.aiAnalysis ? `
  <div class="section-heading">AI Operational Copilot Diagnostic Analysis</div>
  <div class="card" style="background: #f0f9ff; border-color: #bae6fd;">
    <div style="font-size: 13px; color: #0369a1; line-height: 1.5;">${incident.aiAnalysis.summary}</div>
    <div style="margin-top: 10px; font-size: 12px; font-weight: bold; color: #0c4a6e;">Recommended Operational Actions:</div>
    <ul style="margin: 4px 0 0 0; padding-left: 20px; font-size: 12px; color: #0369a1;">
      ${incident.aiAnalysis.recommendations.map(r => `<li>${r}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

  <div class="section-heading">Operational Audit Trail Logs</div>
  <table>
    <thead>
      <tr>
        <th>Timestamp</th>
        <th>Actor</th>
        <th>Event</th>
        <th>Component</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      ${data.auditLogs.slice(0, 10).map((log: any) => `
        <tr>
          <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
          <td><strong>${log.actor}</strong></td>
          <td>${log.event}</td>
          <td>${log.component}</td>
          <td>${log.action}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    Generated automatically by Antarctic Digital Twin Operations Engine | NCPOR MoES India | Confidential Operational Record
  </div>
</body>
</html>`;
  }
}
