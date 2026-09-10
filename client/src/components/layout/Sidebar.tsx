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
  X
} from 'lucide-react';

export type { NavTab };

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenTour?: () => void;
  onOpenHelp?: () => void;
}

interface NavItemConfig {
  id: NavTab;
  label: string;
  subtitle: string;
  category: 'core' | 'life' | 'science' | 'diagnostics';
  icon: React.ReactNode;
  badge?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab,
  onOpenTour,
  onOpenHelp 
}) => {
  const { alerts, incidents, userRole } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');

  const unhandledAlertsCount = alerts.filter(a => !a.acknowledged).length;
  const activeIncidentsCount = incidents.filter(i => i.status !== 'RESOLVED').length;

  const allNavItems: NavItemConfig[] = [
    // 1. CORE & POPULAR VIEWS
    { 
      id: 'dashboard', 
      label: 'Command Center', 
      subtitle: 'Overview & vital signs', 
      category: 'core', 
      icon: <LayoutDashboard className="w-4 h-4 text-blue-700" />,
      highlight: true 
    },
    { 
      id: 'twin', 
      label: '3D Digital Twin', 
      subtitle: 'Interactive 3D buildings', 
      category: 'core', 
      icon: <Box className="w-4 h-4 text-indigo-600" />,
      highlight: true 
    },
    { 
      id: 'assistant', 
      label: 'FrostByte AI', 
      subtitle: 'Ask questions in plain English', 
      category: 'core', 
      icon: <Bot className="w-4 h-4 text-cyan-600" /> 
    },
    { 
      id: 'map', 
      label: 'Regional Map & Satellite', 
      subtitle: 'Antarctic radar & satellite', 
      category: 'core', 
      icon: <Map className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      id: 'commander', 
      label: 'Commander SITREP', 
      subtitle: 'Daily operational briefing', 
      category: 'core', 
      icon: <Shield className="w-4 h-4 text-amber-600" /> 
    },

    // 2. STATION LIFE SUPPORT
    { 
      id: 'energy', 
      label: 'Power Grid & Fuel', 
      subtitle: 'Solar, wind & diesel generators', 
      category: 'life', 
      icon: <Zap className="w-4 h-4 text-amber-500" /> 
    },
    { 
      id: 'environment', 
      label: 'Meteorological Suite', 
      subtitle: 'Polar weather & blizzards', 
      category: 'life', 
      icon: <Thermometer className="w-4 h-4 text-sky-500" /> 
    },
    { 
      id: 'logistics', 
      label: 'Station Stores Ledger', 
      subtitle: 'Food, fuel & spare parts', 
      category: 'life', 
      icon: <Package className="w-4 h-4 text-orange-600" /> 
    },
    { 
      id: 'maintenance', 
      label: 'Work Orders & Repairs', 
      subtitle: 'Scheduled maintenance tasks', 
      category: 'life', 
      icon: <ClipboardList className="w-4 h-4 text-stone-600" /> 
    },
    { 
      id: 'infrastructure', 
      label: 'Asset Health Matrix', 
      subtitle: 'Structural integrity checks', 
      category: 'life', 
      icon: <Wrench className="w-4 h-4 text-stone-500" /> 
    },

    // 3. SCIENCE & CLIMATE
    { 
      id: 'glaciology', 
      label: 'Glaciology & Ice Radar', 
      subtitle: 'Ice sheet & subglacial lakes', 
      category: 'science', 
      icon: <FlaskConical className="w-4 h-4 text-cyan-600" /> 
    },
    { 
      id: 'research', 
      label: 'Official Research Dossier', 
      subtitle: 'Expedition scientific papers', 
      category: 'science', 
      icon: <Microscope className="w-4 h-4 text-indigo-600" /> 
    },
    { 
      id: 'analytics', 
      label: 'Telemetry Trends', 
      subtitle: 'Historical sensor charts', 
      category: 'science', 
      icon: <LineChart className="w-4 h-4 text-blue-600" /> 
    },

    // 4. DIAGNOSTICS & ADVANCED
    { 
      id: 'incidents', 
      label: 'Incident Command Post', 
      subtitle: 'Emergency triage & failover', 
      category: 'diagnostics', 
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined
    },
    { 
      id: 'alerts', 
      label: 'Alarms & Failover Audit', 
      subtitle: 'Active alarms & history', 
      category: 'diagnostics', 
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      badge: unhandledAlertsCount > 0 ? unhandledAlertsCount : undefined
    },
    { 
      id: 'compare', 
      label: 'Dual-Station Compare', 
      subtitle: 'Maitri vs Bharati benchmarks', 
      category: 'diagnostics', 
      icon: <GitCompare className="w-4 h-4 text-cyan-600" /> 
    },
    { 
      id: 'scenarios', 
      label: 'Scenario Stress Lab', 
      subtitle: 'Simulate blizzards & failures', 
      category: 'diagnostics', 
      icon: <FlaskConical className="w-4 h-4 text-purple-600" /> 
    },
    { 
      id: 'sensors', 
      label: 'Sensor Health Matrix', 
      subtitle: 'Physical sensor status array', 
      category: 'diagnostics', 
      icon: <Activity className="w-4 h-4 text-emerald-600" /> 
    },
    { 
      id: 'edge', 
      label: 'Edge Gateway & Comms', 
      subtitle: 'Satellite bandwidth relay', 
      category: 'diagnostics', 
      icon: <Radio className="w-4 h-4 text-sky-600" /> 
    },
    { 
      id: 'replay', 
      label: 'Telemetry Replay', 
      subtitle: 'Historical data time travel', 
      category: 'diagnostics', 
      icon: <Clock className="w-4 h-4 text-amber-600" /> 
    },
    { 
      id: 'dependencies', 
      label: 'Dependency Graph', 
      subtitle: 'Equipment cascade links', 
      category: 'diagnostics', 
      icon: <GitFork className="w-4 h-4 text-purple-600" /> 
    },
    { 
      id: 'settings', 
      label: 'System Architecture', 
      subtitle: 'API endpoints & system specs', 
      category: 'diagnostics', 
      icon: <Settings className="w-4 h-4 text-stone-500" /> 
    }
  ];

  // Filter navigation items by active user role permissions
  const allowedTabs = ROLE_ALLOWED_TABS[userRole] || ROLE_ALLOWED_TABS.ADMIN;
  const roleAllowedItems = allNavItems.filter(item => allowedTabs.includes(item.id));
  const currentRoleMeta = ROLE_METADATA[userRole] || ROLE_METADATA.COMMANDER;

  // Filter further by user search query
  const visibleNavItems = searchQuery.trim() === '' 
    ? roleAllowedItems 
    : roleAllowedItems.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const categories = [
    { id: 'core', label: '🌟 Core Views (Start Here)', items: visibleNavItems.filter(i => i.category === 'core') },
    { id: 'life', label: '⚡ Base Life Support', items: visibleNavItems.filter(i => i.category === 'life') },
    { id: 'science', label: '🔬 Science & Climate', items: visibleNavItems.filter(i => i.category === 'science') },
    { id: 'diagnostics', label: '🛠️ Diagnostics & Simulation', items: visibleNavItems.filter(i => i.category === 'diagnostics') },
  ];

  return (
    <aside className="w-72 bg-[#f8f7f4] border-r border-[#e5e3dc] flex flex-col justify-between shrink-0 font-sans select-none">
      <div className="p-3.5 space-y-2.5 overflow-y-auto flex-1">
        
        {/* Active Role Scope Card */}
        <div className="px-3 py-2 bg-white rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-400">
              Active Profile
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${
              userRole === 'ADMIN' ? 'bg-rose-50 text-rose-800 border-rose-200' :
              userRole === 'COMMANDER' ? 'bg-amber-50 text-amber-800 border-amber-200' :
              userRole === 'OPERATOR' ? 'bg-blue-50 text-blue-800 border-blue-200' :
              userRole === 'SCIENTIST' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              'bg-stone-100 text-stone-800 border-stone-200'
            }`}>
              {userRole}
            </span>
          </div>
          <div className="text-xs font-black text-stone-900 mt-1 flex items-center justify-between">
            <span>{currentRoleMeta.badge}</span>
            <span className="text-[10px] font-mono font-semibold text-stone-500">
              {roleAllowedItems.length} active views
            </span>
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5 leading-snug font-normal">
            {currentRoleMeta.description}
          </div>
        </div>

        {/* QUICK GUIDE SHORTCUTS FOR VISITORS */}
        <div className="grid grid-cols-2 gap-1.5">
          {onOpenTour && (
            <button
              onClick={onOpenTour}
              className="px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm"
              title="Start 2-minute guided tour"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>2-Min Tour</span>
            </button>
          )}

          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm"
              title="Open Plain-English Help & Glossary"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Glossary</span>
            </button>
          )}
        </div>

        {/* SEARCH BAR TO FIND ANY MODULE */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search views (fuel, 3D, ice)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 rounded-xl border border-[#e5e3dc] bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* NAVIGATION LIST (GROUPED OR FILTERED) */}
        {searchQuery.trim() !== '' ? (
          // Flattened search results
          <div className="space-y-1">
            <div className="text-[10px] font-mono font-bold text-stone-400 px-2 uppercase">
              Matching Views ({visibleNavItems.length})
            </div>
            {visibleNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                    isActive
                      ? 'bg-[#eceae2] text-stone-900 shadow-sm border border-[#e5e3dc]'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-[#edebe4]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={isActive ? 'text-blue-700 font-bold' : 'text-stone-500'}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="font-bold text-stone-900">{item.label}</div>
                      <div className="text-[10px] text-stone-500 font-normal">{item.subtitle}</div>
                    </div>
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
        ) : (
          // Categorized views
          categories.map((cat) => {
            if (cat.items.length === 0) return null;
            return (
              <div key={cat.id} className="space-y-1">
                <div className="px-2 pt-2 pb-0.5 text-[10px] font-extrabold tracking-wider text-stone-500 uppercase">
                  {cat.label}
                </div>
                {cat.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                        isActive
                          ? 'bg-[#eceae2] text-stone-900 shadow-sm border border-[#e5e3dc]'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-[#edebe4]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className={`shrink-0 ${isActive ? 'text-blue-700 font-bold' : 'text-stone-500'}`}>
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <div className={`truncate ${isActive ? 'font-black text-blue-950' : 'font-bold text-stone-900'}`}>
                            {item.label}
                          </div>
                          <div className="text-[10px] text-stone-500 font-normal truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      {item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-600 text-white shrink-0 ml-1">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* BOTTOM SIDEBAR STATUS FOOTER */}
      <div className="p-3.5 border-t border-[#e5e3dc] bg-[#f8f7f4] text-xs font-sans shrink-0">
        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
          OPERATIONAL LINK
        </div>
        <div className="flex items-center space-x-2 text-stone-900 font-bold text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>NCPOR Goa HQ Active</span>
        </div>
        <div className="text-[10px] text-stone-500 mt-0.5 font-medium">
          Maitri (1988) & Bharati (2012)
        </div>
      </div>
    </aside>
  );
};
