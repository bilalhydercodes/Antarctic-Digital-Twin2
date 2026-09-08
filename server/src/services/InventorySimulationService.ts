import { InventoryItem, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class InventorySimulationService {
  public static updateInventory(stationId: StationId, speedMultiplier: number): InventoryItem[] {
    const invList = inMemoryDb.inventory.get(stationId);
    const energy = inMemoryDb.energy.get(stationId);
    const station = inMemoryDb.stations.get(stationId);

    if (!invList || !energy || !station) return [];

    const crewCount = station.crewCount;

    invList.forEach(item => {
      if (item.category === 'FUEL') {
        // Sync fuel inventory with energy simulation fuel storage
        item.quantity = energy.fuelStorage.currentFuelLiters;
        item.dailyConsumption = Math.round(energy.fuelStorage.consumptionRateLitersPerHour * 24);
        item.daysRemaining = Math.round(energy.fuelStorage.estimatedDaysRemaining);
      } else if (item.category === 'FOOD') {
        // Daily food burn: ~1.2 kg per person per day
        item.dailyConsumption = Number((crewCount * 1.2).toFixed(1));
        const foodBurn = (item.dailyConsumption / 86400) * 3 * speedMultiplier * 10;
        item.quantity = Math.max(0, Number((item.quantity - foodBurn).toFixed(1)));
        item.daysRemaining = Math.round(item.quantity / item.dailyConsumption);
      } else if (item.category === 'WATER') {
        // Daily drinking water: ~16 L per person per day
        item.dailyConsumption = Math.round(crewCount * 16);
        const waterBurn = (item.dailyConsumption / 86400) * 3 * speedMultiplier * 10;
        item.quantity = Math.max(0, Math.round(item.quantity - waterBurn));
        item.daysRemaining = Math.round(item.quantity / item.dailyConsumption);
      }

      // Update status thresholds
      if (item.daysRemaining < 7) {
        item.status = 'EMERGENCY';
      } else if (item.daysRemaining < 15) {
        item.status = 'CRITICAL';
      } else if (item.daysRemaining < 30) {
        item.status = 'LOW';
      } else {
        item.status = 'NORMAL';
      }
    });

    return invList;
  }
}
