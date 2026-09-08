export type StationId = 'maitri' | 'bharati';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY' | 'RESOLVED';

export type OperationalStatus = 'OPERATIONAL' | 'OFFLINE' | 'MAINTENANCE' | 'SIMULATED';

export type SensorQualityFlag = 'GOOD' | 'SUSPECT' | 'BAD' | 'STALE' | 'MISSING' | 'SIMULATED';

export type CalibrationStatus = 'VALID' | 'DUE_SOON' | 'EXPIRED' | 'CALIBRATING';

export type BatteryPowerStatus = 'NORMAL' | 'LOW' | 'CRITICAL' | 'EXTERNAL_GRID' | 'SOLAR_BACKUP';

export type SensorCommStatus = 'ONLINE' | 'INTERMITTENT' | 'DEGRADED' | 'OFFLINE';

export type TelemetryPriority = 
  | 'P0_LIFE_SAFETY' 
  | 'P1_CRITICAL_INFRASTRUCTURE' 
  | 'P2_STATION_OPERATIONS' 
  | 'P3_SCIENTIFIC_DATA' 
  | 'P4_ANALYTICS';

export type SatelliteLinkMode = 'LOCAL' | 'VSAT' | 'LOW_BANDWIDTH' | 'DEGRADED' | 'OFFLINE';

export type RBACRole = 'ADMIN' | 'COMMANDER' | 'OPERATOR' | 'SCIENTIST' | 'VIEWER';

export type ScenarioId = 
  | 'normal'
  | 'blizzard'
  | 'extreme_cold'
  | 'high_wind'
  | 'generator_failure'
  | 'heating_failure'
  | 'communication_outage'
  | 'fuel_system_alert'
  | 'pump_failure'
  | 'battery_low'
  | 'fuel_shortage'
  | 'sensor_failure'
  | 'multi_system_failure'
  | 'multi_failure_compound';

export type ConnectivityMode = 'LOCAL' | 'SATELLITE' | 'OFFLINE';

export interface StationMeta {
  id: StationId;
  name: string;
  code: string;
  established: number;
  locationName: string;
  coordinates: { lat: number; lng: number };
  elevationMeters: number;
  crewCount: number;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL';
}

// -------------------------------------------------------------
// SENSOR REGISTRY & SENSOR HEALTH TYPES
// -------------------------------------------------------------

export interface SensorMetadata {
  sensorId: string;
  stationId: StationId;
  name: string;
  sensorType: 'AWS' | 'PPM' | 'DFM' | 'ICM' | 'DIM' | 'GPS' | 'SEISMOMETER' | 'RIOMETER' | 'ALL_SKY' | 'EFM' | 'VLF' | 'AIR_ION' | 'UTILITY';
  location: string;
  measurement: string;
  unit: string;
  currentValue: number | string;
  timestamp: string;
  quality: SensorQualityFlag;
  calibrationStatus: CalibrationStatus;
  operationalStatus: OperationalStatus;
  batteryStatus: BatteryPowerStatus;
  commStatus: SensorCommStatus;
  expectedMin: number;
  expectedMax: number;
  priority: TelemetryPriority;
  source: 'DOCUMENTED' | 'SIMULATED' | 'DERIVED' | 'EXTERNAL_TELEMETRY';
}

export interface SensorHealthRecord {
  sensorId: string;
  stationId: StationId;
  healthPercent: number; // 0 - 100
  freshnessSeconds: number; // Seconds since last reading
  missingPacketsCount: number;
  abnormalReadingsCount: number;
  commFailuresCount: number;
  isStuck: boolean;
  isNoisy: boolean;
  consecutiveIdenticalCount: number;
  driftValue: number;
  noiseRms: number;
  diagnostics: string;
  lastUpdated: string;
}

// -------------------------------------------------------------
// EDGE COMPUTING GATEWAY & SATELLITE TYPES
// -------------------------------------------------------------

export interface SatelliteDegradationConfig {
  mode: SatelliteLinkMode;
  latencyMs: number;
  packetLossPercent: number;
  bandwidthKbps: number;
  jitterMs: number;
  outageDurationSec: number;
}

export interface EdgeGatewayTelemetry {
  stationId: StationId;
  gatewayStatus: 'ONLINE' | 'DEGRADED' | 'OFFLINE' | 'BUFFERING';
  cpuLoadPercent: number;
  memoryUsagePercent: number;
  localBufferQueueSize: number;
  maxBufferCapacity: number;
  packetsReceivedTotal: number;
  packetsSentTotal: number;
  packetsDroppedTotal: number;
  compressionRatioPercent: number;
  lastSatelliteSyncTimestamp: string;
  bandwidthUsageKbps: number;
  activeDegradation: SatelliteDegradationConfig;
  priorityTransmissionStats: {
    p0TransmitPercent: number;
    p1TransmitPercent: number;
    p2TransmitPercent: number;
    p3TransmitPercent: number;
    p4TransmitPercent: number;
  };
}

// -------------------------------------------------------------
// STATISTICAL ANOMALY DETECTION TYPES
// -------------------------------------------------------------

export interface StatisticalAnomalyRecord {
  id: string;
  stationId: StationId;
  sensorId: string;
  parameterName: string;
  observedValue: number;
  expectedRange: { min: number; max: number };
  rollingMean: number;
  rollingStdDev: number;
  zScore: number;
  anomalyScore: number; // 0.0 to 1.0
  severity: AlertSeverity;
  timestamp: string;
  reason: string;
  method: 'Z_SCORE' | 'ROLLING_STATS' | 'RATE_OF_CHANGE' | 'BOUNDS_CHECK';
}

// -------------------------------------------------------------
// SYSTEM DEPENDENCY GRAPH TYPES
// -------------------------------------------------------------

export interface DependencyNode {
  id: string;
  name: string;
  category: 'POWER' | 'HEATING' | 'WATER' | 'COMMS' | 'LIFE_SUPPORT' | 'RESEARCH';
  status: 'HEALTHY' | 'WARNING' | 'FAILED';
  dependsOn: string[]; // Parent node IDs
  directImpacts: string[]; // Child node IDs
}

export interface DependencyPropagationResult {
  rootFailureNodeId: string;
  stationId: StationId;
  directImpacts: string[];
  indirectImpacts: string[];
  criticalDependenciesAtRisk: string[];
  overallLifeSupportImpact: 'NONE' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  recommendedMitigations: string[];
  timestamp: string;
}

// -------------------------------------------------------------
// MAINTENANCE MANAGEMENT & SHIFT HANDOVER
// -------------------------------------------------------------

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  stationId: StationId;
  equipmentName: string;
  serviceType: 'ROUTINE_PREVENTIVE' | 'EMERGENCY_REPAIR' | 'CALIBRATION' | 'OVERHAUL';
  lastServiceDate: string;
  nextServiceDate: string;
  status: 'NORMAL' | 'DUE_SOON' | 'OVERDUE' | 'UNDER_MAINTENANCE';
  technician: string;
  healthBeforePercent: number;
  healthAfterPercent: number;
  notes: string;
}

export interface ShiftHandoverReport {
  id: string;
  stationId: StationId;
  generatedAt: string;
  outgoingCommander: string;
  incomingCommander: string;
  shiftHours: string;
  activeIncidentsCount: number;
  resolvedIncidentsCount: number;
  equipmentRequiringAttention: { id: string; name: string; status: string; health: number }[];
  sensorFailuresCount: number;
  offlineSensorsList: string[];
  powerGridSummary: { generationKw: number; demandKw: number; batterySoc: number };
  fuelReservesSummary: { daysRemaining: number; currentLiters: number };
  communicationStatus: string;
  scientificInstrumentsSummary: string;
  pendingMaintenanceTasks: string[];
  overallStationReadinessPercent: number;
}

// -------------------------------------------------------------
// SCIENTIFIC INSTRUMENTATION & UTILITIES
// -------------------------------------------------------------

export interface EnvironmentData {
  stationId: StationId;
  timestamp: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  snowfallRate: number;
  snowAccumulation: number;
  solarRadiation: number;
  iceCondition: string;
  sensorHealth: Record<string, 'ONLINE' | 'OFFLINE' | 'DEGRADED'>;
}

export interface AWSTelemetry {
  station: StationId;
  sensorId: string;
  timestamp: string;
  temperature: number;
  feelsLike?: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number | string;
  solarRadiation: number;
  snowfallRate: number;
  visibility: number;
  status: OperationalStatus;
  quality?: SensorQualityFlag;
}

export interface GeomagneticTelemetry {
  station: StationId;
  timestamp: string;
  ppmTotalIntensity: number;
  ppmStatus: OperationalStatus;
  dfmX: number;
  dfmY: number;
  dfmZ: number;
  dfmStatus: OperationalStatus;
  icmX: number;
  icmY: number;
  icmZ: number;
  icmStatus: OperationalStatus;
  dimDeclination?: number;
  dimInclination?: number;
  dimStatus?: OperationalStatus;
  gpsSync?: boolean;
}

export interface AtmosphericTelemetry {
  station: StationId;
  timestamp: string;
  vlfReceiverStatus: OperationalStatus;
  vlfSignalStrengthDb: number;
  electricFieldMillKvM: number;
  efmStatus: OperationalStatus;
  riometerAbsorptionDb?: number;
  riometerStatus?: OperationalStatus;
  allSkyImagerStatus?: OperationalStatus;
  allSkyCloudCoverPercent?: number;
  airEarthCurrentAntennaPAm2?: number;
  maxwellAntennaVm?: number;
  longWireAntennaDb?: number;
  airIonCounterDensity?: number;
}

export interface SeismicTelemetry {
  station: StationId;
  timestamp: string;
  sensorId: string;
  broadbandStatus: OperationalStatus;
  channelX: number[];
  channelY: number[];
  channelZ: number[];
  activityLevel: 'QUIET' | 'MODERATE' | 'MICROSEISMIC' | 'TREMOR' | 'HIGH_EVENT';
  magnitude: number;
  gpsTimeSync: boolean;
  recordingStatus: 'RECORDING' | 'BUFFERING' | 'PAUSED' | 'ERROR';
  localBufferUsagePercent: number;
}

export interface SubsystemState {
  equipmentId: string;
  station: StationId;
  name: string;
  type: 'MAIN_BUILDING' | 'FUEL_FARM' | 'FUEL_STATION' | 'WATER_PUMP' | 'SUMMER_CAMP' | 'MODULES' | 'POWER' | 'HEATING' | 'HVAC' | 'HOT_WATER' | 'COLD_WATER' | 'COLD_STORAGE' | 'LABS' | 'COMMS' | 'WASTEWATER';
  status: 'RUNNING' | 'STANDBY' | 'WARNING' | 'FAILED' | 'OFFLINE' | 'MAINTENANCE';
  loadPercent: number;
  temperature: number;
  healthPercent: number;
  powerKw?: number;
  details?: Record<string, any>;
}

export interface GeneratorTelemetry {
  id: string;
  name: string;
  rpm: number;
  temperature: number;
  fuelConsumptionRate: number;
  loadPercent: number;
  voltage: number;
  current: number;
  powerKw: number;
  runtimeHours: number;
  healthPercent: number;
  status: 'ONLINE' | 'OFFLINE' | 'WARNING' | 'CRITICAL' | 'FAILED' | 'RECOVERING';
  failureProbability: number;
  isCHP?: boolean;
  thermalOutputKw?: number;
}

export interface BatteryTelemetry {
  stateOfCharge: number;
  capacityKwh: number;
  currentKwh: number;
  voltage: number;
  current: number;
  powerKw: number;
  temperature: number;
  chargeDischargeRateKw: number;
  estimatedBackupHours: number;
  healthPercent: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'DISCHARGING_FAST';
}

export interface PowerGridTelemetry {
  generationKw: number;
  solarGenerationKw: number;
  windGenerationKw: number;
  generatorGenerationKw: number;
  chpThermalGenerationKw?: number;
  consumptionKw: number;
  heatingLoadKw: number;
  criticalLoadKw: number;
  nonCriticalLoadKw: number;
  baseLoadKw: number;
  peakLoadKw: number;
  renewableContributionPercent: number;
  loadSheddingActive?: boolean;
  sheddedLoads?: string[];
  powerHierarchyLevel?: 1 | 2 | 3 | 4;
}

export interface EnergyData {
  stationId: StationId;
  timestamp: string;
  powerGrid: PowerGridTelemetry;
  generators: GeneratorTelemetry[];
  battery: BatteryTelemetry;
  fuelStorage: {
    totalCapacityLiters: number;
    currentFuelLiters: number;
    fuelPercent: number;
    consumptionRateLitersPerHour: number;
    estimatedDaysRemaining: number;
    refillStatus: 'NORMAL' | 'LOW' | 'CRITICAL' | 'SHIPMENT_EN_ROUTE';
  };
}

export interface EquipmentItem {
  id: string;
  stationId: StationId;
  name: string;
  category: 'ENERGY' | 'HVAC' | 'WATER' | 'COMMS' | 'RESEARCH' | 'PUMPS';
  healthPercent: number;
  temperature: number;
  vibration: number;
  runtimeHours: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  lastMaintenance: string;
  nextMaintenance: string;
  failureProbability: number;
  simulatedPrediction: string;
  recommendedAction: string;
  operationalTag?: OperationalStatus;
}

export interface InventoryItem {
  id: string;
  stationId: StationId;
  name: string;
  category: 'FOOD' | 'FUEL' | 'MEDICAL' | 'TECHNICAL' | 'WATER';
  quantity: number;
  unit: string;
  maxCapacity: number;
  dailyConsumption: number;
  daysRemaining: number;
  status: 'NORMAL' | 'LOW' | 'CRITICAL' | 'EMERGENCY';
  lastRestocked: string;
}

export interface StationAlert {
  id: string;
  stationId: StationId;
  sensorId?: string;
  equipmentId?: string;
  timestamp: string;
  severity: AlertSeverity;
  category: 'ENVIRONMENT' | 'GEOMAGNETIC' | 'SEISMIC' | 'ENERGY' | 'HEATING' | 'EQUIPMENT' | 'WATER' | 'COMMS' | 'LOGISTICS' | 'AUTOMATION';
  title: string;
  component: string;
  currentValue?: number | string;
  thresholdValue?: number | string;
  description: string;
  suggestedAction: string;
  acknowledged: boolean;
  resolved: boolean;
}

export interface AutomatedResponseLog {
  id: string;
  stationId: StationId;
  timestamp: string;
  triggerEvent: string;
  actionExecuted: string;
  details: string;
  systemStateAfter: string;
}

export interface IncidentRecord {
  id: string;
  stationId: StationId;
  title: string;
  scenario: ScenarioId;
  startTime: string;
  endTime?: string;
  severity: AlertSeverity;
  triggeringSensorOrEquipment: string;
  initialTelemetry: Record<string, any>;
  affectedSubsystems: string[];
  powerDeficitKw?: number;
  sheddedLoads?: string[];
  preservedLoads?: string[];
  actionsTaken: { timestamp: string; actor: string; action: string; result: string }[];
  aiAnalysis?: {
    summary: string;
    rootCause: string;
    recommendations: string[];
    confidencePercent?: number;
  };
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
}

export interface AuditTrailLog {
  id: string;
  timestamp: string;
  stationId: StationId;
  actor: 'SYSTEM' | 'OPERATOR' | 'AI_ENGINE' | 'AUTOMATION_RULES' | 'SIMULATION_ENGINE';
  event: string;
  component: string;
  prevState?: string;
  newState?: string;
  action: string;
  result: string;
}

export interface TelemetryIngestPayload {
  station: StationId;
  sensorId: string;
  timestamp?: string;
  data: Record<string, any>;
  priority?: TelemetryPriority;
  authToken?: string;
  isDelta?: boolean;
}

export interface SatelliteModeStats {
  mode: ConnectivityMode;
  fullPayloadSize: number;
  deltaPayloadSize: number;
  compressionRatio: number;
  queueSize: number;
  lastSyncTimestamp: string;
  simulatedLatencyMs: number;
  bandwidthKbps: number;
}

export interface SimulationState {
  isRunning: boolean;
  speedMultiplier: number;
  clockMode: 'REAL' | 'DEMO' | 'ACCELERATED';
  simulatedTime: string;
  activeScenario: ScenarioId;
  scenarioTitle: string;
  scenarioDescription: string;
  demoModeActive: boolean;
  demoStepIndex: number;
  connectivityMode: ConnectivityMode;
  satelliteStats: SatelliteModeStats;
  edgeGateway?: EdgeGatewayTelemetry;
}

export interface WhatIfInput {
  stationId: StationId;
  temperatureDelta: number;
  windSpeedDelta: number;
  powerDemandMultiplier: number;
  generator2Offline: boolean;
  fuelReservePercent: number;
  satelliteLinkMode?: SatelliteLinkMode;
  sensorFaultInjectId?: string;
}

export interface WhatIfResult {
  predictedHeatingLoadKw: number;
  predictedTotalPowerKw: number;
  generator1LoadPercent: number;
  generator1Risk: 'NORMAL' | 'WARNING' | 'CRITICAL';
  batteryBackupHours: number;
  fuelBurnRateIncreasePercent: number;
  fuelDaysRemaining: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  recommendedActions: string[];
  dependencyConsequences?: DependencyPropagationResult;
}

export interface DemoStepInfo {
  stepIndex: number;
  totalSteps?: number;
  headline?: string;
  subtext?: string;
  activeComponent?: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  stationId: StationId;
  targetTab: string;
  description?: string;
  actionHighlight?: string;
  aiPrompt?: string;
}
