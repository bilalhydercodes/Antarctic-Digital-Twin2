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
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* HEADER & DISPATCH BUTTON */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 text-purple-600" />
            <span>Station Inventory & Autonomous Logistics</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Logistics & Stores Inventory
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl font-medium">
            Supply Chain & Resource Autonomy • {activeStationId.toUpperCase()} Research Station
          </p>
        </div>

        <button
          onClick={handleDispatch}
          disabled={dispatching}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 active:bg-purple-800 text-white font-bold text-xs shadow-sm transition transform hover:scale-[1.02] disabled:opacity-50"
        >
          <Truck className="w-4 h-4" />
          <span>{dispatching ? 'SHIPMENT EN ROUTE...' : 'DISPATCH SUPPLY SHIPMENT'}</span>
        </button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-xs flex items-center space-x-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-2xl border border-[#e5e3dc] overflow-hidden shadow-sm font-sans text-xs">
        <div className="p-4 bg-[#f8f7f4] border-b border-[#e5e3dc] text-stone-700 font-bold uppercase tracking-wider flex items-center justify-between">
          <span className="font-extrabold text-stone-800">Station Stores Ledger</span>
          <span className="text-[11px] font-mono text-stone-500 font-normal">{inventory.length} SKUs Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fcfbf9] text-stone-500 text-[11px] font-bold border-b border-[#e5e3dc] uppercase">
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Quantity</th>
                <th className="p-4">Daily Burn</th>
                <th className="p-4">Autonomy</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e3dc] text-stone-800">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f7f4] transition">
                  <td className="p-4 font-bold text-stone-900">{item.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200 uppercase">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-stone-900">{item.quantity.toLocaleString()} {item.unit}</span>
                    <span className="text-[10px] text-stone-400 block font-mono">Capacity: {item.maxCapacity.toLocaleString()}</span>
                  </td>
                  <td className="p-4 font-mono text-stone-700">{item.dailyConsumption} {item.unit}/day</td>
                  <td className="p-4">
                    <span className="font-bold text-amber-700 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {item.daysRemaining} Days
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase inline-flex items-center space-x-1 ${
                      item.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      item.status === 'LOW' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                    }`}>
                      <span>{item.status}</span>
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

