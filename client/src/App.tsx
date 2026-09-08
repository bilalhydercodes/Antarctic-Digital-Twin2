import React, { useState, useEffect } from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { ROLE_ALLOWED_TABS, ROLE_METADATA } from './types';
import { DemoModeBanner } from './components/demo/DemoModeBanner';
import { SatelliteBandwidthBanner } from './components/satellite/SatelliteBandwidthBanner';
import { CriticalVoiceAlarmBanner } from './components/alerts/CriticalVoiceAlarmBanner';
import { ShieldAlert, ArrowRight } from 'lucide-react';

import { DashboardPage } from './pages/DashboardPage';
import { CommanderPage } from './pages/CommanderPage';
import { Station3DCanvas } from './components/digitaltwin/Station3DCanvas';
import { Antarctic2DMap } from './components/map/Antarctic2DMap';
import { GlaciologyPage } from './pages/GlaciologyPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { EnergyPage } from './pages/EnergyPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { AlertsPage } from './pages/AlertsPage';
import { IncidentCommandPage } from './pages/IncidentCommandPage';
import { SensorHealthPage } from './pages/SensorHealthPage';
import { EdgeGatewayPage } from './pages/EdgeGatewayPage';
import { DependencyGraphPage } from './pages/DependencyGraphPage';
import { TelemetryReplayPage } from './pages/TelemetryReplayPage';
import { StationComparisonPage } from './pages/StationComparisonPage';
import { ScenarioLabPage } from './pages/ScenarioLabPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AssistantPage } from './pages/AssistantPage';
import { SettingsPage } from './pages/SettingsPage';
import { AntarcticLandingPage } from './components/landing/AntarcticLandingPage';
import { RBACRole } from './types';

export const MainContent: React.FC = () => {
  const { userRole, setUserRole } = useSimulation();
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    return sessionStorage.getItem('entered_twin') !== 'true';
  });
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    return ROLE_METADATA[userRole]?.defaultTab || 'dashboard';
  });

  const handleEnterFromLanding = async (role: RBACRole, targetTab?: NavTab) => {
    await setUserRole(role);
    if (targetTab) {
      setActiveTab(targetTab);
    } else {
      const defaultTab = ROLE_METADATA[role]?.defaultTab || 'dashboard';
      setActiveTab(defaultTab);
    }
    sessionStorage.setItem('entered_twin', 'true');
    setShowLanding(false);
  };

  const handleOpenLanding = () => {
    sessionStorage.removeItem('entered_twin');
    setShowLanding(true);
  };

  // When user switches role in header, automatically switch to role's primary view
  // if the currently active tab is not accessible in that role
  useEffect(() => {
    const allowed = ROLE_ALLOWED_TABS[userRole] || ROLE_ALLOWED_TABS.ADMIN;
    if (!allowed.includes(activeTab)) {
      const defaultTab = ROLE_METADATA[userRole]?.defaultTab || allowed[0] || 'dashboard';
      setActiveTab(defaultTab);
    }
  }, [userRole]);

  if (showLanding) {
    return (
      <AntarcticLandingPage 
        onEnter={handleEnterFromLanding}
        initialRole={userRole}
      />
    );
  }

  const allowedTabs = ROLE_ALLOWED_TABS[userRole] || ROLE_ALLOWED_TABS.ADMIN;
  const isTabPermitted = allowedTabs.includes(activeTab);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f3f0] font-sans">
      {/* Header & Satellite Bandwidth & Demo Stepper Banners */}
      <Header onOpenLanding={handleOpenLanding} />
      <CriticalVoiceAlarmBanner />
      <SatelliteBandwidthBanner />
      <DemoModeBanner />

      {/* Main Workspace with Sidebar & Dynamic Views */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto bg-[#f4f3f0]">
          {!isTabPermitted ? (
            <div className="max-w-xl mx-auto my-12 bg-white p-8 rounded-2xl border border-[#e5e3dc] shadow-sm text-center font-sans space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-stone-900">
                Module Restricted for Role: {userRole}
              </h2>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                The requested module is not part of the <span className="font-bold text-stone-800">{ROLE_METADATA[userRole]?.badge}</span> operational profile.
              </p>
              <button
                onClick={() => setActiveTab(allowedTabs[0] || 'dashboard')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition"
              >
                <span>Go to Permitted View</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <DashboardPage onNavigate={setActiveTab} />}
              {activeTab === 'commander' && <CommanderPage />}
              {activeTab === 'incidents' && <IncidentCommandPage />}
              {activeTab === 'twin' && <Station3DCanvas />}
              {activeTab === 'sensors' && <SensorHealthPage />}
              {activeTab === 'edge' && <EdgeGatewayPage />}
              {activeTab === 'dependencies' && <DependencyGraphPage />}
              {activeTab === 'replay' && <TelemetryReplayPage />}
              {activeTab === 'compare' && <StationComparisonPage />}
              {activeTab === 'map' && <Antarctic2DMap onOpenDigitalTwin={() => setActiveTab('twin')} />}
              {activeTab === 'glaciology' && <GlaciologyPage />}
              {activeTab === 'environment' && <EnvironmentPage />}
              {activeTab === 'energy' && <EnergyPage />}
              {activeTab === 'logistics' && <LogisticsPage />}
              {activeTab === 'infrastructure' && <InfrastructurePage />}
              {activeTab === 'maintenance' && <MaintenancePage />}
              {activeTab === 'alerts' && <AlertsPage />}
              {activeTab === 'analytics' && <AnalyticsPage />}
              {activeTab === 'scenarios' && <ScenarioLabPage />}
              {activeTab === 'assistant' && <AssistantPage />}
              {activeTab === 'settings' && <SettingsPage />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};


export default function App() {
  return (
    <SimulationProvider>
      <MainContent />
    </SimulationProvider>
  );
}
