import { EquipmentItem, EnergyData, EnvironmentData, StationAlert, StationId } from '../types';

export type ComponentStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
export type SensorStatus = 'NORMAL' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL' | 'OFFLINE';

export interface SensorDefinition {
  id: string;
  name: string;
  type: 'TEMPERATURE' | 'VIBRATION' | 'RPM' | 'PRESSURE' | 'FLOW' | 'VOLTAGE' | 'CURRENT' | 'LEVEL' | 'RF_SIGNAL';
  unit: string;
  normalRange: [number, number];
  relativePosition: [number, number, number]; // [x, y, z] on asset
  getValue: (energy: EnergyData | null, env: EnvironmentData | null, eq: EquipmentItem | null, scenario: string) => number;
  getStatus: (value: number) => SensorStatus;
  trend: 'RISING' | 'STABLE' | 'FALLING';
}

export interface InternalComponent {
  id: string;
  name: string;
  description: string;
  category: string;
  relativePosition: [number, number, number]; // center in 3D relative to asset
  size: [number, number, number]; // bounding box
  meshType: 'ENGINE_BLOCK' | 'ALTERNATOR' | 'COOLING_SYSTEM' | 'FUEL_SYSTEM' | 'OIL_SYSTEM' | 'EXHAUST_SYSTEM' | 'BATTERY_PACK' | 'CONTROL_MODULE' | 'ROTOR_GEARBOX' | 'INVERTER' | 'PUMP_IMPELLER' | 'MOTOR_STATOR' | 'FILTER_MEMBRANE' | 'STORAGE_VESSEL' | 'RF_TRANSCEIVER' | 'SWITCHGEAR' | 'AHU_CHILLER';
  getHealth: (energy: EnergyData | null, env: EnvironmentData | null, eq: EquipmentItem | null, scenario: string) => {
    healthPercent: number;
    temperature: number;
    loadPercent?: number;
    vibration?: number;
    status: ComponentStatus;
    failureProbability: number;
    operatingCondition: string;
  };
  sensors: SensorDefinition[];
}

export interface AssetInspectionData {
  assetId: string;
  assetName: string;
  assetType: 'GENERATOR' | 'BATTERY' | 'FUEL_TANK' | 'WATER_SYSTEM' | 'COMMS_TOWER' | 'WIND_TURBINE' | 'SOLAR_ARRAY' | 'MAIN_STATION' | 'RESEARCH_LAB' | 'WAREHOUSE' | 'GENERIC';
  stationId: StationId;
  locationLabel: string;
  status: ComponentStatus;
  healthPercent: number;
  operatingTemp: number;
  loadPercent: number;
  vibration: number;
  runtimeHours: number;
  failureProbability: number;
  lastMaintenance: string;
  nextMaintenance: string;
  aiDiagnosis: string;
  recommendedAction: string;
  downstreamImpact: {
    system: string;
    impactLevel: 'NOMINAL' | 'DEGRADED' | 'CRITICAL';
    description: string;
  }[];
  components: InternalComponent[];
}

// ─── GENERATOR ASSET TEMPLATE ──────────────────────────────────────────────
export function buildGeneratorInspectionData(
  genIndex: number,
  stationId: StationId,
  energy: EnergyData | null,
  env: EnvironmentData | null,
  equipment: EquipmentItem[],
  scenario: string
): AssetInspectionData {
  const isMaitri = stationId === 'maitri';
  const genId = isMaitri ? `gen-m${genIndex}` : `gen-b${genIndex}`;
  
  // Find live generator telemetry from the active simulation energy grid
  const genTelemetry = energy?.generators?.find(g => 
    g.id === genId || 
    g.id.includes(`gen-${isMaitri ? 'm' : 'b'}${genIndex}`) || 
    g.name.includes(`#${genIndex}`)
  ) || energy?.generators?.[genIndex - 1];

  const eqItem = equipment.find(e => 
    e.id === genId || 
    e.id === `eq-${isMaitri ? 'm' : 'b'}${genIndex}` || 
    e.name.toLowerCase().includes(`generator #${genIndex}`) ||
    e.name.toLowerCase().includes(`generator unit #${genIndex}`)
  );

  // Live telemetry bindings
  const temp = genTelemetry?.temperature ?? (eqItem?.temperature ?? (64 + genIndex * 2));
  const health = genTelemetry?.healthPercent ?? (eqItem?.healthPercent ?? 92);
  const load = genTelemetry?.loadPercent ?? 65;
  const powerKw = genTelemetry?.powerKw ?? Math.round((load / 100) * (isMaitri ? 250 : 200));
  const rpm = genTelemetry?.rpm ?? (genTelemetry?.status === 'OFFLINE' ? 0 : 1500);
  const vib = eqItem?.vibration ?? Number((1.2 + (temp > 80 ? (temp - 80) * 0.15 : 0)).toFixed(1));
  const failProb = genTelemetry?.failureProbability ?? (eqItem?.failureProbability ?? (temp > 90 ? 98.0 : temp > 80 ? 65.0 : 3.5));
  const runtimeHours = genTelemetry?.runtimeHours ?? (eqItem?.runtimeHours ?? (8200 + genIndex * 750));

  const rawStatus = genTelemetry?.status || eqItem?.status || 'HEALTHY';
  const status: ComponentStatus = 
    rawStatus === 'CRITICAL' || rawStatus === 'FAILED' || temp >= 95 ? 'CRITICAL' :
    rawStatus === 'WARNING' || temp >= 80 || health < 60 ? 'WARNING' :
    rawStatus === 'OFFLINE' ? 'OFFLINE' : 'HEALTHY';

  const isCritical = status === 'CRITICAL';
  const isWarning = status === 'WARNING';

  const components: InternalComponent[] = [
    {
      id: `${genId}-engine-block`,
      name: 'Engine Block & Crankcase',
      description: 'Heavy-duty turbocharged diesel combustion chamber with forged crankshaft and counter-rotating balance shafts.',
      category: 'MECHANICAL',
      relativePosition: [-0.4, 0.4, 0],
      size: [1.0, 0.8, 0.7],
      meshType: 'ENGINE_BLOCK',
      getHealth: () => ({
        healthPercent: Math.max(10, Math.round(health * 0.95)),
        temperature: Math.round(temp + 2),
        loadPercent: load,
        vibration: vib,
        status: isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'HEALTHY',
        failureProbability: failProb,
        operatingCondition: isCritical ? `Crankcase thermal limit exceeded (${temp}°C)` : 'Crankcase pressure and compression nominal'
      }),
      sensors: [
        {
          id: `S-${genId}-TMP-ENG`,
          name: 'Crankcase Temperature Sensor',
          type: 'TEMPERATURE',
          unit: '°C',
          normalRange: [55, 80],
          relativePosition: [-0.4, 0.8, 0.2],
          getValue: () => Math.round(temp + 2),
          getStatus: (v) => v > 90 ? 'CRITICAL' : v > 80 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'RISING' : 'STABLE'
        },
        {
          id: `S-${genId}-VIB-01`,
          name: 'Engine Main Bearing Vibration',
          type: 'VIBRATION',
          unit: 'mm/s',
          normalRange: [0.5, 3.5],
          relativePosition: [-0.7, 0.2, 0],
          getValue: () => vib,
          getStatus: (v) => v > 5.0 ? 'CRITICAL' : v > 3.5 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'RISING' : 'STABLE'
        },
        {
          id: `S-${genId}-RPM-01`,
          name: 'Crankshaft Speed Encoder',
          type: 'RPM',
          unit: 'RPM',
          normalRange: [1480, 1520],
          relativePosition: [-0.8, 0.5, 0.3],
          getValue: () => rpm,
          getStatus: (v) => v === 0 ? 'OFFLINE' : (v < 1450 || v > 1550 ? 'WARNING' : 'NORMAL'),
          trend: 'STABLE'
        }
      ]
    },
    {
      id: `${genId}-alternator`,
      name: 'Stator & Rotor Alternator',
      description: 'Brushless 3-phase synchronous AC generator with Class H polar insulation and permanent magnet exciter.',
      category: 'ELECTRICAL',
      relativePosition: [0.5, 0.4, 0],
      size: [0.8, 0.7, 0.7],
      meshType: 'ALTERNATOR',
      getHealth: () => ({
        healthPercent: Math.max(20, Math.round(health * 0.98)),
        temperature: Math.round(temp - 8),
        loadPercent: load,
        vibration: Number((vib * 0.7).toFixed(1)),
        status: isCritical ? 'WARNING' : 'HEALTHY',
        failureProbability: Math.round(failProb * 0.5),
        operatingCondition: rpm === 0 ? 'Generator breaker tripped / Excitation off' : `Delivering ${powerKw} kW at 415V RMS`
      }),
      sensors: [
        {
          id: `S-${genId}-VOLT-01`,
          name: 'Line-to-Line Voltage',
          type: 'VOLTAGE',
          unit: 'V',
          normalRange: [400, 430],
          relativePosition: [0.6, 0.7, 0.25],
          getValue: () => rpm === 0 ? 0 : (genTelemetry?.voltage ?? 415),
          getStatus: (v) => v === 0 ? 'OFFLINE' : (v < 390 || v > 440 ? 'WARNING' : 'NORMAL'),
          trend: 'STABLE'
        },
        {
          id: `S-${genId}-CURR-01`,
          name: 'Output Current (Phase A)',
          type: 'CURRENT',
          unit: 'A',
          normalRange: [50, 220],
          relativePosition: [0.7, 0.3, -0.2],
          getValue: () => rpm === 0 ? 0 : (genTelemetry?.current ?? Math.round((load / 100) * 210)),
          getStatus: (v) => v > 230 ? 'CRITICAL' : v > 200 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'FALLING' : 'STABLE'
        }
      ]
    },
    {
      id: `${genId}-cooling-system`,
      name: 'Radiator & Coolant Loop',
      description: 'High-capacity ethylene-glycol heat exchanger with thermostatic bypass valve and ducted blower fan.',
      category: 'THERMAL',
      relativePosition: [-0.9, 0.45, 0],
      size: [0.35, 0.85, 0.75],
      meshType: 'COOLING_SYSTEM',
      getHealth: () => ({
        healthPercent: Math.max(10, Math.round(100 - (temp > 70 ? (temp - 70) * 3.2 : 0))),
        temperature: Math.round(temp + 2),
        status: isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'HEALTHY',
        failureProbability: failProb,
        operatingCondition: temp > 85 ? `Coolant overheat detected (${temp}°C)` : 'Coolant circulation nominal'
      }),
      sensors: [
        {
          id: `S-${genId}-COOL-FLOW`,
          name: 'Coolant Flow Rate',
          type: 'FLOW',
          unit: 'L/min',
          normalRange: [45, 75],
          relativePosition: [-0.95, 0.7, 0.2],
          getValue: () => rpm === 0 ? 0 : Math.max(8, Math.round(62 - (temp > 80 ? (temp - 80) * 2.2 : 0))),
          getStatus: (v) => v < 20 ? 'CRITICAL' : v < 40 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'FALLING' : 'STABLE'
        },
        {
          id: `S-${genId}-RAD-TEMP`,
          name: 'Radiator Core Temperature',
          type: 'TEMPERATURE',
          unit: '°C',
          normalRange: [50, 75],
          relativePosition: [-0.95, 0.2, -0.2],
          getValue: () => Math.round(temp + 2),
          getStatus: (v) => v > 90 ? 'CRITICAL' : v > 75 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'RISING' : 'STABLE'
        }
      ]
    },
    {
      id: `${genId}-fuel-system`,
      name: 'Common Rail Fuel Injection',
      description: 'High-pressure 1800 bar accumulator with piezoelectric injectors and dual polar-grade fuel pre-heaters.',
      category: 'FUEL',
      relativePosition: [-0.2, 0.65, 0.35],
      size: [0.8, 0.2, 0.2],
      meshType: 'FUEL_SYSTEM',
      getHealth: () => ({
        healthPercent: Math.max(30, Math.round(health * 0.96)),
        temperature: 42,
        status: isCritical ? 'WARNING' : 'HEALTHY',
        failureProbability: Math.round(failProb * 0.4),
        operatingCondition: rpm === 0 ? 'Fuel supply solenoid closed' : `Consumption: ${genTelemetry?.fuelConsumptionRate ?? 32} L/h`
      }),
      sensors: [
        {
          id: `S-${genId}-FUEL-PRES`,
          name: 'Common Rail Fuel Pressure',
          type: 'PRESSURE',
          unit: 'bar',
          normalRange: [1400, 1850],
          relativePosition: [-0.1, 0.75, 0.35],
          getValue: () => rpm === 0 ? 0 : Math.round(1680 * (health / 100)),
          getStatus: (v) => v === 0 ? 'OFFLINE' : v < 800 ? 'CRITICAL' : v < 1300 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'FALLING' : 'STABLE'
        }
      ]
    },
    {
      id: `${genId}-oil-system`,
      name: 'Lubrication & Sump Pump',
      description: 'Full-flow multi-viscosity synthetic polar oil filtration loop with magnetic debris trap and oil cooler.',
      category: 'LUBRICATION',
      relativePosition: [-0.3, 0.08, 0],
      size: [0.9, 0.16, 0.6],
      meshType: 'OIL_SYSTEM',
      getHealth: () => ({
        healthPercent: Math.max(25, Math.round(health * 0.94)),
        temperature: Math.round(temp - 5),
        status: isCritical ? 'CRITICAL' : 'HEALTHY',
        failureProbability: Math.round(failProb * 0.7),
        operatingCondition: isCritical ? 'Oil viscosity breakdown risk at high temperature' : 'Main gallery pressure 4.6 bar'
      }),
      sensors: [
        {
          id: `S-${genId}-OIL-PRES`,
          name: 'Main Oil Gallery Pressure',
          type: 'PRESSURE',
          unit: 'bar',
          normalRange: [3.8, 5.5],
          relativePosition: [-0.4, 0.12, 0.3],
          getValue: () => rpm === 0 ? 0 : Number((4.6 * (health / 100)).toFixed(1)),
          getStatus: (v) => v === 0 ? 'OFFLINE' : v < 2.0 ? 'CRITICAL' : v < 3.2 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'FALLING' : 'STABLE'
        }
      ]
    },
    {
      id: `${genId}-exhaust-system`,
      name: 'Turbocharger & Exhaust Manifold',
      description: 'Ceramic-insulated exhaust collector with wastegate turbocharger and thermal energy recovery exchanger.',
      category: 'THERMAL',
      relativePosition: [0.4, 0.85, 0],
      size: [0.4, 0.5, 0.4],
      meshType: 'EXHAUST_SYSTEM',
      getHealth: () => ({
        healthPercent: Math.max(30, Math.round(health * 0.92)),
        temperature: rpm === 0 ? 30 : Math.round(temp * 3.8 + (load / 100) * 110),
        status: isCritical ? 'WARNING' : 'HEALTHY',
        failureProbability: Math.round(failProb * 0.5),
        operatingCondition: rpm === 0 ? 'Cool down cycle active' : `Exhaust velocity nominal at ${load}% load`
      }),
      sensors: [
        {
          id: `S-${genId}-EGT-01`,
          name: 'Exhaust Gas Temperature (EGT)',
          type: 'TEMPERATURE',
          unit: '°C',
          normalRange: [280, 390],
          relativePosition: [0.4, 1.0, 0],
          getValue: () => rpm === 0 ? 30 : Math.round(temp * 3.8 + (load / 100) * 110),
          getStatus: (v) => v > 450 ? 'CRITICAL' : v > 390 ? 'WARNING' : 'NORMAL',
          trend: isCritical ? 'RISING' : 'STABLE'
        }
      ]
    },
    {
      id: `${genId}-controller`,
      name: 'Digital Engine Controller (DEIF)',
      description: 'Microprocessor governor with automatic synchronizer, CAN-bus telemetry interface, and safety trip matrix.',
      category: 'CONTROL',
      relativePosition: [0.75, 0.7, 0.3],
      size: [0.25, 0.35, 0.15],
      meshType: 'CONTROL_MODULE',
      getHealth: () => ({
        healthPercent: 99,
        temperature: 24,
        status: 'HEALTHY',
        failureProbability: 0.5,
        operatingCondition: isCritical ? 'Safety trip issued to 415V generator breaker' : 'Bus synchronization locked'
      }),
      sensors: [
        {
          id: `S-${genId}-CPU-TEMP`,
          name: 'Governor Logic Board Temperature',
          type: 'TEMPERATURE',
          unit: '°C',
          normalRange: [15, 45],
          relativePosition: [0.75, 0.85, 0.3],
          getValue: () => 26.2,
          getStatus: () => 'NORMAL',
          trend: 'STABLE'
        }
      ]
    }
  ];

  return {
    assetId: genId,
    assetName: isMaitri ? `Caterpillar Generator Unit #${genIndex} (250 kVA)` : `Volvo CHP Generator #${genIndex} (200 kW)`,
    assetType: 'GENERATOR',
    stationId,
    locationLabel: isMaitri ? `Maitri Powerhouse Bay ${genIndex}` : `Bharati Energy Module Generator ${genIndex}`,
    status,
    healthPercent: health,
    operatingTemp: temp,
    loadPercent: load,
    vibration: vib,
    runtimeHours,
    failureProbability: failProb,
    lastMaintenance: eqItem?.lastMaintenance ?? '2026-06-10',
    nextMaintenance: isCritical ? 'IMMEDIATE REPAIR REQUIRED' : (eqItem?.nextMaintenance ?? '2026-10-15'),
    aiDiagnosis: isCritical
      ? `🚨 Critical cooling breakdown on Generator #${genIndex}. Operating temperature reached ${temp}°C, inducing high failure risk (${failProb}%). Automated breaker failover recommended.`
      : `Generator #${genIndex} operating within nominal Antarctic polar load parameters (${load}% load, ${temp}°C). Grid harmonic distortion nominal.`,
    recommendedAction: isCritical
      ? `Transfer critical station load to Generator #${genIndex === 2 ? 3 : 1}. Flush coolant loop and replace thermostatic actuator cartridge.`
      : `Next scheduled lube filter check in ${(60 - genIndex * 5)} operational days.`,
    downstreamImpact: [
      {
        system: 'Station 415V Main Busbar',
        impactLevel: isCritical ? 'CRITICAL' : 'NOMINAL',
        description: isCritical ? `Lost ${powerKw} kW active generation capacity. Load rerouting required.` : 'Bus voltage stable at 415V ± 1.2%'
      },
      {
        system: 'Life Support Hydronic Heating',
        impactLevel: isCritical ? 'DEGRADED' : 'NOMINAL',
        description: isCritical ? 'Auxiliary boiler heating coil engaged to buffer thermal deficit.' : 'Water glycol temperature at 78°C'
      },
      {
        system: 'LiFePO4 Battery Buffer',
        impactLevel: isCritical ? 'DEGRADED' : 'NOMINAL',
        description: isCritical ? 'Battery ESS discharging to buffer grid transition surge.' : 'Battery SOC floating nominal'
      }
    ],
    components
  };
}

// ─── BATTERY ESS TEMPLATE ──────────────────────────────────────────────────
export function buildBatteryInspectionData(
  stationId: StationId,
  energy: EnergyData | null,
  equipment: EquipmentItem[],
  scenario: string
): AssetInspectionData {
  const isMaitri = stationId === 'maitri';
  const soc = energy?.battery?.stateOfCharge ?? 88;
  const temp = energy?.battery?.temperature ?? 16;
  const health = energy?.battery?.healthPercent ?? 98;
  const powerKw = energy?.battery?.powerKw ?? 30;
  const capacityKwh = energy?.battery?.capacityKwh ?? (isMaitri ? 250 : 350);
  const backupHours = energy?.battery?.estimatedBackupHours ?? 8.4;
  
  const rawStatus = energy?.battery?.status || 'HEALTHY';
  const status: ComponentStatus = 
    rawStatus === 'CRITICAL' || rawStatus === 'DISCHARGING_FAST' || soc < 20 ? 'CRITICAL' :
    rawStatus === 'WARNING' || soc < 40 ? 'WARNING' : 'HEALTHY';

  const isCritical = status === 'CRITICAL';

  return {
    assetId: isMaitri ? 'battery-m1' : 'battery-b1',
    assetName: isMaitri ? 'Station Battery Bank (250 kWh LiFePO4)' : '350kWh Ultra-Cold Energy Storage System',
    assetType: 'BATTERY',
    stationId,
    locationLabel: isMaitri ? 'Maitri Battery Shelter' : 'Bharati Energy Distribution Wing',
    status,
    healthPercent: health,
    operatingTemp: temp,
    loadPercent: Math.min(100, Math.round((powerKw / capacityKwh) * 100)),
    vibration: 0.1,
    runtimeHours: 9400,
    failureProbability: isCritical ? 78.0 : 1.2,
    lastMaintenance: '2026-07-20',
    nextMaintenance: '2027-01-20',
    aiDiagnosis: isCritical
      ? `⚠️ Battery grid depletion detected (SOC: ${soc}%). Grid load shedding activated to protect cell minimum threshold.`
      : `Battery cell internal resistance balanced across all 16 strings. Thermal stabilization active at ${temp}°C.`,
    recommendedAction: isCritical
      ? 'Disconnect non-essential loads immediately. Reroute excess diesel generator output to rapid charging cycle.'
      : 'Maintain ambient battery room temperature above 12°C to prevent polar capacity loss.',
    downstreamImpact: [
      {
        system: 'Uninterruptible Power Supply (UPS)',
        impactLevel: isCritical ? 'CRITICAL' : 'NOMINAL',
        description: isCritical ? `Autonomous backup reduced to < ${backupHours} Hours.` : `Autonomous backup at ${backupHours} Hours.`
      }
    ],
    components: [
      {
        id: 'bat-cells',
        name: 'LiFePO4 Prismatic Cell Rack (16 Strings)',
        description: '3.2V 280Ah high-density lithium iron phosphate cells enclosed in insulated fire-resistant steel racks.',
        category: 'ELECTROCHEMICAL',
        relativePosition: [0, 0.4, 0],
        size: [1.8, 0.8, 0.5],
        meshType: 'BATTERY_PACK',
        getHealth: () => ({
          healthPercent: health,
          temperature: temp,
          status,
          failureProbability: isCritical ? 65.0 : 1.0,
          operatingCondition: isCritical ? `Low SOC (${soc}%) / Rapid discharge` : 'Cell delta-V < 3 mV balanced'
        }),
        sensors: [
          {
            id: 'S-BAT-SOC',
            name: 'State of Charge (SOC)',
            type: 'LEVEL',
            unit: '%',
            normalRange: [40, 95],
            relativePosition: [-0.5, 0.7, 0.25],
            getValue: () => soc,
            getStatus: (v) => v < 20 ? 'CRITICAL' : v < 40 ? 'WARNING' : 'NORMAL',
            trend: isCritical ? 'FALLING' : 'STABLE'
          },
          {
            id: 'S-BAT-TEMP',
            name: 'Core Module Temperature',
            type: 'TEMPERATURE',
            unit: '°C',
            normalRange: [12, 28],
            relativePosition: [0.5, 0.7, 0.25],
            getValue: () => temp,
            getStatus: (v) => v > 35 ? 'CRITICAL' : v > 28 ? 'WARNING' : 'NORMAL',
            trend: 'STABLE'
          }
        ]
      },
      {
        id: 'bat-inverter',
        name: 'Bi-Directional Smart Inverter (DC/AC)',
        description: 'IGBT-based pure sine wave grid-forming inverter with 4-quadrant reactive power compensation.',
        category: 'POWER_ELECTRONICS',
        relativePosition: [0, 0.85, 0],
        size: [1.2, 0.4, 0.4],
        meshType: 'INVERTER',
        getHealth: () => ({
          healthPercent: 97,
          temperature: Math.round(temp + 12),
          status: 'HEALTHY',
          failureProbability: 1.5,
          operatingCondition: `Grid synchronizing at 50.0 Hz (${powerKw} kW throughput)`
        }),
        sensors: [
          {
            id: 'S-INV-PWR',
            name: 'Inverter Power Throughput',
            type: 'FLOW',
            unit: 'kW',
            normalRange: [10, 80],
            relativePosition: [0, 0.95, 0.2],
            getValue: () => powerKw,
            getStatus: () => 'NORMAL',
            trend: 'STABLE'
          }
        ]
      }
    ]
  };
}

// ─── FUEL TANK TEMPLATE ──────────────────────────────────────────────────
export function buildFuelTankInspectionData(
  tankId: string,
  stationId: StationId,
  energy: EnergyData | null,
  env: EnvironmentData | null,
  scenario: string
): AssetInspectionData {
  const isMaitri = stationId === 'maitri';
  const fuelPercent = energy?.fuelStorage?.fuelPercent ?? 75;
  const currentLiters = energy?.fuelStorage?.currentFuelLiters ?? 58400;
  const daysLeft = energy?.fuelStorage?.estimatedDaysRemaining ?? 47;
  const burnRate = energy?.fuelStorage?.consumptionRateLitersPerHour ?? 51.2;
  const isLowFuel = scenario === 'fuel_shortage' || fuelPercent < 25;
  const status: ComponentStatus = isLowFuel ? 'CRITICAL' : (fuelPercent < 45 ? 'WARNING' : 'HEALTHY');

  return {
    assetId: tankId,
    assetName: isMaitri ? 'Arctic Diesel Fuel Storage Tank' : 'Fuel Farm Reserve Vessel',
    assetType: 'FUEL_TANK',
    stationId,
    locationLabel: isMaitri ? 'Maitri Southern Fuel Depot' : 'Bharati Coastal Fuel Farm',
    status,
    healthPercent: isLowFuel ? 40 : 96,
    operatingTemp: env?.temperature ?? -18,
    loadPercent: Math.round(fuelPercent),
    vibration: 0.05,
    runtimeHours: 18500,
    failureProbability: isLowFuel ? 60.0 : 0.8,
    lastMaintenance: '2026-05-15',
    nextMaintenance: '2026-11-15',
    aiDiagnosis: isLowFuel
      ? `⚠️ Fuel reserves approaching ${daysLeft} days threshold (${currentLiters.toLocaleString()} L). Tank trace heaters active to prevent wax precipitation.`
      : `Fuel volume (${currentLiters.toLocaleString()} L) and viscosity nominal. Hydrostatic pressure stable.`,
    recommendedAction: isLowFuel
      ? 'Confirm ETA for polar resupply vessel MV Vasiliy Golovnin and engage fuel conservation mode.'
      : 'Perform routine moisture bleed test at bottom drain manifold in 30 days.',
    downstreamImpact: [
      {
        system: 'Diesel Generator Array',
        impactLevel: isLowFuel ? 'CRITICAL' : 'NOMINAL',
        description: isLowFuel ? `Estimated fuel autonomy reduced to ${daysLeft} Days.` : `Fuel autonomy at ${daysLeft} Days.`
      }
    ],
    components: [
      {
        id: 'tank-vessel',
        name: 'Double-Walled Steel Tank & Heating Jacket',
        description: 'ASTM A516 grade low-temperature carbon steel vessel with vacuum insulation and trace heating jacket.',
        category: 'STORAGE',
        relativePosition: [0, 0.7, 0],
        size: [1.6, 1.4, 2.8],
        meshType: 'STORAGE_VESSEL',
        getHealth: () => ({
          healthPercent: isLowFuel ? 50 : 98,
          temperature: -5,
          status,
          failureProbability: isLowFuel ? 45.0 : 0.5,
          operatingCondition: `Fuel reserve: ${currentLiters.toLocaleString()} L (${Math.round(fuelPercent)}%)`
        }),
        sensors: [
          {
            id: 'S-TANK-LVL',
            name: 'Ultrasonic Fuel Level Sensor',
            type: 'LEVEL',
            unit: '%',
            normalRange: [30, 95],
            relativePosition: [0, 1.4, 0],
            getValue: () => Math.round(fuelPercent),
            getStatus: (v) => v < 20 ? 'CRITICAL' : v < 40 ? 'WARNING' : 'NORMAL',
            trend: isLowFuel ? 'FALLING' : 'STABLE'
          },
          {
            id: 'S-TANK-FLOW',
            name: 'Discharge Flow Rate',
            type: 'FLOW',
            unit: 'L/h',
            normalRange: [30, 80],
            relativePosition: [0, 0.4, 1.0],
            getValue: () => burnRate,
            getStatus: () => 'NORMAL',
            trend: 'STABLE'
          }
        ]
      }
    ]
  };
}

// ─── WATER PLANT TEMPLATE ────────────────────────────────────────────────
export function buildWaterSystemInspectionData(
  stationId: StationId,
  equipment: EquipmentItem[],
  scenario: string
): AssetInspectionData {
  const isMaitri = stationId === 'maitri';
  const eq = equipment.find(e => e.category === 'WATER' || e.id.includes('water'));
  const health = eq?.healthPercent ?? 95;
  const temp = eq?.temperature ?? 8.5;
  const vib = eq?.vibration ?? 0.6;
  const status: ComponentStatus = eq?.status === 'CRITICAL' ? 'CRITICAL' : eq?.status === 'WARNING' ? 'WARNING' : 'HEALTHY';

  return {
    assetId: isMaitri ? 'water-m1' : 'water-b1',
    assetName: isMaitri ? 'Priyadarshini Lake Water Filtration Plant' : 'Seawater RO Desalination & Meltwater Plant',
    assetType: 'WATER_SYSTEM',
    stationId,
    locationLabel: isMaitri ? 'Priyadarshini Lake Pumphouse' : 'Bharati Environmental Utility Block',
    status,
    healthPercent: health,
    operatingTemp: temp,
    loadPercent: 62,
    vibration: vib,
    runtimeHours: eq?.runtimeHours ?? 6800,
    failureProbability: eq?.failureProbability ?? 2.1,
    lastMaintenance: eq?.lastMaintenance ?? '2026-08-01',
    nextMaintenance: eq?.nextMaintenance ?? '2026-12-01',
    aiDiagnosis: 'Potable water filtration operating at 100% microbiological safety. Intake pipe trace heating drawing nominal 4.2 kW.',
    recommendedAction: 'Inspect pre-filter cartridge differential pressure in 25 days.',
    downstreamImpact: [
      {
        system: 'Station Potable Water Supply',
        impactLevel: 'NOMINAL',
        description: 'Potable water reservoir at 88% capacity (60 days reserve).'
      }
    ],
    components: [
      {
        id: 'water-pump',
        name: 'Centrifugal Intake Booster Pump',
        description: 'Stainless steel 316L multi-stage pump with silicon carbide mechanical seals and sub-zero heater sleeve.',
        category: 'PUMP',
        relativePosition: [0, 0.4, 0],
        size: [1.2, 0.7, 0.8],
        meshType: 'PUMP_IMPELLER',
        getHealth: () => ({
          healthPercent: health,
          temperature: temp,
          status,
          failureProbability: 2.0,
          operatingCondition: 'Delivery pressure 4.2 bar at 120 L/min'
        }),
        sensors: [
          {
            id: 'S-WTR-PRES',
            name: 'Discharge Water Pressure',
            type: 'PRESSURE',
            unit: 'bar',
            normalRange: [3.5, 5.0],
            relativePosition: [0, 0.7, 0.3],
            getValue: () => 4.2,
            getStatus: () => 'NORMAL',
            trend: 'STABLE'
          }
        ]
      }
    ]
  };
}

// ─── COMMS TOWER TEMPLATE ────────────────────────────────────────────────
export function buildCommsInspectionData(
  stationId: StationId,
  equipment: EquipmentItem[],
  scenario: string
): AssetInspectionData {
  const isMaitri = stationId === 'maitri';
  const eq = equipment.find(e => e.category === 'COMMS' || e.id.includes('comms'));
  const isCommsFault = scenario === 'sensor_failure' || eq?.status === 'WARNING';
  const health = isCommsFault ? 65 : (eq?.healthPercent ?? 98);
  const status: ComponentStatus = isCommsFault ? 'WARNING' : 'HEALTHY';

  return {
    assetId: isMaitri ? 'comms-m1' : 'comms-b1',
    assetName: isMaitri ? 'ISRO Deep Space & Inmarsat Telemetry Tower' : 'Bharati Satellite Earth Station & Data Hub',
    assetType: 'COMMS_TOWER',
    stationId,
    locationLabel: isMaitri ? 'Maitri Communications Mast' : 'Bharati High-Gain Radome Dome',
    status,
    healthPercent: health,
    operatingTemp: eq?.temperature ?? 22.0,
    loadPercent: 45,
    vibration: eq?.vibration ?? 0.3,
    runtimeHours: eq?.runtimeHours ?? 15200,
    failureProbability: isCommsFault ? 35.0 : (eq?.failureProbability ?? 1.0),
    lastMaintenance: eq?.lastMaintenance ?? '2026-07-15',
    nextMaintenance: eq?.nextMaintenance ?? '2027-01-15',
    aiDiagnosis: isCommsFault
      ? '⚠️ Transient telemetry packet drops detected on secondary C-Band transponder. Primary link operational.'
      : 'Satellite carrier-to-noise ratio > 24 dB. Uplink to NCPOR Goa HQ latency 580 ms (nominal geostationary).',
    recommendedAction: 'Verify radome de-icing blower duty cycle before incoming storm front.',
    downstreamImpact: [
      {
        system: 'HQ Telemetry Gateway',
        impactLevel: isCommsFault ? 'DEGRADED' : 'NOMINAL',
        description: 'Real-time telemetry stream active via redundant L-Band backup.'
      }
    ],
    components: [
      {
        id: 'comms-rf',
        name: 'C/Ku-Band Solid State Power Amplifier',
        description: 'Dual 200W GaN high-power amplifier with thermo-electric peltier cooling and waveguide diplexer.',
        category: 'RF_COMMS',
        relativePosition: [0, 0.5, 0],
        size: [0.8, 0.8, 0.6],
        meshType: 'RF_TRANSCEIVER',
        getHealth: () => ({
          healthPercent: health,
          temperature: 28,
          status,
          failureProbability: isCommsFault ? 30.0 : 1.0,
          operatingCondition: 'SNR 24.2 dB nominal'
        }),
        sensors: [
          {
            id: 'S-RF-SNR',
            name: 'Signal-to-Noise Ratio (SNR)',
            type: 'RF_SIGNAL',
            unit: 'dB',
            normalRange: [18, 30],
            relativePosition: [0, 0.9, 0.2],
            getValue: () => isCommsFault ? 14.5 : 24.8,
            getStatus: (v) => v < 12 ? 'CRITICAL' : v < 18 ? 'WARNING' : 'NORMAL',
            trend: isCommsFault ? 'FALLING' : 'STABLE'
          }
        ]
      }
    ]
  };
}

// ─── WIND TURBINE TEMPLATE ───────────────────────────────────────────────
export function buildWindTurbineInspectionData(
  turbineId: string,
  stationId: StationId,
  energy: EnergyData | null,
  env: EnvironmentData | null,
  scenario: string
): AssetInspectionData {
  const windSpeed = env?.windSpeed ?? 32;
  const isStorm = windSpeed > 75 || scenario === 'blizzard';
  const genKw = energy?.powerGrid?.windGenerationKw ?? Math.round((windSpeed / 50) * 35);
  const status: ComponentStatus = isStorm ? 'WARNING' : 'HEALTHY';

  return {
    assetId: turbineId,
    assetName: 'Polar-Class Wind Turbine (50 kW)',
    assetType: 'WIND_TURBINE',
    stationId,
    locationLabel: `${stationId === 'maitri' ? 'Maitri' : 'Bharati'} Wind Farm`,
    status,
    healthPercent: isStorm ? 75 : 94,
    operatingTemp: -12,
    loadPercent: Math.min(100, Math.round((windSpeed / 50) * 80)),
    vibration: isStorm ? 4.2 : 1.8,
    runtimeHours: 11200,
    failureProbability: isStorm ? 25.0 : 3.2,
    lastMaintenance: '2026-06-25',
    nextMaintenance: '2026-10-25',
    aiDiagnosis: isStorm
      ? '⚠️ Katabatic gale speed approaching cut-out threshold (80 km/h). Pitch regulation feathering blades to protect drivetrain.'
      : `Wind turbine generating ${genKw} kW clean renewable power. Yaw alignment tracking prevailing katabatic corridor.`,
    recommendedAction: isStorm
      ? 'Engage emergency hydraulic disc brake if gusts exceed 90 km/h.'
      : 'Inspect blade leading edge erosion shields during upcoming calm weather window.',
    downstreamImpact: [
      {
        system: 'Renewable Power Contribution',
        impactLevel: 'NOMINAL',
        description: `Generating ${genKw} kW active renewable power.`
      }
    ],
    components: [
      {
        id: 'wt-gearbox',
        name: 'Planetary Gearbox & Main Bearing',
        description: '2-stage planetary step-up gearbox with polar synthetic low-temperature gear lube and vibration sensors.',
        category: 'MECHANICAL',
        relativePosition: [0, 0.3, 0],
        size: [0.6, 0.4, 0.5],
        meshType: 'ROTOR_GEARBOX',
        getHealth: () => ({
          healthPercent: isStorm ? 78 : 95,
          temperature: isStorm ? 48 : 28,
          vibration: isStorm ? 3.8 : 1.6,
          status,
          failureProbability: isStorm ? 22.0 : 2.5,
          operatingCondition: `Generator shaft rotating at ${Math.round(windSpeed * 30)} RPM (${genKw} kW)`
        }),
        sensors: [
          {
            id: 'S-WT-VIB',
            name: 'Gearbox Axial Vibration',
            type: 'VIBRATION',
            unit: 'mm/s',
            normalRange: [0.5, 3.2],
            relativePosition: [0, 0.45, 0.2],
            getValue: () => isStorm ? 3.9 : 1.7,
            getStatus: (v) => v > 4.5 ? 'CRITICAL' : v > 3.2 ? 'WARNING' : 'NORMAL',
            trend: isStorm ? 'RISING' : 'STABLE'
          }
        ]
      }
    ]
  };
}

// ─── MAIN STATION / LAB TEMPLATE ─────────────────────────────────────────
export function buildBuildingInspectionData(
  buildingId: string,
  buildingName: string,
  stationId: StationId,
  energy: EnergyData | null,
  env: EnvironmentData | null,
  equipment: EquipmentItem[],
  scenario: string
): AssetInspectionData {
  const isMaitri = stationId === 'maitri';
  const heatLoad = energy?.powerGrid?.heatingLoadKw ?? 85;
  const powerCon = energy?.powerGrid?.consumptionKw ?? 140;
  const outdoorTemp = env?.temperature ?? -22;
  const roomTemp = Number((21.2 + (heatLoad > 100 ? 0.6 : 0)).toFixed(1));

  return {
    assetId: buildingId,
    assetName: buildingName,
    assetType: 'MAIN_STATION',
    stationId,
    locationLabel: `${isMaitri ? 'Maitri' : 'Bharati'} Central Complex`,
    status: 'HEALTHY',
    healthPercent: 96,
    operatingTemp: roomTemp,
    loadPercent: Math.min(100, Math.round((powerCon / 200) * 100)),
    vibration: 0.1,
    runtimeHours: 32000,
    failureProbability: 1.0,
    lastMaintenance: '2026-07-01',
    nextMaintenance: '2027-01-01',
    aiDiagnosis: `Building life support systems, HVAC environmental pressure, and emergency fire dampers operating nominally at ${roomTemp}°C (outdoor: ${outdoorTemp}°C).`,
    recommendedAction: 'Routine HEPA filter inspection in 45 days.',
    downstreamImpact: [
      {
        system: 'Expedition Life Support Matrix',
        impactLevel: 'NOMINAL',
        description: 'Habitation climate and breathable air quality at 100% nominal index.'
      }
    ],
    components: [
      {
        id: `${buildingId}-ahu`,
        name: 'HVAC Air Handling Unit & Heat Recovery',
        description: 'Ducted air circulation module with counter-flow heat recovery wheel and dual pre-heating coils.',
        category: 'HVAC',
        relativePosition: [0, 0.5, 0],
        size: [1.8, 1.0, 1.2],
        meshType: 'AHU_CHILLER',
        getHealth: () => ({
          healthPercent: 95,
          temperature: roomTemp,
          status: 'HEALTHY',
          failureProbability: 1.5,
          operatingCondition: `Heating draw: ${heatLoad} kW · Climate: ${roomTemp}°C`
        }),
        sensors: [
          {
            id: `S-${buildingId}-ROOM-TEMP`,
            name: 'Habitation Ambient Temperature',
            type: 'TEMPERATURE',
            unit: '°C',
            normalRange: [19, 23],
            relativePosition: [0, 0.8, 0.4],
            getValue: () => roomTemp,
            getStatus: () => 'NORMAL',
            trend: 'STABLE'
          }
        ]
      },
      {
        id: `${buildingId}-switchgear`,
        name: '415V Main Distribution Switchgear',
        description: 'Air circuit breakers with arc-flash protection, power quality analyzer, and automatic bus transfer logic.',
        category: 'ELECTRICAL',
        relativePosition: [1.0, 0.5, 0],
        size: [0.8, 1.2, 0.6],
        meshType: 'SWITCHGEAR',
        getHealth: () => ({
          healthPercent: 99,
          temperature: 28.0,
          status: 'HEALTHY',
          failureProbability: 0.5,
          operatingCondition: `Feeder load: ${powerCon} kW balanced`
        }),
        sensors: [
          {
            id: `S-${buildingId}-BUS-VOLT`,
            name: 'Busbar 3-Phase Voltage',
            type: 'VOLTAGE',
            unit: 'V',
            normalRange: [405, 425],
            relativePosition: [1.0, 1.0, 0.2],
            getValue: () => 415.2,
            getStatus: () => 'NORMAL',
            trend: 'STABLE'
          }
        ]
      }
    ]
  };
}

// ─── MASTER RESOLVER ─────────────────────────────────────────────────────
export function getAssetInspectionData(
  assetId: string,
  stationId: StationId,
  energy: EnergyData | null,
  env: EnvironmentData | null,
  equipment: EquipmentItem[],
  scenario: string
): AssetInspectionData {
  const lower = assetId.toLowerCase();

  // Generator matching
  if (lower.includes('gen-m1') || lower.includes('gen-1') || lower.includes('gen1') || lower.includes('generator #1')) {
    return buildGeneratorInspectionData(1, stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('gen-m2') || lower.includes('gen-2') || lower.includes('gen2') || lower.includes('generator #2') || lower.includes('chp gen #2')) {
    return buildGeneratorInspectionData(2, stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('gen-m3') || lower.includes('gen-3') || lower.includes('gen3') || lower.includes('generator #3')) {
    return buildGeneratorInspectionData(3, stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('gen-m4') || lower.includes('gen-4') || lower.includes('gen4') || lower.includes('generator #4')) {
    return buildGeneratorInspectionData(4, stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('gen-b1') || lower.includes('chp gen #1')) {
    return buildGeneratorInspectionData(1, stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('gen-b2')) {
    return buildGeneratorInspectionData(2, stationId, energy, env, equipment, scenario);
  }

  // Battery matching
  if (lower.includes('battery') || lower.includes('ess') || lower.includes('eq-b3')) {
    return buildBatteryInspectionData(stationId, energy, equipment, scenario);
  }

  // Fuel tank matching
  if (lower.includes('fuel')) {
    return buildFuelTankInspectionData(assetId, stationId, energy, env, scenario);
  }

  // Water system matching
  if (lower.includes('water') || lower.includes('priyadarshini') || lower.includes('eq-m4') || lower.includes('eq-b4')) {
    return buildWaterSystemInspectionData(stationId, equipment, scenario);
  }

  // Comms tower matching
  if (lower.includes('comms') || lower.includes('tower') || lower.includes('eq-m5')) {
    return buildCommsInspectionData(stationId, equipment, scenario);
  }

  // Wind turbine matching
  if (lower.includes('wind') || lower.includes('turbine')) {
    return buildWindTurbineInspectionData(assetId, stationId, energy, env, scenario);
  }

  // Main station / buildings
  if (lower.includes('main') || lower.includes('maitri main') || lower.includes('bharati main')) {
    return buildBuildingInspectionData(assetId, stationId === 'maitri' ? 'Maitri Main Station Complex' : 'Bharati Main Station Facility', stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('research') || lower.includes('lab')) {
    return buildBuildingInspectionData(assetId, 'Polar Atmospheric & Biological Research Lab', stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('accomm')) {
    return buildBuildingInspectionData(assetId, 'Crew Habitation & Life Support Block', stationId, energy, env, equipment, scenario);
  }
  if (lower.includes('warehouse') || lower.includes('logistics')) {
    return buildBuildingInspectionData(assetId, 'Station Stores & Cryo-Logistics Warehouse', stationId, energy, env, equipment, scenario);
  }

  // Fallback generic generator/asset
  return buildGeneratorInspectionData(1, stationId, energy, env, equipment, scenario);
}
