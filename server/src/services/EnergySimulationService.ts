import { EnergyData, StationId, EnvironmentData } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class EnergySimulationService {
  public static updateEnergyGrid(stationId: StationId, env: EnvironmentData, speedMultiplier: number): EnergyData {
    const energy = inMemoryDb.energy.get(stationId);
    if (!energy) throw new Error(`Energy telemetry for ${stationId} missing`);

    // -------------------------------------------------------------
    // 1. HEATING DEMAND DEPENDENCY GRAPH
    // -------------------------------------------------------------
    // Formula: Below -20°C, heating demand increases dynamically
    const baseHeatingKw = stationId === 'maitri' ? 140 : 150;
    const coldDelta = Math.max(0, -20 - env.temperature);
    const dynamicHeatingKw = Math.round(baseHeatingKw + (coldDelta * 4.8));
    energy.powerGrid.heatingLoadKw = dynamicHeatingKw;

    // Total Power Consumption
    const totalConsumptionKw = dynamicHeatingKw + energy.powerGrid.criticalLoadKw + energy.powerGrid.nonCriticalLoadKw;
    energy.powerGrid.consumptionKw = totalConsumptionKw;

    // Renewable Generation Physics
    const solarKw = Math.max(0, Math.round((env.solarRadiation / 500) * (stationId === 'maitri' ? 45 : 65)));
    const windKw = env.windSpeed > 10 && env.windSpeed < 90 ? Math.round(env.windSpeed * 1.1) : 0;
    energy.powerGrid.solarGenerationKw = solarKw;
    energy.powerGrid.windGenerationKw = windKw;

    // -------------------------------------------------------------
    // 2. GENERATOR POWER CALCULATION
    // -------------------------------------------------------------
    const activeGenPowerKw = energy.generators
      .filter(g => g.status === 'ONLINE' || g.status === 'WARNING' || g.status === 'CRITICAL')
      .reduce((sum, g) => sum + g.powerKw, 0);

    energy.powerGrid.generatorGenerationKw = activeGenPowerKw;
    
    const totalGenerationKw = activeGenPowerKw + solarKw + windKw;
    energy.powerGrid.generationKw = totalGenerationKw;

    if (totalGenerationKw > 0) {
      energy.powerGrid.renewableContributionPercent = Number((((solarKw + windKw) / totalGenerationKw) * 100).toFixed(1));
    } else {
      energy.powerGrid.renewableContributionPercent = 0;
    }

    // -------------------------------------------------------------
    // 3. REAL BATTERY MODEL
    // -------------------------------------------------------------
    const powerBalanceKw = totalGenerationKw - totalConsumptionKw;
    const battery = energy.battery;

    if (powerBalanceKw < 0) {
      // DEFICIT: Battery Discharges
      const deficitKw = Math.abs(powerBalanceKw);
      battery.current = -Math.round(deficitKw * 2.1);
      battery.chargeDischargeRateKw = -deficitKw;

      // Drain SOC state continuously
      const socDrain = (deficitKw / battery.capacityKwh) * (speedMultiplier * 0.04);
      battery.stateOfCharge = Math.max(0, Number((battery.stateOfCharge - socDrain).toFixed(1)));
      
      const usableKwh = (battery.stateOfCharge / 100) * battery.capacityKwh;
      battery.estimatedBackupHours = Number((usableKwh / Math.max(1, deficitKw)).toFixed(1));

      if (battery.stateOfCharge < 15) {
        battery.status = 'CRITICAL';
      } else if (battery.stateOfCharge < 30) {
        battery.status = 'WARNING';
      } else {
        battery.status = 'DISCHARGING_FAST';
      }
    } else {
      // SURPLUS: Battery Charges
      const surplusKw = powerBalanceKw;
      battery.current = Math.round(surplusKw * 1.7);
      battery.chargeDischargeRateKw = surplusKw;

      const socGain = (surplusKw / battery.capacityKwh) * (speedMultiplier * 0.03);
      battery.stateOfCharge = Math.min(100, Number((battery.stateOfCharge + socGain).toFixed(1)));
      
      const usableKwh = (battery.stateOfCharge / 100) * battery.capacityKwh;
      battery.estimatedBackupHours = Number((usableKwh / 40).toFixed(1));
      battery.status = 'HEALTHY';
    }

    // -------------------------------------------------------------
    // 4. REAL FUEL MODEL (Specific consumption: 0.23 L/kWh)
    // -------------------------------------------------------------
    const fuelHourlyBurnLiters = Number((activeGenPowerKw * 0.23).toFixed(1));
    energy.fuelStorage.consumptionRateLitersPerHour = fuelHourlyBurnLiters;

    // Deduct fuel from storage based on actual active generator load
    const fuelBurnThisTick = (fuelHourlyBurnLiters / 3600) * 3 * speedMultiplier * 40;
    energy.fuelStorage.currentFuelLiters = Math.max(0, Math.round(energy.fuelStorage.currentFuelLiters - fuelBurnThisTick));
    energy.fuelStorage.fuelPercent = Number(((energy.fuelStorage.currentFuelLiters / energy.fuelStorage.totalCapacityLiters) * 100).toFixed(1));

    const dailyConsumptionLiters = fuelHourlyBurnLiters * 24;
    energy.fuelStorage.estimatedDaysRemaining = Number((energy.fuelStorage.currentFuelLiters / Math.max(1, dailyConsumptionLiters)).toFixed(1));

    if (energy.fuelStorage.estimatedDaysRemaining < 15) {
      energy.fuelStorage.refillStatus = 'CRITICAL';
    } else if (energy.fuelStorage.estimatedDaysRemaining < 30) {
      energy.fuelStorage.refillStatus = 'LOW';
    } else {
      energy.fuelStorage.refillStatus = 'NORMAL';
    }

    energy.timestamp = new Date().toISOString();
    return energy;
  }
}
