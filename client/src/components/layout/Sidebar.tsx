import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { 
  NavTab, 
  ROLE_ALLOWED_TABS, 
  ROLE_METADATA 
} from '../../types';
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
  GitCompare,
  Microscope,
  Search,
  Sparkles,
  HelpCircle,
  Building2,
  ChevronDown,
  Droplets,
  CloudSun
} from 'lucide-react';

export type { NavTab };

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenTour?: () => void;
  onOpenHelp?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenTour,
  onOpenHelp 
}) => {
  const { alerts, incidents, userRole, activeStationId, setActiveStationId } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [stationsOpen, setStationsOpen] = useState(true);

  const unhandledAlertsCount = alerts.filter(a => !a.acknowledged).length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  const navItems: {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analytics', label: 'Telemetry', icon: <LineChart className="w-4 h-4" /> },
    { id: 'twin', label: '3D Digital Twin', icon: <Box className="w-4 h-4" /> },
    { id: 'edge', label: 'Satellite Link', icon: <Radio className="w-4 h-4" /> },
    { id: 'environment', label: 'Weather & Forecast', icon: <CloudSun className="w-4 h-4" /> },
    { id: 'energy', label: 'Energy & Power', icon: <Zap className="w-4 h-4" /> },
    { id: 'infrastructure', label: 'Water & Life Support', icon: <Droplets className="w-4 h-4" /> },
    { id: 'logistics', label: 'Logistics & Stores', icon: <Package className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
    { 
      id: 'incidents', 
      label: 'Incident Management', 
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined,
      badgeColor: 'bg-rose-500 text-white'
    },
    { id: 'assistant', label: 'AI Copilot (FrostByte)', icon: <Bot className="w-4 h-4 text-cyan-400" /> },
    { id: 'scenarios', label: 'Simulation Lab', icon: <FlaskConical className="w-4 h-4 text-purple-400" /> },
    { id: 'research', label: 'Scientific Payloads', icon: <Microscope className="w-4 h-4" /> },
    { id: 'compare', label: 'Reports & Analytics', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'map', label: 'Antarctic Map & GPS', icon: <Map className="w-4 h-4" /> },
    { id: 'dependencies', label: 'Dependency Graph', icon: <GitFork className="w-4 h-4" /> },
    { id: 'replay', label: 'Telemetry Replay', icon: <Clock className="w-4 h-4" /> },
    { id: 'settings', label: 'System Architecture', icon: <Settings className="w-4 h-4" /> }
  ];

  const allowedTabs = ROLE_ALLOWED_TABS[userRole] || ROLE_ALLOWED_TABS.ADMIN;
  const filteredNavItems = navItems.filter(item => allowedTabs.includes(item.id));

  return (
    <aside className="w-64 bg-[#0a182c] text-slate-200 border-r border-[#152a4a] flex flex-col justify-between shrink-0 font-sans select-none">
      
      {/* Upper Navigation List */}
      <div className="p-3 space-y-1.5 overflow-y-auto flex-1 custom-scrollbar">
        
        {/* Search Bar */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search system..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11243f] text-xs text-white placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-[#1e3860] focus:outline-none focus:border-cyan-400 transition"
          />
        </div>

        {/* Navigation Items */}
        <div className="space-y-0.5">
          {/* Dashboard (Top Item) */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'dashboard'
                ? 'bg-[#1e4478] text-white shadow-xs'
                : 'text-slate-300 hover:bg-[#11243f] hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <LayoutDashboard className="w-4 h-4 text-sky-400" />
              <span>Dashboard</span>
            </div>
          </button>

          {/* Stations Collapsible Dropdown */}
          <div className="pt-1">
            <button
              onClick={() => setStationsOpen(!stationsOpen)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-[#11243f] rounded-lg transition"
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>Stations</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${stationsOpen ? 'rotate-180' : ''}`} />
            </button>

            {stationsOpen && (
              <div className="pl-7 pr-2 py-1 space-y-1">
                <button
                  onClick={() => {
                    setActiveStationId('maitri');
                    setActiveTab('twin');
                  }}
                  className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-medium transition flex items-center justify-between ${
                    activeStationId === 'maitri'
                      ? 'bg-blue-600/30 text-sky-300 border border-blue-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span>• Maitri (Schirmacher)</span>
                  <span className="text-[9px] px-1 bg-blue-900/60 rounded text-sky-200">1988</span>
                </button>
                <button
                  onClick={() => {
                    setActiveStationId('bharati');
                    setActiveTab('twin');
                  }}
                  className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-medium transition flex items-center justify-between ${
                    activeStationId === 'bharati'
                      ? 'bg-blue-600/30 text-sky-300 border border-blue-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span>• Bharati (Coastal)</span>
                  <span className="text-[9px] px-1 bg-sky-900/60 rounded text-sky-200">2012</span>
                </button>
              </div>
            )}
          </div>

          {/* Remaining Items */}
          {filteredNavItems
            .filter(item => item.id !== 'dashboard')
            .filter(item => searchQuery.trim() === '' || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-[#1e4478] text-white shadow-xs'
                      : 'text-slate-300 hover:bg-[#11243f] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={isActive ? 'text-sky-300' : 'text-slate-400'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${item.badgeColor || 'bg-blue-500 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      {/* Bottom Footer Banner: Antarctic Programme & Expedition */}
      <div className="p-3 border-t border-[#152a4a] bg-[#071324]/80">
        <div className="rounded-xl p-2.5 bg-gradient-to-r from-blue-950/80 to-slate-900/80 border border-blue-800/30 text-left">
          <div className="flex items-center justify-between text-[10px] font-bold text-sky-300">
            <span>Antarctic Programme</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-950 border border-sky-600/30 text-sky-200">MoES</span>
          </div>
          <div className="text-[11px] font-extrabold text-white mt-0.5">
            42nd Indian Scientific Expedition
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">
            ATCP 1983 • Madrid Protocol
          </div>
        </div>
      </div>
    </aside>
  );
};
