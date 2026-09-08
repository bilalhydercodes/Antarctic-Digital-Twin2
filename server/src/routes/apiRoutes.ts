import { Router } from 'express';
import { ApiController } from '../controllers/apiController.js';

const router = Router();

// -------------------------------------------------------------
// REAL TELEMETRY INGESTION & STORE-AND-FORWARD SYNC
// -------------------------------------------------------------
router.post('/telemetry/ingest', ApiController.ingestTelemetry);
router.post('/telemetry/sync', ApiController.syncTelemetryQueue);

// Station Metadata & Combined Telemetry
router.get('/stations', ApiController.getStations);
router.get('/stations/compare', ApiController.compareStations);
router.get('/stations/:id', ApiController.getStationById);
router.get('/stations/:id/telemetry', ApiController.getStationTelemetry);
router.get('/stations/:id/scientific', ApiController.getScientificTelemetry);
router.get('/stations/:id/analytics', ApiController.getStationAnalytics);

// Sensor Health & Quality Engine
router.get('/sensors/health', ApiController.getSensorsHealth);
router.post('/sensors/:id/fault', ApiController.injectSensorFault);

// Edge Gateway & Satellite Link Simulator
router.get('/edge/status', ApiController.getEdgeStatus);
router.post('/edge/config', ApiController.configureEdgeLink);

// Statistical Anomaly Detection & Dependencies
router.get('/analytics/anomalies', ApiController.getAnomalies);
router.post('/dependencies/evaluate', ApiController.evaluateDependencies);

// Telemetry Historical Replay
router.get('/telemetry/replay', ApiController.getTelemetryReplayData);

// Maintenance Management & Work Orders
router.get('/maintenance', ApiController.getMaintenanceRecords);
router.post('/maintenance/work-orders', ApiController.createWorkOrder);

// Digital Shift Handover & Reports
router.get('/reports/shift-handover', ApiController.getShiftHandover);

// AI Explanation & RBAC Auth Role
router.post('/ai/explain-alert', ApiController.explainAlert);
router.post('/auth/role', ApiController.setRole);

// Simulation & Scenario Control
router.post('/scenarios', ApiController.triggerScenario);
router.post('/simulation/scenario', ApiController.triggerScenario);
router.post('/simulation/start', ApiController.startSimulation);
router.post('/simulation/pause', ApiController.pauseSimulation);
router.post('/simulation/reset', ApiController.resetSimulation);
router.post('/simulation/speed', ApiController.setSpeed);

// Incidents & Report Exporting (Supports both GET and POST)
router.get('/incidents', ApiController.getIncidents);
router.get('/incidents/:id/export', ApiController.exportIncidentReport);
router.post('/incidents/:id/export', ApiController.exportIncidentReport);

// Alerts Management & System Audit Logs
router.post('/alerts/:id/acknowledge', ApiController.acknowledgeAlert);
router.post('/alerts/:id/resolve', ApiController.resolveAlert);
router.get('/logs', ApiController.getSystemLogs);

// RAG AI Assistant & What-If Engine
router.post('/assistant/query', ApiController.queryAssistant);
router.post('/whatif', ApiController.calculateWhatIf);
router.post('/inventory/dispatch', ApiController.dispatchSupply);

export default router;
