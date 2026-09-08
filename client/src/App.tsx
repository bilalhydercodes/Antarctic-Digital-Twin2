import React, { useState } from 'react';
import { SimulationProvider } from './context/SimulationContext';
import { Header } from './components/layout/Header';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { DemoModeBanner } from './components/demo/DemoModeBanner';
import { SatelliteBandwidthBanner } from './components/satellite/SatelliteBandwidthBanner';
import { CriticalVoiceAlarmBanner } from './components/alerts/CriticalVoiceAlarmBanner';

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

export const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#f4f3f0] font-sans">
      {/* Header & Satellite Bandwidth & Demo Stepper Banners */}
      <Header />
      <CriticalVoiceAlarmBanner />
      <SatelliteBandwidthBanner />
      <DemoModeBanner />

      {/* Main Workspace with Sidebar & Dynamic Views */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 overflow-y-auto bg-[#f4f3f0]">
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
