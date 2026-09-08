import { StationId, ScenarioId, IncidentRecord, AuditTrailLog, StationAlert } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';
import { systemLogger } from '../utils/logger.js';

export class EmergencyScenarioEngine {
  private static ioServer: any = null;

  public static setSocketServer(io: any) {
    this.ioServer = io;
  }

  public static async triggerEmergencyScenario(stationId: StationId, scenarioId: ScenarioId): Promise<IncidentRecord> {
    const timestamp = new Date().toISOString();
    const stationName = stationId === 'maitri' ? 'Maitri' : 'Bharati';
    const energy = inMemoryDb.energy.get(stationId);
    const env = inMemoryDb.environment.get(stationId);
    const subList = inMemoryDb.subsystems.get(stationId) || [];

    if (!energy || !env) {
      throw new Error(`Station state for ${stationId} is unavailable.`);
    }

    let title = 'Emergency Incident';
    let triggeringSensor = 'AUTOMATED_MONITOR';
    const initialTelemetry: Record<string, any> = {
      ambientTemperature: env.temperature,
      windSpeed: env.windSpeed,
      powerDemandKw: energy.powerGrid.consumptionKw,
      powerGenerationKw: energy.powerGrid.generationKw,
      batterySOC: energy.battery.stateOfCharge
    };

    const actionsTaken: IncidentRecord['actionsTaken'] = [];
    const affectedSubsystems: string[] = [];
    const sheddedLoads: string[] = [];
    const preservedLoads: string[] = [];

    // STEP 1: DETECT SCENARIO TYPE & COMPUTE DEFICIT
    if (scenarioId === 'blizzard' || scenarioId === 'generator_failure' || scenarioId === 'multi_system_failure' || scenarioId === 'heating_failure') {
      title = scenarioId === 'generator_failure' 
        ? `🔥 PRIMARY POWER GENERATOR FAILURE & EMERGENCE LOAD-SHEDDING` 
        : `🚨 SEVERE KATABATIC BLIZZARD & POWER GRID SURGE`;
      
      triggeringSensor = scenarioId === 'generator_failure' ? 'GEN-01-THERMAL-CUTOUT' : 'AWS-ANEMOMETER-SURGE';

      // Mark primary generator as failed
      const gen1 = energy.generators[0];
      if (gen1) {
        gen1.status = 'FAILED';
        gen1.temperature = 96.5;
        gen1.healthPercent = 15;
        gen1.loadPercent = 0;
        gen1.powerKw = 0;
      }

      // Mark subsystem as failed
      const powerSub = subList.find(s => s.type === 'POWER');
      if (powerSub) {
        powerSub.status = 'FAILED';
        powerSub.healthPercent = 40;
      }

      // Calculate power deficit
      const remainingGenerationKw = energy.powerGrid.solarGenerationKw + energy.powerGrid.windGenerationKw + (energy.generators[1]?.status === 'ONLINE' ? energy.generators[1].powerKw : 0);
      const totalDemandKw = energy.powerGrid.heatingLoadKw + energy.powerGrid.criticalLoadKw + energy.powerGrid.nonCriticalLoadKw;
      const powerDeficitKw = Math.max(0, totalDemandKw - remainingGenerationKw);

      // STEP 2: LOAD SHEDDING CONTROL LOGIC
      energy.powerGrid.loadSheddingActive = true;
      
      // Shed non-critical scientific loads & summer camp
      sheddedLoads.push('Scientific Ionospheric & VLF Array', 'Summer Camp Auxiliary Heaters', 'Secondary Workshop Power');
      preservedLoads.push('Central Hydronic Heating Loop #1', 'Potable Water Anti-Freeze Recirculator', 'Satellite Comms & Life Support');

      energy.powerGrid.nonCriticalLoadKw = 0; // Shed non-critical load completely
      energy.powerGrid.consumptionKw = energy.powerGrid.heatingLoadKw + energy.powerGrid.criticalLoadKw;
      energy.powerGrid.sheddedLoads = sheddedLoads;

      // STEP 3: WRITE AUDIT TRAIL LOGS
      const auditLog1: AuditTrailLog = {
        id: `aud-${Date.now()}-1`,
        timestamp,
        stationId,
        actor: 'SYSTEM',
        event: 'GENERATOR_TRIP_DETECTED',
        component: gen1?.name || 'Generator #1',
        prevState: 'ONLINE',
        newState: 'FAILED',
        action: 'Primary Generator thermal trip detected. Output voltage dropped to 0V.',
        result: `Power deficit of ${powerDeficitKw} kW identified.`
      };

      const auditLog2: AuditTrailLog = {
        id: `aud-${Date.now()}-2`,
        timestamp: new Date().toISOString(),
        stationId,
        actor: 'AUTOMATION_RULES',
        event: 'AUTOMATED_LOAD_SHEDDING',
        component: 'Power Grid Switchgear Matrix',
        prevState: 'NORMAL_OPERATION',
        newState: 'LOAD_SHEDDING_ACTIVE',
        action: `Shed non-critical loads: ${sheddedLoads.join(', ')}.`,
        result: `Preserved primary heating and life support systems (${preservedLoads.join(', ')}). Demand reduced by ${energy.powerGrid.nonCriticalLoadKw} kW.`
      };

      inMemoryDb.auditLogs.unshift(auditLog1, auditLog2);

      actionsTaken.push({
        timestamp: new Date().toISOString(),
        actor: 'AUTOMATION_RULES',
        action: 'Generator failure detected. Switched battery inverter to priority supply mode.',
        result: 'Battery buffer engaged. SOC discharging at 18 kW rate.'
      });

      actionsTaken.push({
        timestamp: new Date().toISOString(),
        actor: 'AUTOMATION_RULES',
        action: 'Executed automated load-shedding protocol #04.',
        result: `Shedded 40 kW non-critical load. Station heating preserved.`
      });

      affectedSubsystems.push('Primary Power Grid', 'Non-Critical Research Laboratories', 'Auxiliary Summer Camp');
    }

    // STEP 4: CREATE INCIDENT RECORD
    const incident: IncidentRecord = {
      id: `INC-${stationId.toUpperCase()}-${Date.now().toString().slice(-6)}`,
      stationId,
      title,
      scenario: scenarioId,
      startTime: timestamp,
      severity: 'CRITICAL',
      triggeringSensorOrEquipment: triggeringSensor,
      initialTelemetry,
      affectedSubsystems,
      powerDeficitKw: 85,
      sheddedLoads,
      preservedLoads,
      actionsTaken,
      aiAnalysis: {
        summary: `[AUTOMATED INCIDENT ANALYSIS for ${stationName}] Primary generator thermal failure occurred during katabatic weather surge. Automated switchgear successfully shed non-critical research loads, preserving station life-support heating.`,
        rootCause: 'Primary Generator cooling loop thermal overload coupled with ambient load spike.',
        recommendations: [
          'Maintain load-shedding until Backup Generator #3 achieves steady thermal sync.',
          'Verify Priyadarshini/Seawater pump trace heating continuity.',
          'Dispatch maintenance crew to inspect Generator #1 coolant circulation pump.'
        ]
      },
      status: 'ACTIVE'
    };

    inMemoryDb.incidents.unshift(incident);

    // Broadcast Incident via Socket.IO
    if (this.ioServer) {
      this.ioServer.emit('incidentCreated', incident);
      this.ioServer.emit('auditLogCreated', inMemoryDb.auditLogs.slice(0, 5));
    }

    systemLogger.log(
      'EMERGENCY_SCENARIO_EXECUTED',
      stationId,
      `Triggered emergency scenario [${scenarioId}]. Incident ${incident.id} registered. Load shedding executed.`,
      incident
    );

    return incident;
  }
}
