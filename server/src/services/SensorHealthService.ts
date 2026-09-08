import { SensorMetadata, SensorHealthRecord, StationId, SensorQualityFlag } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class SensorHealthService {
  private static ioServer: any = null;

  public static setSocketServer(io: any) {
    this.ioServer = io;
  }

  public static initializeSensorRegistry(): void {
    const now = new Date().toISOString();

    const initialSensors: SensorMetadata[] = [
      // MAITRI SCIENTIFIC & UTILITY SENSORS
      {
        sensorId: 'AWS-MTR-01',
        stationId: 'maitri',
        name: 'Maitri Automatic Weather Station (AWS)',
        sensorType: 'AWS',
        location: 'Meteorological Mast Alpha',
        measurement: 'Air Temperature & Wind Suite',
        unit: '°C / km/h',
        currentValue: -32.4,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -65.0,
        expectedMax: 10.0,
        priority: 'P1_CRITICAL_INFRASTRUCTURE',
        source: 'SIMULATED'
      },
      {
        sensorId: 'PPM-MTR-01',
        stationId: 'maitri',
        name: 'Proton Precession Magnetometer (PPM)',
        sensorType: 'PPM',
        location: 'Geomagnetic Non-Magnetic Hut #1',
        measurement: 'Total Magnetic Field Intensity',
        unit: 'nT',
        currentValue: 43250.4,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: 40000.0,
        expectedMax: 48000.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'SIMULATED'
      },
      {
        sensorId: 'DFM-MTR-01',
        stationId: 'maitri',
        name: 'Digital Fluxgate Magnetometer (DFM)',
        sensorType: 'DFM',
        location: 'Geomagnetic Non-Magnetic Hut #2',
        measurement: '3-Component Vector Magnetic Field (X/Y/Z)',
        unit: 'nT',
        currentValue: 18420.2,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -45000.0,
        expectedMax: 25000.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'SIMULATED'
      },
      {
        sensorId: 'ICM-MTR-01',
        stationId: 'maitri',
        name: 'Induction Coil Magnetometer (ICM)',
        sensorType: 'ICM',
        location: 'Geomagnetic Sensor Field',
        measurement: 'Pulsation Dynamic Magnetic Field (X/Y/Z)',
        unit: 'nT/s',
        currentValue: 0.12,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -5.0,
        expectedMax: 5.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'SIMULATED'
      },
      {
        sensorId: 'DIM-MTR-01',
        stationId: 'maitri',
        name: 'Declination-Inclination Magnetometer (DIM)',
        sensorType: 'DIM',
        location: 'Absolute Geomagnetic Pillar',
        measurement: 'Declination & Inclination Angles',
        unit: 'deg',
        currentValue: -18.4,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -90.0,
        expectedMax: 90.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'DOCUMENTED'
      },
      {
        sensorId: 'SEIS-MTR-BB01',
        stationId: 'maitri',
        name: 'Broadband Seismometer BB01',
        sensorType: 'SEISMOMETER',
        location: 'Underground Bedrock Vault',
        measurement: '3-Channel Ground Motion Waveform',
        unit: 'mm/s',
        currentValue: 0.008,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -10.0,
        expectedMax: 10.0,
        priority: 'P1_CRITICAL_INFRASTRUCTURE',
        source: 'SIMULATED'
      },
      {
        sensorId: 'RIO-MTR-01',
        stationId: 'maitri',
        name: 'Riometer Ionospheric Sensor',
        sensorType: 'RIOMETER',
        location: 'Ionospheric Antenna Array',
        measurement: 'Cosmic Noise Absorption',
        unit: 'dB',
        currentValue: 0.38,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: 0.0,
        expectedMax: 10.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'DOCUMENTED'
      },
      {
        sensorId: 'EFM-MTR-01',
        stationId: 'maitri',
        name: 'Electric Field Mill (EFM)',
        sensorType: 'EFM',
        location: 'Atmospheric Research Mast',
        measurement: 'Atmospheric Electric Potential Gradient',
        unit: 'kV/m',
        currentValue: 1.45,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -10.0,
        expectedMax: 15.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'SIMULATED'
      },
      {
        sensorId: 'VLF-MTR-01',
        stationId: 'maitri',
        name: 'Very Low Frequency (VLF) Receiver',
        sensorType: 'VLF',
        location: 'Radio Astronomy Mast',
        measurement: 'Sub-Ionospheric VLF Signal Strength',
        unit: 'dB',
        currentValue: 64.2,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: 20.0,
        expectedMax: 100.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'DOCUMENTED'
      },
      {
        sensorId: 'PUMP-MTR-01',
        stationId: 'maitri',
        name: 'Priyadarshini Lake Pump Intake Sensor',
        sensorType: 'UTILITY',
        location: 'Priyadarshini Lake Pump House',
        measurement: 'Intake Water Fluid Temperature & Flow',
        unit: '°C',
        currentValue: 3.8,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'EXTERNAL_GRID',
        commStatus: 'ONLINE',
        expectedMin: 1.0,
        expectedMax: 15.0,
        priority: 'P0_LIFE_SAFETY',
        source: 'DOCUMENTED'
      },

      // BHARATI SCIENTIFIC & UTILITY SENSORS
      {
        sensorId: 'AWS-BHR-01',
        stationId: 'bharati',
        name: 'Bharati Automatic Weather Station',
        sensorType: 'AWS',
        location: 'Larsemann Meteorological Tower',
        measurement: 'Air Temperature & Marine Wind',
        unit: '°C / km/h',
        currentValue: -28.6,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -60.0,
        expectedMax: 15.0,
        priority: 'P1_CRITICAL_INFRASTRUCTURE',
        source: 'SIMULATED'
      },
      {
        sensorId: 'PPM-BHR-01',
        stationId: 'bharati',
        name: 'Bharati Proton Magnetometer',
        sensorType: 'PPM',
        location: 'Prydz Bay Magnetic Observation Hut',
        measurement: 'Total Magnetic Field Intensity',
        unit: 'nT',
        currentValue: 44120.8,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: 40000.0,
        expectedMax: 48000.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'SIMULATED'
      },
      {
        sensorId: 'DFM-BHR-01',
        stationId: 'bharati',
        name: 'Bharati Digital Fluxgate Magnetometer',
        sensorType: 'DFM',
        location: 'Magnetic Sensor Enclosure',
        measurement: 'Vector Magnetic Field (X/Y/Z)',
        unit: 'nT',
        currentValue: 19100.5,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -45000.0,
        expectedMax: 25000.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'SIMULATED'
      },
      {
        sensorId: 'GPS-BHR-01',
        stationId: 'bharati',
        name: 'Bharati Precision GPS / GNSS Timing System',
        sensorType: 'GPS',
        location: 'Geodetic Roof Antenna',
        measurement: 'Atomic Clock Synchronization & Crustal Drift',
        unit: 'ns / mm',
        currentValue: 1.0,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'EXTERNAL_GRID',
        commStatus: 'ONLINE',
        expectedMin: 0.0,
        expectedMax: 100.0,
        priority: 'P1_CRITICAL_INFRASTRUCTURE',
        source: 'DOCUMENTED'
      },
      {
        sensorId: 'EFM-BHR-01',
        stationId: 'bharati',
        name: 'Bharati Electric Field Mill',
        sensorType: 'EFM',
        location: 'Coastal Science Platform',
        measurement: 'Atmospheric Electric Potential Gradient',
        unit: 'kV/m',
        currentValue: 1.22,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'NORMAL',
        commStatus: 'ONLINE',
        expectedMin: -10.0,
        expectedMax: 15.0,
        priority: 'P3_SCIENTIFIC_DATA',
        source: 'SIMULATED'
      },
      {
        sensorId: 'SEAPUMP-BHR-01',
        stationId: 'bharati',
        name: 'Seawater Intake Pump & Thermal De-icer',
        sensorType: 'UTILITY',
        location: 'Prydz Bay Seawater Intake Pump House',
        measurement: 'Seawater Intake Temperature & Pressure',
        unit: '°C / bar',
        currentValue: 2.4,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'EXTERNAL_GRID',
        commStatus: 'ONLINE',
        expectedMin: 1.0,
        expectedMax: 20.0,
        priority: 'P0_LIFE_SAFETY',
        source: 'DOCUMENTED'
      },
      {
        sensorId: 'CHP-BHR-01',
        stationId: 'bharati',
        name: 'CHP Unit #1 Thermal Exhaust Monitor',
        sensorType: 'UTILITY',
        location: 'Central Co-Gen Powerhouse',
        measurement: 'CHP Thermal Output & Exchanger Temp',
        unit: 'kW / °C',
        currentValue: 78.0,
        timestamp: now,
        quality: 'GOOD',
        calibrationStatus: 'VALID',
        operationalStatus: 'OPERATIONAL',
        batteryStatus: 'EXTERNAL_GRID',
        commStatus: 'ONLINE',
        expectedMin: 40.0,
        expectedMax: 95.0,
        priority: 'P1_CRITICAL_INFRASTRUCTURE',
        source: 'DOCUMENTED'
      }
    ];

    initialSensors.forEach(s => {
      inMemoryDb.sensors.set(s.sensorId, s);
      inMemoryDb.sensorHealth.set(s.sensorId, {
        sensorId: s.sensorId,
        stationId: s.stationId,
        healthPercent: 98,
        freshnessSeconds: 1,
        missingPacketsCount: 0,
        abnormalReadingsCount: 0,
        commFailuresCount: 0,
        isStuck: false,
        isNoisy: false,
        consecutiveIdenticalCount: 0,
        driftValue: 0,
        noiseRms: 0.02,
        diagnostics: 'Nominal telemetry streaming.',
        lastUpdated: now
      });
    });

    console.log(`📡 SensorHealthService: Registered ${initialSensors.length} documented scientific and utility sensors across Maitri and Bharati.`);
  }

  public static processReading(sensorId: string, value: number): SensorQualityFlag {
    const sensor = inMemoryDb.sensors.get(sensorId);
    const health = inMemoryDb.sensorHealth.get(sensorId);
    if (!sensor || !health) return 'GOOD';

    const now = new Date().toISOString();
    const previousValue = Number(sensor.currentValue);

    sensor.currentValue = value;
    sensor.timestamp = now;
    health.lastUpdated = now;
    health.freshnessSeconds = 0;

    // 1. STUCK SENSOR DETECTOR
    if (Math.abs(value - previousValue) < 0.0001) {
      health.consecutiveIdenticalCount++;
      if (health.consecutiveIdenticalCount >= 5) {
        health.isStuck = true;
        sensor.quality = 'SUSPECT';
        health.healthPercent = Math.max(40, health.healthPercent - 10);
        health.diagnostics = `POSSIBLE STUCK SENSOR: Identical value (${value}) received ${health.consecutiveIdenticalCount} consecutive cycles.`;
      }
    } else {
      health.consecutiveIdenticalCount = 0;
      health.isStuck = false;
    }

    // 2. BOUNDARY & ABNORMAL CHECK
    if (value < sensor.expectedMin || value > sensor.expectedMax) {
      health.abnormalReadingsCount++;
      sensor.quality = 'BAD';
      health.healthPercent = Math.max(20, health.healthPercent - 15);
      health.diagnostics = `ABNORMAL VALUE: ${value} ${sensor.unit} outside operational envelope [${sensor.expectedMin}, ${sensor.expectedMax}].`;
    } else if (!health.isStuck) {
      sensor.quality = 'GOOD';
      health.healthPercent = Math.min(100, health.healthPercent + 1);
      health.diagnostics = 'Nominal telemetry streaming.';
    }

    // Broadcast update
    if (this.ioServer) {
      this.ioServer.emit('sensorHealthUpdated', {
        sensor,
        health
      });
    }

    return sensor.quality;
  }

  public static updateTimeouts(): void {
    const now = Date.now();
    inMemoryDb.sensorHealth.forEach((health, sensorId) => {
      const sensor = inMemoryDb.sensors.get(sensorId);
      if (!sensor) return;

      const lastMs = new Date(health.lastUpdated).getTime();
      const elapsedSec = Math.floor((now - lastMs) / 1000);
      health.freshnessSeconds = elapsedSec;

      // Timeout detection (if no reading for > 15s)
      if (elapsedSec > 15 && sensor.operationalStatus === 'OPERATIONAL') {
        sensor.operationalStatus = 'OFFLINE';
        sensor.quality = 'MISSING';
        health.healthPercent = Math.max(10, health.healthPercent - 25);
        health.commFailuresCount++;
        health.diagnostics = `SENSOR OFFLINE: Telemetry signal timed out (${elapsedSec}s elapsed since last packet).`;

        if (this.ioServer) {
          this.ioServer.emit('sensorHealthUpdated', { sensor, health });
        }
      }
    });
  }

  public static injectFault(sensorId: string, faultType: 'STUCK' | 'NOISY' | 'OFFLINE' | 'RESTORE'): SensorMetadata {
    const sensor = inMemoryDb.sensors.get(sensorId);
    const health = inMemoryDb.sensorHealth.get(sensorId);
    if (!sensor || !health) throw new Error(`Sensor ${sensorId} not found.`);

    if (faultType === 'STUCK') {
      health.isStuck = true;
      health.consecutiveIdenticalCount = 10;
      sensor.quality = 'SUSPECT';
      health.healthPercent = 45;
      health.diagnostics = 'Simulated fault: Stuck sensor output injected by Operator.';
    } else if (faultType === 'OFFLINE') {
      sensor.operationalStatus = 'OFFLINE';
      sensor.quality = 'MISSING';
      health.healthPercent = 0;
      health.commFailuresCount++;
      health.diagnostics = 'Simulated fault: Comm interface severed by Operator.';
    } else if (faultType === 'NOISY') {
      health.isNoisy = true;
      sensor.quality = 'SUSPECT';
      health.healthPercent = 65;
      health.noiseRms = 1.85;
      health.diagnostics = 'Simulated fault: High noise RMS distortion injected.';
    } else if (faultType === 'RESTORE') {
      sensor.operationalStatus = 'OPERATIONAL';
      sensor.quality = 'GOOD';
      health.isStuck = false;
      health.isNoisy = false;
      health.consecutiveIdenticalCount = 0;
      health.healthPercent = 98;
      health.diagnostics = 'Sensor calibration and telemetry restored to nominal.';
    }

    if (this.ioServer) {
      this.ioServer.emit('sensorHealthUpdated', { sensor, health });
    }

    return sensor;
  }
}
