import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  GitCompare, 
  Thermometer, 
  Wind, 
  Gauge, 
  Zap, 
  Flame, 
  ShieldAlert, 
  Radio, 
  RefreshCw,
  Mountain
} from 'lucide-react';

export const StationComparisonPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const res = await api.compareStations();
      if (res.success && res.comparison) {
        setData(res.comparison);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison();
    const timer = setInterval(fetchComparison, 4000);
    return () => clearInterval(timer);
  }, []);

  const maitri = data?.maitri;
  const bharati = data?.bharati;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            <span>Layer 32: Dual-Station Synchronized Comparison</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            Maitri vs Bharati Operational Comparison
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Live cross-station telemetry correlation comparing inland Oasis micro-climate (Maitri, Schirmacher Oasis) with coastal Larsemann Hills promontory conditions (Bharati).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={fetchComparison}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Sync</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Synchronized Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MAITRI CARD */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#eceae2]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-stone-900">MAITRI RESEARCH STATION</h2>
                <p className="text-[11px] text-stone-500 font-mono">70.76° S, 11.73° E • Est. 1989 • Inland Ice Free</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
              STATION #2
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                <span>Ambient Temp</span>
              </div>
              <div className="text-xl font-black text-stone-900 mt-1">
                {maitri?.temp !== undefined ? `${maitri.temp}°C` : '-18.4°C'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Wind className="w-3.5 h-3.5 text-stone-500" />
                <span>Wind Velocity</span>
              </div>
              <div className="text-xl font-black text-stone-900 mt-1">
                {maitri?.windSpeed !== undefined ? `${maitri.windSpeed} km/h` : '36 km/h'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Power Demand</span>
              </div>
              <div className="text-xl font-black text-stone-900 mt-1">
                {maitri?.powerDemandKw || 260} kW
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fuel Autonomy</span>
              </div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {maitri?.fuelDays || 64} Days
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="font-bold">Station Specific Architecture:</div>
            <div>• Primary Power: Diesel Generator Synchronized Bank (3x 125 kVA)</div>
            <div>• Water: Priyadarshini Lake Submersible Trace-Heated Loop</div>
            <div>• Instrumentation: PPM, DFM, Seismometer, Riometer, GPS, Electric Field Mill</div>
          </div>
        </div>

        {/* BHARATI CARD */}
        <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#eceae2]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-stone-900">BHARATI RESEARCH STATION</h2>
                <p className="text-[11px] text-stone-500 font-mono">69.40° S, 76.19° E • Est. 2012 • Coastal Promontory</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800">
              STATION #3
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                <span>Ambient Temp</span>
              </div>
              <div className="text-xl font-black text-stone-900 mt-1">
                {bharati?.temp !== undefined ? `${bharati.temp}°C` : '-12.8°C'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Wind className="w-3.5 h-3.5 text-stone-500" />
                <span>Wind Velocity</span>
              </div>
              <div className="text-xl font-black text-stone-900 mt-1">
                {bharati?.windSpeed !== undefined ? `${bharati.windSpeed} km/h` : '28 km/h'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Power Demand</span>
              </div>
              <div className="text-xl font-black text-stone-900 mt-1">
                {bharati?.powerDemandKw || 240} kW
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
              <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                <span>Fuel Autonomy</span>
              </div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {bharati?.fuelDays || 72} Days
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-sky-950 space-y-1">
            <div className="font-bold">Station Specific Architecture:</div>
            <div>• Primary Power: Integrated Combined Heat & Power (CHP) + Waste Heat Recovery</div>
            <div>• Water: Seawater Desalination (RO) + Heated Intake Pipeline</div>
            <div>• Instrumentation: AWS, PPM, DFM, ICM, VLF Receiver, All-Sky Imager, Earth Sensing</div>
          </div>
        </div>
      </div>

      {/* Comparative Analytical Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm">
        <h3 className="text-base font-extrabold text-stone-900 mb-3">
          Synchronized Engineering & Atmospheric Matrix
        </h3>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f8f7f4] border-b border-[#e5e3dc] text-stone-500 uppercase text-[10px]">
              <th className="py-2.5 px-4">Parameter</th>
              <th className="py-2.5 px-4 text-blue-900">Maitri (Inland)</th>
              <th className="py-2.5 px-4 text-sky-900">Bharati (Coastal)</th>
              <th className="py-2.5 px-4 text-stone-500">Differential Analysis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eceae2] font-mono">
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Temperature</td>
              <td className="py-2.5 px-4">{maitri?.temp ?? -18.4}°C</td>
              <td className="py-2.5 px-4">{bharati?.temp ?? -12.8}°C</td>
              <td className="py-2.5 px-4 text-stone-600">Maitri ~5.6°C colder (Continental radiation cooling)</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Wind Dynamics</td>
              <td className="py-2.5 px-4">{maitri?.windSpeed ?? 36} km/h</td>
              <td className="py-2.5 px-4">{bharati?.windSpeed ?? 28} km/h</td>
              <td className="py-2.5 px-4 text-stone-600">Katabatic gusts from Antarctic ice cap at Maitri</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Barometric Pressure</td>
              <td className="py-2.5 px-4">{maitri?.pressure ?? 982} hPa</td>
              <td className="py-2.5 px-4">{bharati?.pressure ?? 994} hPa</td>
              <td className="py-2.5 px-4 text-stone-600">Maitri 117m elevation offset vs Sea Level Bharati</td>
            </tr>
            <tr>
              <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Power Architecture</td>
              <td className="py-2.5 px-4 font-sans text-stone-700">Diesel Synchronized</td>
              <td className="py-2.5 px-4 font-sans text-stone-700">CHP + Thermal Recovery</td>
              <td className="py-2.5 px-4 text-emerald-700 font-sans font-medium">Bharati achieves +28% thermal efficiency</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
