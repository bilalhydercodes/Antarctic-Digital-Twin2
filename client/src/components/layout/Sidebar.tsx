import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { NavTab, ROLE_ALLOWED_TABS } from '../../types';
import { 
  LayoutDashboard, 
  Building, 
  LineChart, 
  Box, 
  Radio, 
  CloudSun, 
  Zap, 
  Droplets, 
  Package, 
  Wrench, 
  ShieldAlert, 
  Bot, 
  FlaskConical, 
  Microscope, 
  FileText, 
  Settings,
  ChevronDown,
  Activity,
  GitFork,
  Clock,
  Compass
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenTour?: () => void;
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { userRole, activeStationId, setActiveStationId, incidents, alerts } = useSimulation();
  const [stationsOpen, setStationsOpen] = useState(true);

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED').length;
  const unhandledAlerts = alerts.filter(a => !a.acknowledged).length;

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Telemetry', icon: <LineChart className="w-3.5 h-3.5" /> },
    { id: 'twin', label: '3D Digital Twin', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'edge', label: 'Satellite Link', icon: <Radio className="w-3.5 h-3.5" /> },
    { id: 'environment', label: 'Weather & Forecast', icon: <CloudSun className="w-3.5 h-3.5" /> },
    { id: 'energy', label: 'Energy & Power', icon: <Zap className="w-3.5 h-3.5" /> },
    { id: 'infrastructure', label: 'Water & Life Support', icon: <Droplets className="w-3.5 h-3.5" /> },
    { id: 'logistics', label: 'Logistics & Stores', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-3.5 h-3.5" /> },
    { 
      id: 'incidents', 
      label: 'Incident Management', 
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
      badge: activeIncidents > 0 ? activeIncidents : undefined,
      badgeColor: 'bg-rose-700 text-white'
    },
    { id: 'assistant', label: 'AI Copilot', icon: <Bot className="w-3.5 h-3.5 text-sky-400" /> },
    { id: 'scenarios', label: 'Simulation Lab', icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: 'research', label: 'Scientific Payloads', icon: <Microscope className="w-3.5 h-3.5" /> },
    { id: 'compare', label: 'Reports & Analytics', icon: <FileText className="w-3.5 h-3.5" /> },
    { id: 'dependencies', label: 'System Dependencies', icon: <GitFork className="w-3.5 h-3.5" /> },
    { id: 'replay', label: 'Telemetry Replay', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-3.5 h-3.5" /> }
  ];

  const allowedTabs = ROLE_ALLOWED_TABS[userRole] || ROLE_ALLOWED_TABS.ADMIN;
  const filteredNavItems = navItems.filter(item => allowedTabs.includes(item.id));

  return (
    <aside className="w-56 bg-[#102a43] text-slate-200 border-r border-[#1f3a56] flex flex-col justify-between shrink-0 font-sans select-none text-xs">
      
      {/* Upper Navigation Items */}
      <div className="py-2 px-1.5 space-y-0.5 overflow-y-auto flex-1">
        
        {/* Section Header: OPERATIONAL VIEWS */}
        <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
          Mission Navigation
        </div>

        {/* Dashboard Tab */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm font-medium transition ${
            activeTab === 'dashboard'
              ? 'bg-[#243b53] text-white border-l-2 border-sky-400'
              : 'text-slate-300 hover:bg-[#19324d] hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-sky-300" />
            <span>Dashboard</span>
          </div>
        </button>

        {/* Stations Accordion Menu */}
        <div>
          <button
            onClick={() => setStationsOpen(!stationsOpen)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm font-medium text-slate-300 hover:bg-[#19324d] transition"
          >
            <div className="flex items-center space-x-2">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>Stations</span>
            </div>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${stationsOpen ? 'rotate-180' : ''}`} />
          </button>

          {stationsOpen && (
            <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-slate-700/60 ml-3 my-0.5">
              <button
                onClick={() => {
                  setActiveStationId('maitri');
                  setActiveTab('twin');
                }}
                className={`w-full text-left px-2 py-1 rounded-sm text-[11px] font-medium transition flex items-center justify-between ${
                  activeStationId === 'maitri' && activeTab === 'twin'
                    ? 'bg-[#243b53] text-sky-200 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>Maitri</span>
                <span className="text-[9px] font-mono text-slate-400">70.76°S</span>
              </button>

              <button
                onClick={() => {
                  setActiveStationId('bharati');
                  setActiveTab('twin');
                }}
                className={`w-full text-left px-2 py-1 rounded-sm text-[11px] font-medium transition flex items-center justify-between ${
                  activeStationId === 'bharati' && activeTab === 'twin'
                    ? 'bg-[#243b53] text-sky-200 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>Bharati</span>
                <span className="text-[9px] font-mono text-slate-400">69.40°S</span>
              </button>
            </div>
          )}
        </div>

        {/* Filtered Nav List */}
        {filteredNavItems
          .filter(item => item.id !== 'dashboard')
          .map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm font-medium transition ${
                  isActive
                    ? 'bg-[#243b53] text-white border-l-2 border-sky-400'
                    : 'text-slate-300 hover:bg-[#19324d] hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className={isActive ? 'text-sky-300' : 'text-slate-400'}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-1 py-0.2 rounded-xs font-mono font-bold text-[9px] ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Institutional Mission System Status Footer */}
      <div className="p-2 border-t border-[#1f3a56] bg-[#0b1d33] text-[10px] space-y-1">
        <div className="flex items-center justify-between font-mono text-slate-400">
          <span>SYSTEM STATE:</span>
          <span className="text-emerald-400 font-bold">NOMINAL</span>
        </div>
        <div className="text-slate-400 leading-tight">
          NCPOR Polar Telemetry Network • v2.4-Gov
        </div>
      </div>

    </aside>
  );
};
