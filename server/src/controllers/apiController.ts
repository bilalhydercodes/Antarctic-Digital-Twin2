import { Request, Response } from 'express';
import { inMemoryDb } from '../models/Database.js';
import { TelemetryIngestionService } from '../services/TelemetryIngestionService.js';
import { simulationEngine } from '../simulation/SimulationEngine.js';
import { EmergencyScenarioEngine } from '../services/EmergencyScenarioEngine.js';
import { ReportGeneratorService } from '../services/ReportGeneratorService.js';
import { AIAssistantService } from '../services/AIAssistantService.js';
import { SensorHealthService } from '../services/SensorHealthService.js';
import { EdgeGatewayService } from '../services/EdgeGatewayService.js';
import { DependencyGraphService } from '../services/DependencyGraphService.js';
import { MaintenanceService } from '../services/MaintenanceService.js';
import { ShiftHandoverService } from '../services/ShiftHandoverService.js';
import { AnomalyDetectionService } from '../services/AnomalyDetectionService.js';
import { GeminiAIService } from '../services/GeminiAIService.js';
import { systemLogger } from '../utils/logger.js';
import { StationId, ScenarioId, WhatIfInput, WhatIfResult, RBACRole } from '../types/index.js';
import { seedInitialStationData } from '../simulation/seedData.js';

export class ApiController {
  // POST /api/telemetry/ingest
  public static async ingestTelemetry(req: Request, res: Response) {
    try {
      const result = await TelemetryIngestionService.ingestTelemetry(req.body);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // POST /api/telemetry/sync (Batch flush from offline queue)
  public static async syncTelemetryQueue(req: Request, res: Response) {
    try {
      const { packets } = req.body;
      if (!Array.isArray(packets)) {
        return res.status(400).json({ success: false, error: 'packets array required' });
      }

      let ingestedCount = 0;
      for (const pkt of packets) {
        try {
          await TelemetryIngestionService.ingestTelemetry(pkt);
          ingestedCount++;
        } catch (e) {
          // Continue
        }
      }

      inMemoryDb.simulationState.satelliteStats.queueSize = 0;

      res.json({
        success: true,
        packetsIngested: ingestedCount,
        message: `Successfully synchronized ${ingestedCount} queued telemetry packet(s) with central twin state.`
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/sensors/health
  public static async getSensorsHealth(req: Request, res: Response) {
    const stationId = req.query.stationId as StationId;
    const allSensors = Array.from(inMemoryDb.sensors.values());
    const filteredSensors = stationId ? allSensors.filter(s => s.stationId === stationId) : allSensors;
    
    const healthMap: Record<string, any> = {};
    filteredSensors.forEach(s => {
      healthMap[s.sensorId] = inMemoryDb.sensorHealth.get(s.sensorId);
    });

    res.json({
      success: true,
      count: filteredSensors.length,
      sensors: filteredSensors,
      health: healthMap
    });
  }

  // POST /api/sensors/:id/fault (Fault injection)
  public static async injectSensorFault(req: Request, res: Response) {
    const sensorId = req.params.id;
    const { faultType } = req.body as { faultType: 'STUCK' | 'NOISY' | 'OFFLINE' | 'RESTORE' };
    try {
      const sensor = SensorHealthService.injectFault(sensorId, faultType || 'STUCK');
      res.json({ success: true, message: `Sensor [${sensorId}] fault state set to ${faultType}`, sensor });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  }

  // GET /api/edge/status
  public static async getEdgeStatus(req: Request, res: Response) {
    const stationId = (req.query.stationId as StationId) || 'maitri';
    const gateway = inMemoryDb.edgeGateways.get(stationId);
    res.json({ success: true, stationId, gateway });
  }

  // POST /api/edge/config
  public static async configureEdgeLink(req: Request, res: Response) {
    const { stationId, config } = req.body;
    const stId = (stationId || 'maitri') as StationId;
    try {
      const updated = EdgeGatewayService.configureSatelliteLink(stId, config || {});
      res.json({ success: true, stationId: stId, gateway: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // GET /api/analytics/anomalies
  public static async getAnomalies(req: Request, res: Response) {
    const stationId = req.query.stationId as StationId;
    const anomalies = AnomalyDetectionService.detectAnomalies(stationId);
    res.json({ success: true, count: anomalies.length, data: anomalies });
  }

  // POST /api/dependencies/evaluate
  public static async evaluateDependencies(req: Request, res: Response) {
    const { stationId, failedComponentId } = req.body;
    const stId = (stationId || 'maitri') as StationId;
    try {
      const result = DependencyGraphService.evaluateFailure(stId, failedComponentId || 'generators_chp');
      const nodes = DependencyGraphService.getGraphNodes(stId);
      res.json({ success: true, nodes, evaluation: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // GET /api/telemetry/replay
  public static async getTelemetryReplayData(req: Request, res: Response) {
    const stationId = (req.query.stationId as StationId) || 'maitri';
    const limit = Number(req.query.limit) || 100;
    const history = inMemoryDb.historicalTelemetry.filter(h => h.stationId === stationId).slice(-limit);
    res.json({
      success: true,
      stationId,
      count: history.length,
      timeRange: {
        start: history[0]?.timestamp || new Date().toISOString(),
        end: history[history.length - 1]?.timestamp || new Date().toISOString()
      },
      frames: history
    });
  }

  // GET /api/reports/shift-handover
  public static async getShiftHandover(req: Request, res: Response) {
    const stationId = (req.query.stationId as StationId) || 'maitri';
    const report = ShiftHandoverService.generateShiftHandover(stationId);
    const format = (req.query.format as string || 'json').toLowerCase();

    if (format === 'html' || format === 'pdf') {
      const html = ShiftHandoverService.generateShiftHandoverPdfHtml(report);
      res.setHeader('Content-Type', 'text/html');
      return res.send(html);
    }
    res.json({ success: true, report });
  }

  // GET /api/maintenance
  public static async getMaintenanceRecords(req: Request, res: Response) {
    const stationId = req.query.stationId as StationId;
    const records = MaintenanceService.getRecords(stationId);
    res.json({ success: true, count: records.length, data: records });
  }

  // POST /api/maintenance/work-orders
  public static async createWorkOrder(req: Request, res: Response) {
    try {
      const newRecord = MaintenanceService.addRecord(req.body);
      res.json({ success: true, record: newRecord });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // GET /api/stations/compare
  public static async compareStations(req: Request, res: Response) {
    const maitriEnv = inMemoryDb.environment.get('maitri');
    const bharatiEnv = inMemoryDb.environment.get('bharati');
    const maitriEnergy = inMemoryDb.energy.get('maitri');
    const bharatiEnergy = inMemoryDb.energy.get('bharati');
    const maitriAws = inMemoryDb.aws.get('maitri');
    const bharatiAws = inMemoryDb.aws.get('bharati');
    const maitriAlerts = inMemoryDb.alerts.filter(a => a.stationId === 'maitri' && !a.resolved);
    const bharatiAlerts = inMemoryDb.alerts.filter(a => a.stationId === 'bharati' && !a.resolved);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      comparison: {
        maitri: {
          name: 'Maitri Research Station',
          temp: maitriAws?.temperature ?? maitriEnv?.temperature,
          windSpeed: maitriAws?.windSpeed ?? maitriEnv?.windSpeed,
          pressure: maitriAws?.pressure ?? maitriEnv?.pressure,
          powerDemandKw: maitriEnergy?.powerGrid.consumptionKw,
          powerGenKw: maitriEnergy?.powerGrid.generationKw,
          batterySoc: maitriEnergy?.battery.stateOfCharge,
          fuelDays: maitriEnergy?.fuelStorage.estimatedDaysRemaining,
          activeAlertsCount: maitriAlerts.length
        },
        bharati: {
          name: 'Bharati Research Station',
          temp: bharatiAws?.temperature ?? bharatiEnv?.temperature,
          windSpeed: bharatiAws?.windSpeed ?? bharatiEnv?.windSpeed,
          pressure: bharatiAws?.pressure ?? bharatiEnv?.pressure,
          powerDemandKw: bharatiEnergy?.powerGrid.consumptionKw,
          powerGenKw: bharatiEnergy?.powerGrid.generationKw,
          chpThermalKw: bharatiEnergy?.powerGrid.chpThermalGenerationKw,
          batterySoc: bharatiEnergy?.battery.stateOfCharge,
          fuelDays: bharatiEnergy?.fuelStorage.estimatedDaysRemaining,
          activeAlertsCount: bharatiAlerts.length
        }
      }
    });
  }

  // POST /api/ai/explain-alert
  public static async explainAlert(req: Request, res: Response) {
    const { alertId, alert: clientAlert, stationId } = req.body;
    let alert = inMemoryDb.alerts.find(a => a.id === alertId) || clientAlert;

    if (!alert) {
      const stId = (stationId || 'maitri') as StationId;
      alert = {
        id: alertId || 'ALT-POLAR-01',
        stationId: stId,
        severity: 'CRITICAL',
        component: 'Combined Heat & Power (CHP) / Hydronic Loop',
        title: 'Thermal Exchange Dissipation Alarm',
        description: 'Rapid coolant temperature gradient detected during polar katabatic weather surge.',
        suggestedAction: 'Engage secondary trace heating circuit and verify boiler flow rate.',
        timestamp: new Date().toISOString()
      };
    }

    try {
      const geminiExp = await GeminiAIService.explainAlert(alert, alert.stationId || 'maitri');
      if (geminiExp) {
        return res.json({ success: true, alert, explanation: geminiExp });
      }
    } catch (e: any) {
      console.warn('[ApiController] Gemini alert explanation fallback:', e.message);
    }

    const env = inMemoryDb.environment.get(alert.stationId);
    const energy = inMemoryDb.energy.get(alert.stationId);

    const explanation = {
      alertTitle: alert.title,
      severity: alert.severity,
      component: alert.component,
      currentTelemetry: `Ambient Temp: ${env?.temperature}°C | Wind: ${env?.windSpeed} km/h | Power Load: ${energy?.powerGrid.consumptionKw} kW`,
      contributingFactors: [
        `Polar atmospheric conditions crossing nominal thresholds.`,
        `Thermal dissipation dynamics impacting ${alert.component}.`,
        `Electrical load balancing priority rule activated.`
      ],
      confidencePercent: 94,
      recommendedOperationalResponse: alert.suggestedAction,
      source: 'NCPOR MISSION AI ENGINE (DERIVED PHYSICAL MODEL)'
    };

    res.json({ success: true, alert, explanation });
  }

  // GET /api/stations/:id/analytics
  public static async getStationAnalytics(req: Request, res: Response) {
    const stationId = (req.params.id as StationId) || 'maitri';
    const range = (req.query.range as string) || '24h';

    const env = inMemoryDb.environment.get(stationId);
    const energy = inMemoryDb.energy.get(stationId);
    const aws = inMemoryDb.aws.get(stationId);
    const geo = inMemoryDb.geomagnetic.get(stationId);
    const seis = inMemoryDb.seismic.get(stationId);

    const baseTemp = aws?.temperature ?? env?.temperature ?? (stationId === 'maitri' ? -18.4 : -12.8);
    const baseWind = aws?.windSpeed ?? env?.windSpeed ?? (stationId === 'maitri' ? 36 : 28);
    const basePressure = aws?.pressure ?? env?.pressure ?? (stationId === 'maitri' ? 982 : 994);
    const basePowerGen = energy?.powerGrid.generationKw ?? 290;
    const basePowerCon = energy?.powerGrid.consumptionKw ?? 250;
    const baseBattery = energy?.battery.stateOfCharge ?? 85;
    const baseHeating = energy?.powerGrid.chpThermalGenerationKw ?? 150;
    const baseFuel = energy?.fuelStorage.currentFuelLiters ?? 65000;
    const basePpm = geo?.ppmTotalIntensity ?? 44250;
    const baseSeis = seis?.magnitude ?? 0.2;

    let pointsCount = 24;
    let stepMinutes = 60;
    if (range === '1h') { pointsCount = 12; stepMinutes = 5; }
    else if (range === '6h') { pointsCount = 24; stepMinutes = 15; }
    else if (range === '24h') { pointsCount = 24; stepMinutes = 60; }
    else if (range === '7d') { pointsCount = 28; stepMinutes = 360; }
    else if (range === '30d') { pointsCount = 30; stepMinutes = 1440; }

    const now = Date.now();
    const data: any[] = [];

    for (let i = pointsCount - 1; i >= 0; i--) {
      const pointTime = new Date(now - i * stepMinutes * 60 * 1000);
      const angle = (i / pointsCount) * Math.PI * 2;
      const noise = (Math.sin(i * 1.7) * 0.5);

      const temp = Number((baseTemp + Math.sin(angle) * 3.5 + noise * 0.8).toFixed(1));
      const wind = Math.max(5, Math.round(baseWind + Math.cos(angle * 1.3) * 12 + noise * 4));
      const pressure = Math.round(basePressure + Math.sin(angle * 0.8) * 8 + noise * 2);
      const powerGen = Math.round(basePowerGen + Math.sin(angle) * 20 + noise * 5);
      const powerCon = Math.round(basePowerCon + Math.cos(angle) * 25 + noise * 8);
      const batterySoc = Math.min(100, Math.max(40, Math.round(baseBattery - Math.sin(angle) * 8)));
      const heating = Math.round(baseHeating + (Math.abs(temp) * 1.8) + noise * 5);
      const fuel = Math.max(10000, Math.round(baseFuel - (pointsCount - i) * (range === '30d' ? 1200 : range === '7d' ? 250 : 20)));
      const ppmIntensity = Math.round(basePpm + Math.sin(angle * 2) * 45 + noise * 10);
      const seismicMag = Math.max(0.05, Number((baseSeis + Math.abs(Math.sin(angle * 3)) * 0.4 + noise * 0.1).toFixed(2)));

      data.push({
        timestamp: pointTime.toISOString(),
        time: pointTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: pointTime.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        temp,
        wind,
        pressure,
        powerGen,
        powerCon,
        batterySoc,
        heating,
        fuel,
        ppmIntensity,
        seismicMag
      });
    }

    // Replace the latest data point with exact real-time telemetry if available
    const realHistory = inMemoryDb.historicalTelemetry.filter(h => h.stationId === stationId);
    if (realHistory.length > 0) {
      const latest = realHistory[realHistory.length - 1];
      data[data.length - 1].temp = latest.temp ?? data[data.length - 1].temp;
      data[data.length - 1].wind = latest.wind ?? data[data.length - 1].wind;
      data[data.length - 1].pressure = latest.pressure ?? data[data.length - 1].pressure;
      data[data.length - 1].powerGen = latest.powerGen ?? data[data.length - 1].powerGen;
      data[data.length - 1].powerCon = latest.powerCon ?? data[data.length - 1].powerCon;
      data[data.length - 1].batterySoc = latest.batterySoc ?? data[data.length - 1].batterySoc;
    }

    const calcStats = (vals: number[]) => {
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const avg = Number((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
      const variance = vals.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / vals.length;
      const stdDev = Number(Math.sqrt(variance).toFixed(2));
      const first = vals[0];
      const last = vals[vals.length - 1];
      const rate = Number(((last - first) / Math.max(1, (pointsCount * stepMinutes) / 60)).toFixed(2));
      const trend = rate > 0.15 ? 'RISING' : rate < -0.15 ? 'FALLING' : 'STABLE';
      const anomalyScore = Number((Math.min(1.0, Math.abs(last - avg) / (Math.max(1, stdDev * 2.5)))).toFixed(2));
      return { current: last, min, max, avg, stdDev, rate, trend, anomalyScore };
    };

    const stats = {
      temperature: calcStats(data.map(d => d.temp)),
      wind: calcStats(data.map(d => d.wind)),
      pressure: calcStats(data.map(d => d.pressure)),
      powerConsumption: calcStats(data.map(d => d.powerCon)),
      heating: calcStats(data.map(d => d.heating)),
      fuel: calcStats(data.map(d => d.fuel)),
      geomagnetic: calcStats(data.map(d => d.ppmIntensity)),
      seismic: calcStats(data.map(d => d.seismicMag))
    };

    res.json({
      success: true,
      stationId,
      range,
      count: data.length,
      stats,
      data
    });
  }

  // POST /api/auth/role
  public static async setRole(req: Request, res: Response) {
    const { role } = req.body as { role: RBACRole };
    if (!role) return res.status(400).json({ success: false, error: 'role required' });
    inMemoryDb.activeUserRole = role;
    res.json({ success: true, activeRole: inMemoryDb.activeUserRole });
  }

  // GET /api/stations
  public static async getStations(req: Request, res: Response) {
    const stations = Array.from(inMemoryDb.stations.values());
    res.json({
      success: true,
      count: stations.length,
      data: stations
    });
  }

  // GET /api/stations/:id
  public static async getStationById(req: Request, res: Response) {
    const id = req.params.id as StationId;
    const station = inMemoryDb.stations.get(id);
    if (!station) return res.status(404).json({ success: false, error: 'Station not found' });
    res.json({ success: true, data: station });
  }

  // GET /api/stations/:id/telemetry
  public static async getStationTelemetry(req: Request, res: Response) {
    const id = req.params.id as StationId;
    try {
      const env = inMemoryDb.environment.get(id);
      const energy = inMemoryDb.energy.get(id);
      const equipment = inMemoryDb.equipment.get(id);
      const inventory = inMemoryDb.inventory.get(id);
      const aws = inMemoryDb.aws.get(id);
      const geomagnetic = inMemoryDb.geomagnetic.get(id);
      const atmospheric = inMemoryDb.atmospheric.get(id);
      const seismic = id === 'maitri' ? inMemoryDb.seismic.get('maitri') : null;
      const subsystems = inMemoryDb.subsystems.get(id);
      const alerts = inMemoryDb.alerts.filter(a => a.stationId === id);

      res.json({
        success: true,
        stationId: id,
        timestamp: new Date().toISOString(),
        simulationState: inMemoryDb.simulationState,
        data: {
          environment: env,
          energy: energy,
          equipment: equipment,
          inventory: inventory,
          aws,
          geomagnetic,
          atmospheric,
          seismic,
          subsystems,
          alerts
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET /api/stations/:id/scientific
  public static async getScientificTelemetry(req: Request, res: Response) {
    const id = req.params.id as StationId;
    res.json({
      success: true,
      stationId: id,
      data: {
        aws: inMemoryDb.aws.get(id),
        geomagnetic: inMemoryDb.geomagnetic.get(id),
        atmospheric: inMemoryDb.atmospheric.get(id),
        seismic: id === 'maitri' ? inMemoryDb.seismic.get('maitri') : null
      }
    });
  }

  // POST /api/simulation/scenario or POST /api/scenarios
  public static async triggerScenario(req: Request, res: Response) {
    const { scenarioId, scenario, stationId } = req.body;
    const targetScenario: ScenarioId = scenarioId || scenario || 'normal';
    const targetStation: StationId = stationId || 'maitri';

    simulationEngine.triggerScenario(targetScenario);

    let incident = null;
    if (targetScenario === 'blizzard' || targetScenario === 'generator_failure' || targetScenario === 'heating_failure' || targetScenario === 'pump_failure' || targetScenario === 'multi_failure_compound') {
      incident = await EmergencyScenarioEngine.triggerEmergencyScenario(targetStation, targetScenario);
    }

    res.json({
      success: true,
      message: `Scenario [${targetScenario}] activated across stations.`,
      incident,
      simulationState: inMemoryDb.simulationState
    });
  }

  // GET /api/incidents
  public static async getIncidents(req: Request, res: Response) {
    const stationId = req.query.stationId as StationId;
    const filtered = stationId ? inMemoryDb.incidents.filter(i => i.stationId === stationId) : inMemoryDb.incidents;
    res.json({ success: true, count: filtered.length, data: filtered });
  }

  // GET & POST /api/incidents/:id/export
  public static async exportIncidentReport(req: Request, res: Response) {
    const incidentId = req.params.id;
    const format = (req.query.format as string || 'pdf').toLowerCase();

    try {
      if (format === 'csv') {
        const csv = ReportGeneratorService.generateIncidentCsv(incidentId);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="Incident_${incidentId}.csv"`);
        return res.send(csv);
      } else if (format === 'json') {
        const json = ReportGeneratorService.generateIncidentJson(incidentId);
        return res.json(json);
      } else {
        const html = ReportGeneratorService.generateIncidentPdfHtml(incidentId);
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
      }
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  }

  // POST /api/assistant/query
  public static async queryAssistant(req: Request, res: Response) {
    const { stationId, prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, error: 'Prompt required' });
    
    const stId = (stationId || 'maitri') as StationId;
    const response = await AIAssistantService.queryAssistant(stId, prompt);

    res.json({
      success: true,
      stationId: stId,
      prompt,
      response,
      answer: response.fullMarkdownAnswer
    });
  }

  // GET /api/logs
  public static async getSystemLogs(req: Request, res: Response) {
    const stationId = req.query.stationId as string;
    const auditLogs = inMemoryDb.auditLogs.filter(a => !stationId || a.stationId === stationId);
    const systemLogs = systemLogger.getLogs(stationId);
    res.json({ success: true, auditLogsCount: auditLogs.length, auditLogs, systemLogs });
  }

  // POST /api/simulation/start
  public static async startSimulation(req: Request, res: Response) {
    simulationEngine.start();
    res.json({ success: true, message: 'Simulation clock started', state: inMemoryDb.simulationState });
  }

  // POST /api/simulation/pause
  public static async pauseSimulation(req: Request, res: Response) {
    simulationEngine.pause();
    res.json({ success: true, message: 'Simulation clock paused', state: inMemoryDb.simulationState });
  }

  // POST /api/simulation/reset
  public static async resetSimulation(req: Request, res: Response) {
    seedInitialStationData();
    SensorHealthService.initializeSensorRegistry();
    EdgeGatewayService.initializeEdgeGateways();
    MaintenanceService.initializeMaintenanceRecords();
    simulationEngine.triggerScenario('normal');
    systemLogger.log('SIMULATION_RESET', 'all', 'Station state reset to baseline.');
    res.json({ success: true, message: 'Simulation reset to baseline state', state: inMemoryDb.simulationState });
  }

  // POST /api/simulation/speed
  public static async setSpeed(req: Request, res: Response) {
    const { speed } = req.body;
    simulationEngine.setSpeed(Number(speed) || 1);
    res.json({ success: true, speed: inMemoryDb.simulationState.speedMultiplier });
  }

  // POST /api/alerts/:id/acknowledge
  public static async acknowledgeAlert(req: Request, res: Response) {
    const alertId = req.params.id;
    const alert = inMemoryDb.alerts.find(a => a.id === alertId);
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    
    alert.acknowledged = true;
    res.json({ success: true, alert });
  }

  // POST /api/alerts/:id/resolve
  public static async resolveAlert(req: Request, res: Response) {
    const alertId = req.params.id;
    const alert = inMemoryDb.alerts.find(a => a.id === alertId);
    if (!alert) return res.status(404).json({ success: false, error: 'Alert not found' });
    
    alert.resolved = true;
    alert.acknowledged = true;
    res.json({ success: true, alert });
  }

  // POST /api/whatif
  public static async calculateWhatIf(req: Request, res: Response) {
    const input: WhatIfInput = req.body;
    const stationId = input.stationId || 'maitri';
    const env = inMemoryDb.environment.get(stationId);
    const energy = inMemoryDb.energy.get(stationId);

    if (!env || !energy) return res.status(404).json({ success: false, error: 'Station data unavailable' });

    const currentTemp = env.temperature;
    const targetTemp = currentTemp + (input.temperatureDelta || 0);
    const coldDelta = Math.max(0, -20 - targetTemp);
    
    const predictedHeatingLoadKw = Math.round(150 + coldDelta * 5);
    const multiplier = input.powerDemandMultiplier || 1.0;
    const predictedTotalPowerKw = Math.round((predictedHeatingLoadKw + energy.powerGrid.criticalLoadKw + energy.powerGrid.nonCriticalLoadKw) * multiplier);

    let generator1LoadPercent = 60;
    let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    const recs: string[] = [];

    if (input.generator2Offline) {
      generator1LoadPercent = Math.min(100, Math.round((predictedTotalPowerKw / 250) * 100));
      if (generator1LoadPercent > 90) {
        riskLevel = 'CRITICAL';
        recs.push('URGENT: Initiate load shedding for non-critical heating loops immediately.');
        recs.push('Activate Backup Generator #3 to share thermal load.');
      } else {
        riskLevel = 'HIGH';
        recs.push('Monitor Generator #1 winding temperature closely.');
      }
    } else {
      generator1LoadPercent = Math.round((predictedTotalPowerKw * 0.6 / 250) * 100);
      if (predictedTotalPowerKw > 360) riskLevel = 'MODERATE';
    }

    const fuelBurnRateIncreasePercent = Math.round(((predictedTotalPowerKw - energy.powerGrid.consumptionKw) / energy.powerGrid.consumptionKw) * 100);
    const currentFuel = (energy.fuelStorage.currentFuelLiters * (input.fuelReservePercent ? input.fuelReservePercent / 100 : 1.0));
    const dailyBurnLiters = (predictedTotalPowerKw * 0.23) * 24;
    const fuelDaysRemaining = Number((currentFuel / Math.max(1, dailyBurnLiters)).toFixed(1));
    const batteryBackupHours = Number(((energy.battery.capacityKwh * 0.8) / Math.max(1, predictedTotalPowerKw - energy.powerGrid.generationKw)).toFixed(1));

    // Evaluate dependency consequences
    const depResult = DependencyGraphService.evaluateFailure(stationId, input.generator2Offline ? 'generators_chp' : 'electrical_grid');

    const result: WhatIfResult = {
      predictedHeatingLoadKw,
      predictedTotalPowerKw,
      generator1LoadPercent,
      generator1Risk: generator1LoadPercent > 88 ? 'CRITICAL' : generator1LoadPercent > 75 ? 'WARNING' : 'NORMAL',
      batteryBackupHours: Math.max(0.5, batteryBackupHours || 6.5),
      fuelBurnRateIncreasePercent: Math.max(-50, fuelBurnRateIncreasePercent),
      fuelDaysRemaining,
      riskLevel,
      recommendedActions: recs.length > 0 ? recs : ['Maintain standard operational parameters.', 'Verify HVAC valve actuators.'],
      dependencyConsequences: depResult
    };

    res.json({ success: true, input, result });
  }

  // POST /api/inventory/dispatch
  public static async dispatchSupply(req: Request, res: Response) {
    const { stationId } = req.body;
    const stId = (stationId || 'maitri') as StationId;
    const inv = inMemoryDb.inventory.get(stId);

    if (!inv) return res.status(404).json({ success: false, error: 'Inventory not found' });

    inv.forEach(item => {
      item.quantity = Math.round(item.maxCapacity * 0.95);
      item.status = 'NORMAL';
      item.lastRestocked = new Date().toISOString().split('T')[0];
    });

    const energy = inMemoryDb.energy.get(stId);
    if (energy) {
      energy.fuelStorage.currentFuelLiters = energy.fuelStorage.totalCapacityLiters;
      energy.fuelStorage.fuelPercent = 100;
      energy.fuelStorage.refillStatus = 'NORMAL';
      energy.fuelStorage.estimatedDaysRemaining = 65.0;
    }

    res.json({
      success: true,
      message: `Supply shipment successfully delivered to ${stId.toUpperCase()}. Reserves restored to 95%+ capacity.`
    });
  }
}
