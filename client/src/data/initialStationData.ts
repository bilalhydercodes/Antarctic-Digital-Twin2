import { 
  StationId, 
  EnvironmentData, 
  EnergyData, 
  EquipmentItem, 
  InventoryItem, 
  StationAlert, 
  AWSTelemetry, 
  GeomagneticTelemetry, 
  AtmosphericTelemetry, 
  SeismicTelemetry, 
  SubsystemState,
  SensorMetadata,
  SensorHealthRecord,
  EdgeGatewayTelemetry,
  MaintenanceRecord
} from '../types';

export interface StationBundle {
  environment: EnvironmentData;
  energy: EnergyData;
  equipment: EquipmentItem[];
  inventory: InventoryItem[];
  aws?: AWSTelemetry;
  geomagnetic?: GeomagneticTelemetry;
  atmospheric?: AtmosphericTelemetry;
  seismic?: SeismicTelemetry;
  subsystems?: SubsystemState[];
}

const now = new Date().toISOString();

export const initialMaitriBundle: StationBundle = {
  environment: {
    stationId: 'maitri',
    timestamp: now,
    temperature: -32.4,
    feelsLike: -42.1,
    humidity: 61.2,
    pressure: 982.4,
    windSpeed: 14.2,
    windDirection: 'WSW',
    visibility: 12.5,
    snowfallRate: 0.1,
    snowAccumulation: 45,
    solarRadiation: 410,
    iceCondition: 'PACK_ICE_STABLE',
    sensorHealth: {
      'AWS-MTR-01': 'ONLINE',
      'PPM-MTR-01': 'ONLINE',
      'DFM-MTR-01': 'ONLINE',
      'SEIS-MTR-BB01': 'ONLINE'
    }
  },
  energy: {
    stationId: 'maitri',
    timestamp: now,
    powerGrid: {
      generationKw: 310,
      solarGenerationKw: 45,
      windGenerationKw: 35,
      generatorGenerationKw: 230,
      consumptionKw: 265,
      heatingLoadKw: 155,
      criticalLoadKw: 70,
      nonCriticalLoadKw: 40,
      baseLoadKw: 210,
      peakLoadKw: 290,
      renewableContributionPercent: 25.8,
      loadSheddingActive: false,
      sheddedLoads: []
    },
    generators: [
      { id: 'gen-m1', name: 'Primary Diesel Gen #1 (Kirloskar 125kVA)', rpm: 1500, temperature: 72, fuelConsumptionRate: 28.5, loadPercent: 68, voltage: 415, current: 180, powerKw: 115, runtimeHours: 4250, healthPercent: 94, status: 'ONLINE', failureProbability: 5.2 },
      { id: 'gen-m2', name: 'Secondary Diesel Gen #2 (Kirloskar 125kVA)', rpm: 1500, temperature: 69, fuelConsumptionRate: 27.2, loadPercent: 65, voltage: 415, current: 172, powerKw: 115, runtimeHours: 3910, healthPercent: 96, status: 'ONLINE', failureProbability: 4.1 },
      { id: 'gen-m3', name: 'Emergency Backup Gen #3 (62.5kVA)', rpm: 0, temperature: 18, fuelConsumptionRate: 0, loadPercent: 0, voltage: 0, current: 0, powerKw: 0, runtimeHours: 820, healthPercent: 99, status: 'OFFLINE', failureProbability: 1.0 }
    ],
    battery: {
      stateOfCharge: 88,
      capacityKwh: 450,
      currentKwh: 396,
      voltage: 480,
      current: 12,
      powerKw: 5.76,
      temperature: 19,
      chargeDischargeRateKw: 5.8,
      estimatedBackupHours: 14.5,
      healthPercent: 96,
      status: 'HEALTHY'
    },
    fuelStorage: {
      totalCapacityLiters: 80000,
      currentFuelLiters: 62400,
      fuelPercent: 78,
      consumptionRateLitersPerHour: 55.7,
      estimatedDaysRemaining: 46.6,
      refillStatus: 'NORMAL'
    }
  },
  equipment: [
    { id: 'eq-m1', stationId: 'maitri', name: 'Priyadarshini Lake Water Pump', category: 'WATER', healthPercent: 91, temperature: 4.2, vibration: 1.2, runtimeHours: 3200, status: 'HEALTHY', lastMaintenance: '2026-01-15', nextMaintenance: '2026-07-15', failureProbability: 4.5, simulatedPrediction: 'Impeller wear nominal. Anti-freeze trace heating active.', recommendedAction: 'Maintain current suction flow rate.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-m2', stationId: 'maitri', name: 'Hydronic Boiler #1', category: 'HVAC', healthPercent: 94, temperature: 68.4, vibration: 0.8, runtimeHours: 6100, status: 'HEALTHY', lastMaintenance: '2026-02-01', nextMaintenance: '2026-08-01', failureProbability: 3.2, simulatedPrediction: 'Combustion efficiency 94.5%. Burner nozzle clean.', recommendedAction: 'Inspect fuel filter at next interval.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-m3', stationId: 'maitri', name: 'Broadband Seismometer BB01', category: 'RESEARCH', healthPercent: 98, temperature: 2.1, vibration: 0.1, runtimeHours: 12400, status: 'HEALTHY', lastMaintenance: '2025-11-20', nextMaintenance: '2026-11-20', failureProbability: 1.0, simulatedPrediction: 'GPS synchronization locked. Zero thermal drift.', recommendedAction: 'Clean vault cover after snow drift.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-m4', stationId: 'maitri', name: 'Proton Precession Magnetometer', category: 'RESEARCH', healthPercent: 96, temperature: -15.0, vibration: 0.0, runtimeHours: 18500, status: 'HEALTHY', lastMaintenance: '2025-12-10', nextMaintenance: '2026-12-10', failureProbability: 1.5, simulatedPrediction: 'Sensor coil resistance stable.', recommendedAction: 'Routine calibration.', operationalTag: 'OPERATIONAL' }
  ],
  inventory: [
    { id: 'inv-m1', stationId: 'maitri', name: 'Polar Diesel (AN-8 Standard)', category: 'FUEL', quantity: 62400, unit: 'Liters', maxCapacity: 80000, dailyConsumption: 1336, daysRemaining: 46, status: 'NORMAL', lastRestocked: '2026-01-10' },
    { id: 'inv-m2', stationId: 'maitri', name: 'Rations & Freeze-Dried Food', category: 'FOOD', quantity: 450, unit: 'Ration Packs', maxCapacity: 600, dailyConsumption: 8.5, daysRemaining: 52, status: 'NORMAL', lastRestocked: '2026-01-10' },
    { id: 'inv-m3', stationId: 'maitri', name: 'Emergency Medical Supplies', category: 'MEDICAL', quantity: 95, unit: 'Kits', maxCapacity: 100, dailyConsumption: 0.2, daysRemaining: 475, status: 'NORMAL', lastRestocked: '2026-01-10' }
  ],
  aws: {
    station: 'maitri',
    sensorId: 'AWS-MTR-01',
    timestamp: now,
    temperature: -32.4,
    humidity: 61.2,
    pressure: 982.4,
    windSpeed: 14.2,
    windDirection: 247,
    solarRadiation: 410,
    snowfallRate: 0.1,
    visibility: 12.5,
    status: 'OPERATIONAL'
  },
  geomagnetic: {
    station: 'maitri',
    timestamp: now,
    ppmTotalIntensity: 43250.4,
    ppmStatus: 'OPERATIONAL',
    dfmX: 18420.2,
    dfmY: -2150.8,
    dfmZ: -38950.6,
    dfmStatus: 'OPERATIONAL',
    icmX: 0.12,
    icmY: -0.08,
    icmZ: 0.04,
    icmStatus: 'OPERATIONAL',
    dimDeclination: -18.4,
    dimInclination: -64.7,
    dimStatus: 'OPERATIONAL'
  },
  atmospheric: {
    station: 'maitri',
    timestamp: now,
    vlfReceiverStatus: 'OPERATIONAL',
    vlfSignalStrengthDb: 64.2,
    electricFieldMillKvM: 1.45,
    efmStatus: 'OPERATIONAL',
    riometerAbsorptionDb: 0.38,
    riometerStatus: 'OPERATIONAL',
    allSkyImagerStatus: 'OPERATIONAL',
    allSkyCloudCoverPercent: 15,
    airEarthCurrentAntennaPAm2: 2.1,
    maxwellAntennaVm: 120.5,
    longWireAntennaDb: 48.0,
    airIonCounterDensity: 420
  },
  seismic: {
    station: 'maitri',
    sensorId: 'SEIS-MTR-BB01',
    timestamp: now,
    broadbandStatus: 'OPERATIONAL',
    channelX: [0.002, 0.005, -0.003, 0.001, -0.004, 0.006, -0.002],
    channelY: [0.001, -0.002, 0.004, -0.003, 0.002, -0.001, 0.003],
    channelZ: [0.008, 0.012, 0.005, -0.002, 0.003, -0.006, 0.004],
    activityLevel: 'QUIET',
    magnitude: 1.2,
    gpsTimeSync: true,
    recordingStatus: 'RECORDING',
    localBufferUsagePercent: 12.4
  },
  subsystems: [
    { equipmentId: 'MAITRI-MAIN-BUILDING', station: 'maitri', name: 'Main Station Building', type: 'MAIN_BUILDING', status: 'RUNNING', loadPercent: 68, temperature: 21.4, healthPercent: 96 },
    { equipmentId: 'MAITRI-FUEL-FARM', station: 'maitri', name: 'Fuel Farm (80,000L Storage)', type: 'FUEL_FARM', status: 'RUNNING', loadPercent: 78, temperature: -12.0, healthPercent: 98 },
    { equipmentId: 'MAITRI-FUEL-STATION', station: 'maitri', name: 'Automated Fuel Dispensing Station', type: 'FUEL_STATION', status: 'RUNNING', loadPercent: 42, temperature: -8.5, healthPercent: 94 },
    { equipmentId: 'MAITRI-PUMP-LAKE', station: 'maitri', name: 'Priyadarshini Lake Water Pump House', type: 'WATER_PUMP', status: 'RUNNING', loadPercent: 62, temperature: 3.8, healthPercent: 91 },
    { equipmentId: 'MAITRI-SUMMER-CAMP', station: 'maitri', name: 'Summer Huts & Auxiliary Camp', type: 'SUMMER_CAMP', status: 'STANDBY', loadPercent: 20, temperature: 14.0, healthPercent: 90 },
    { equipmentId: 'MAITRI-CONTAINER-MODULES', station: 'maitri', name: 'Containerized Research Labs', type: 'MODULES', status: 'RUNNING', loadPercent: 74, temperature: 19.5, healthPercent: 95 },
    { equipmentId: 'MAITRI-POWER-REG', station: 'maitri', name: 'Regulated Electrical Power Grid', type: 'POWER', status: 'RUNNING', loadPercent: 72, temperature: 48.0, healthPercent: 96 },
    { equipmentId: 'MAITRI-HEATING-01', station: 'maitri', name: 'Central Hydronic Heating System', type: 'HEATING', status: 'RUNNING', loadPercent: 75, temperature: 68.4, healthPercent: 94 },
    { equipmentId: 'MAITRI-HOT-WATER', station: 'maitri', name: 'Hot Water Circulation Loop', type: 'HOT_WATER', status: 'RUNNING', loadPercent: 65, temperature: 62.0, healthPercent: 95 },
    { equipmentId: 'MAITRI-COLD-WATER', station: 'maitri', name: 'Potable Cold Water Line', type: 'COLD_WATER', status: 'RUNNING', loadPercent: 55, temperature: 4.2, healthPercent: 97 },
    { equipmentId: 'MAITRI-COLD-STORAGE', station: 'maitri', name: 'Deep Freeze Food & Sample Storage', type: 'COLD_STORAGE', status: 'RUNNING', loadPercent: 82, temperature: -22.0, healthPercent: 98 },
    { equipmentId: 'MAITRI-LABS', station: 'maitri', name: 'Geomagnetic & Met Laboratories', type: 'LABS', status: 'RUNNING', loadPercent: 60, temperature: 20.8, healthPercent: 97 },
    { equipmentId: 'MAITRI-COMMS', station: 'maitri', name: 'Satellite Comms & High-Frequency Radio', type: 'COMMS', status: 'RUNNING', loadPercent: 48, temperature: 25.0, healthPercent: 99 }
  ]
};

export const initialBharatiBundle: StationBundle = {
  environment: {
    stationId: 'bharati',
    timestamp: now,
    temperature: -28.6,
    feelsLike: -36.4,
    humidity: 58.4,
    pressure: 991.2,
    windSpeed: 18.5,
    windDirection: 'ESE',
    visibility: 15.0,
    snowfallRate: 0.0,
    snowAccumulation: 28,
    solarRadiation: 480,
    iceCondition: 'FAST_ICE_SOLID',
    sensorHealth: {
      'AWS-BHR-01': 'ONLINE',
      'PPM-BHR-01': 'ONLINE',
      'DFM-BHR-01': 'ONLINE',
      'SATCOMM-BHR': 'ONLINE'
    }
  },
  energy: {
    stationId: 'bharati',
    timestamp: now,
    powerGrid: {
      generationKw: 420,
      solarGenerationKw: 60,
      windGenerationKw: 40,
      generatorGenerationKw: 320,
      chpThermalGenerationKw: 185,
      consumptionKw: 340,
      heatingLoadKw: 170,
      criticalLoadKw: 110,
      nonCriticalLoadKw: 60,
      baseLoadKw: 280,
      peakLoadKw: 380,
      renewableContributionPercent: 23.8,
      loadSheddingActive: false,
      sheddedLoads: []
    },
    generators: [
      { id: 'gen-b1', name: 'CHP Co-Gen Unit #1 (MAN 200kW CHP)', rpm: 1500, temperature: 78, fuelConsumptionRate: 38.2, loadPercent: 80, voltage: 415, current: 250, powerKw: 160, runtimeHours: 5120, healthPercent: 95, status: 'ONLINE', failureProbability: 6.0, isCHP: true, thermalOutputKw: 95 },
      { id: 'gen-b2', name: 'CHP Co-Gen Unit #2 (MAN 200kW CHP)', rpm: 1500, temperature: 76, fuelConsumptionRate: 37.8, loadPercent: 80, voltage: 415, current: 250, powerKw: 160, runtimeHours: 4890, healthPercent: 97, status: 'ONLINE', failureProbability: 3.8, isCHP: true, thermalOutputKw: 90 },
      { id: 'gen-b3', name: 'Auxiliary Generator #3 (150kW)', rpm: 0, temperature: 20, fuelConsumptionRate: 0, loadPercent: 0, voltage: 0, current: 0, powerKw: 0, runtimeHours: 1100, healthPercent: 99, status: 'OFFLINE', failureProbability: 1.2, isCHP: false, thermalOutputKw: 0 }
    ],
    battery: {
      stateOfCharge: 92,
      capacityKwh: 600,
      currentKwh: 552,
      voltage: 600,
      current: 18,
      powerKw: 10.8,
      temperature: 20,
      chargeDischargeRateKw: 10.8,
      estimatedBackupHours: 16.2,
      healthPercent: 98,
      status: 'HEALTHY'
    },
    fuelStorage: {
      totalCapacityLiters: 120000,
      currentFuelLiters: 98400,
      fuelPercent: 82,
      consumptionRateLitersPerHour: 76.0,
      estimatedDaysRemaining: 53.9,
      refillStatus: 'NORMAL'
    }
  },
  equipment: [
    { id: 'eq-b1', stationId: 'bharati', name: 'CHP Co-Gen Unit #1', category: 'ENERGY', healthPercent: 95, temperature: 78.0, vibration: 2.1, runtimeHours: 5120, status: 'HEALTHY', lastMaintenance: '2026-02-10', nextMaintenance: '2026-08-10', failureProbability: 6.0, simulatedPrediction: 'Thermal heat exchanger recovery 92%.', recommendedAction: 'Monitor oil pressure.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-b2', stationId: 'bharati', name: 'Seawater Intake Pump & Desalination RO', category: 'WATER', healthPercent: 93, temperature: 2.4, vibration: 1.5, runtimeHours: 4200, status: 'HEALTHY', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', failureProbability: 4.0, simulatedPrediction: 'RO membrane pressure 58 bar.', recommendedAction: 'Flush membrane weekly.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-b3', stationId: 'bharati', name: 'Satellite Earth Station Antenna', category: 'COMMS', healthPercent: 99, temperature: 24.0, vibration: 0.2, runtimeHours: 14200, status: 'HEALTHY', lastMaintenance: '2026-03-01', nextMaintenance: '2026-09-01', failureProbability: 0.8, simulatedPrediction: 'Radome heater active. Ka-band signal locked.', recommendedAction: 'No action required.', operationalTag: 'OPERATIONAL' }
  ],
  inventory: [
    { id: 'inv-b1', stationId: 'bharati', name: 'Polar Diesel (AN-8 Standard)', category: 'FUEL', quantity: 98400, unit: 'Liters', maxCapacity: 120000, dailyConsumption: 1824, daysRemaining: 53, status: 'NORMAL', lastRestocked: '2026-01-15' },
    { id: 'inv-b2', stationId: 'bharati', name: 'Fresh Water Storage', category: 'WATER', quantity: 18500, unit: 'Liters', maxCapacity: 22000, dailyConsumption: 350, daysRemaining: 52, status: 'NORMAL', lastRestocked: '2026-02-01' }
  ],
  aws: {
    station: 'bharati',
    sensorId: 'AWS-BHR-01',
    timestamp: now,
    temperature: -28.6,
    humidity: 58.4,
    pressure: 991.2,
    windSpeed: 18.5,
    windDirection: 112,
    solarRadiation: 480,
    snowfallRate: 0.0,
    visibility: 15.0,
    status: 'OPERATIONAL'
  },
  geomagnetic: {
    station: 'bharati',
    timestamp: now,
    ppmTotalIntensity: 44120.8,
    ppmStatus: 'OPERATIONAL',
    dfmX: 19100.5,
    dfmY: -1850.2,
    dfmZ: -39720.1,
    dfmStatus: 'OPERATIONAL',
    icmX: 0.08,
    icmY: 0.05,
    icmZ: -0.02,
    icmStatus: 'OPERATIONAL',
    gpsSync: true
  },
  atmospheric: {
    station: 'bharati',
    timestamp: now,
    vlfReceiverStatus: 'OPERATIONAL',
    vlfSignalStrengthDb: 58.6,
    electricFieldMillKvM: 1.22,
    efmStatus: 'OPERATIONAL'
  },
  subsystems: [
    { equipmentId: 'BHARATI-MAIN-BUILDING', station: 'bharati', name: 'Bharati Main Station Complex', type: 'MAIN_BUILDING', status: 'RUNNING', loadPercent: 71, temperature: 22.0, healthPercent: 98 },
    { equipmentId: 'BHARATI-FUEL-FARM', station: 'bharati', name: 'Main Fuel Storage Tanks', type: 'FUEL_FARM', status: 'RUNNING', loadPercent: 84, temperature: -10.0, healthPercent: 99 },
    { equipmentId: 'BHARATI-FUEL-STATION', station: 'bharati', name: 'Day Tank Fuel Station', type: 'FUEL_STATION', status: 'RUNNING', loadPercent: 50, temperature: -5.0, healthPercent: 96 },
    { equipmentId: 'BHARATI-SEAWATER-PUMP', station: 'bharati', name: 'Seawater Intake Pump & RO Plant', type: 'WATER_PUMP', status: 'RUNNING', loadPercent: 68, temperature: 2.4, healthPercent: 93 },
    { equipmentId: 'BHARATI-SUMMER-CAMP', station: 'bharati', name: 'Summer Living Quarters', type: 'SUMMER_CAMP', status: 'STANDBY', loadPercent: 15, temperature: 15.0, healthPercent: 92 },
    { equipmentId: 'BHARATI-MODULES', station: 'bharati', name: 'Scientific Modular Containers', type: 'MODULES', status: 'RUNNING', loadPercent: 70, temperature: 20.0, healthPercent: 97 },
    { equipmentId: 'BHARATI-CHP-POWER', station: 'bharati', name: 'CHP (Combined Heat & Power) Co-Gen Grid', type: 'POWER', status: 'RUNNING', loadPercent: 76, temperature: 72.0, healthPercent: 95 },
    { equipmentId: 'BHARATI-AUTOMATED-HEATING', station: 'bharati', name: 'Automated Waste-Heat Recovery Heating', type: 'HEATING', status: 'RUNNING', loadPercent: 78, temperature: 74.0, healthPercent: 96 },
    { equipmentId: 'BHARATI-HVAC', station: 'bharati', name: 'Central HVAC & Air Conditioning', type: 'HVAC', status: 'RUNNING', loadPercent: 64, temperature: 21.0, healthPercent: 95 },
    { equipmentId: 'BHARATI-HOT-WATER', station: 'bharati', name: 'CHP Thermal Recovery Hot Water', type: 'HOT_WATER', status: 'RUNNING', loadPercent: 70, temperature: 65.0, healthPercent: 97 },
    { equipmentId: 'BHARATI-COLD-WATER', station: 'bharati', name: 'Desalinated Potable Water System', type: 'COLD_WATER', status: 'RUNNING', loadPercent: 58, temperature: 5.0, healthPercent: 98 },
    { equipmentId: 'BHARATI-COLD-STORAGE', station: 'bharati', name: 'Cryo & Frozen Storage Vaults', type: 'COLD_STORAGE', status: 'RUNNING', loadPercent: 85, temperature: -24.0, healthPercent: 99 },
    { equipmentId: 'BHARATI-LABS', station: 'bharati', name: 'Atmospheric & Space Science Labs', type: 'LABS', status: 'RUNNING', loadPercent: 66, temperature: 21.5, healthPercent: 98 },
    { equipmentId: 'BHARATI-SATCOMM', station: 'bharati', name: 'Dedicated Satellite Earth Station', type: 'COMMS', status: 'RUNNING', loadPercent: 52, temperature: 24.0, healthPercent: 99 },
    { equipmentId: 'BHARATI-WASTEWATER', station: 'bharati', name: 'Bioreactor Wastewater Treatment Plant', type: 'WASTEWATER', status: 'RUNNING', loadPercent: 60, temperature: 18.0, healthPercent: 94 }
  ]
};

export const initialStationBundles: Record<StationId, StationBundle> = {
  maitri: initialMaitriBundle,
  bharati: initialBharatiBundle
};

export const initialAlerts: StationAlert[] = [
  {
    id: 'ALT-INIT-01',
    stationId: 'maitri',
    title: 'Routine Meteorological Calibration Nominal',
    severity: 'INFO',
    category: 'ENVIRONMENT',
    component: 'AWS & Pyranometer Suite',
    description: 'All 4 AWS telemetry channels reporting within standard ±0.1% baseline error bounds.',
    suggestedAction: 'No immediate action required.',
    timestamp: now,
    acknowledged: true,
    resolved: false
  },
  {
    id: 'ALT-INIT-02',
    stationId: 'bharati',
    title: 'CHP Waste-Heat Recovery Optimal',
    severity: 'INFO',
    category: 'ENERGY',
    component: 'Combined Heat & Power Co-Generation',
    description: 'Thermal heat exchanger generating 185kW auxiliary warmth for living modules.',
    suggestedAction: 'Maintain current thermal fluid flow rate.',
    timestamp: now,
    acknowledged: true,
    resolved: false
  }
];

export const initialSensors: SensorMetadata[] = [
  { 
    sensorId: 'AWS-MTR-01', 
    stationId: 'maitri', 
    sensorType: 'ANEMOMETER',
    name: 'Ultrasonic Polar Anemometer', 
    location: 'Meteorology Mast North',
    category: 'METEOROLOGY', 
    measurement: 'Wind Speed',
    unit: 'km/h',
    quality: 'GOOD',
    calibrationStatus: 'VALID',
    operationalStatus: 'OPERATIONAL',
    communicationStatus: 'LIVE',
    lastPacketTimestamp: now,
    priority: 'P1_CRITICAL_INFRASTRUCTURE', 
    sourceType: 'DOCUMENTED'
  },
  { 
    sensorId: 'MTR-TMP-01', 
    stationId: 'maitri', 
    sensorType: 'THERMOMETER',
    name: 'Sub-Zero Ambient RTD Probe', 
    location: 'Met Screen #1',
    category: 'METEOROLOGY', 
    measurement: 'Ambient Temperature',
    unit: '°C',
    quality: 'GOOD',
    calibrationStatus: 'VALID',
    operationalStatus: 'OPERATIONAL',
    communicationStatus: 'LIVE',
    lastPacketTimestamp: now,
    priority: 'P1_CRITICAL_INFRASTRUCTURE', 
    sourceType: 'DOCUMENTED'
  },
  { 
    sensorId: 'PPM-MTR-01', 
    stationId: 'maitri', 
    sensorType: 'MAGNETOMETER',
    name: 'Proton Precession Magnetometer', 
    location: 'Geomagnetic Non-Magnetic Hut',
    category: 'GEOMAGNETISM', 
    measurement: 'Total Magnetic Intensity',
    unit: 'nT',
    quality: 'GOOD',
    calibrationStatus: 'VALID',
    operationalStatus: 'OPERATIONAL',
    communicationStatus: 'LIVE',
    lastPacketTimestamp: now,
    priority: 'P3_SCIENTIFIC', 
    sourceType: 'DOCUMENTED'
  },
  { 
    sensorId: 'AWS-BHR-01', 
    stationId: 'bharati', 
    sensorType: 'SONIC_AWS',
    name: 'Sonic Meteorological Station', 
    location: 'Ridge Observation Tower',
    category: 'METEOROLOGY', 
    measurement: 'Wind & Gust Velocity',
    unit: 'km/h',
    quality: 'GOOD',
    calibrationStatus: 'VALID',
    operationalStatus: 'OPERATIONAL',
    communicationStatus: 'LIVE',
    lastPacketTimestamp: now,
    priority: 'P1_CRITICAL_INFRASTRUCTURE', 
    sourceType: 'DOCUMENTED'
  }
];

export const initialSensorHealthMap: Record<string, SensorHealthRecord> = {
  'AWS-MTR-01': { 
    sensorId: 'AWS-MTR-01', 
    stationId: 'maitri', 
    healthPercent: 99, 
    dataQuality: 'GOOD',
    operationalStatus: 'OPERATIONAL',
    calibrationStatus: 'VALID',
    lastPacketTimestamp: now,
    missingPacketsCount: 0,
    abnormalReadingsCount: 0,
    isStuck: false, 
    isNoisy: false 
  },
  'MTR-TMP-01': { 
    sensorId: 'MTR-TMP-01', 
    stationId: 'maitri', 
    healthPercent: 98, 
    dataQuality: 'GOOD',
    operationalStatus: 'OPERATIONAL',
    calibrationStatus: 'VALID',
    lastPacketTimestamp: now,
    missingPacketsCount: 0,
    abnormalReadingsCount: 0,
    isStuck: false, 
    isNoisy: false 
  },
  'PPM-MTR-01': { 
    sensorId: 'PPM-MTR-01', 
    stationId: 'maitri', 
    healthPercent: 97, 
    dataQuality: 'GOOD',
    operationalStatus: 'OPERATIONAL',
    calibrationStatus: 'VALID',
    lastPacketTimestamp: now,
    missingPacketsCount: 0,
    abnormalReadingsCount: 0,
    isStuck: false, 
    isNoisy: false 
  },
  'AWS-BHR-01': { 
    sensorId: 'AWS-BHR-01', 
    stationId: 'bharati', 
    healthPercent: 99, 
    dataQuality: 'GOOD',
    operationalStatus: 'OPERATIONAL',
    calibrationStatus: 'VALID',
    lastPacketTimestamp: now,
    missingPacketsCount: 0,
    abnormalReadingsCount: 0,
    isStuck: false, 
    isNoisy: false 
  }
};

export const initialEdgeGateway: EdgeGatewayTelemetry = {
  stationId: 'maitri',
  gatewayStatus: 'ONLINE',
  cpuPercent: 24.5,
  memoryPercent: 38.2,
  queueSize: 0,
  compressionRatio: 92.4,
  lastSatelliteSync: now
};

export const initialMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'WO-2026-001',
    equipmentId: 'eq-m1',
    stationId: 'maitri',
    equipmentName: 'Priyadarshini Lake Water Pump',
    serviceType: 'PREVENTIVE',
    status: 'NORMAL',
    operatingHours: 3200,
    lastServiceDate: '2026-01-15',
    nextServiceDate: '2026-07-15',
    technician: 'Lead Mech Engineer Sharma',
    healthBeforePercent: 88,
    healthAfterPercent: 91,
    notes: 'Resistance verified at 42 Ohms. Trace heating active and nominal.'
  },
  {
    id: 'WO-2026-002',
    equipmentId: 'eq-b1',
    stationId: 'bharati',
    equipmentName: 'MAN CHP Engine #1',
    serviceType: 'PREVENTIVE',
    status: 'DUE_SOON',
    operatingHours: 5120,
    lastServiceDate: '2026-02-10',
    nextServiceDate: '2026-08-10',
    technician: 'Co-Gen Tech Patil',
    healthBeforePercent: 92,
    healthAfterPercent: 95,
    notes: 'Sample extracted, spectrometer analysis in progress.'
  }
];
