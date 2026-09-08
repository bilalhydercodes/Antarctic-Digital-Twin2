import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Package, Truck, CheckCircle2, AlertTriangle, ShieldAlert, RotateCcw } from 'lucide-react';

export const LogisticsPage: React.FC = () => {
  const { inventory, activeStationId, dispatchSupply } = useSimulation();
  const [dispatching, setDispatching] = useState(false);
  const [message, setMessage] = useState('');

  const handleDispatch = async () => {
    setDispatching(true);
    setMessage('Dispatching Supply Vessel #1042...');
    try {
      await dispatchSupply();
      setMessage('✅ Supply Vessel #1042 Arrived & Unloaded. All reserves restored to 95%+ capacity.');
    } catch (err: any) {
      setMessage('Failed to dispatch supply shipment');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER & DISPATCH BUTTON */}
      <div className="bg-polar-900 p-6 rounded-2xl border border-polar-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
            <Package className="w-5 h-5 text-purple-400" />
            <span className="uppercase">LOGISTICS & STORES INVENTORY</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Supply Chain & Resource Autonomy • {activeStationId.toUpperCase()} Station
          </p>
        </div>

        <button
          onClick={handleDispatch}
          disabled={dispatching}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-blue transition transform hover:scale-105 disabled:opacity-50"
        >
          <Truck className="w-4 h-4" />
          <span>{dispatching ? 'SHIPMENT EN ROUTE...' : 'DISPATCH SUPPLY SHIPMENT'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-purple-950/60 border border-purple-800 text-purple-300 font-mono text-xs animate-in fade-in">
          {message}
        </div>
      )}

      {/* INVENTORY TABLE */}
      <div className="bg-polar-900 rounded-2xl border border-polar-800 overflow-hidden shadow-xl font-mono text-xs">
        <div className="p-4 bg-polar-950 border-b border-polar-800 text-slate-400 font-bold uppercase tracking-wider">
          STATION STORES LEDGER
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-polar-950/60 text-slate-400 text-[11px] border-b border-polar-800">
                <th className="p-4">ITEM NAME</th>
                <th className="p-4">CATEGORY</th>
                <th className="p-4">CURRENT QUANTITY</th>
                <th className="p-4">DAILY BURN</th>
                <th className="p-4">AUTONOMY</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-polar-800 text-slate-200">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-polar-850/50 transition">
                  <td className="p-4 font-bold text-slate-100">{item.name}</td>
                  <td className="p-4 text-cyan-400">{item.category}</td>
                  <td className="p-4">
                    {item.quantity.toLocaleString()} {item.unit}
                    <span className="text-[10px] text-slate-500 block">Max: {item.maxCapacity.toLocaleString()}</span>
                  </td>
                  <td className="p-4">{item.dailyConsumption} {item.unit}/day</td>
                  <td className="p-4 font-bold text-amber-300">{item.daysRemaining} Days</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      item.status === 'NORMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      item.status === 'LOW' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                    }`}>
                      {item.status}
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
