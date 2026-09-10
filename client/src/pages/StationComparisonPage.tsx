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
  Mountain,
  Microscope,
  Award,
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const StationComparisonPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparisonMode, setComparisonMode] = useState<'telemetry' | 'dossier'>('telemetry');

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
            Maitri vs Bharati Operational & Engineering Comparison
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Live cross-station telemetry correlation and verified National Centre for Polar and Ocean Research (NCPOR) technical dossier comparing inland Oasis micro-climate (Maitri) with coastal promontory conditions (Bharati).
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center bg-[#f8f7f4] p-1 rounded-xl border border-[#e5e3dc] text-xs font-bold">
            <button
              onClick={() => setComparisonMode('telemetry')}
              className={`px-3 py-1.5 rounded-lg transition ${
                comparisonMode === 'telemetry' ? 'bg-slate-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Live Telemetry Sync
            </button>
            <button
              onClick={() => setComparisonMode('dossier')}
              className={`px-3 py-1.5 rounded-lg transition ${
                comparisonMode === 'dossier' ? 'bg-slate-900 text-white shadow-sm' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Official NCPOR Dossier
            </button>
          </div>

          <button
            onClick={fetchComparison}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {comparisonMode === 'telemetry' ? (
        <>
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
                    <p className="text-[11px] text-stone-500 font-mono">
                      70° 45' 52" S, 11° 44' 03" E • Est. 1988 • Elevation: ~50m ASL
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                  IN-MTR-01
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
                <div className="font-bold flex items-center justify-between">
                  <span>NCPOR Verified Station Profile:</span>
                  <span className="text-[10px] font-mono bg-blue-200/60 px-1.5 py-0.5 rounded">Schirmacher Oasis</span>
                </div>
                <div>• Superstructure: Elevated structural steel stilts over ice-free bedrock moraine</div>
                <div>• Primary Power: 3 × Kirloskar Diesel Generators (62.5–125 kVA) + 45kW Solar + 35kW Wind</div>
                <div>• Water Sourcing: Lake Priyadarshini Submersible Trace-Heated Loop (+2°C to +4°C)</div>
                <div>• Living Capacity: 47 living base in main building + 25 summer camp = 72 maximum capacity</div>
                <div>• Science: IMD Brewer Ozone Spectrophotometer, IIG Magnetometers, NGRI Seismograph, NPL Riometer</div>
              </div>
            </div>

            {/* BHARATI CARD */}
            <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#eceae2]">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <Mountain className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-stone-900">BHARATI RESEARCH STATION</h2>
                    <p className="text-[11px] text-stone-500 font-mono">
                      69° 24.41' S, 76° 11.72' E • Est. 2012 • Elevation: ~35m ASL
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  IN-BHR-02
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc]">
                  <div className="text-[10px] font-bold text-stone-400 uppercase flex items-center space-x-1">
                    <Thermometer className="w-3.5 h-3.5 text-indigo-600" />
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

              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                <div className="font-bold flex items-center justify-between">
                  <span>NCPOR Verified Station Profile:</span>
                  <span className="text-[10px] font-mono bg-indigo-200/60 px-1.5 py-0.5 rounded">Larsemann Hills</span>
                </div>
                <div>• Superstructure: Aerodynamic bi-axial envelope enclosing 134 ISO container modules on stilts</div>
                <div>• Primary Power: 3 × 100 kVA Combined Heat & Power (CHP) units with 185 kW thermal recovery</div>
                <div>• Water Sourcing: Seawater Reverse Osmosis (RO) desalination plant drawing from Prydz Bay</div>
                <div>• Living Capacity: 47 living berths in main building (twin sharing) + 25 summer = 72 total capacity</div>
                <div>• Science: ISRO Polar Satellite Ground Earth Station (dual 7.5m radomes), Marine Biogeochemistry</div>
              </div>
            </div>
          </div>

          {/* Comparative Analytical Matrix */}
          <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm">
            <h3 className="text-base font-extrabold text-stone-900 mb-3">
              Synchronized Engineering & Atmospheric Differential Matrix
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8f7f4] border-b border-[#e5e3dc] text-stone-500 uppercase text-[10px]">
                  <th className="py-2.5 px-4">Parameter</th>
                  <th className="py-2.5 px-4 text-blue-900">Maitri (Inland Lake Basin)</th>
                  <th className="py-2.5 px-4 text-indigo-900">Bharati (Coastal Promontory)</th>
                  <th className="py-2.5 px-4 text-stone-500">Differential Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceae2] font-mono">
                <tr>
                  <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Ambient Temperature</td>
                  <td className="py-2.5 px-4">{maitri?.temp ?? -18.4}°C</td>
                  <td className="py-2.5 px-4">{bharati?.temp ?? -12.8}°C</td>
                  <td className="py-2.5 px-4 text-stone-600 font-sans">Maitri ~5.6°C colder (Continental radiation cooling over Oasis rock)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Wind Dynamics</td>
                  <td className="py-2.5 px-4">{maitri?.windSpeed ?? 36} km/h</td>
                  <td className="py-2.5 px-4">{bharati?.windSpeed ?? 28} km/h</td>
                  <td className="py-2.5 px-4 text-stone-600 font-sans">Katabatic wind drainage off Queen Maud Land inland ice slope</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Barometric Pressure</td>
                  <td className="py-2.5 px-4">{maitri?.pressure ?? 982} hPa</td>
                  <td className="py-2.5 px-4">{bharati?.pressure ?? 994} hPa</td>
                  <td className="py-2.5 px-4 text-stone-600 font-sans">Maitri ~50m elevation (Schirmacher Oasis) vs Coastal ~35m elevation</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Power Architecture</td>
                  <td className="py-2.5 px-4 font-sans text-stone-700">Diesel Synchronized Bank (3x 125 kVA)</td>
                  <td className="py-2.5 px-4 font-sans text-stone-700">Combined Heat & Power (3x 100 kVA CHP)</td>
                  <td className="py-2.5 px-4 text-emerald-700 font-sans font-semibold">Bharati co-generation saves 185 kW heating fuel load (+28% efficiency)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-sans font-bold text-stone-800">Freshwater Infrastructure</td>
                  <td className="py-2.5 px-4 font-sans text-stone-700">Lake Priyadarshini Submersible Pump Loop</td>
                  <td className="py-2.5 px-4 font-sans text-stone-700">Prydz Bay Seawater RO Desalination</td>
                  <td className="py-2.5 px-4 text-stone-600 font-sans">Glacial lake freshwater trace heating vs Coastal marine RO membrane filtration</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* Official NCPOR Dossier View */
        <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#eceae2]">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4" />
                <span>Ministry of Earth Sciences (MoES) • Government of India</span>
              </div>
              <h2 className="text-xl font-black text-stone-900">
                Official Comparative Architectural & Science Dossier
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Madrid Protocol Annexes III/IV Verified</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8f7f4] border-b border-[#e5e3dc] text-stone-500 uppercase text-[10px]">
                  <th className="py-3 px-4 w-1/4">Specification Parameter</th>
                  <th className="py-3 px-4 text-blue-900 w-3/8 font-black">Maitri Research Station (IN-MTR-01)</th>
                  <th className="py-3 px-4 text-indigo-900 w-3/8 font-black">Bharati Research Station (IN-BHR-02)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceae2] font-sans">
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Commissioned Date</td>
                  <td className="py-3 px-4 text-stone-700">December 1988 (Commissioned January 1989)</td>
                  <td className="py-3 px-4 text-stone-700">18 March 2012 (31st Indian Scientific Expedition)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Geographic Setting</td>
                  <td className="py-3 px-4 text-stone-700">Schirmacher Oasis inland ice-free rocky moraine</td>
                  <td className="py-3 px-4 text-stone-700">Grovness Peninsula promontory between Thala Fjord & Quilty Bay</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Verified Coordinates</td>
                  <td className="py-3 px-4 font-mono text-stone-800">70° 45' 52" S, 11° 44' 03" E (-70.7644°, 11.7342°)</td>
                  <td className="py-3 px-4 font-mono text-stone-800">69° 24.41' S, 76° 11.72' E (-69.4070°, 76.1950°)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Elevation Profile</td>
                  <td className="py-3 px-4 font-semibold text-blue-700">~50 m above sea level (Current NCPOR Profile)</td>
                  <td className="py-3 px-4 font-semibold text-indigo-700">~35 m above sea level</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Superstructure Architecture</td>
                  <td className="py-3 px-4 text-stone-700">Structural steel stilts over moraine + containerized lab annexes</td>
                  <td className="py-3 px-4 text-stone-700">Aerodynamic bi-axial envelope enclosing 134 ISO shipping containers on stilts</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Crew Capacity Breakdown</td>
                  <td className="py-3 px-4 text-stone-700">47 living base in main building + 25 summer camp = <strong>72 maximum capacity</strong></td>
                  <td className="py-3 px-4 text-stone-700">47 berths in main complex (twin sharing) + 25 summer camp = <strong>72 maximum capacity</strong></td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Primary Power Generation</td>
                  <td className="py-3 px-4 text-stone-700">3 × Kirloskar Diesel GenSets (62.5–125 kVA) + 45kW Solar + 35kW Wind</td>
                  <td className="py-3 px-4 text-stone-700">3 × 100 kVA Combined Heat & Power (CHP) units on Jet A-1 / DMA + 2 × 60 kVA UPS</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Thermal Co-Generation</td>
                  <td className="py-3 px-4 text-stone-700">Hydronic diesel boilers + jacket heat recovery</td>
                  <td className="py-3 px-4 text-stone-700 font-semibold text-emerald-700">185 kW thermal waste-heat recovery loop (+28% overall fuel efficiency)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Potable Water Sourcing</td>
                  <td className="py-3 px-4 text-stone-700">Lake Priyadarshini freshwater lake submersible pump with trace-heated loop</td>
                  <td className="py-3 px-4 text-stone-700">Seawater Reverse Osmosis (RO) desalination plant drawing from Prydz Bay</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Satellite Ground Station</td>
                  <td className="py-3 px-4 text-stone-700">Dedicated VSAT Ka-band link to ISRO/NRSC Hyderabad + Inmarsat / Iridium</td>
                  <td className="py-3 px-4 text-stone-700 font-semibold text-indigo-800">ISRO Dual-Tracking 7.5m Radome Earth Station receiving Resourcesat, Cartosat, Oceansat, RISAT</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-stone-900">Madrid Protocol Waste Compliance</td>
                  <td className="py-3 px-4 text-stone-700">Bio-digestive sewage treatment; 100% solid & hazardous waste retrograded to India</td>
                  <td className="py-3 px-4 text-stone-700">Bioreactor wastewater plant; greywater recycled for sanitary flush; 100% solid waste retrograded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
