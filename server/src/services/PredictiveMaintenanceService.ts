import { GeneratorTelemetry, EquipmentItem, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';
import { systemLogger } from '../utils/logger.js';

export class PredictiveMaintenanceService {
  public static evaluatePredictions(stationId: StationId): void {
    const energy = inMemoryDb.energy.get(stationId);
    const eqList = inMemoryDb.equipment.get(stationId);

    if (!energy || !eqList) return;

    energy.generators.forEach(gen => {
      if (gen.status === 'OFFLINE') return;

      // Predictive failure score equation
      const tempFactor = Math.max(0, (gen.temperature - 70) * 2.2);
      const loadFactor = Math.max(0, (gen.loadPercent - 75) * 0.8);
      const runtimeFactor = (gen.runtimeHours / 10000) * 5;

      const riskScore = Math.min(99.0, Number((tempFactor + loadFactor + runtimeFactor + (100 - gen.healthPercent) * 0.5).toFixed(1)));
      gen.failureProbability = riskScore;

      if (riskScore > 70) {
        systemLogger.log(
          'PREDICTION_GENERATED',
          stationId,
          `High Failure Risk predicted for ${gen.name}: ${riskScore}%`,
          { genId: gen.id, temp: gen.temperature, riskScore }
        );
      }
    });
  }
}
