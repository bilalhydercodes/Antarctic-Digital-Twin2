import { StationId, DependencyNode, DependencyPropagationResult } from '../types/index.js';
import { inMemoryDb } from '../models/Database.js';

export class DependencyGraphService {
  // Define core station dependency graph topology
  private static graph: Record<string, { name: string; category: DependencyNode['category']; dependsOn: string[] }> = {
    fuel_storage: {
      name: 'Station Polar Diesel Storage Farm',
      category: 'POWER',
      dependsOn: []
    },
    generators_chp: {
      name: 'Primary Diesel & CHP Power Generation',
      category: 'POWER',
      dependsOn: ['fuel_storage']
    },
    electrical_grid: {
      name: 'Regulated Electrical Switchgear & Inverter Matrix',
      category: 'POWER',
      dependsOn: ['generators_chp']
    },
    hydronic_heating: {
      name: 'Central Hydronic & Waste-Heat Space Heating',
      category: 'HEATING',
      dependsOn: ['electrical_grid']
    },
    intake_water_pumps: {
      name: 'Priyadarshini Lake / Seawater RO Intake Pumps',
      category: 'WATER',
      dependsOn: ['electrical_grid']
    },
    satellite_comms: {
      name: 'Ka-Band Earth Station & Satellite Transceiver',
      category: 'COMMS',
      dependsOn: ['electrical_grid']
    },
    research_labs: {
      name: 'Scientific Research Instrumentation & Magnetometers',
      category: 'RESEARCH',
      dependsOn: ['electrical_grid']
    },
    life_support: {
      name: 'Habitat Life-Support & Environmental Control',
      category: 'LIFE_SUPPORT',
      dependsOn: ['hydronic_heating', 'intake_water_pumps']
    },
    remote_telemetry: {
      name: 'NCPOR Goa Remote Operations Uplink',
      category: 'COMMS',
      dependsOn: ['satellite_comms']
    }
  };

  public static getGraphNodes(stationId: StationId): DependencyNode[] {
    const energy = inMemoryDb.energy.get(stationId);
    const subList = inMemoryDb.subsystems.get(stationId) || [];
    const isGenFailed = energy?.generators.some(g => g.status === 'FAILED');

    return Object.entries(this.graph).map(([id, def]) => {
      let status: DependencyNode['status'] = 'HEALTHY';
      if (id === 'generators_chp' && isGenFailed) status = 'FAILED';
      else if (id === 'electrical_grid' && isGenFailed) status = 'WARNING';
      else if (id === 'research_labs' && energy?.powerGrid.loadSheddingActive) status = 'WARNING';

      const directImpacts = Object.entries(this.graph)
        .filter(([_, childDef]) => childDef.dependsOn.includes(id))
        .map(([childId]) => childId);

      return {
        id,
        name: def.name,
        category: def.category,
        status,
        dependsOn: def.dependsOn,
        directImpacts
      };
    });
  }

  public static evaluateFailure(stationId: StationId, failedComponentId: string): DependencyPropagationResult {
    const root = this.graph[failedComponentId];
    if (!root) {
      throw new Error(`Component ${failedComponentId} not found in dependency topology.`);
    }

    // BFS to find all direct and indirect dependencies
    const directImpacts: string[] = [];
    const indirectImpacts: string[] = [];
    const queue: { id: string; depth: number }[] = [];

    Object.entries(this.graph).forEach(([id, def]) => {
      if (def.dependsOn.includes(failedComponentId)) {
        directImpacts.push(def.name);
        queue.push({ id, depth: 1 });
      }
    });

    const visited = new Set<string>(directImpacts);

    while (queue.length > 0) {
      const current = queue.shift()!;
      Object.entries(this.graph).forEach(([id, def]) => {
        if (def.dependsOn.includes(current.id) && !visited.has(def.name)) {
          visited.add(def.name);
          if (current.depth >= 1) {
            indirectImpacts.push(def.name);
          }
          queue.push({ id, depth: current.depth + 1 });
        }
      });
    }

    let overallLifeSupportImpact: DependencyPropagationResult['overallLifeSupportImpact'] = 'NONE';
    const recs: string[] = [];

    if (visited.has(this.graph.life_support.name)) {
      overallLifeSupportImpact = 'CRITICAL';
      recs.push('CRITICAL: Primary life-support systems threatened. Initiate Level-1 load shedding protocol immediately.');
      recs.push('Engage secondary emergency backup generator and verify battery inverter buffer.');
    } else if (visited.has(this.graph.hydronic_heating.name) || visited.has(this.graph.intake_water_pumps.name)) {
      overallLifeSupportImpact = 'SEVERE';
      recs.push('Severe heating/water threat detected. Verify anti-freeze trace heating loops.');
    } else if (visited.has(this.graph.satellite_comms.name)) {
      overallLifeSupportImpact = 'MODERATE';
      recs.push('Communication degraded. Switch to Edge Gateway store-and-forward queueing.');
    } else {
      recs.push('Maintain routine operational parameters.');
    }

    return {
      rootFailureNodeId: failedComponentId,
      stationId,
      directImpacts,
      indirectImpacts,
      criticalDependenciesAtRisk: Array.from(visited),
      overallLifeSupportImpact,
      recommendedMitigations: recs,
      timestamp: new Date().toISOString()
    };
  }
}
