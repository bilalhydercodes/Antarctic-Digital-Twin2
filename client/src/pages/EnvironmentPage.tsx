import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Thermometer, Wind, Eye, Gauge, Sun, Snowflake, ShieldCheck, Radio } from 'lucide-react';
import { PageExplainer } from '../components/common/PageExplainer';

export const EnvironmentPage: React.FC = () => {
  const { activeStationId, environment, useRealWeatherMode, setUseRealWeatherMode } = useSimulation();

  return (
    <div className="space-y-6 font-sans">
      {/* Plain English Guide Explainer */}
      <PageExplainer pageId="environment" defaultOpen={false} />

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-polar flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-sky-600" />
              <span>METEOROLOGICAL SENSOR SUITE</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{useRealWeatherMode ? 'REAL SATELLITE METEOROLOGY ACTIVE' : 'SIMULATED WEATHER'}</span>
            </span>
          </div>
          <p className="text-xs text-stone-500 font-medium">
            High-Resolution Polar Anemometer, Thermistor & Pyranometer Telemetry • {activeStationId.toUpperCase()} Station
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setUseRealWeatherMode(!useRealWeatherMode)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              useRealWeatherMode
                ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-sm'
                : 'bg-stone-100 text-stone-600 border-stone-300'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${useRealWeatherMode ? 'text-sky-600 animate-pulse' : 'text-stone-400'}`} />
            <span>{useRealWeatherMode ? 'REAL OPEN-METEO FEED' : 'SIMULATED FEED'}</span>
          </button>
        </div>
      </div>

      {/* Main Meteorological Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Temperature */}
        <div className="bg-white border border-[#e5e3dc] p-6 rounded-2xl shadow-polar">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">AMBIENT TEMPERATURE</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600"><Thermometer className="w-5 h-5" /></div>
          </div>
          <div className="text-4xl font-extrabold text-stone-900">{environment?.temperature}°C</div>
          <div className="text-xs text-stone-500 font-medium mt-1">Apparent Feels Like: {environment?.feelsLike}°C</div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 font-mono">
            Sensor ID: MTR-TMP-01A • Calibrated: 2026-08-30
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-white border border-[#e5e3dc] p-6 rounded-2xl shadow-polar">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">WIND VELOCITY</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Wind className="w-5 h-5" /></div>
          </div>
          <div className="text-4xl font-extrabold text-blue-700">{environment?.windSpeed} km/h</div>
          <div className="text-xs text-stone-500 font-medium mt-1">Direction: {environment?.windDirection} ({environment?.windSpeed && environment.windSpeed > 75 ? 'Blizzard Storm' : 'Nominal Katabatic'})</div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 font-mono">
            Sensor ID: MTR-WND-02B • Calibrated: 2026-08-30
          </div>
        </div>

        {/* Surface Pressure */}
        <div className="bg-white border border-[#e5e3dc] p-6 rounded-2xl shadow-polar">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">SURFACE PRESSURE</span>
            <div className="p-2 rounded-xl bg-stone-100 text-stone-700"><Gauge className="w-5 h-5" /></div>
          </div>
          <div className="text-4xl font-extrabold text-stone-900">{environment?.pressure} hPa</div>
          <div className="text-xs text-stone-500 font-medium mt-1">Dew Point: -28.4°C • Relative Humidity: {environment?.humidity}%</div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 font-mono">
            Sensor ID: MTR-BAR-03C • Calibrated: 2026-08-30
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e5e3dc] p-6 rounded-2xl shadow-polar">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">SOLAR PYRANOMETER</div>
          <div className="text-2xl font-bold text-amber-600">{environment?.solarRadiation} W/m²</div>
          <div className="text-xs text-stone-500 font-medium mt-1">Solar Panel Angle: 45° Fixed Antarctic Tilt</div>
        </div>

        <div className="bg-white border border-[#e5e3dc] p-6 rounded-2xl shadow-polar">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">VISIBILITY RANGE</div>
          <div className="text-2xl font-bold text-stone-900">{environment?.visibility} km</div>
          <div className="text-xs text-stone-500 font-medium mt-1">Optical Laser Transmissometer Active</div>
        </div>

        <div className="bg-white border border-[#e5e3dc] p-6 rounded-2xl shadow-polar">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">SNOWFALL ACCUMULATION</div>
          <div className="text-2xl font-bold text-stone-900">{environment?.snowfallRate} cm/h</div>
          <div className="text-xs text-stone-500 font-medium mt-1">Ultrasonic Snow Gauge Sensor</div>
        </div>
      </div>
    </div>
  );
};
