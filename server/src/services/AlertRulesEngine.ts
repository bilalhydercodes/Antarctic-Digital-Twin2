import { StationId, StationAlert, AlertSeverity } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class AlertRulesEngine {
  private static ioServer: any = null;

  public static setSocketServer(io: any) {
    this.ioServer = io;
  }

  public static evaluateTelemetry(stationId: StationId, category: string, data: Record<string, any>): StationAlert[] {
    const generatedAlerts: StationAlert[] = [];

    // 1. WEATHER / AWS THRESHOLD CHECKS
    if (category === 'AWS' || category === 'ENVIRONMENT') {
      const temp = Number(data.temperature);
      const wind = Number(data.windSpeed);

      if (!isNaN(temp) && temp < -38.0) {
        generatedAlerts.push(this.createAlert({
          stationId,
          sensorId: data.sensorId || 'AWS-001',
          severity: 'CRITICAL',
          category: 'ENVIRONMENT',
          title: '🥶 EXTREME COLD AIR TEMPERATURE WARNING',
          component: 'AWS Air Temperature Sensor',
          currentValue: `${temp.toFixed(1)} °C`,
          thresholdValue: '-38.0 °C',
          description: `Severe ambient drop to ${temp.toFixed(1)}°C detected at ${stationId.toUpperCase()}. Risk of pipe freeze and hydronic fluid viscosity surge.`,
          suggestedAction: 'Activate auxiliary trace heating on water intake lines and increase boiler setpoint to +75°C.'
        }));
      }

      if (!isNaN(wind) && wind > 75.0) {
        generatedAlerts.push(this.createAlert({
          stationId,
          sensorId: data.sensorId || 'AWS-001',
          severity: 'CRITICAL',
          category: 'ENVIRONMENT',
          title: '🚨 KATABATIC BLIZZARD WIND SPEED SURGE',
          component: 'AWS Anemometer Suite',
          currentValue: `${wind.toFixed(1)} km/h`,
          thresholdValue: '75.0 km/h',
          description: `Gale force katabatic winds of ${wind.toFixed(1)} km/h logged at ${stationId.toUpperCase()}.`,
          suggestedAction: 'Stow solar panels immediately, secure outdoor container latches, and mandate EVA restriction.'
        }));
      }
    }

    // 2. GEOMAGNETIC DISTURBANCE CHECKS
    if (category === 'GEOMAGNETIC') {
      const ppm = Number(data.ppmTotalIntensity);
      if (!isNaN(ppm) && (ppm > 48000 || ppm < 40000)) {
        generatedAlerts.push(this.createAlert({
          stationId,
          severity: 'WARNING',
          category: 'GEOMAGNETIC',
          title: '🧲 GEOMAGNETIC FIELD ANOMALY DETECTED',
          component: 'Proton Precession Magnetometer (PPM)',
          currentValue: `${ppm.toFixed(1)} nT`,
          thresholdValue: '40,000 - 48,000 nT',
          description: `Magnetic field intensity reading of ${ppm.toFixed(1)} nT indicates severe ionospheric disturbance or solar storm.`,
          suggestedAction: 'Verify VLF receiver and satellite comms gain control; notify ionospheric research team.'
        }));
      }
    }

    // 3. SEISMIC ACTIVITY CHECKS (MAITRI)
    if (category === 'SEISMIC') {
      const mag = Number(data.magnitude);
      if (!isNaN(mag) && mag >= 3.0) {
        generatedAlerts.push(this.createAlert({
          stationId: 'maitri',
          sensorId: 'SEIS-MTR-BB01',
          severity: 'CRITICAL',
          category: 'SEISMIC',
          title: '🌋 SEISMIC EVENT DETECTED (MAGNITUDE ≥ 3.0)',
          component: 'Broadband Seismometer BB01',
          currentValue: `M ${mag.toFixed(1)}`,
          thresholdValue: 'M 3.0',
          description: `Local seismic trigger event of Magnitude ${mag.toFixed(1)} detected near Schirmacher Oasis.`,
          suggestedAction: 'Inspect Priyadarshini Lake dam structure and fuel storage tank foundations for structural displacement.'
        }));
      }
    }

    // 4. POWER GENERATION & GENERATOR THERMAL CHECKS
    if (category === 'ENERGY' || category === 'GENERATOR') {
      const genTemp = Number(data.temperature);
      const genLoad = Number(data.loadPercent);

      if (!isNaN(genTemp) && genTemp >= 88.0) {
        generatedAlerts.push(this.createAlert({
          stationId,
          equipmentId: data.id || 'GEN-01',
          severity: 'CRITICAL',
          category: 'ENERGY',
          title: '🔥 GENERATOR THERMAL OVERLOAD WARNING',
          component: data.name || 'Diesel Generator Unit',
          currentValue: `${genTemp.toFixed(1)} °C`,
          thresholdValue: '88.0 °C',
          description: `Generator winding temperature peaked at ${genTemp.toFixed(1)}°C under ${genLoad || 80}% electrical load.`,
          suggestedAction: 'Initiate automatic switchgear failover to standby generator and inspect coolant loop radiator.'
        }));
      }
    }

    // 5. PUMP HOUSE & WATER SUPPLY FREEZE RISK
    if (category === 'WATER' || category === 'PUMP') {
      const waterTemp = Number(data.temperature);
      if (!isNaN(waterTemp) && waterTemp <= 1.0) {
        generatedAlerts.push(this.createAlert({
          stationId,
          equipmentId: data.equipmentId || 'WATER-PUMP-01',
          severity: 'CRITICAL',
          category: 'WATER',
          title: '❄️ INTAKE PUMP FREEZING RISK DETECTED',
          component: stationId === 'maitri' ? 'Priyadarshini Lake Water Pump' : 'Seawater Intake Pump',
          currentValue: `${waterTemp.toFixed(1)} °C`,
          thresholdValue: '1.0 °C',
          description: `Water pump intake fluid temperature dropped to ${waterTemp.toFixed(1)}°C. High risk of ice slush blockage.`,
          suggestedAction: 'Engage secondary thermal anti-freeze recirculator and flush intake manifold.'
        }));
      }
    }

    return generatedAlerts;
  }

  private static createAlert(params: {
    stationId: StationId;
    sensorId?: string;
    equipmentId?: string;
    severity: AlertSeverity;
    category: StationAlert['category'];
    title: string;
    component: string;
    currentValue?: string;
    thresholdValue?: string;
    description: string;
    suggestedAction: string;
  }): StationAlert {
    const alert: StationAlert = {
      id: `alt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      stationId: params.stationId,
      sensorId: params.sensorId,
      equipmentId: params.equipmentId,
      severity: params.severity,
      category: params.category,
      title: params.title,
      component: params.component,
      currentValue: params.currentValue,
      thresholdValue: params.thresholdValue,
      description: params.description,
      suggestedAction: params.suggestedAction,
      acknowledged: false,
      resolved: false
    };

    // Save to database
    inMemoryDb.alerts.unshift(alert);
    if (inMemoryDb.alerts.length > 60) {
      inMemoryDb.alerts.pop();
    }

    // Broadcast over Socket.IO
    if (this.ioServer) {
      this.ioServer.emit('alertCreated', alert);
    }

    return alert;
  }
}
