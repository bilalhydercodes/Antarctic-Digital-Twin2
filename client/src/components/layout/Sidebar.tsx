import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  LayoutDashboard, 
  Box, 
  Map, 
  Thermometer, 
  Zap, 
  Package, 
  Wrench, 
  AlertTriangle, 
  LineChart, 
  FlaskConical, 
  Bot, 
  Settings,
  Shield,
  ClipboardList,
  ShieldAlert,
  Activity,
  Radio,
  GitFork,
  Clock,
  GitCompare
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'commander'
  | 'incidents'
  | 'twin'
  | 'sensors'
  | 'edge'
  | 'dependencies'
  | 'replay'
  | 'compare'
  | 'map'
  | 'glaciology'
  | 'environment'
  | 'energy'
  | 'logistics'
  | 'infrastructure'
  | 'maintenance'
  | 'alerts'
  | 'analytics'
  | 'scenarios'
  | 'assistant'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { alerts, incidents } = useSimulation();

  const unhandledAlertsCount = alerts.filter(a => !a.acknowledged).length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'commander', label: 'Commander SITREP', icon: <Shield className="w-4 h-4 text-amber-600" /> },
    { 
      id: 'incidents', 
      label: 'Incident Command Post', 
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined
    },
    { id: 'twin', label: '3D Digital Twin', icon: <Box className="w-4 h-4 text-blue-600" /> },
    { id: 'sensors', label: 'Sensor Health Matrix', icon: <Activity className="w-4 h-4 text-emerald-600" /> },
    { id: 'edge', label: 'Edge Gateway & Comms', icon: <Radio className="w-4 h-4 text-sky-600" /> },
    { id: 'dependencies', label: 'Dependency Graph', icon: <GitFork className="w-4 h-4 text-purple-600" /> },
    { id: 'replay', label: 'Telemetry Replay', icon: <Clock className="w-4 h-4 text-amber-600" /> },
    { id: 'compare', label: 'Dual-Station Compare', icon: <GitCompare className="w-4 h-4 text-cyan-600" /> },
    { id: 'map', label: 'Regional Map & Satellite', icon: <Map className="w-4 h-4" /> },
    { id: 'glaciology', label: 'Glaciology & Ice Radar', icon: <FlaskConical className="w-4 h-4 text-cyan-600" /> },
    { id: 'environment', label: 'Meteorological Suite', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'energy', label: 'Power Grid & Fuel', icon: <Zap className="w-4 h-4" /> },
    { id: 'logistics', label: 'Station Stores Ledger', icon: <Package className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Asset Health Matrix', icon: <Wrench className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Work Orders & Repairs', icon: <ClipboardList className="w-4 h-4" /> },
    { 
      id: 'alerts', 
      label: 'Alarms & Failover Audit', 
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: unhandledAlertsCount > 0 ? unhandledAlertsCount : undefined
    },
    { id: 'analytics', label: 'Telemetry Trends', icon: <LineChart className="w-4 h-4" /> },
    { id: 'scenarios', label: 'Scenario Stress Lab', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'assistant', label: 'FrostByte AI', icon: <Bot className="w-4 h-4 text-cyan-600" /> },
    { id: 'settings', label: 'System Architecture', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-[#f8f7f4] border-r border-[#e5e3dc] flex flex-col justify-between shrink-0 font-sans">
      <div className="p-4 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-stone-400 uppercase">
          STATION NAVIGATION
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-[#eceae2] text-stone-900 shadow-sm border border-[#e5e3dc]'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-[#edebe4]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={isActive ? 'text-blue-700 font-bold' : 'text-stone-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* BOTTOM SIDEBAR STATUS FOOTER */}
      <div className="p-4 border-t border-[#e5e3dc] bg-[#f8f7f4] text-xs font-sans">
        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
          OPERATIONAL LINK
        </div>
        <div className="flex items-center space-x-2 text-stone-900 font-bold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>NCPOR Goa HQ Active</span>
        </div>
        <div className="text-[11px] text-stone-500 mt-1">
          Telemetry Packet Rate: 3s
        </div>
      </div>
    </aside>
  );
};
