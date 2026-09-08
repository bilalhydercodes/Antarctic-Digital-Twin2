import { StationId, AutomatedResponseLog, StationAlert } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';
import { systemLogger } from '../utils/logger.js';

export class AutomationService {
  private static ioServer: any = null;

  public static setSocketServer(io: any) {
    this.ioServer = io;
  }

  public static handleGeneratorFailover(stationId: StationId): void {
    const energy = inMemoryDb.energy.get(stationId);
    if (!energy) return;

    const gen1 = energy.generators[0];
    const gen2 = energy.generators[1];

    if (!gen2 || gen2.status === 'OFFLINE' || gen2.status === 'FAILED') return;

    // Trigger Failover if Gen 2 temperature exceeds 96°C or health drops below 20%
    if (gen2.temperature >= 96 || gen2.healthPercent <= 20) {
      gen2.status = 'OFFLINE';
      gen2.powerKw = 0;
      gen2.loadPercent = 0;
      gen2.rpm = 0;

      systemLogger.log(
        'GENERATOR_FAILED',
        stationId,
        `Generator #2 Breaker Tripped due to Thermal Overload (${gen2.temperature}°C). Marked OFFLINE.`,
        { genId: gen2.id, temp: gen2.temperature }
      );

      // Transfer critical station load to Generator #1
      if (gen1) {
        gen1.status = 'ONLINE';
        const netDemandKw = energy.powerGrid.consumptionKw - (energy.powerGrid.solarGenerationKw + energy.powerGrid.windGenerationKw);
        gen1.powerKw = Math.min(250, netDemandKw);
        gen1.loadPercent = Math.min(100, Math.round((gen1.powerKw / 250) * 100));
        gen1.temperature = Math.min(94, gen1.temperature + 14);

        systemLogger.log(
          'LOAD_TRANSFERRED',
          stationId,
          `Critical load (${energy.powerGrid.criticalLoadKw} kW) transferred to Generator #1 (Load: ${gen1.loadPercent}%).`,
          { gen1Load: gen1.loadPercent }
        );
      }

      // Battery support buffer
      if (energy.powerGrid.generationKw < energy.powerGrid.consumptionKw) {
        energy.battery.status = 'DISCHARGING_FAST';
        systemLogger.log(
          'BATTERY_DISCHARGE_STARTED',
          stationId,
          `Battery ESS engaged to buffer ${energy.powerGrid.consumptionKw - energy.powerGrid.generationKw} kW deficit.`,
          { soc: energy.battery.stateOfCharge }
        );
      }

      // Log Automated Response Action
      const autoLog: AutomatedResponseLog = {
        id: `auto-${Date.now()}`,
        stationId,
        timestamp: new Date().toISOString(),
        triggerEvent: `Generator #2 Overheated (${gen2.temperature}°C)`,
        actionExecuted: 'AUTOMATED CRITICAL LOAD TRANSFER EXECUTED',
        details: `Tripped Generator #2, shifted ${energy.powerGrid.criticalLoadKw}kW load to Generator #1. Engaged battery storage buffer.`,
        systemStateAfter: `Generator #1 at ${gen1?.loadPercent || 92}% Load, Battery Supporting`
      };

      inMemoryDb.automatedLogs.unshift(autoLog);

      // Create System Alert
      const alert: StationAlert = {
        id: `alt-${Date.now()}-failover`,
        stationId,
        timestamp: new Date().toISOString(),
        severity: 'EMERGENCY',
        category: 'AUTOMATION',
        title: '🚨 AUTOMATED RESPONSE EXECUTED',
        component: 'Station Power Switchgear',
        description: `Generator #2 overheated and tripped. Critical load of ${energy.powerGrid.criticalLoadKw}kW was automatically transferred to Generator #1.`,
        suggestedAction: 'Inspect Generator #2 cooling system and monitor Generator #1 thermal load.',
        acknowledged: false,
        resolved: false
      };

      inMemoryDb.alerts.unshift(alert);

      systemLogger.log(
        'ALERT_CREATED',
        stationId,
        `Emergency Alert: ${alert.title}`,
        alert
      );

      if (this.ioServer) {
        this.ioServer.emit('automatedResponseExecuted', autoLog);
        this.ioServer.emit('alertCreated', alert);
      }
    }
  }
}
