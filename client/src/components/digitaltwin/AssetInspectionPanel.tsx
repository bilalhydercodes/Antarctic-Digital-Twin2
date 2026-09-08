import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  Layers, 
  Radio, 
  Focus, 
  RotateCcw, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Thermometer, 
  Wrench, 
  Clock, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Sparkles,
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { AssetInspectionData, InternalComponent, SensorDefinition } from '../../services/AssetInternalCatalog';
import { StationAlert } from '../../types';

interface AssetInspectionPanelProps {
  data: AssetInspectionData;
  isCutawayMode: boolean;
  onToggleCutaway: () => void;
  showSensors: boolean;
  onToggleSensors: () => void;
  selectedComponent: InternalComponent | null;
  onSelectComponent: (comp: InternalComponent | null) => void;
  selectedSensor: SensorDefinition | null;
  onSelectSensor: (sensor: SensorDefinition | null) => void;
  onFocusCamera: () => void;
  onResetCamera: () => void;
  onClose: () => void;
  onExecuteFailover?: () => void;
  alerts: StationAlert[];
  onAcknowledgeAlert?: (id: string) => void;
  onResolveAlert?: (id: string) => void;
}

export const AssetInspectionPanel: React.FC<AssetInspectionPanelProps> = ({
  data,
  isCutawayMode,
  onToggleCutaway,
  showSensors,
  onToggleSensors,
  selectedComponent,
  onSelectComponent,
  selectedSensor,
  onSelectSensor,
  onFocusCamera,
  onResetCamera,
  onClose,
  onExecuteFailover,
  alerts,
  onAcknowledgeAlert,
  onResolveAlert
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COMPONENTS' | 'SENSORS' | 'MAINTENANCE' | 'ALERTS' | 'HISTORY'>('OVERVIEW');
  const [woCreated, setWoCreated] = useState(false);

  // Flatten all sensors from all components
  const allSensors: { sensor: SensorDefinition; parentComp: InternalComponent }[] = [];
  data.components.forEach(comp => {
    comp.sensors.forEach(sensor => {
      allSensors.push({ sensor, parentComp: comp });
    });
  });

  const matchingAlerts = alerts.filter(a => 
    a.component.toLowerCase().includes(data.assetName.toLowerCase()) || 
    a.title.toLowerCase().includes(data.assetId.toLowerCase()) ||
    data.assetName.toLowerCase().includes(a.component.toLowerCase())
  );

  const isCritical = data.status === 'CRITICAL';
  const isWarning = data.status === 'WARNING';

  const handleCreateWO = () => {
    setWoCreated(true);
    setTimeout(() => setWoCreated(false), 4000);
  };

  return (
    <div className="absolute top-4 right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-[#e5e3dc] shadow-2xl z-20 flex flex-col font-sans text-xs overflow-hidden transition-all duration-300">
      
      {/* ── PANEL HEADER ── */}
      <div className="p-4 border-b border-[#e5e3dc] bg-[#f8f7f4] flex items-start justify-between gap-2 shrink-0">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${
            isCritical ? 'bg-rose-100 text-rose-700 animate-pulse' :
            isWarning ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-700'
          }`}>
            {data.assetType === 'GENERATOR' ? <Zap className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                isCritical ? 'bg-rose-600 text-white' :
                isWarning ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'
              }`}>
                {data.status}
              </span>
              <span className="text-[10px] text-stone-400 font-mono font-bold">ID: {data.assetId}</span>
            </div>
            <h2 className="text-sm font-black text-stone-900 mt-0.5 leading-tight">{data.assetName}</h2>
            <div className="text-[10px] text-stone-500 font-medium">{data.locationLabel}</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-white border border-[#e5e3dc] text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── TOP ACTIONS TOOLBAR ── */}
      <div className="p-2 bg-stone-900 text-white flex items-center justify-between gap-1 shrink-0 text-[10px] font-bold">
        {/* Cutaway Toggle */}
        <button
          onClick={onToggleCutaway}
          className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
            isCutawayMode
              ? 'bg-cyan-500 text-stone-950 font-black shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isCutawayMode ? 'Cutaway Active' : 'Inspect Internals'}</span>
        </button>

        {/* Sensors Mode Toggle */}
        <button
          onClick={onToggleSensors}
          className={`px-2.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
            showSensors
              ? 'bg-emerald-500 text-stone-950 font-black shadow-sm'
              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{showSensors ? 'Sensors ON' : 'Sensors'}</span>
        </button>

        {/* Focus Camera */}
        <button
          onClick={onFocusCamera}
          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 transition"
          title="Focus Camera on Asset"
        >
          <Focus className="w-3.5 h-3.5" />
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 transition"
          title="Reset Station View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 6 ENGINEERING TABS BAR ── */}
      <div className="flex border-b border-[#e5e3dc] bg-white px-2 pt-2 gap-1 overflow-x-auto shrink-0 text-[10px] font-bold">
        {[
          { id: 'OVERVIEW', label: 'Overview' },
          { id: 'COMPONENTS', label: `Parts (${data.components.length})` },
          { id: 'SENSORS', label: `Sensors (${allSensors.length})` },
          { id: 'MAINTENANCE', label: 'Service' },
          { id: 'ALERTS', label: `Alarms (${matchingAlerts.length})` },
          { id: 'HISTORY', label: 'History' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-2.5 py-1.5 rounded-t-lg transition border-b-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-700 font-extrabold bg-[#f8f7f4]'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT AREA ── */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">

        {/* ── 1. OVERVIEW TAB ── */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-4">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Health Score</div>
                <div className={`text-xl font-black ${
                  data.healthPercent > 80 ? 'text-emerald-600' :
                  data.healthPercent > 50 ? 'text-amber-600' : 'text-rose-600'
                }`}>
                  {data.healthPercent}%
                </div>
              </div>

              <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Operating Temp</div>
                <div className={`text-xl font-black ${data.operatingTemp > 85 ? 'text-rose-600' : 'text-stone-900'}`}>
                  {data.operatingTemp}°C
                </div>
              </div>

              <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Active Load</div>
                <div className="text-xl font-black text-stone-900">{data.loadPercent}%</div>
              </div>

              <div className="bg-[#f8f7f4] p-3 rounded-xl border border-[#e5e3dc]">
                <div className="text-[10px] font-bold text-stone-400 uppercase">Failure Prob.</div>
                <div className={`text-xl font-black ${data.failureProbability > 50 ? 'text-rose-600' : 'text-stone-900'}`}>
                  {data.failureProbability}%
                </div>
              </div>
            </div>

            {/* AI Risk Manager Diagnosis */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 ${
              isCritical ? 'bg-rose-50 border-rose-200 text-rose-900' :
              isWarning ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <div className="flex items-center space-x-1.5 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI RISK MANAGER DIAGNOSIS</span>
              </div>
              <p className="text-xs leading-relaxed text-stone-800">
                {data.aiDiagnosis}
              </p>
              <div className="pt-1 text-[11px] font-semibold text-stone-700">
                <strong>Action:</strong> {data.recommendedAction}
              </div>
            </div>

            {/* Emergency Failover Action Button */}
            {(isCritical || isWarning) && onExecuteFailover && (
              <button
                onClick={onExecuteFailover}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition shadow-md flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>EXECUTE AUTOMATED LOAD FAILOVER</span>
              </button>
            )}

            {/* System Relationship Flow */}
            <div className="bg-[#f8f7f4] p-3.5 rounded-xl border border-[#e5e3dc] space-y-2">
              <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                System Circuit Relationship
              </div>
              <div className="flex items-center space-x-1 text-[11px] font-bold text-stone-700 overflow-x-auto pb-1">
                <span className="px-2 py-1 bg-white rounded border border-[#e5e3dc] text-stone-900 shrink-0">{data.assetName.split(' ')[0]}</span>
                <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="px-2 py-1 bg-white rounded border border-[#e5e3dc] text-stone-700 shrink-0">Switchgear</span>
                <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="px-2 py-1 bg-white rounded border border-[#e5e3dc] text-stone-700 shrink-0">Battery 350kWh</span>
                <ArrowRight className="w-3 h-3 text-stone-400 shrink-0" />
                <span className="px-2 py-1 bg-white rounded border border-[#e5e3dc] text-stone-700 shrink-0">Station HVAC</span>
              </div>
              <div className="space-y-1 pt-1">
                {data.downstreamImpact.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] p-1.5 rounded bg-white border border-[#e5e3dc]">
                    <span className="font-bold text-stone-800">{item.system}</span>
                    <span className={`px-1.5 py-0.5 rounded font-black text-[9px] ${
                      item.impactLevel === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                      item.impactLevel === 'DEGRADED' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {item.impactLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. COMPONENTS TAB ── */}
        {activeTab === 'COMPONENTS' && (
          <div className="space-y-2">
            <div className="text-[10px] text-stone-500 font-medium">
              Click any internal part to isolate in 3D cutaway view:
            </div>

            {data.components.map((comp) => {
              const compHealth = comp.getHealth(null, null, null, '');
              const isSelected = selectedComponent?.id === comp.id;

              return (
                <div
                  key={comp.id}
                  onClick={() => onSelectComponent(isSelected ? null : comp)}
                  className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-400/50 shadow-sm'
                      : 'bg-[#f8f7f4] border-[#e5e3dc] hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-stone-900 text-xs">{comp.name}</div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      compHealth.status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      compHealth.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {compHealth.healthPercent}% • {compHealth.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 leading-snug">
                    {comp.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200/60 font-medium">
                    <span>Temp: <strong>{compHealth.temperature}°C</strong></span>
                    <span>Fail Risk: <strong>{compHealth.failureProbability}%</strong></span>
                    <span>Sensors: <strong>{comp.sensors.length}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── 3. SENSORS TAB ── */}
        {activeTab === 'SENSORS' && (
          <div className="space-y-3">
            <div className="text-[10px] text-stone-500 font-medium">
              Real-time telemetry stream from mounted polar sensors:
            </div>

            <div className="space-y-2">
              {allSensors.map(({ sensor, parentComp }) => {
                const val = sensor.getValue(null, null, null, '');
                const sensorStatus = sensor.getStatus(val);
                const isSelected = selectedSensor?.id === sensor.id;

                return (
                  <div
                    key={sensor.id}
                    onClick={() => onSelectSensor(isSelected ? null : sensor)}
                    className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 shadow-sm'
                        : 'bg-[#f8f7f4] border-[#e5e3dc] hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[9px] text-stone-400 font-bold">{sensor.id}</span>
                        <div className="font-bold text-stone-900 text-xs">{sensor.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-stone-900">{val} <span className="text-[10px] text-stone-500 font-semibold">{sensor.unit}</span></div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                          sensorStatus === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          sensorStatus === 'WARNING' || sensorStatus === 'HIGH_RISK' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {sensorStatus}
                        </span>
                      </div>
                    </div>

                    {/* Normal range progress bar */}
                    <div>
                      <div className="flex justify-between text-[9px] text-stone-400 font-semibold">
                        <span>Nominal: {sensor.normalRange[0]} {sensor.unit}</span>
                        <span>Max: {sensor.normalRange[1]} {sensor.unit}</span>
                      </div>
                      <div className="w-full bg-stone-200 h-1.5 rounded-full mt-0.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sensorStatus === 'CRITICAL' ? 'bg-rose-500' :
                            sensorStatus === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(5, ((val - sensor.normalRange[0]) / (sensor.normalRange[1] - sensor.normalRange[0])) * 100))}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-[9px] text-stone-400 font-medium">
                      Mounted on: <strong>{parentComp.name}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 4. MAINTENANCE TAB ── */}
        {activeTab === 'MAINTENANCE' && (
          <div className="space-y-4">
            <div className="bg-[#f8f7f4] p-3.5 rounded-xl border border-[#e5e3dc] space-y-2">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Service Schedule</div>
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>Last Overhaul:</span>
                <span className="font-bold text-stone-900">{data.lastMaintenance}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>Next Scheduled:</span>
                <span className="font-bold text-blue-700">{data.nextMaintenance}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-stone-700">
                <span>Operating Runtime:</span>
                <span className="font-bold text-stone-900">{data.runtimeHours.toLocaleString()} Hours</span>
              </div>
            </div>

            <button
              onClick={handleCreateWO}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition flex items-center justify-center space-x-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{woCreated ? '✓ JOB CARD CREATED & DISPATCHED' : 'Create Preventive Work Order'}</span>
            </button>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 space-y-1">
              <span className="font-bold text-stone-900 block text-[11px]">Recommended Polar Procedure:</span>
              <p className="text-[11px] leading-relaxed">{data.recommendedAction}</p>
            </div>
          </div>
        )}

        {/* ── 5. ALERTS TAB ── */}
        {activeTab === 'ALERTS' && (
          <div className="space-y-3">
            <div className="text-[10px] text-stone-500 font-medium">
              Subsystem alarms tied to this asset:
            </div>

            {matchingAlerts.map(alt => (
              <div key={alt.id} className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[8px] font-black bg-rose-600 text-white uppercase">{alt.severity}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{alt.timestamp.slice(11, 19)}</span>
                </div>
                <div className="font-bold text-stone-900 text-xs">{alt.title}</div>
                <p className="text-[11px] text-stone-700">{alt.description}</p>
                
                <div className="flex items-center space-x-2 pt-1">
                  {!alt.acknowledged && onAcknowledgeAlert && (
                    <button
                      onClick={() => onAcknowledgeAlert(alt.id)}
                      className="px-2.5 py-1 rounded bg-amber-600 text-white text-[10px] font-bold"
                    >
                      Acknowledge
                    </button>
                  )}
                  {!alt.resolved && onResolveAlert && (
                    <button
                      onClick={() => onResolveAlert(alt.id)}
                      className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}

            {matchingAlerts.length === 0 && (
              <div className="text-center py-8 text-stone-400 font-medium text-xs">
                No active alarms detected on this subsystem. All parameters operating nominal.
              </div>
            )}
          </div>
        )}

        {/* ── 6. HISTORY TAB ── */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-4">
            <div className="bg-[#f8f7f4] p-3.5 rounded-xl border border-[#e5e3dc] space-y-2">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Recent Telemetry Trend</div>
              <div className="h-20 flex items-end justify-between gap-1 pt-4 px-2 bg-white rounded-lg border border-[#e5e3dc]">
                {[62, 64, 63, 65, 66, 68, 70, 72, 78, isCritical ? 98 : 74].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className={`w-full rounded-t ${h > 85 ? 'bg-rose-500' : h > 75 ? 'bg-amber-500' : 'bg-blue-500'}`}
                      style={{ height: `${(h / 100) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[9px] text-stone-400 font-bold">
                <span>T-30m</span>
                <span>T-15m</span>
                <span>Live Now ({data.operatingTemp}°C)</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-stone-600">
              <div className="font-bold text-stone-900 text-xs">Event Chronology:</div>
              <div className="p-2 rounded bg-[#f8f7f4] border border-[#e5e3dc]">
                <strong>2026-08-28 14:10</strong> — Routine oil vibration analysis logged normal.
              </div>
              <div className="p-2 rounded bg-[#f8f7f4] border border-[#e5e3dc]">
                <strong>2026-08-24 09:30</strong> — Polar intake de-icing circuit inspected nominal.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
