import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { 
  LineChart as LineChartIcon, 
  Clock, 
  Activity, 
  Thermometer, 
  Wind, 
  Zap, 
  Flame, 
  Gauge, 
  Compass, 
  Waves,
  TrendingUp, 
  TrendingDown, 
  Minus, 
  RefreshCw,
  Download,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';
type ParameterCategory = 'temperature' | 'wind' | 'power' | 'heating' | 'fuel' | 'geomagnetic' | 'seismic';

export const AnalyticsPage: React.FC = () => {
  const { activeStationId } = useSimulation();

  const [range, setRange] = useState<TimeRange>('24h');
  const [activeParam, setActiveParam] = useState<ParameterCategory>('temperature');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics(activeStationId, range);
      if (res.success && Array.isArray(res.data)) {
        setHistoryData(res.data);
        if (res.stats) setStats(res.stats);
      }
    } catch (e: any) {
      console.error('Failed to load analytics:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [activeStationId, range]);

  // Export current history as CSV
  const exportCsv = () => {
    if (historyData.length === 0) return;
    const headers = ['Timestamp', 'Time', 'Temperature_C', 'Wind_kmh', 'Pressure_hPa', 'PowerGen_kW', 'PowerCon_kW', 'Battery_SOC', 'Heating_kW', 'Fuel_Liters', 'PPM_nT', 'Seismic_Mag'];
    const rows = historyData.map(d => [
      d.timestamp,
      d.time,
      d.temp,
      d.wind,
      d.pressure,
      d.powerGen,
      d.powerCon,
      d.batterySoc,
      d.heating,
      d.fuel,
      d.ppmIntensity,
      d.seismicMag
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Telemetry_Trends_${activeStationId.toUpperCase()}_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to extract active parameter stats
  const getActiveStats = () => {
    if (!stats) return null;
    switch (activeParam) {
      case 'temperature': return { label: 'Ambient Temperature', unit: '°C', ...stats.temperature };
      case 'wind': return { label: 'Katabatic Wind Speed', unit: 'km/h', ...stats.wind };
      case 'power': return { label: 'Station Power Demand', unit: 'kW', ...stats.powerConsumption };
      case 'heating': return { label: 'Thermal Heating Demand', unit: 'kW', ...stats.heating };
      case 'fuel': return { label: 'Day-Tank Fuel Level', unit: 'L', ...stats.fuel };
      case 'geomagnetic': return { label: 'PPM Magnetic Flux', unit: 'nT', ...stats.geomagnetic };
      case 'seismic': return { label: 'Seismic Waveform Energy', unit: 'Mag', ...stats.seismic };
    }
  };

  const currentStats = getActiveStats();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans text-stone-800">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <LineChartIcon className="w-4 h-4" />
            <span>Layer 7 & 8: Historical Telemetry & Advanced Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {activeStationId === 'maitri' ? 'Maitri' : 'Bharati'} Telemetry Trends & Analytics
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Statistical multi-horizon time-series auditing calculating rolling averages, moving variance, trend vectors, rate of change, and threshold deviations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-[#f4f3f0] p-1 rounded-xl border border-[#e5e3dc] font-mono text-xs">
            {(['1h', '6h', '24h', '7d', '30d'] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  range === r ? 'bg-blue-700 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl bg-white border border-[#e5e3dc] hover:bg-stone-50 text-stone-700 transition"
            title="Refresh trends"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={exportCsv}
            disabled={historyData.length === 0}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Parameter Category Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'temperature', label: 'Temperature', icon: <Thermometer className="w-4 h-4 text-blue-600" /> },
          { id: 'wind', label: 'Wind & Pressure', icon: <Wind className="w-4 h-4 text-sky-600" /> },
          { id: 'power', label: 'Power Grid Balance', icon: <Zap className="w-4 h-4 text-amber-500" /> },
          { id: 'heating', label: 'Hydronic Heating', icon: <Flame className="w-4 h-4 text-orange-500" /> },
          { id: 'fuel', label: 'Fuel Logistics', icon: <Gauge className="w-4 h-4 text-emerald-600" /> },
          { id: 'geomagnetic', label: 'Geomagnetic (PPM/DFM)', icon: <Compass className="w-4 h-4 text-purple-600" /> },
          { id: 'seismic', label: 'Seismic Monitoring', icon: <Waves className="w-4 h-4 text-rose-600" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveParam(tab.id as ParameterCategory)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
              activeParam === tab.id
                ? 'bg-white text-stone-900 border-stone-400 shadow-sm ring-1 ring-stone-300'
                : 'bg-[#f8f7f4] text-stone-600 border-[#e5e3dc] hover:bg-[#edebe4]'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Statistical Analytics KPI Cards (Section 8 Requirements) */}
      {currentStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Current Reading</div>
            <div className="text-xl font-black text-stone-900 mt-1">
              {currentStats.current} <span className="text-xs font-normal text-stone-500">{currentStats.unit}</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Latest telemetry point</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Range Mean (Avg)</div>
            <div className="text-xl font-black text-blue-900 mt-1">
              {currentStats.avg} <span className="text-xs font-normal text-stone-500">{currentStats.unit}</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Horizon average</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Minimum (Floor)</div>
            <div className="text-xl font-black text-stone-800 mt-1">
              {currentStats.min} <span className="text-xs font-normal text-stone-500">{currentStats.unit}</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Lowest recorded</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Maximum (Peak)</div>
            <div className="text-xl font-black text-stone-800 mt-1">
              {currentStats.max} <span className="text-xs font-normal text-stone-500">{currentStats.unit}</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Peak recorded</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Std Deviation (σ)</div>
            <div className="text-xl font-black text-indigo-900 mt-1">
              ±{currentStats.stdDev}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Variance dispersion</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Rate of Change</div>
            <div className="text-xl font-black text-stone-900 mt-1 flex items-center space-x-1">
              <span>{currentStats.rate > 0 ? `+${currentStats.rate}` : currentStats.rate}</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Delta / hour</div>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Trend Vector</div>
            <div className="mt-1 flex items-center space-x-1.5">
              {currentStats.trend === 'RISING' ? (
                <span className="flex items-center text-xs font-bold text-amber-600">
                  <TrendingUp className="w-4 h-4 mr-1 text-amber-500" />
                  RISING
                </span>
              ) : currentStats.trend === 'FALLING' ? (
                <span className="flex items-center text-xs font-bold text-blue-600">
                  <TrendingDown className="w-4 h-4 mr-1 text-blue-500" />
                  FALLING
                </span>
              ) : (
                <span className="flex items-center text-xs font-bold text-emerald-600">
                  <Minus className="w-4 h-4 mr-1 text-emerald-500" />
                  STABLE
                </span>
              )}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">Anomaly score: {currentStats.anomalyScore}</div>
          </div>
        </div>
      )}

      {/* Main Interactive High-Fidelity Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#eceae2]">
          <div className="flex items-center space-x-2">
            <LineChartIcon className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              {activeParam === 'temperature' && 'Ambient Air Temperature Curve (°C)'}
              {activeParam === 'wind' && 'Katabatic Wind Speed (km/h) & Barometric Pressure (hPa)'}
              {activeParam === 'power' && 'Generation vs Power Demand Balance (kW)'}
              {activeParam === 'heating' && 'Hydronic Space Heating Thermal Load (kW)'}
              {activeParam === 'fuel' && 'Station Bulk Fuel Storage Volume (Liters)'}
              {activeParam === 'geomagnetic' && 'Proton Precession Magnetometer Total Intensity (nT)'}
              {activeParam === 'seismic' && 'Broadband Seismic Waveform Activity (Magnitude)'}
            </h2>
          </div>

          <span className="text-xs font-mono text-stone-500">
            {historyData.length} Sample Points • Timeframe: {range}
          </span>
        </div>

        {/* Chart Viewport */}
        <div className="h-80 w-full min-h-[320px]">
          {loading && historyData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-stone-400 text-xs font-medium">
              Loading station telemetry trends...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {activeParam === 'temperature' ? (
                <AreaChart data={historyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} unit="°C" domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="temp" name="Ambient Temp (°C)" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
                </AreaChart>
              ) : activeParam === 'wind' ? (
                <LineChart data={historyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#0284c7" fontSize={11} unit=" km/h" tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#7c3aed" fontSize={11} unit=" hPa" domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="wind" name="Wind Velocity (km/h)" stroke="#0284c7" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="pressure" name="Barometric Pressure (hPa)" stroke="#7c3aed" strokeWidth={2} dot={false} />
                </LineChart>
              ) : activeParam === 'power' ? (
                <AreaChart data={historyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="genGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" kW" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="powerGen" name="Power Generation (kW)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#genGradient)" />
                  <Line type="monotone" dataKey="powerCon" name="Power Consumption (kW)" stroke="#e11d48" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="batterySoc" name="Battery SOC (%)" stroke="#10b981" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                </AreaChart>
              ) : activeParam === 'heating' ? (
                <AreaChart data={historyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="heatGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" kW" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="heating" name="Space Heating Demand (kW)" stroke="#ea580c" strokeWidth={2.5} fillOpacity={1} fill="url(#heatGradient)" />
                </AreaChart>
              ) : activeParam === 'fuel' ? (
                <AreaChart data={historyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" L" tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="fuel" name="Fuel Reserve (Liters)" stroke="#059669" strokeWidth={2.5} fillOpacity={1} fill="url(#fuelGradient)" />
                </AreaChart>
              ) : activeParam === 'geomagnetic' ? (
                <LineChart data={historyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" nT" domain={['auto', 'auto']} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="ppmIntensity" name="PPM Total Field (nT)" stroke="#9333ea" strokeWidth={2} dot={false} />
                </LineChart>
              ) : (
                <LineChart data={historyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} unit=" Mag" domain={[0, 4.0]} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="seismicMag" name="Seismic Magnitude (M)" stroke="#e11d48" strokeWidth={2} dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Historical Telemetry Samples Table */}
      <div className="bg-white rounded-2xl border border-[#e5e3dc] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#eceae2] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Recorded Time-Series Telemetry Points ({historyData.length} records)
          </h3>
          <span className="text-[11px] font-mono text-stone-500">
            Resolution: {range === '1h' ? '5 min' : range === '6h' ? '15 min' : range === '24h' ? '1 hour' : 'Dynamic'}
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f8f7f4] border-b border-[#e5e3dc] text-stone-500 uppercase text-[10px] sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Temp (°C)</th>
                <th className="py-2.5 px-4">Wind (km/h)</th>
                <th className="py-2.5 px-4">Pressure (hPa)</th>
                <th className="py-2.5 px-4">Gen / Demand (kW)</th>
                <th className="py-2.5 px-4">Battery SOC</th>
                <th className="py-2.5 px-4">Heating (kW)</th>
                <th className="py-2.5 px-4">Fuel (Liters)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eceae2] font-mono text-stone-700">
              {historyData.slice(-15).reverse().map((d, i) => (
                <tr key={i} className="hover:bg-[#fcfbf9] transition">
                  <td className="py-2 px-4 font-sans font-medium text-stone-900">
                    {d.time} <span className="text-stone-400 text-[10px]">{d.date}</span>
                  </td>
                  <td className="py-2 px-4">{d.temp}°C</td>
                  <td className="py-2 px-4">{d.wind} km/h</td>
                  <td className="py-2 px-4">{d.pressure} hPa</td>
                  <td className="py-2 px-4">{d.powerGen} / {d.powerCon} kW</td>
                  <td className="py-2 px-4">{d.batterySoc}%</td>
                  <td className="py-2 px-4">{d.heating} kW</td>
                  <td className="py-2 px-4">{d.fuel?.toLocaleString()} L</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
