import { StationId, StatisticalAnomalyRecord, AlertSeverity } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class AnomalyDetectionService {
  private static ioServer: any = null;

  public static setSocketServer(io: any) {
    this.ioServer = io;
  }

  public static detectAnomalies(stationId?: StationId): StatisticalAnomalyRecord[] {
    const stations: StationId[] = stationId ? [stationId] : ['maitri', 'bharati'];
    const detected: StatisticalAnomalyRecord[] = [];

    for (const stId of stations) {
      const history = inMemoryDb.historicalTelemetry.filter(h => h.stationId === stId);
      if (history.length < 5) continue;

      const recentHistory = history.slice(-30);
      const temps = recentHistory.map(h => h.temp);
      const winds = recentHistory.map(h => h.wind);
      const loads = recentHistory.map(h => h.powerCon);

      const latestTemp = temps[temps.length - 1];
      const latestWind = winds[winds.length - 1];
      const latestLoad = loads[loads.length - 1];

      // 1. STATISTICAL TEMPERATURE Z-SCORE
      const meanTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
      const stdTemp = Math.sqrt(temps.map(x => Math.pow(x - meanTemp, 2)).reduce((a, b) => a + b, 0) / temps.length) || 1.0;
      const zTemp = Math.abs((latestTemp - meanTemp) / stdTemp);

      if (zTemp > 2.2 || latestTemp < -42.0) {
        const score = Number(Math.min(0.99, 0.5 + zTemp * 0.15).toFixed(2));
        const anomaly: StatisticalAnomalyRecord = {
          id: `anom-${stId}-temp-${Date.now()}`,
          stationId: stId,
          sensorId: `AWS-${stId.toUpperCase()}-01`,
          parameterName: 'Air Temperature',
          observedValue: latestTemp,
          expectedRange: { min: Number((meanTemp - 2 * stdTemp).toFixed(1)), max: Number((meanTemp + 2 * stdTemp).toFixed(1)) },
          rollingMean: Number(meanTemp.toFixed(1)),
          rollingStdDev: Number(stdTemp.toFixed(2)),
          zScore: Number(zTemp.toFixed(2)),
          anomalyScore: score,
          severity: score > 0.85 ? 'CRITICAL' : 'WARNING',
          timestamp: new Date().toISOString(),
          reason: `Temperature reading (${latestTemp}°C) deviates by ${zTemp.toFixed(1)}σ from the 30-cycle rolling baseline (${meanTemp.toFixed(1)}°C).`,
          method: 'Z_SCORE'
        };
        detected.push(anomaly);
      }

      // 2. WIND RATE OF CHANGE / PEAK SURGE
      const meanWind = winds.reduce((a, b) => a + b, 0) / winds.length;
      if (latestWind > 70.0 || (latestWind - meanWind) > 30.0) {
        const anomaly: StatisticalAnomalyRecord = {
          id: `anom-${stId}-wind-${Date.now()}`,
          stationId: stId,
          sensorId: `AWS-${stId.toUpperCase()}-01`,
          parameterName: 'Wind Velocity',
          observedValue: latestWind,
          expectedRange: { min: 10, max: 60 },
          rollingMean: Number(meanWind.toFixed(1)),
          rollingStdDev: 8.5,
          zScore: Number(((latestWind - meanWind) / 8.5).toFixed(2)),
          anomalyScore: 0.92,
          severity: 'CRITICAL',
          timestamp: new Date().toISOString(),
          reason: `Katabatic wind surge (${latestWind} km/h) exceeds safe envelope and baseline average by +${(latestWind - meanWind).toFixed(1)} km/h.`,
          method: 'RATE_OF_CHANGE'
        };
        detected.push(anomaly);
      }
    }

    // Save recent anomalies
    if (detected.length > 0) {
      inMemoryDb.anomalies.unshift(...detected);
      if (inMemoryDb.anomalies.length > 50) {
        inMemoryDb.anomalies = inMemoryDb.anomalies.slice(0, 50);
      }

      if (this.ioServer) {
        this.ioServer.emit('anomaliesDetected', detected);
      }
    }

    return inMemoryDb.anomalies;
  }

  public static getRecentAnomalies(stationId?: StationId): StatisticalAnomalyRecord[] {
    if (stationId) {
      return inMemoryDb.anomalies.filter(a => a.stationId === stationId);
    }
    return inMemoryDb.anomalies;
  }
}
