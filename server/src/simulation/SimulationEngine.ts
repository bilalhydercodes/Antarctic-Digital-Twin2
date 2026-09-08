import { inMemoryDb } from '../models/Database.js';
import { StationId, StationAlert, ScenarioId } from '../types/index.js';
import { TelemetryIngestionService } from '../services/TelemetryIngestionService.js';
import { EnvironmentSimulationService } from '../services/EnvironmentSimulationService.js';
import { EnergySimulationService } from '../services/EnergySimulationService.js';
import { EquipmentHealthService } from '../services/EquipmentHealthService.js';
import { InventorySimulationService } from '../services/InventorySimulationService.js';
import { SensorHealthService } from '../services/SensorHealthService.js';
import { EdgeGatewayService } from '../services/EdgeGatewayService.js';
import { AnomalyDetectionService } from '../services/AnomalyDetectionService.js';
import { EmergencyScenarioEngine } from '../services/EmergencyScenarioEngine.js';
import { systemLogger } from '../utils/logger.js';

export class SimulationEngine {
  private timer: NodeJS.Timeout | null = null;
  private ioServer: any = null;

  public setSocketServer(io: any) {
    this.ioServer = io;
    TelemetryIngestionService.setSocketServer(io);
    EdgeGatewayService.setSocketServer(io);
    SensorHealthService.setSocketServer(io);
    AnomalyDetectionService.setSocketServer(io);
  }

  public start() {
    if (this.timer) clearInterval(this.timer);
    inMemoryDb.simulationState.isRunning = true;
    this.timer = setInterval(() => {
      this.tick();
    }, 3000); // 3s physics tick loop
    systemLogger.log('SIMULATION_STARTED', 'all', 'Mission Operations Simulation Engine active.');
  }

  public pause() {
    inMemoryDb.simulationState.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    systemLogger.log('SIMULATION_PAUSED', 'all', 'Simulation Engine paused.');
  }

  public setSpeed(multiplier: number) {
    inMemoryDb.simulationState.speedMultiplier = Math.max(1, Math.min(50, multiplier));
  }

  public triggerScenario(scenarioId: ScenarioId) {
    inMemoryDb.simulationState.activeScenario = scenarioId;
    
    const stations: StationId[] = ['maitri', 'bharati'];
    stations.forEach(stId => {
      this.applyScenarioToStation(stId, scenarioId);
    });

    systemLogger.log('SCENARIO_STARTED', 'all', `Scenario [${scenarioId}] initiated across stations.`);

    if (this.ioServer) {
      this.ioServer.emit('scenarioStarted', {
        scenarioId,
        simulationState: inMemoryDb.simulationState
      });
    }
  }

  public addAlert(alertData: Omit<StationAlert, 'id' | 'timestamp'>) {
    const alert: StationAlert = {
      ...alertData,
      id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    inMemoryDb.alerts.unshift(alert);

    if (inMemoryDb.alerts.length > 60) {
      inMemoryDb.alerts.pop();
    }

    if (this.ioServer) {
      this.ioServer.emit('alertCreated', alert);
    }
  }

  private applyScenarioToStation(stationId: StationId, scenarioId: ScenarioId) {
    const env = inMemoryDb.environment.get(stationId);
    const energy = inMemoryDb.energy.get(stationId);

    if (!env || !energy) return;

    if (scenarioId === 'blizzard') {
      env.temperature = -38.4;
      env.feelsLike = -52.0;
      env.windSpeed = 82;
      env.visibility = 0.2;
      env.snowfallRate = 3.5;
      env.solarRadiation = 15;
      energy.powerGrid.solarGenerationKw = 5;
      energy.powerGrid.heatingLoadKw = Math.round(energy.powerGrid.heatingLoadKw * 1.4);
    } else if (scenarioId === 'extreme_cold') {
      env.temperature = -46.0;
      env.feelsLike = -60.0;
      env.windSpeed = 40;
      energy.powerGrid.heatingLoadKw = Math.round(energy.powerGrid.heatingLoadKw * 1.5);
    } else if (scenarioId === 'generator_failure') {
      const gen1 = energy.generators[0];
      if (gen1) {
        gen1.temperature = 98.5;
        gen1.status = 'FAILED';
        gen1.healthPercent = 20;
        gen1.failureProbability = 99.0;
        gen1.powerKw = 0;
      }
    } else if (scenarioId === 'multi_system_failure' || scenarioId === 'multi_failure_compound') {
      // Compound multi-failure: Blizzard + Generator Failure + Satellite Link Degraded
      env.temperature = -42.0;
      env.windSpeed = 88;
      const gen1 = energy.generators[0];
      if (gen1) {
        gen1.temperature = 99.0;
        gen1.status = 'FAILED';
        gen1.healthPercent = 10;
        gen1.powerKw = 0;
      }
      EdgeGatewayService.configureSatelliteLink(stationId, { mode: 'DEGRADED' });
    } else if (scenarioId === 'normal') {
      env.temperature = stationId === 'maitri' ? -32.4 : -28.6;
      env.feelsLike = stationId === 'maitri' ? -42.1 : -36.4;
      env.windSpeed = stationId === 'maitri' ? 14.2 : 18.5;
      env.visibility = 12.5;
      env.solarRadiation = stationId === 'maitri' ? 410 : 480;
      
      const gen1 = energy.generators[0];
      if (gen1) {
        gen1.temperature = 72;
        gen1.status = 'ONLINE';
        gen1.healthPercent = 94;
        gen1.failureProbability = 5.0;
      }

      energy.powerGrid.loadSheddingActive = false;
      energy.powerGrid.sheddedLoads = [];
      EdgeGatewayService.configureSatelliteLink(stationId, { mode: 'LOCAL' });
    }
  }

  public async tick() {
    if (!inMemoryDb.simulationState.isRunning) return;

    const speed = inMemoryDb.simulationState.speedMultiplier;
    const stations: StationId[] = ['maitri', 'bharati'];

    // Update sensor timeout monitoring
    SensorHealthService.updateTimeouts();

    for (const stId of stations) {
      // 1. Physical Environment Update
      const env = await EnvironmentSimulationService.updateEnvironment(stId, speed);

      // Route physics ticks through the unified Telemetry Ingestion Service
      await TelemetryIngestionService.ingestTelemetry({
        station: stId,
        sensorId: `AWS-${stId.toUpperCase()}-01`,
        timestamp: new Date().toISOString(),
        priority: 'P1_CRITICAL_INFRASTRUCTURE',
        data: {
          temperature: env.temperature,
          feelsLike: env.feelsLike,
          humidity: env.humidity,
          pressure: env.pressure,
          windSpeed: env.windSpeed,
          windDirection: env.windDirection,
          solarRadiation: env.solarRadiation
        }
      });

      // 2. Power Grid Update
      EnergySimulationService.updateEnergyGrid(stId, env, speed);
      EquipmentHealthService.updateEquipmentStates(stId, speed);
      InventorySimulationService.updateInventory(stId, speed);

      // 3. Edge Gateway Telemetry Tick
      EdgeGatewayService.updateGatewayTick(stId);
    }
  }
}

export const simulationEngine = new SimulationEngine();
