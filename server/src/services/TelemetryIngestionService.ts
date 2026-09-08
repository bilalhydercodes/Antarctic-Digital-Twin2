import { TelemetryIngestPayload, StationId, StationAlert, TelemetryPriority } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';
import { AlertRulesEngine } from './AlertRulesEngine.js';
import { SensorHealthService } from './SensorHealthService.js';
import { EdgeGatewayService } from './EdgeGatewayService.js';
import { AnomalyDetectionService } from './AnomalyDetectionService.js';
import { systemLogger } from '../utils/logger.js';

export interface IngestionResult {
  success: boolean;
  station: StationId;
  sensorId: string;
  timestamp: string;
  processedCategory: string;
  priority: TelemetryPriority;
  quality: string;
  alertsGenerated: number;
  satelliteStats: {
    fullPayloadBytes: number;
    deltaPayloadBytes: number;
    compressionRatioPercent: number;
  };
  message: string;
}

export class TelemetryIngestionService {
  private static ioServer: any = null;

  public static setSocketServer(io: any) {
    this.ioServer = io;
    AlertRulesEngine.setSocketServer(io);
    SensorHealthService.setSocketServer(io);
    EdgeGatewayService.setSocketServer(io);
    AnomalyDetectionService.setSocketServer(io);
  }

  public static async ingestTelemetry(payload: TelemetryIngestPayload): Promise<IngestionResult> {
    // 1. VALIDATE INCOMING PAYLOAD
    const station = payload.station ? (payload.station.toLowerCase() as StationId) : null;
    if (!station || (station !== 'maitri' && station !== 'bharati')) {
      throw new Error(`Invalid station ID: ${payload.station}. Must be 'MAITRI' or 'BHARATI'.`);
    }

    if (!payload.sensorId || typeof payload.sensorId !== 'string') {
      throw new Error('Missing or invalid sensorId in telemetry payload.');
    }

    if (!payload.data || typeof payload.data !== 'object') {
      throw new Error('Missing or invalid data object in telemetry payload.');
    }

    const timestamp = payload.timestamp || new Date().toISOString();
    const sensorId = payload.sensorId.toUpperCase();
    const data = payload.data;
    const priority: TelemetryPriority = payload.priority || (sensorId.startsWith('PUMP') ? 'P0_LIFE_SAFETY' : sensorId.startsWith('GEN') || sensorId.startsWith('AWS') ? 'P1_CRITICAL_INFRASTRUCTURE' : 'P3_SCIENTIFIC_DATA');

    let processedCategory = 'GENERAL';
    const alerts: StationAlert[] = [];
    let quality = 'GOOD';

    // 2. SENSOR HEALTH & DATA QUALITY MONITORING
    const primaryNumericVal = typeof data.temperature === 'number' ? data.temperature : typeof data.ppmTotalIntensity === 'number' ? data.ppmTotalIntensity : typeof data.magnitude === 'number' ? data.magnitude : typeof data.powerKw === 'number' ? data.powerKw : 0;
    
    if (inMemoryDb.sensors.has(sensorId)) {
      quality = SensorHealthService.processReading(sensorId, primaryNumericVal);
    }

    // 3. CATEGORY ROUTING & STATE MUTATION
    if (sensorId.startsWith('AWS') || 'temperature' in data || 'windSpeed' in data) {
      processedCategory = 'AWS';
      const existing = inMemoryDb.aws.get(station) || {
        station,
        sensorId,
        timestamp,
        temperature: -30.0,
        feelsLike: -40.0,
        humidity: 60.0,
        pressure: 985.0,
        windSpeed: 20.0,
        windDirection: 180,
        solarRadiation: 400,
        snowfallRate: 0,
        visibility: 10,
        status: 'OPERATIONAL'
      };

      const updatedAws = {
        ...existing,
        ...data,
        station,
        sensorId,
        timestamp
      };

      inMemoryDb.aws.set(station, updatedAws);

      // Sync backward compatible Environment object
      const env = inMemoryDb.environment.get(station);
      if (env) {
        if ('temperature' in data) env.temperature = Number(data.temperature);
        if ('feelsLike' in data) env.feelsLike = Number(data.feelsLike);
        if ('humidity' in data) env.humidity = Number(data.humidity);
        if ('pressure' in data) env.pressure = Number(data.pressure);
        if ('windSpeed' in data) env.windSpeed = Number(data.windSpeed);
        if ('windDirection' in data) env.windDirection = String(data.windDirection);
        env.timestamp = timestamp;
      }

      alerts.push(...AlertRulesEngine.evaluateTelemetry(station, 'AWS', updatedAws));
    } else if (sensorId.startsWith('PPM') || sensorId.startsWith('DFM') || sensorId.startsWith('ICM') || sensorId.startsWith('DIM') || 'ppmTotalIntensity' in data || 'dfmX' in data) {
      processedCategory = 'GEOMAGNETIC';
      const existing = inMemoryDb.geomagnetic.get(station) || {
        station,
        timestamp,
        ppmTotalIntensity: 43500.0,
        ppmStatus: 'OPERATIONAL',
        dfmX: 18500.0,
        dfmY: -2000.0,
        dfmZ: -39000.0,
        dfmStatus: 'OPERATIONAL',
        icmX: 0,
        icmY: 0,
        icmZ: 0,
        icmStatus: 'OPERATIONAL'
      };

      const updatedGeo = {
        ...existing,
        ...data,
        station,
        timestamp
      };

      inMemoryDb.geomagnetic.set(station, updatedGeo);
      alerts.push(...AlertRulesEngine.evaluateTelemetry(station, 'GEOMAGNETIC', updatedGeo));
    } else if (sensorId.startsWith('VLF') || sensorId.startsWith('EFM') || sensorId.startsWith('RIO') || 'electricFieldMillKvM' in data) {
      processedCategory = 'ATMOSPHERIC';
      const existing = inMemoryDb.atmospheric.get(station) || {
        station,
        timestamp,
        vlfReceiverStatus: 'OPERATIONAL',
        vlfSignalStrengthDb: 60.0,
        electricFieldMillKvM: 1.2,
        efmStatus: 'OPERATIONAL'
      };

      const updatedAtmo = {
        ...existing,
        ...data,
        station,
        timestamp
      };

      inMemoryDb.atmospheric.set(station, updatedAtmo);
    } else if (sensorId.startsWith('SEIS') || 'broadbandStatus' in data || 'channelZ' in data) {
      processedCategory = 'SEISMIC';
      const existing = inMemoryDb.seismic.get('maitri') || {
        station: 'maitri',
        sensorId,
        timestamp,
        broadbandStatus: 'OPERATIONAL',
        channelX: [0, 0, 0],
        channelY: [0, 0, 0],
        channelZ: [0, 0, 0],
        activityLevel: 'QUIET',
        magnitude: 1.0,
        gpsTimeSync: true,
        recordingStatus: 'RECORDING',
        localBufferUsagePercent: 10.0
      };

      const updatedSeis = {
        ...existing,
        ...data,
        station: 'maitri' as StationId,
        timestamp
      };

      inMemoryDb.seismic.set('maitri', updatedSeis);
      alerts.push(...AlertRulesEngine.evaluateTelemetry('maitri', 'SEISMIC', updatedSeis));
    } else if (sensorId.startsWith('GEN') || sensorId.startsWith('PWR') || 'powerKw' in data || 'loadPercent' in data) {
      processedCategory = 'ENERGY';
      const energy = inMemoryDb.energy.get(station);
      if (energy && data.generatorId) {
        const gen = energy.generators.find(g => g.id.toUpperCase() === String(data.generatorId).toUpperCase());
        if (gen) {
          Object.assign(gen, data);
        }
      }
      alerts.push(...AlertRulesEngine.evaluateTelemetry(station, 'ENERGY', data));
    } else if (sensorId.startsWith('PUMP') || sensorId.startsWith('WATER') || 'waterTemp' in data) {
      processedCategory = 'WATER';
      const subList = inMemoryDb.subsystems.get(station) || [];
      const pumpSub = subList.find(s => s.type === 'WATER_PUMP' || s.equipmentId.includes('PUMP'));
      if (pumpSub) {
        if ('temperature' in data) pumpSub.temperature = Number(data.temperature);
        if ('loadPercent' in data) pumpSub.loadPercent = Number(data.loadPercent);
        if ('status' in data) pumpSub.status = data.status;
      }
      alerts.push(...AlertRulesEngine.evaluateTelemetry(station, 'WATER', data));
    }

    // 4. SATELLITE MODE METRICS COMPUTATION
    const fullJson = JSON.stringify(payload);
    const fullPayloadBytes = Buffer.byteLength(fullJson, 'utf8');
    const deltaJson = JSON.stringify({ s: station, id: sensorId, p: priority, d: data });
    const deltaPayloadBytes = Buffer.byteLength(deltaJson, 'utf8');
    const compressionRatioPercent = Number((((fullPayloadBytes - deltaPayloadBytes) / fullPayloadBytes) * 100).toFixed(1));

    inMemoryDb.simulationState.satelliteStats.fullPayloadSize = fullPayloadBytes;
    inMemoryDb.simulationState.satelliteStats.deltaPayloadSize = deltaPayloadBytes;
    inMemoryDb.simulationState.satelliteStats.compressionRatio = compressionRatioPercent;
    inMemoryDb.simulationState.satelliteStats.lastSyncTimestamp = timestamp;

    // 5. HISTORICAL RECORDING
    const stEnv = inMemoryDb.environment.get(station);
    const stEnergy = inMemoryDb.energy.get(station);
    const stGeo = inMemoryDb.geomagnetic.get(station);
    const stSeis = inMemoryDb.seismic.get(station);

    if (stEnv && stEnergy) {
      inMemoryDb.historicalTelemetry.push({
        stationId: station,
        timestamp,
        temp: stEnv.temperature,
        wind: stEnv.windSpeed,
        pressure: stEnv.pressure,
        powerGen: stEnergy.powerGrid.generationKw,
        powerCon: stEnergy.powerGrid.consumptionKw,
        batterySoc: stEnergy.battery.stateOfCharge,
        fuelLiters: stEnergy.fuelStorage.currentFuelLiters,
        ppmIntensity: stGeo?.ppmTotalIntensity,
        seismicMag: stSeis?.magnitude
      });
    }

    if (inMemoryDb.historicalTelemetry.length > 1000) {
      inMemoryDb.historicalTelemetry.splice(0, inMemoryDb.historicalTelemetry.length - 1000);
    }

    // 6. STATISTICAL ANOMALY DETECTION
    AnomalyDetectionService.detectAnomalies(station);

    // 7. AUDIT LOGGING
    systemLogger.log(
      'TELEMETRY_INGESTED',
      station,
      `[${priority}] Ingested telemetry from ${sensorId} (${processedCategory}). Quality: ${quality}. Full: ${fullPayloadBytes}B, Delta: ${deltaPayloadBytes}B.`,
      { sensorId, category: processedCategory, priority, quality }
    );

    // 8. SOCKET.IO REALTIME BROADCAST
    if (this.ioServer) {
      this.ioServer.emit('telemetryUpdate', {
        station,
        sensorId,
        category: processedCategory,
        priority,
        quality,
        timestamp,
        data,
        satelliteStats: inMemoryDb.simulationState.satelliteStats
      });

      this.ioServer.emit('stationTelemetry', {
        maitri: {
          aws: inMemoryDb.aws.get('maitri'),
          geomagnetic: inMemoryDb.geomagnetic.get('maitri'),
          atmospheric: inMemoryDb.atmospheric.get('maitri'),
          seismic: inMemoryDb.seismic.get('maitri'),
          subsystems: inMemoryDb.subsystems.get('maitri'),
          environment: inMemoryDb.environment.get('maitri'),
          energy: inMemoryDb.energy.get('maitri'),
          equipment: inMemoryDb.equipment.get('maitri'),
          inventory: inMemoryDb.inventory.get('maitri')
        },
        bharati: {
          aws: inMemoryDb.aws.get('bharati'),
          geomagnetic: inMemoryDb.geomagnetic.get('bharati'),
          atmospheric: inMemoryDb.atmospheric.get('bharati'),
          subsystems: inMemoryDb.subsystems.get('bharati'),
          environment: inMemoryDb.environment.get('bharati'),
          energy: inMemoryDb.energy.get('bharati'),
          equipment: inMemoryDb.equipment.get('bharati'),
          inventory: inMemoryDb.inventory.get('bharati')
        },
        simulationState: inMemoryDb.simulationState,
        latestAlerts: inMemoryDb.alerts.slice(-8),
        edgeGateways: {
          maitri: inMemoryDb.edgeGateways.get('maitri'),
          bharati: inMemoryDb.edgeGateways.get('bharati')
        },
        recentAnomalies: inMemoryDb.anomalies.slice(0, 5)
      });
    }

    return {
      success: true,
      station,
      sensorId,
      timestamp,
      processedCategory,
      priority,
      quality,
      alertsGenerated: alerts.length,
      satelliteStats: {
        fullPayloadBytes,
        deltaPayloadBytes,
        compressionRatioPercent
      },
      message: `Telemetry from ${sensorId} (${priority}) ingested with quality [${quality}].`
    };
  }
}
