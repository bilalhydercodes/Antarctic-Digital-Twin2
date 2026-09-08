import { GeneratorTelemetry, EquipmentItem, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class EquipmentHealthService {
  public static updateEquipmentStates(stationId: StationId, speedMultiplier: number): void {
    const energy = inMemoryDb.energy.get(stationId);
    const eqList = inMemoryDb.equipment.get(stationId);

    if (!energy || !eqList) return;

    // Update Generator telemetry and equipment states
    energy.generators.forEach(gen => {
      if (gen.status === 'OFFLINE') return;

      // Update runtime hours
      gen.runtimeHours += (3 / 3600) * speedMultiplier;

      // Dynamic temperature physics based on load
      if (gen.loadPercent > 85) {
        gen.temperature = Math.min(100, Number((gen.temperature + 0.4 * speedMultiplier).toFixed(1)));
        gen.healthPercent = Math.max(10, Number((gen.healthPercent - 0.2 * speedMultiplier).toFixed(1)));
      } else if (gen.loadPercent > 0) {
        const targetTemp = 64 + (gen.loadPercent * 0.12);
        const diff = targetTemp - gen.temperature;
        gen.temperature = Number((gen.temperature + diff * 0.05).toFixed(1));
      }

      // State machine logic
      if (gen.temperature >= 98 || gen.healthPercent <= 15) {
        gen.status = 'CRITICAL'; // Will trigger automated failover
        gen.failureProbability = 99.0;
      } else if (gen.temperature >= 88 || gen.healthPercent <= 50) {
        gen.status = 'CRITICAL';
        gen.failureProbability = Number((Math.min(95, 50 + (gen.temperature - 88) * 4)).toFixed(1));
      } else if (gen.temperature >= 76 || gen.healthPercent <= 80) {
        gen.status = 'WARNING';
        gen.failureProbability = Number((Math.min(50, 15 + (gen.temperature - 76) * 2.5)).toFixed(1));
      } else {
        gen.status = 'ONLINE';
        gen.failureProbability = Number((Math.max(1.5, 4.0 + (gen.temperature - 64) * 0.3)).toFixed(1));
      }

      // Sync matching equipment item
      const eqItem = eqList.find(e => e.id.includes(gen.id) || e.name.toLowerCase().includes(gen.name.toLowerCase()));
      if (eqItem) {
        eqItem.temperature = gen.temperature;
        eqItem.healthPercent = gen.healthPercent;
        eqItem.failureProbability = gen.failureProbability;
        const genStatusStr = gen.status as string;
        eqItem.status = genStatusStr === 'OFFLINE' ? 'OFFLINE' : gen.status === 'CRITICAL' ? 'CRITICAL' : gen.status === 'WARNING' ? 'WARNING' : 'HEALTHY';
        eqItem.vibration = genStatusStr === 'OFFLINE' ? 0 : Number((1.2 + (gen.loadPercent * 0.03)).toFixed(1));
        
        if (gen.status === 'WARNING' || gen.status === 'CRITICAL') {
          eqItem.simulatedPrediction = `Thermal stress detected. Cooling loop flow degraded by ${Math.round(gen.failureProbability)}%.`;
          eqItem.recommendedAction = 'Inspect primary coolant pump and rebalance station load to Generator #1.';
        } else {
          eqItem.simulatedPrediction = 'Nominal operational envelope.';
          eqItem.recommendedAction = 'Routine maintenance scheduled as per NCPOR log.';
        }
      }
    });
  }
}
