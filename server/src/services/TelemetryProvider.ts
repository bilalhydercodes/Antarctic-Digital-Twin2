import { EnvironmentData, EnergyData, EquipmentItem, InventoryItem, StationId } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export interface ITelemetryProvider {
  providerName: string;
  isSimulated: boolean;
  getEnvironmentData(stationId: StationId): Promise<EnvironmentData>;
  getEnergyData(stationId: StationId): Promise<EnergyData>;
  getEquipmentData(stationId: StationId): Promise<EquipmentItem[]>;
  getInventoryData(stationId: StationId): Promise<InventoryItem[]>;
}

export class SimulationTelemetryProvider implements ITelemetryProvider {
  public providerName = "NCPOR Physics Simulation Engine v2.4";
  public isSimulated = true;

  async getEnvironmentData(stationId: StationId): Promise<EnvironmentData> {
    const data = inMemoryDb.environment.get(stationId);
    if (!data) throw new Error(`Environment telemetry for ${stationId} unavailable`);
    return data;
  }

  async getEnergyData(stationId: StationId): Promise<EnergyData> {
    const data = inMemoryDb.energy.get(stationId);
    if (!data) throw new Error(`Energy telemetry for ${stationId} unavailable`);
    return data;
  }

  async getEquipmentData(stationId: StationId): Promise<EquipmentItem[]> {
    return inMemoryDb.equipment.get(stationId) || [];
  }

  async getInventoryData(stationId: StationId): Promise<InventoryItem[]> {
    return inMemoryDb.inventory.get(stationId) || [];
  }
}

// Active singleton instance (can be swapped for MQTT/IoT Telemetry Provider later)
export const telemetryProvider = new SimulationTelemetryProvider();
