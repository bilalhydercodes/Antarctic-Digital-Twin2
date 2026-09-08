export type SystemEventType = 
  | 'SIMULATION_STARTED'
  | 'SIMULATION_PAUSED'
  | 'SIMULATION_RESET'
  | 'SCENARIO_STARTED'
  | 'ANOMALY_DETECTED'
  | 'PREDICTION_GENERATED'
  | 'GENERATOR_FAILED'
  | 'LOAD_TRANSFERRED'
  | 'BATTERY_DISCHARGE_STARTED'
  | 'ALERT_CREATED'
  | 'GROQ_ANALYSIS_COMPLETED'
  | 'EMERGENCY_SCENARIO_EXECUTED'
  | 'TELEMETRY_INGESTED';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  type: SystemEventType;
  stationId: string;
  message: string;
  details?: any;
}

class SystemLogger {
  private logs: SystemLogEntry[] = [];

  public log(type: SystemEventType, stationId: string, message: string, details?: any): SystemLogEntry {
    const entry: SystemLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      stationId,
      message,
      details
    };

    this.logs.unshift(entry);
    if (this.logs.length > 200) {
      this.logs.pop();
    }

    const emojiMap: Record<SystemEventType, string> = {
      SIMULATION_STARTED: '🟢',
      SIMULATION_PAUSED: '⏸️',
      SIMULATION_RESET: '🔄',
      SCENARIO_STARTED: '🧪',
      ANOMALY_DETECTED: '⚠️',
      PREDICTION_GENERATED: '🔮',
      GENERATOR_FAILED: '🚨',
      LOAD_TRANSFERRED: '⚡',
      BATTERY_DISCHARGE_STARTED: '🔋',
      ALERT_CREATED: '🔔',
      GROQ_ANALYSIS_COMPLETED: '🤖',
      EMERGENCY_SCENARIO_EXECUTED: '🚨',
      TELEMETRY_INGESTED: '📡'
    };

    console.log(`${emojiMap[type]} [${entry.timestamp.split('T')[1].slice(0, 8)}] [${type}] [${stationId.toUpperCase()}]: ${message}`);
    return entry;
  }

  public getLogs(stationId?: string, limit: number = 50): SystemLogEntry[] {
    if (stationId) {
      return this.logs.filter(l => l.stationId === stationId).slice(0, limit);
    }
    return this.logs.slice(0, limit);
  }
}

export const systemLogger = new SystemLogger();
