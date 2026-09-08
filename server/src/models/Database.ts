import mongoose from 'mongoose';
import { 
  StationMeta, 
  EnvironmentData, 
  EnergyData, 
  EquipmentItem, 
  InventoryItem, 
  StationAlert, 
  AutomatedResponseLog,
  AuditTrailLog,
  IncidentRecord,
  AWSTelemetry,
  GeomagneticTelemetry,
  AtmosphericTelemetry,
  SeismicTelemetry,
  SubsystemState,
  TelemetryIngestPayload,
  SimulationState,
  SensorMetadata,
  SensorHealthRecord,
  EdgeGatewayTelemetry,
  StatisticalAnomalyRecord,
  MaintenanceRecord,
  ShiftHandoverReport,
  RBACRole
} from '../types/index.js';

class InMemoryStore {
  public stations: Map<string, StationMeta> = new Map();
  public environment: Map<string, EnvironmentData> = new Map();
  public energy: Map<string, EnergyData> = new Map();
  public equipment: Map<string, EquipmentItem[]> = new Map();
  public inventory: Map<string, InventoryItem[]> = new Map();
  
  // Scientific Instrumentation Stores
  public aws: Map<string, AWSTelemetry> = new Map();
  public geomagnetic: Map<string, GeomagneticTelemetry> = new Map();
  public atmospheric: Map<string, AtmosphericTelemetry> = new Map();
  public seismic: Map<string, SeismicTelemetry> = new Map();

  // Subsystem Digital Twin States
  public subsystems: Map<string, SubsystemState[]> = new Map();

  // Advanced Mission Ops Stores
  public sensors: Map<string, SensorMetadata> = new Map();
  public sensorHealth: Map<string, SensorHealthRecord> = new Map();
  public edgeGateways: Map<string, EdgeGatewayTelemetry> = new Map();
  public anomalies: StatisticalAnomalyRecord[] = [];
  public maintenanceRecords: MaintenanceRecord[] = [];
  public shiftHandovers: ShiftHandoverReport[] = [];
  public activeUserRole: RBACRole = 'COMMANDER';

  // Alerts, Incidents & Audit Logs
  public alerts: StationAlert[] = [];
  public automatedLogs: AutomatedResponseLog[] = [];
  public incidents: IncidentRecord[] = [];
  public auditLogs: AuditTrailLog[] = [];
  public telemetryQueue: TelemetryIngestPayload[] = [];
  
  public historicalTelemetry: { 
    stationId: string; 
    timestamp: string; 
    temp: number; 
    wind: number; 
    pressure: number;
    powerGen: number; 
    powerCon: number; 
    batterySoc: number; 
    fuelLiters: number;
    ppmIntensity?: number;
    seismicMag?: number;
  }[] = [];
  
  public simulationState: SimulationState = {
    isRunning: true,
    speedMultiplier: 1,
    clockMode: 'REAL',
    simulatedTime: new Date().toISOString(),
    activeScenario: 'normal',
    scenarioTitle: 'Normal Antarctic Operations',
    scenarioDescription: 'Standard seasonal weather and automated hybrid power grid regulation.',
    demoModeActive: false,
    demoStepIndex: 0,
    connectivityMode: 'LOCAL',
    satelliteStats: {
      mode: 'LOCAL',
      fullPayloadSize: 2450,
      deltaPayloadSize: 180,
      compressionRatio: 92.6,
      queueSize: 0,
      lastSyncTimestamp: new Date().toISOString(),
      simulatedLatencyMs: 45,
      bandwidthKbps: 1024
    }
  };
}

export const inMemoryDb = new InMemoryStore();
export let isMongoConnected = false;

export async function initDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/antarctic_twin';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    isMongoConnected = true;
    console.log('🟢 Connected to MongoDB at:', mongoUri);
  } catch (err) {
    isMongoConnected = false;
    console.log('🟡 MongoDB optional connection (running with high-performance In-Memory Database engine). Operational Digital Twin active!');
  }
}
