import { 
  StationMeta, 
  EnvironmentData, 
  EnergyData, 
  EquipmentItem, 
  InventoryItem, 
  StationAlert,
  AWSTelemetry,
  GeomagneticTelemetry,
  AtmosphericTelemetry,
  SeismicTelemetry,
  SubsystemState
} from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export function seedInitialStationData(): void {
  const now = new Date().toISOString();

  // 1. MAITRI STATION META (NCPOR Verified Profile)
  const maitriMeta: StationMeta = {
    id: 'maitri',
    name: 'Maitri Research Station',
    code: 'IN-MTR-01',
    established: 1988,
    commissionedDate: 'December 1988 (Operational January 1989)',
    locationName: 'Schirmacher Oasis, Queen Maud Land',
    coordinates: { lat: -70.7644, lng: 11.7342 },
    coordinatesDMS: "70° 45' 52\" S, 11° 44' 03\" E",
    elevationMeters: 50,
    elevationDescription: '~50 m above sea level on rocky moraine overlooking Lake Priyadarshini',
    crewCount: 47,
    winterCrewCount: 25,
    summerCapacity: 72,
    status: 'OPERATIONAL',
    architecture: 'Superstructure on structural steel stilts over ice-free moraine to prevent snow-drift buildup',
    powerPlantSpecs: '3 × Kirloskar Arctic Diesel GenSets (62.5–125 kVA, AN-8 DMA fuel) + 45 kW Solar PV + 35 kW Wind',
    waterSupplySpecs: 'Lake Priyadarshini freshwater pump house with electrically trace-heated insulated circulation loop (+2°C to +4°C)',
    satelliteCommsSpecs: 'Dedicated VSAT Ka-band satellite ground terminal linked to ISRO/NRSC Hyderabad + Inmarsat + Iridium',
    wasteManagementSpecs: 'Madrid Protocol Annex III/IV compliant bio-digestive sewage treatment; 100% solid & hazardous waste retrograded to India',
    scientificDisciplines: [
      'Atmospheric Physics & Total Ozone Column (IMD Brewer Spectrophotometer)',
      'Geomagnetism & Space Weather (IIG PPM, DFM, ICM, DIM Observatory)',
      'Broadband Seismology & Geodetic GNSS Plate Drift (NGRI Guralp CMG-3T)',
      'Upper Atmosphere & Cosmic Noise Riometry (NPL 30MHz Riometer, EFM, VLF)',
      'Limnology, Glaciology & Permafrost Core Drilling (NCPOR / GSI)'
    ],
    partnerInstitutes: ['NCPOR', 'IMD', 'IIG', 'NGRI', 'NPL', 'GSI', 'SASE/DRDO', 'ISRO'],
    ncporProfileUrl: 'https://ncpor.res.in/antarcticas/station/maitri'
  };

  // 2. BHARATI STATION META (NCPOR Verified Profile)
  const bharatiMeta: StationMeta = {
    id: 'bharati',
    name: 'Bharati Research Station',
    code: 'IN-BHR-02',
    established: 2012,
    commissionedDate: '18 March 2012 (31st Indian Scientific Expedition to Antarctica)',
    locationName: 'Grovness Peninsula, Larsemann Hills, Prydz Bay',
    coordinates: { lat: -69.4070, lng: 76.1950 },
    coordinatesDMS: "69° 24.41' S, 76° 11.72' E",
    elevationMeters: 35,
    elevationDescription: '~35 m above sea level on coastal promontory between Thala Fjord & Quilty Bay',
    crewCount: 47,
    winterCrewCount: 25,
    summerCapacity: 72,
    status: 'OPERATIONAL',
    architecture: 'Aerodynamic bi-axial envelope enclosing 134 prefabricated ISO containers on high-tensile steel stilts',
    powerPlantSpecs: '3 × 100 kVA Combined Heat & Power (CHP) units on Jet A-1/DMA with 185 kW thermal waste-heat co-generation',
    waterSupplySpecs: 'Seawater Reverse Osmosis (RO) desalination plant drawing from Prydz Bay via trace-heated sub-sea intake',
    satelliteCommsSpecs: 'Dedicated ISRO/NRSC Earth Station with dual tracking radomes for polar remote sensing relay to Shadnagar',
    wasteManagementSpecs: 'Biological bioreactor wastewater treatment; greywater recycled for flushing; 100% solid waste retrograded to India',
    scientificDisciplines: [
      'Polar Satellite Remote Sensing & Ground Tracking (ISRO / NRSC)',
      'Physical Oceanography & Biogeochemistry (NCPOR / Prydz Bay)',
      'Coastal Meteorology & Atmospheric Boundary Layer (IMD)',
      'Geomagnetic Field Observations & Atmospheric Electricity (IIG)',
      'Continental Gondwana Geology & Ice Sheet Dynamics'
    ],
    partnerInstitutes: ['NCPOR', 'ISRO / NRSC', 'IMD', 'IIG', 'Survey of India', 'SIOM'],
    ncporProfileUrl: 'https://ncpor.res.in/antarcticas/station/bharati'
  };

  inMemoryDb.stations.set('maitri', maitriMeta);
  inMemoryDb.stations.set('bharati', bharatiMeta);

  // 3. MAITRI AWS & SCIENTIFIC INSTRUMENTATION SEEDS
  const maitriAws: AWSTelemetry = {
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
  };

  const maitriGeomagnetic: GeomagneticTelemetry = {
    station: 'maitri',
    timestamp: now,
    ppmTotalIntensity: 43250.4, // nT
    ppmStatus: 'OPERATIONAL',
    dfmX: 18420.2, // nT
    dfmY: -2150.8, // nT
    dfmZ: -38950.6, // nT
    dfmStatus: 'OPERATIONAL',
    icmX: 0.12, // nT/s
    icmY: -0.08,
    icmZ: 0.04,
    icmStatus: 'OPERATIONAL',
    dimDeclination: -18.4, // deg
    dimInclination: -64.7, // deg
    dimStatus: 'OPERATIONAL'
  };

  const maitriAtmospheric: AtmosphericTelemetry = {
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
  };

  const maitriSeismic: SeismicTelemetry = {
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
  };

  inMemoryDb.aws.set('maitri', maitriAws);
  inMemoryDb.geomagnetic.set('maitri', maitriGeomagnetic);
  inMemoryDb.atmospheric.set('maitri', maitriAtmospheric);
  inMemoryDb.seismic.set('maitri', maitriSeismic);

  // 4. BHARATI AWS & SCIENTIFIC INSTRUMENTATION SEEDS
  const bharatiAws: AWSTelemetry = {
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
  };

  const bharatiGeomagnetic: GeomagneticTelemetry = {
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
  };

  const bharatiAtmospheric: AtmosphericTelemetry = {
    station: 'bharati',
    timestamp: now,
    vlfReceiverStatus: 'OPERATIONAL',
    vlfSignalStrengthDb: 58.6,
    electricFieldMillKvM: 1.22,
    efmStatus: 'OPERATIONAL'
  };

  inMemoryDb.aws.set('bharati', bharatiAws);
  inMemoryDb.geomagnetic.set('bharati', bharatiGeomagnetic);
  inMemoryDb.atmospheric.set('bharati', bharatiAtmospheric);

  // 5. INFRASTRUCTURE SUBSYSTEM DIGITAL TWINS (MAITRI & BHARATI)
  const maitriSubsystems: SubsystemState[] = [
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
  ];

  const bharatiSubsystems: SubsystemState[] = [
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
  ];

  inMemoryDb.subsystems.set('maitri', maitriSubsystems);
  inMemoryDb.subsystems.set('bharati', bharatiSubsystems);

  // 6. MAITRI & BHARATI ENVIRONMENT DATA (BACKWARD COMPATIBLE COMBINED VIEW)
  const maitriEnv: EnvironmentData = {
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
  };

  const bharatiEnv: EnvironmentData = {
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
  };

  inMemoryDb.environment.set('maitri', maitriEnv);
  inMemoryDb.environment.set('bharati', bharatiEnv);

  // 7. MAITRI ENERGY (Primary Generators + Solar + Wind + Priyadarshini Heating)
  const maitriEnergy: EnergyData = {
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
  };

  // 8. BHARATI ENERGY (CHP Combined Heat & Power Architecture)
  const bharatiEnergy: EnergyData = {
    stationId: 'bharati',
    timestamp: now,
    powerGrid: {
      generationKw: 420,
      solarGenerationKw: 60,
      windGenerationKw: 40,
      generatorGenerationKw: 320,
      chpThermalGenerationKw: 185, // CHP Thermal co-generation
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
  };

  inMemoryDb.energy.set('maitri', maitriEnergy);
  inMemoryDb.energy.set('bharati', bharatiEnergy);

  // 9. EQUIPMENT ITEMS SEEDS
  const maitriEquipment: EquipmentItem[] = [
    { id: 'eq-m1', stationId: 'maitri', name: 'Priyadarshini Lake Water Pump', category: 'WATER', healthPercent: 91, temperature: 4.2, vibration: 1.2, runtimeHours: 3200, status: 'HEALTHY', lastMaintenance: '2026-01-15', nextMaintenance: '2026-07-15', failureProbability: 4.5, simulatedPrediction: 'Impeller wear nominal. Anti-freeze trace heating active.', recommendedAction: 'Maintain current suction flow rate.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-m2', stationId: 'maitri', name: 'Hydronic Boiler #1', category: 'HVAC', healthPercent: 94, temperature: 68.4, vibration: 0.8, runtimeHours: 6100, status: 'HEALTHY', lastMaintenance: '2026-02-01', nextMaintenance: '2026-08-01', failureProbability: 3.2, simulatedPrediction: 'Combustion efficiency 94.5%. Burner nozzle clean.', recommendedAction: 'Inspect fuel filter at next interval.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-m3', stationId: 'maitri', name: 'Broadband Seismometer BB01', category: 'RESEARCH', healthPercent: 98, temperature: 2.1, vibration: 0.1, runtimeHours: 12400, status: 'HEALTHY', lastMaintenance: '2025-11-20', nextMaintenance: '2026-11-20', failureProbability: 1.0, simulatedPrediction: 'GPS synchronization locked. Zero thermal drift.', recommendedAction: 'Clean vault cover after snow drift.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-m4', stationId: 'maitri', name: 'Proton Precession Magnetometer', category: 'RESEARCH', healthPercent: 96, temperature: -15.0, vibration: 0.0, runtimeHours: 18500, status: 'HEALTHY', lastMaintenance: '2025-12-10', nextMaintenance: '2026-12-10', failureProbability: 1.5, simulatedPrediction: 'Sensor coil resistance stable.', recommendedAction: 'Routine calibration.', operationalTag: 'OPERATIONAL' }
  ];

  const bharatiEquipment: EquipmentItem[] = [
    { id: 'eq-b1', stationId: 'bharati', name: 'CHP Co-Gen Unit #1', category: 'ENERGY', healthPercent: 95, temperature: 78.0, vibration: 2.1, runtimeHours: 5120, status: 'HEALTHY', lastMaintenance: '2026-02-10', nextMaintenance: '2026-08-10', failureProbability: 6.0, simulatedPrediction: 'Thermal heat exchanger recovery 92%.', recommendedAction: 'Monitor oil pressure.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-b2', stationId: 'bharati', name: 'Seawater Intake Pump & Desalination RO', category: 'WATER', healthPercent: 93, temperature: 2.4, vibration: 1.5, runtimeHours: 4200, status: 'HEALTHY', lastMaintenance: '2026-01-20', nextMaintenance: '2026-07-20', failureProbability: 4.0, simulatedPrediction: 'RO membrane pressure 58 bar.', recommendedAction: 'Flush membrane weekly.', operationalTag: 'OPERATIONAL' },
    { id: 'eq-b3', stationId: 'bharati', name: 'Satellite Earth Station Antenna', category: 'COMMS', healthPercent: 99, temperature: 24.0, vibration: 0.2, runtimeHours: 14200, status: 'HEALTHY', lastMaintenance: '2026-03-01', nextMaintenance: '2026-09-01', failureProbability: 0.8, simulatedPrediction: 'Radome heater active. Ka-band signal locked.', recommendedAction: 'No action required.', operationalTag: 'OPERATIONAL' }
  ];

  inMemoryDb.equipment.set('maitri', maitriEquipment);
  inMemoryDb.equipment.set('bharati', bharatiEquipment);

  // 10. INVENTORY ITEMS SEEDS
  const maitriInventory: InventoryItem[] = [
    { id: 'inv-m1', stationId: 'maitri', name: 'Polar Diesel (AN-8 Standard)', category: 'FUEL', quantity: 62400, unit: 'Liters', maxCapacity: 80000, dailyConsumption: 1336, daysRemaining: 46, status: 'NORMAL', lastRestocked: '2026-01-10' },
    { id: 'inv-m2', stationId: 'maitri', name: 'Rations & Freeze-Dried Food', category: 'FOOD', quantity: 450, unit: 'Ration Packs', maxCapacity: 600, dailyConsumption: 8.5, daysRemaining: 52, status: 'NORMAL', lastRestocked: '2026-01-10' },
    { id: 'inv-m3', stationId: 'maitri', name: 'Emergency Medical Supplies', category: 'MEDICAL', quantity: 95, unit: 'Kits', maxCapacity: 100, dailyConsumption: 0.2, daysRemaining: 475, status: 'NORMAL', lastRestocked: '2026-01-10' }
  ];

  const bharatiInventory: InventoryItem[] = [
    { id: 'inv-b1', stationId: 'bharati', name: 'Polar Diesel (AN-8 Standard)', category: 'FUEL', quantity: 98400, unit: 'Liters', maxCapacity: 120000, dailyConsumption: 1824, daysRemaining: 53, status: 'NORMAL', lastRestocked: '2026-01-15' },
    { id: 'inv-b2', stationId: 'bharati', name: 'Fresh Water Storage', category: 'WATER', quantity: 18500, unit: 'Liters', maxCapacity: 22000, dailyConsumption: 350, daysRemaining: 52, status: 'NORMAL', lastRestocked: '2026-02-01' }
  ];

  inMemoryDb.inventory.set('maitri', maitriInventory);
  inMemoryDb.inventory.set('bharati', bharatiInventory);

  console.log('✅ Baseline seed data loaded into In-Memory Store for Maitri and Bharati Stations.');
}
