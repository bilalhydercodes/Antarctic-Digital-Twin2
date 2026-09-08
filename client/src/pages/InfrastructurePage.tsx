import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Wrench, ShieldCheck, AlertTriangle } from 'lucide-react';

export const InfrastructurePage: React.FC = () => {
  const { equipment } = useSimulation();

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-polar flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-blue-700" />
            <span className="uppercase tracking-wide">STATION ASSET HEALTH MATRIX</span>
          </h2>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Predictive Failure Risk Scoring & Thermal Telemetry Monitoring
          </p>
        </div>
      </div>

      {/* Assets Matrix Table */}
      <div className="bg-white border border-[#e5e3dc] rounded-2xl p-6 shadow-polar">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">ASSET NAME</th>
                <th className="pb-3">CATEGORY</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">HEALTH</th>
                <th className="pb-3">OPERATING TEMP</th>
                <th className="pb-3">VIBRATION</th>
                <th className="pb-3">FAILURE RISK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {equipment.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f7f4]">
                  <td className="py-3.5 font-bold text-stone-900">{item.name}</td>
                  <td className="py-3.5 text-stone-500">{item.category}</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                      item.status === 'HEALTHY' || (item.status as string) === 'ONLINE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.status === 'WARNING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-600 text-white'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-stone-900">{item.healthPercent}%</td>
                  <td className="py-3.5 font-bold text-stone-900">{item.temperature}°C</td>
                  <td className="py-3.5 text-stone-600">{item.vibration} mm/s</td>
                  <td className="py-3.5">
                    <span className={`font-bold ${item.failureProbability > 50 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {item.failureProbability}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
