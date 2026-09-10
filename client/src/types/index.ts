export type StationId = 'maitri' | 'bharati';

export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL' | 'EMERGENCY' | 'RESOLVED';

export type OperationalStatus = 'OPERATIONAL' | 'OFFLINE' | 'MAINTENANCE' | 'SIMULATED';

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

export type RBACRole = 'ADMIN' | 'COMMANDER' | 'OPERATOR' | 'SCIENTIST' | 'VIEWER';

export type NavTab = 
  | 'dashboard'
  | 'commander'
  | 'incidents'
  | 'twin'
  | 'sensors'
  | 'edge'
  | 'dependencies'
  | 'replay'
  | 'compare'
  | 'map'
  | 'glaciology'
  | 'environment'
  | 'energy'
  | 'logistics'
  | 'infrastructure'
  | 'maintenance'
  | 'alerts'
  | 'analytics'
  | 'scenarios'
  | 'assistant'
  | 'research'
  | 'settings';

export const ROLE_ALLOWED_TABS: Record<RBACRole, NavTab[]> = {
  ADMIN: [
    'dashboard',
    'commander',
    'incidents',
    'twin',
    'sensors',
    'edge',
    'dependencies',
    'replay',
    'compare',
    'map',
    'glaciology',
    'environment',
    'energy',
    'logistics',
    'infrastructure',
    'maintenance',
    'alerts',
    'analytics',
    'scenarios',
    'assistant',
    'research',
    'settings'
  ],
  COMMANDER: [
    'commander',
    'dashboard',
    'incidents',
    'twin',
    'dependencies',
    'compare',
    'research',
    'alerts',
    'replay',
    'scenarios',
    'assistant'
  ],
  OPERATOR: [
    'dashboard',
    'twin',
    'energy',
    'logistics',
    'infrastructure',
    'maintenance',
    'sensors',
    'alerts',
    'edge',
    'analytics',
    'research'
  ],
  SCIENTIST: [
    'research',
    'glaciology',
    'environment',
    'map',
    'analytics',
    'dashboard',
    'sensors',
    'compare',
    'assistant'
  ],
  VIEWER: [
    'dashboard',
    'research',
    'twin',
    'map',
    'environment',
    'analytics'
  ]
};

export interface RoleMetadata {
  label: string;
  badge: string;
  description: string;
  color: string;
  defaultTab: NavTab;
}

export const ROLE_METADATA: Record<RBACRole, RoleMetadata> = {
  ADMIN: {
    label: 'ADMIN',
    badge: 'SYSTEM ADMINISTRATOR',
    description: 'Full unconstrained platform control, infrastructure & system settings',
    color: 'rose',
    defaultTab: 'dashboard'
  },
  COMMANDER: {
    label: 'COMMANDER',
    badge: 'STATION COMMANDER',
    description: 'Executive mission authority, SITREP briefings, incident command & failovers',
    color: 'amber',
    defaultTab: 'commander'
  },
  OPERATOR: {
    label: 'OPERATOR',
    badge: 'STATION OPERATOR',
    description: 'Station systems, 415V microgrid, equipment maintenance & logistics ledger',
    color: 'blue',
    defaultTab: 'dashboard'
  },
  SCIENTIST: {
    label: 'SCIENTIST',
    badge: 'POLAR RESEARCHER',
    description: 'Glaciology radar, meteorological sensor suites & environmental trends',
    color: 'emerald',
    defaultTab: 'glaciology'
  },
  VIEWER: {
    label: 'VIEWER',
    badge: 'PUBLIC OBSERVER',
    description: 'Read-only telemetry surveillance, 3D Digital Twin & geographic map',
    color: 'stone',
    defaultTab: 'dashboard'
  }
};

export type TelemetryPriority = 
  | 'P0_LIFE_SAFETY'
  | 'P1_CRITICAL_INFRASTRUCTURE'
  | 'P2_STATION_OPERATIONS'
  | 'P3_SCIENTIFIC'
  | 'P4_ANALYTICS';

export type SensorQualityFlag = 'GOOD' | 'SUSPECT' | 'BAD' | 'STALE' | 'MISSING' | 'SIMULATED';

export interface StationMeta {
  id: StationId;
  name: string;
  code: string;
  established: number;
  commissionedDate?: string;
  locationName: string;
  coordinates: { lat: number; lng: number };
  coordinatesDMS?: string;
  elevationMeters: number;
  elevationDescription?: string;
  crewCount: number;
  winterCrewCount?: number;
  summerCapacity?: number;
  status: 'OPERATIONAL' | 'WARNING' | 'CRITICAL';
  architecture?: string;
  powerPlantSpecs?: string;
  waterSupplySpecs?: string;
  satelliteCommsSpecs?: string;
  wasteManagementSpecs?: string;
  scientificDisciplines?: string[];
  partnerInstitutes?: string[];
  ncporProfileUrl?: string;
}

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
  };
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED';
}

export interface AuditTrailLog {
  id: string;
  timestamp: string;
  stationId: StationId;
  actor: 'SYSTEM' | 'OPERATOR' | 'AI_ENGINE' | 'AUTOMATION_RULES';
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
}

export interface WhatIfInput {
  stationId: StationId;
  temperatureDelta: number;
  windSpeedDelta: number;
  powerDemandMultiplier: number;
  generator2Offline: boolean;
  fuelReservePercent: number;
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

export interface SensorMetadata {
  sensorId: string;
  stationId: StationId;
  sensorType: string;
  name: string;
  location: string;
  category: 'METEOROLOGY' | 'GEOMAGNETISM' | 'SEISMOLOGY' | 'ATMOSPHERE' | 'UTILITY' | 'LIFE_SUPPORT';
  measurement: string;
  unit: string;
  currentValue?: number | string;
  quality: SensorQualityFlag;
  calibrationStatus: 'VALID' | 'DUE_SOON' | 'EXPIRED' | 'UNVERIFIED';
  operationalStatus: OperationalStatus;
  batteryStatus?: string;
  communicationStatus: 'LIVE' | 'LAGGING' | 'OFFLINE';
  lastPacketTimestamp: string;
  priority: TelemetryPriority;
  sourceType: 'DOCUMENTED' | 'SIMULATED' | 'DERIVED';
}

export interface SensorHealthRecord {
  sensorId: string;
  stationId: StationId;
  healthPercent: number; // 0 - 100
  dataQuality: SensorQualityFlag;
  operationalStatus: OperationalStatus;
  calibrationStatus: 'VALID' | 'DUE_SOON' | 'EXPIRED' | 'UNVERIFIED';
  lastPacketTimestamp: string;
  missingPacketsCount: number;
  abnormalReadingsCount: number;
  isStuck: boolean;
  isNoisy: boolean;
  driftValue?: number;
  simulatedFault?: 'NONE' | 'STUCK' | 'NOISY' | 'OFFLINE';
}

export interface SatelliteDegradationConfig {
  mode: 'LOCAL' | 'VSAT' | 'LOW_BANDWIDTH' | 'DEGRADED' | 'OFFLINE';
  bandwidthKbps: number;
  latencyMs: number;
  packetLossPercent: number;
  jitterMs: number;
  outageDurationSec: number;
}

export interface EdgeGatewayTelemetry {
  stationId: StationId;
  gatewayStatus: 'ONLINE' | 'DEGRADED' | 'BUFFERING' | 'OFFLINE';
  cpuPercent?: number;
  cpuLoadPercent?: number;
  memoryPercent?: number;
  memoryUsagePercent?: number;
  queueSize?: number;
  localBufferQueueSize?: number;
  maxBufferCapacity?: number;
  packetsReceived?: number;
  packetsReceivedTotal?: number;
  packetsSent?: number;
  packetsSentTotal?: number;
  packetsDropped?: number;
  packetsDroppedTotal?: number;
  compressionRatio?: number;
  compressionRatioPercent?: number;
  lastSatelliteSync?: string;
  lastSatelliteSyncTimestamp?: string;
  satelliteLink?: SatelliteDegradationConfig;
  activeDegradation?: SatelliteDegradationConfig;
  bandwidthUsageKbps?: number;
  priorityTransmission?: {
    p0LifeSafetyPercent: number;
    p1CriticalInfraPercent: number;
    p2StationOpsPercent: number;
    p3ScientificPercent: number;
    p4AnalyticsPercent: number;
  };
  priorityTransmissionStats?: {
    p0TransmitPercent: number;
    p1TransmitPercent: number;
    p2TransmitPercent: number;
    p3TransmitPercent: number;
    p4TransmitPercent: number;
  };
}

export interface StatisticalAnomalyRecord {
  id: string;
  stationId: StationId;
  sensorId: string;
  parameter: string;
  observedValue: number;
  rollingMean: number;
  rollingStdDev: number;
  zScore: number;
  expectedRange: { min: number; max: number };
  anomalyScore: number; // 0.0 to 1.0
  timestamp: string;
  reason: string;
  severity: 'WARNING' | 'CRITICAL';
}

export interface DependencyNode {
  id: string;
  name: string;
  stationId: StationId;
  category: 'POWER' | 'FUEL' | 'HEATING' | 'WATER' | 'COMMS' | 'LIFE_SUPPORT' | 'SCIENCE';
  status: 'NORMAL' | 'DEGRADED' | 'FAILED';
  dependsOn: string[];
  supports: string[];
  criticalLevel: 1 | 2 | 3 | 4;
}

export interface DependencyPropagationResult {
  failedComponentId: string;
  directImpacts: string[];
  indirectImpacts: string[];
  criticalDependenciesAtRisk: string[];
  lifeSupportImpacted: boolean;
  propagationPath: string[];
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  stationId: StationId;
  equipmentName: string;
  serviceType: 'PREVENTIVE' | 'CORRECTIVE' | 'CALIBRATION' | 'OVERHAUL';
  status: 'NORMAL' | 'DUE_SOON' | 'OVERDUE' | 'UNDER_MAINTENANCE';
  operatingHours: number;
  lastServiceDate: string;
  nextServiceDate: string;
  technician: string;
  healthBeforePercent: number;
  healthAfterPercent: number;
  notes: string;
}

export interface ShiftHandoverReport {
  id: string;
  stationId: StationId;
  generatedAt: string;
  shiftCommander: string;
  shiftPeriod: string;
  activeIncidentsCount: number;
  resolvedIncidentsCount: number;
  equipmentRequiringAttention: { equipmentId: string; status: string; note: string }[];
  sensorFailures: { sensorId: string; issue: string }[];
  powerStatus: { generationKw: number; demandKw: number; reserveKwh: number; fuelDays: number };
  communicationStatus: string;
  scientificInstrumentsSummary: string;
  pendingMaintenanceTasks: string[];
  operationalNotes: string[];
}

export interface ComponentPrediction {
  componentName: string;
  componentId?: string;
  currentRisk: string;
  conservationAction: string;
  predictedSavedBenefit: string;
  savingsMetric: string;
  urgency: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  actionType: 'SHED_LOAD' | 'ACTIVATE_TRACE_HEAT' | 'STOW_SOLAR' | 'MODULATE_SETPOINT' | 'BALANCED_GENERATOR' | 'RESERVE_OPTIMIZATION';
  applied?: boolean;
}
