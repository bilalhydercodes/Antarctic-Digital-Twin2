import { ScenarioId } from '../types/index.js';

export interface ScenarioDefinition {
  id: ScenarioId;
  title: string;
  description: string;
  applyState: (stationId: 'maitri' | 'bharati') => void;
}

export const PRESET_SCENARIOS: Record<ScenarioId, { title: string; description: string }> = {
  normal: {
    title: "Normal Antarctic Operations",
    description: "Standard seasonal weather, baseline heating demand, and stable renewable-diesel hybrid power grid."
  },
  blizzard: {
    title: "Severe Antarctic Blizzard",
    description: "Extreme katabatic winds (85+ km/h), visibility below 300m, solar PV drop, and +35% surge in heating demand."
  },
  extreme_cold: {
    title: "Polar Deep Freeze (-44°C)",
    description: "Rapid drop in ambient temperature triggering maximum HVAC heating load, generator thermal strain, and elevated fuel burn rate."
  },
  high_wind: {
    title: "Katabatic High Wind Event",
    description: "Wind speeds reaching 95 km/h. Structural warning issued, solar panels stowed, outdoor operations restricted."
  },
  generator_failure: {
    title: "Primary Generator Failure & Failover",
    description: "Thermal degradation on primary generator leading to shutdown. Automated Smart Response executes critical load transfer."
  },
  heating_failure: {
    title: "Central Hydronic Heating Loop Anomaly",
    description: "Boiler circulation pressure drop detected. Emergency electrical backup heating loops engaged."
  },
  communication_outage: {
    title: "Satellite Communication Outage",
    description: "Primary Ka-band satellite earth station link drop. Switchboard transitions to HF radio and store-and-forward queueing."
  },
  fuel_system_alert: {
    title: "Fuel Farm Tank Transfer Line Leak",
    description: "Pressure drop on day-tank fuel transfer line. Automatic isolation valves locked."
  },
  pump_failure: {
    title: "Lake / Seawater Intake Pump Freezing Risk",
    description: "Intake fluid temperature drops below 1.0°C. Secondary trace heating recirculator engaged."
  },
  battery_low: {
    title: "Energy Storage Grid Depletion",
    description: "Battery State of Charge drops below 20%, triggering automated load-shedding of non-essential research sub-systems."
  },
  fuel_shortage: {
    title: "Logistics Fuel Reserve Critical",
    description: "Simulated fuel reserve drops to critical 14-day threshold. Triggers emergency supply shipment dispatch workflow."
  },
  sensor_failure: {
    title: "Environmental Telemetry Sensor Offline",
    description: "Thermal Sensor #03 experiences telecommunication bus fault and transitions to OFFLINE state."
  },
  multi_system_failure: {
    title: "Multi-System Polar Emergency",
    description: "Combined severe blizzard, generator failure, and high power demand testing automated emergency load-shedding."
  },
  multi_failure_compound: {
    title: "Compound Multi-Failure Scenario",
    description: "Cascading failure: Severe Blizzard (-46°C, 92 km/h) + Primary CHP/Generator Trip + Degraded Satellite Link with P0 Telemetry Prioritization."
  }
};
