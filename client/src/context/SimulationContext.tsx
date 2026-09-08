import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket';
import { api } from '../services/api';
import { OfflineSyncManager } from '../services/OfflineSyncManager';
import { 
  StationId, 
  EnvironmentData, 
  EnergyData, 
  EquipmentItem, 
  InventoryItem, 
  StationAlert, 
  AutomatedResponseLog,
  AuditTrailLog,
  IncidentRecord,
  AWSTelemetry,
  GeomagneticTelemetry,
  AtmosphericTelemetry,
  SeismicTelemetry,
  SubsystemState,
  SimulationState, 
  ConnectivityMode,
  DemoStepInfo,
  ScenarioId,
  WhatIfInput,
  WhatIfResult,
  RBACRole,
  SensorMetadata,
  SensorHealthRecord,
  EdgeGatewayTelemetry,
  StatisticalAnomalyRecord,
  MaintenanceRecord
} from '../types';
import { audioService } from '../services/AudioService';
import { 
  StationBundle, 
  initialStationBundles, 
  initialAlerts, 
  initialSensors, 
  initialSensorHealthMap, 
  initialEdgeGateway, 
  initialMaintenanceRecords 
} from '../data/initialStationData';


interface SimulationContextType {
  activeStationId: StationId;
  setActiveStationId: (id: StationId) => void;
  userRole: RBACRole;
  setUserRole: (role: RBACRole) => Promise<void>;
  environment: EnvironmentData | null;
  energy: EnergyData | null;
  equipment: EquipmentItem[];
  inventory: InventoryItem[];
  aws: AWSTelemetry | null;
  geomagnetic: GeomagneticTelemetry | null;
  atmospheric: AtmosphericTelemetry | null;
  seismic: SeismicTelemetry | null;
  subsystems: SubsystemState[];
  alerts: StationAlert[];
  automatedLogs: AutomatedResponseLog[];
  incidents: IncidentRecord[];
  auditLogs: AuditTrailLog[];
  sensors: SensorMetadata[];
  sensorHealthMap: Record<string, SensorHealthRecord>;
  edgeGateway: EdgeGatewayTelemetry | null;
  anomalies: StatisticalAnomalyRecord[];
  maintenanceRecords: MaintenanceRecord[];
  simulationState: SimulationState;
  connectivityMode: ConnectivityMode;
  setConnectivityMode: (mode: ConnectivityMode) => void;
  offlineQueueSize: number;
  offlineSyncStatus: string;
  flushOfflineQueue: () => Promise<void>;
  demoStep: DemoStepInfo | null;
  isConnected: boolean;
  lastUpdated: string;
  useRealWeatherMode: boolean;
  setUseRealWeatherMode: (val: boolean) => Promise<void>;
  startDemo: () => Promise<void>;
  stopDemo: () => Promise<void>;
  triggerScenario: (scenarioId: ScenarioId) => Promise<void>;
  toggleSimulation: () => Promise<void>;
  setSpeed: (speed: number) => Promise<void>;
  resetSimulation: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  dispatchSupply: () => Promise<void>;
  askAssistant: (prompt: string) => Promise<any>;
  runWhatIf: (input: WhatIfInput) => Promise<WhatIfResult>;
  sendExternalTelemetry: (payload: { station: StationId; sensorId: string; timestamp?: string; data: Record<string, any> }) => Promise<any>;
  getExportUrl: (incidentId: string, format?: 'pdf' | 'csv' | 'json') => string;
  injectSensorFault: (sensorId: string, faultType: 'STUCK' | 'NOISY' | 'OFFLINE' | 'RESTORE') => Promise<void>;
  refreshSensorHealth: () => Promise<void>;
  configureSatelliteLink: (config: any) => Promise<void>;
  evaluateDependencies: (componentId: string) => Promise<any>;
  createWorkOrder: (record: Partial<MaintenanceRecord>) => Promise<void>;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStationId, setActiveStationId] = useState<StationId>('maitri');
  const [userRole, setUserRoleState] = useState<RBACRole>('COMMANDER');
  const [stationBundles, setStationBundles] = useState<Record<StationId, StationBundle>>(initialStationBundles);
  const [alerts, setAlerts] = useState<StationAlert[]>(initialAlerts);
  const [automatedLogs, setAutomatedLogs] = useState<AutomatedResponseLog[]>([]);
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditTrailLog[]>([]);

  // Advanced Digital Twin State
  const [sensors, setSensors] = useState<SensorMetadata[]>(initialSensors);
  const [sensorHealthMap, setSensorHealthMap] = useState<Record<string, SensorHealthRecord>>(initialSensorHealthMap);
  const [edgeGateway, setEdgeGateway] = useState<EdgeGatewayTelemetry | null>(initialEdgeGateway);
  const [anomalies, setAnomalies] = useState<StatisticalAnomalyRecord[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>(initialMaintenanceRecords);
  
  const [connectivityMode, setConnectivityModeState] = useState<ConnectivityMode>('LOCAL');
  const [offlineQueueSize, setOfflineQueueSize] = useState<number>(0);
  const [offlineSyncStatus, setOfflineSyncStatus] = useState<string>('');
  const [useRealWeatherModeState, setUseRealWeatherModeState] = useState<boolean>(true);

  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: true,
    speedMultiplier: 1,
    clockMode: 'REAL',
    simulatedTime: new Date().toISOString(),
    activeScenario: 'normal',
    scenarioTitle: 'Normal Antarctic Operations',
    scenarioDescription: 'Standard seasonal weather and hybrid power grid regulation.',
    demoModeActive: false,
    demoStepIndex: 0,
    connectivityMode: 'LOCAL',
    satelliteStats: {
      mode: 'LOCAL',
      fullPayloadSize: 2450,
      deltaPayloadSize: 180,
      compressionRatio: 92.6,
      queueSize: 0,
      lastSyncTimestamp: new Date().toISOString(),
      simulatedLatencyMs: 45,
      bandwidthKbps: 1024
    }
  });

  const [demoStep, setDemoStep] = useState<DemoStepInfo | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  const setUserRole = async (role: RBACRole) => {
    setUserRoleState(role);
    await api.setUserRole(role);
  };

  const setUseRealWeatherMode = async (val: boolean) => {
    setUseRealWeatherModeState(val);
    await api.setWeatherMode(val);
  };

  const startDemo = async () => {
    await api.startDemo();
  };

  const stopDemo = async () => {
    await api.stopDemo();
    setDemoStep(null);
  };

  const setConnectivityMode = useCallback((mode: ConnectivityMode) => {
    setConnectivityModeState(mode);
    setSimulationState(prev => ({
      ...prev,
      connectivityMode: mode,
      satelliteStats: {
        ...prev.satelliteStats,
        mode,
        simulatedLatencyMs: mode === 'SATELLITE' ? 450 : mode === 'OFFLINE' ? 9999 : 45,
        bandwidthKbps: mode === 'SATELLITE' ? 128 : mode === 'OFFLINE' ? 0 : 1024
      }
    }));

    if (mode !== 'OFFLINE' && OfflineSyncManager.getQueue().length > 0) {
      OfflineSyncManager.flushQueue((status, count) => {
        setOfflineSyncStatus(status);
        setOfflineQueueSize(count);
      });
    }
  }, []);

  const flushOfflineQueue = async () => {
    await OfflineSyncManager.flushQueue((status, count) => {
      setOfflineSyncStatus(status);
      setOfflineQueueSize(count);
    });
  };

  // Fetch station sensors & edge data
  const refreshSensorHealth = useCallback(async () => {
    try {
      const res = await api.getSensorsHealth(activeStationId);
      if (res.success) {
        setSensors(res.sensors || []);
        setSensorHealthMap(res.health || {});
      }
    } catch (e) {
      // Ignore fallback
    }
  }, [activeStationId]);

  // Socket.IO Listeners
  useEffect(() => {
    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on('connect', () => {
      setIsConnected(true);
      if (connectivityMode !== 'OFFLINE' && OfflineSyncManager.getQueue().length > 0) {
        flushOfflineQueue();
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('stationTelemetry', (data: {
      maitri: StationBundle;
      bharati: StationBundle;
      simulationState: SimulationState;
      latestAlerts: StationAlert[];
      incidents?: IncidentRecord[];
    }) => {
      if (connectivityMode === 'OFFLINE') return;

      setStationBundles({
        maitri: data.maitri,
        bharati: data.bharati
      });
      if (data.simulationState) {
        setSimulationState(data.simulationState);
      }
      if (data.latestAlerts) {
        setAlerts(prev => {
          const combined = [...data.latestAlerts, ...prev];
          const map = new Map();
          combined.forEach(a => map.set(a.id, a));
          return Array.from(map.values()).slice(0, 50);
        });
      }
      if (data.incidents) {
        setIncidents(data.incidents);
      }
      setLastUpdated(new Date().toLocaleTimeString());
    });

    socket.on('alertCreated', (newAlert: StationAlert) => {
      if (connectivityMode === 'OFFLINE') return;
      setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id)]);
      if (newAlert.severity === 'CRITICAL' || newAlert.severity === 'EMERGENCY') {
        audioService.startCriticalAlarmLoop(`${newAlert.title}. Suggested action: ${newAlert.suggestedAction || 'Inspect subsystem immediately'}`, newAlert.id);
      }
    });

    socket.on('incidentCreated', (newIncident: IncidentRecord) => {
      if (connectivityMode === 'OFFLINE') return;
      setIncidents(prev => [newIncident, ...prev.filter(i => i.id !== newIncident.id)]);
      if (newIncident.severity === 'CRITICAL' || newIncident.status === 'ACTIVE') {
        audioService.startCriticalAlarmLoop(`Emergency incident at ${newIncident.stationId.toUpperCase()} station: ${newIncident.title}. Automated load shedding engaged`, newIncident.id);
      }
    });

    socket.on('sensorHealthUpdate', (data: { stationId: StationId; sensors: SensorMetadata[]; healthMap: Record<string, SensorHealthRecord> }) => {
      if (data.stationId === activeStationId) {
        if (data.sensors) setSensors(data.sensors);
        if (data.healthMap) setSensorHealthMap(data.healthMap);
      }
    });

    socket.on('edgeTelemetry', (data: { stationId: StationId; gateway: EdgeGatewayTelemetry }) => {
      if (data.stationId === activeStationId) {
        setEdgeGateway(data.gateway);
      }
    });

    socket.on('anomaliesUpdate', (anomList: StatisticalAnomalyRecord[]) => {
      setAnomalies(anomList.filter(a => a.stationId === activeStationId));
    });

    socket.on('demoStep', (stepInfo: DemoStepInfo) => {
      setDemoStep(stepInfo);
    });

    // Initial REST sync
    api.getStationTelemetry(activeStationId).then(res => {
      if (res.success && res.data) {
        setStationBundles(prev => ({
          ...prev,
          [activeStationId]: {
            environment: res.data.environment,
            energy: res.data.energy,
            equipment: res.data.equipment,
            inventory: res.data.inventory,
            aws: res.data.aws,
            geomagnetic: res.data.geomagnetic,
            atmospheric: res.data.atmospheric,
            seismic: res.data.seismic,
            subsystems: res.data.subsystems
          }
        }));
        if (res.data.alerts) setAlerts(res.data.alerts);
        if (res.data.automatedLogs) setAutomatedLogs(res.data.automatedLogs);
      }
    }).catch(err => console.log('REST sync fallback offline:', err.message));

    // Initial fetch for sensor health, edge gateway, anomalies, and maintenance
    refreshSensorHealth();

    api.getEdgeStatus(activeStationId).then(res => {
      if (res.success && res.gateway) setEdgeGateway(res.gateway);
    }).catch(() => {});

    api.getAnomalies(activeStationId).then(res => {
      if (res.success && res.data) setAnomalies(res.data);
    }).catch(() => {});

    api.getMaintenanceRecords(activeStationId).then(res => {
      if (res.success && res.data) setMaintenanceRecords(res.data);
    }).catch(() => {});

    setOfflineQueueSize(OfflineSyncManager.getQueue().length);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('stationTelemetry');
      socket.off('alertCreated');
      socket.off('incidentCreated');
      socket.off('sensorHealthUpdate');
      socket.off('edgeTelemetry');
      socket.off('anomaliesUpdate');
      socket.off('demoStep');
    };
  }, [activeStationId, connectivityMode, refreshSensorHealth]);

  // Autonomous Client-Side Simulation Tick (Active on Vercel preview or when backend is disconnected)
  useEffect(() => {
    if (isConnected) return; // Yield to live server socket updates

    const interval = setInterval(() => {
      setStationBundles(prev => {
        const next = { ...prev };
        (['maitri', 'bharati'] as StationId[]).forEach(stId => {
          const current = next[stId];
          if (!current) return;
          const tempDelta = (Math.random() - 0.5) * 0.2;
          const windDelta = (Math.random() - 0.5) * 0.4;
          const loadDelta = (Math.random() - 0.5) * 2.0;

          const newTemp = Math.round((current.environment.temperature + tempDelta) * 10) / 10;
          const newWind = Math.max(0, Math.round((current.environment.windSpeed + windDelta) * 10) / 10);
          const newCons = Math.round(Math.max(150, current.energy.powerGrid.consumptionKw + loadDelta));

          next[stId] = {
            ...current,
            environment: {
              ...current.environment,
              timestamp: new Date().toISOString(),
              temperature: newTemp,
              feelsLike: Math.round((newTemp - (newWind * 0.6)) * 10) / 10,
              windSpeed: newWind
            },
            energy: {
              ...current.energy,
              timestamp: new Date().toISOString(),
              powerGrid: {
                ...current.energy.powerGrid,
                consumptionKw: newCons
              }
            }
          };
        });
        return next;
      });

      setLastUpdated(new Date().toLocaleTimeString());
    }, 3500);

    return () => clearInterval(interval);
  }, [isConnected]);

  const activeBundle = stationBundles[activeStationId];

  const triggerScenario = async (scenarioId: ScenarioId) => {
    // Immediate optimistic local simulation state update
    setStationBundles(prev => {
      const current = prev[activeStationId];
      if (!current) return prev;
      if (scenarioId === 'blizzard') {
        return {
          ...prev,
          [activeStationId]: {
            ...current,
            environment: {
              ...current.environment,
              temperature: -41.5,
              feelsLike: -58.2,
              windSpeed: 96.4,
              windDirection: 'SSW',
              visibility: 0.8,
              snowfallRate: 4.8
            }
          }
        };
      } else if (scenarioId === 'generator_failure') {
        return {
          ...prev,
          [activeStationId]: {
            ...current,
            energy: {
              ...current.energy,
              powerGrid: {
                ...current.energy.powerGrid,
                generationKw: 180,
                loadSheddingActive: true,
                sheddedLoads: ['Container Labs Aux Heater', 'Summer Camp HVAC']
              },
              generators: current.energy.generators.map((g, idx) => 
                idx === 0 ? { ...g, status: 'OFFLINE', powerKw: 0, failureProbability: 98 } : g
              )
            }
          }
        };
      } else if (scenarioId === 'normal') {
        return initialStationBundles;
      }
      return prev;
    });

    try {
      await api.triggerScenario(scenarioId, activeStationId);
      const incRes = await api.getIncidents(activeStationId);
      if (incRes.success && incRes.data?.length) setIncidents(incRes.data);
    } catch (e) {
      // Optimistic state already set
    }

    if (scenarioId === 'blizzard') {
      audioService.resetSilencedAlerts();
      audioService.startCriticalAlarmLoop(
        `Katabatic blizzard emergency at ${activeStationId.toUpperCase()} Station. Sustained gale winds over 90 km/h. Mandatory EVA restrictions engaged. Stow solar arrays`,
        'scen-blizzard'
      );
    } else if (scenarioId === 'generator_failure') {
      audioService.resetSilencedAlerts();
      audioService.startCriticalAlarmLoop(
        `Primary generator cooling failure at ${activeStationId.toUpperCase()} Station. Thermal overload trip. Automated load shedding preserving life support heating`,
        'scen-gen-trip'
      );
    } else if (scenarioId === 'extreme_cold') {
      audioService.resetSilencedAlerts();
      audioService.startCriticalAlarmLoop(
        `Deep freeze warning at ${activeStationId.toUpperCase()} Station. Ambient temperature dropped below minus 45 degrees. Hydronic heating load surge active`,
        'scen-cold'
      );
    } else if (scenarioId === 'multi_failure_compound') {
      audioService.resetSilencedAlerts();
      audioService.startCriticalAlarmLoop(
        `Compound disaster emergency at ${activeStationId.toUpperCase()} Station. Blizzard storm and generator trip in progress. Life support preservation engaged`,
        'scen-compound'
      );
    } else if (scenarioId === 'normal') {
      audioService.stopCriticalAlarmLoop();
    }
  };

  const toggleSimulation = async () => {
    if (simulationState.isRunning) {
      await api.pauseSimulation();
    } else {
      await api.startSimulation();
    }
  };

  const setSpeed = async (speed: number) => {
    await api.setSimulationSpeed(speed);
  };

  const resetSimulation = async () => {
    await api.resetSimulation();
    setDemoStep(null);
    audioService.stopCriticalAlarmLoop();
  };

  const acknowledgeAlert = async (alertId: string) => {
    await api.acknowledgeAlert(alertId);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
    audioService.stopCriticalAlarmLoop();
  };

  const resolveAlert = async (alertId: string) => {
    await api.resolveAlert(alertId);
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, resolved: true, acknowledged: true } : a));
    audioService.stopCriticalAlarmLoop();
  };

  const dispatchSupply = async () => {
    setStationBundles(prev => {
      const current = prev[activeStationId];
      if (!current) return prev;
      return {
        ...prev,
        [activeStationId]: {
          ...current,
          energy: {
            ...current.energy,
            fuelStorage: {
              ...current.energy.fuelStorage,
              currentFuelLiters: current.energy.fuelStorage.totalCapacityLiters,
              fuelPercent: 100,
              estimatedDaysRemaining: 65,
              refillStatus: 'NORMAL'
            }
          }
        }
      };
    });
    try {
      await api.dispatchSupply(activeStationId);
    } catch (e) {}
  };

  const askAssistant = async (prompt: string): Promise<any> => {
    const res = await api.queryAssistant(activeStationId, prompt);
    return res;
  };

  const runWhatIf = async (input: WhatIfInput): Promise<WhatIfResult> => {
    const res = await api.calculateWhatIf({ ...input, stationId: activeStationId });
    return res.result;
  };

  const sendExternalTelemetry = async (payload: { station: StationId; sensorId: string; timestamp?: string; data: Record<string, any> }) => {
    if (connectivityMode === 'OFFLINE') {
      const qSize = OfflineSyncManager.enqueuePacket(payload);
      setOfflineQueueSize(qSize);
      setOfflineSyncStatus(`OFFLINE: Packet queued (${qSize} total)`);
      return { success: true, queued: true, queueSize: qSize, message: 'Telemetry queued locally while offline.' };
    } else {
      const res = await api.ingestTelemetry(payload);
      return res;
    }
  };

  const getExportUrl = (incidentId: string, format: 'pdf' | 'csv' | 'json' = 'pdf') => {
    return api.exportIncidentReportUrl(incidentId, format);
  };

  const injectSensorFault = async (sensorId: string, faultType: 'STUCK' | 'NOISY' | 'OFFLINE' | 'RESTORE') => {
    await api.injectSensorFault(sensorId, faultType);
    await refreshSensorHealth();
  };

  const configureSatelliteLink = async (config: any) => {
    const res = await api.configureEdgeLink(activeStationId, config);
    if (res.success && res.gateway) {
      setEdgeGateway(res.gateway);
    }
  };

  const evaluateDependencies = async (componentId: string) => {
    return await api.evaluateDependencies(activeStationId, componentId);
  };

  const createWorkOrder = async (record: Partial<MaintenanceRecord>) => {
    await api.createWorkOrder({ ...record, stationId: activeStationId });
    const res = await api.getMaintenanceRecords(activeStationId);
    if (res.success) setMaintenanceRecords(res.data);
  };

  return (
    <SimulationContext.Provider
      value={{
        activeStationId,
        setActiveStationId,
        userRole,
        setUserRole,
        environment: activeBundle?.environment || null,
        energy: activeBundle?.energy || null,
        equipment: activeBundle?.equipment || [],
        inventory: activeBundle?.inventory || [],
        aws: activeBundle?.aws || null,
        geomagnetic: activeBundle?.geomagnetic || null,
        atmospheric: activeBundle?.atmospheric || null,
        seismic: activeBundle?.seismic || null,
        subsystems: activeBundle?.subsystems || [],
        alerts: alerts.filter(a => a.stationId === activeStationId),
        automatedLogs: automatedLogs.filter(a => a.stationId === activeStationId),
        incidents: incidents.filter(i => i.stationId === activeStationId),
        auditLogs: auditLogs.filter(a => a.stationId === activeStationId),
        sensors: sensors.filter(s => s.stationId === activeStationId),
        sensorHealthMap,
        edgeGateway,
        anomalies,
        maintenanceRecords: maintenanceRecords.filter(m => m.stationId === activeStationId),
        simulationState,
        connectivityMode,
        setConnectivityMode,
        offlineQueueSize,
        offlineSyncStatus,
        flushOfflineQueue,
        demoStep,
        isConnected,
        lastUpdated,
        useRealWeatherMode: useRealWeatherModeState,
        setUseRealWeatherMode,
        startDemo,
        stopDemo,
        triggerScenario,
        toggleSimulation,
        setSpeed,
        resetSimulation,
        acknowledgeAlert,
        resolveAlert,
        dispatchSupply,
        askAssistant,
        runWhatIf,
        sendExternalTelemetry,
        getExportUrl,
        injectSensorFault,
        refreshSensorHealth,
        configureSatelliteLink,
        evaluateDependencies,
        createWorkOrder
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
