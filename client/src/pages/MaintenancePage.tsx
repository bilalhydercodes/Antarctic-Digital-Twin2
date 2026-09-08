import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { 
  Wrench, 
  PlusCircle, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Boxes, 
  Printer,
  ChevronRight,
  Filter
} from 'lucide-react';

interface WorkOrder {
  id: string;
  equipmentId: string;
  equipmentName: string;
  category: string;
  assignedTechnician: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  title: string;
  description: string;
  createdDate: string;
  etaDays: number;
  requiredParts: string[];
}

export const MaintenancePage: React.FC = () => {
  const { equipment, inventory, activeStationId } = useSimulation();

  const isMaitri = activeStationId === 'maitri';

  // Seed work orders from active equipment failure states
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-2026-081',
      equipmentId: 'gen-m1',
      equipmentName: isMaitri ? 'Kirloskar Generator #1' : 'Caterpillar CHP Unit 1',
      category: 'ENERGY',
      assignedTechnician: 'Er. Rajesh Sharma (Lead Power Tech)',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      title: 'Injector Nozzle Decarbonization & Bearing Lube',
      description: 'Vibration signature indicates minor bearing play on secondary drive shaft. Flush injector nozzles and replace gasket.',
      createdDate: '2026-08-28',
      etaDays: 2,
      requiredParts: ['High-Pressure Injector Seal (Qty: 2)', 'Synthetic Polar Lube 5W-40 (Qty: 10L)']
    },
    {
      id: 'WO-2026-082',
      equipmentId: 'water-pump-01',
      equipmentName: isMaitri ? 'Priyadarshini Intake Pump #2' : 'Larsemann RO Booster Pump',
      category: 'WATER',
      assignedTechnician: 'Dr. Anita Roy (Cryo-Systems)',
      priority: 'MEDIUM',
      status: 'OPEN',
      title: 'Sub-Zero Intake Pipe De-icing Ribbon Inspection',
      description: 'Trace heating element resistance measured 12% lower than nominal. Test ribbon continuity across 150m intake line.',
      createdDate: '2026-08-29',
      etaDays: 3,
      requiredParts: ['Self-Regulating Heat Trace Tape 30W/m (Qty: 20m)', 'IP68 Sealant Gel (Qty: 1)']
    },
    {
      id: 'WO-2026-083',
      equipmentId: 'comms-dish-01',
      equipmentName: isMaitri ? 'ISRO 4.5m Inmarsat Gateway' : 'Ku-Band High-Gain Radome',
      category: 'COMMS',
      assignedTechnician: 'S. Kulkarni (Satcom Specialist)',
      priority: 'LOW',
      status: 'COMPLETED',
      title: 'Radome Seal Check & Azimuth Servo Recalibration',
      description: 'Annual servo calibration completed. Azimuth tracking error verified < 0.05 degrees. Wind seals inspected nominal.',
      createdDate: '2026-08-24',
      etaDays: 0,
      requiredParts: ['Servo Potentiometer 10k (Qty: 1)']
    }
  ]);

  // Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState(equipment[0]?.id || '');
  const [techName, setTechName] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY'>('MEDIUM');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [etaDays, setEtaDays] = useState(3);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const handleCreateWorkOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEq = equipment.find(eq => eq.id === selectedEqId) || equipment[0];
    const newWO: WorkOrder = {
      id: `WO-2026-0${Math.floor(80 + Math.random() * 100)}`,
      equipmentId: selectedEqId,
      equipmentName: targetEq?.name || 'Station Subsystem',
      category: targetEq?.category || 'ENERGY',
      assignedTechnician: techName || 'Station Maintenance Duty Officer',
      priority,
      status: 'OPEN',
      title: title || 'Scheduled Preventive Inspection',
      description: description || 'Routine preventive maintenance and sensor calibration.',
      createdDate: new Date().toISOString().slice(0, 10),
      etaDays,
      requiredParts: ['Standard Polar O-Ring Kit', 'Silicone Sealant']
    };

    setWorkOrders([newWO, ...workOrders]);
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
    setTechName('');
  };

  const updateWOStatus = (id: string, newStatus: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED') => {
    setWorkOrders(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };

  const filteredOrders = workOrders.filter(w => filterStatus === 'ALL' || w.status === filterStatus);

  const openCount = workOrders.filter(w => w.status === 'OPEN').length;
  const inProgressCount = workOrders.filter(w => w.status === 'IN_PROGRESS').length;
  const completedCount = workOrders.filter(w => w.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── HEADER ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-700">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-stone-900 text-amber-300 uppercase tracking-widest">
                MAINTENANCE OPS
              </span>
              <span className="text-xs font-bold text-stone-500">
                {isMaitri ? 'Maitri Schirmacher Oasis Facility' : 'Bharati Larsemann Hills Station'}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-stone-900 mt-1 tracking-tight">
              Asset Health & Digital Work Orders
            </h1>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Predictive Anomaly Remediation, Job Card Tracking, and Critical Spare Parts Availability
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#f8f7f4] border border-[#e5e3dc] text-stone-700 hover:bg-stone-100 transition flex items-center space-x-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-stone-400" />
            <span>Export Manifest</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition flex items-center space-x-1.5 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Work Order</span>
          </button>
        </div>
      </div>

      {/* ── KPI METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Open Jobs</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{openCount}</div>
          <div className="text-[10px] text-stone-400 font-bold mt-1">Pending technician dispatch</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Under Maintenance</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{inProgressCount}</div>
          <div className="text-[10px] text-stone-400 font-bold mt-1">Jobs currently in progress</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Resolved This Cycle</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{completedCount}</div>
          <div className="text-[10px] text-stone-400 font-bold mt-1">Inspected & verified nominal</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#e5e3dc] shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Spares Availability</span>
            <Boxes className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">96.8%</div>
          <div className="text-[10px] text-stone-400 font-bold mt-1">Station inventory ready</div>
        </div>
      </div>

      {/* ── WORK ORDERS SECTION WITH FILTER TABS ── */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e3dc] pb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <span className="text-sm font-extrabold text-stone-900 uppercase tracking-tight">
              Work Order Queue ({filteredOrders.length})
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs font-bold">
            {[
              { id: 'ALL', label: 'All Jobs' },
              { id: 'OPEN', label: `Open (${openCount})` },
              { id: 'IN_PROGRESS', label: `In Progress (${inProgressCount})` },
              { id: 'COMPLETED', label: `Completed (${completedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl transition ${
                  filterStatus === tab.id
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-[#f8f7f4] text-stone-600 hover:text-stone-900 border border-[#e5e3dc]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Work Order Cards List */}
        <div className="space-y-3">
          {filteredOrders.map(wo => (
            <div 
              key={wo.id}
              className="p-5 rounded-2xl bg-[#f8f7f4] border border-[#e5e3dc] space-y-3 hover:border-stone-300 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-900 text-amber-300 font-mono text-[10px] font-black">
                    {wo.id}
                  </span>
                  <div>
                    <h3 className="text-sm font-extrabold text-stone-900">{wo.title}</h3>
                    <div className="text-xs text-stone-500 font-medium">
                      Equipment: <strong>{wo.equipmentName}</strong> · Tech: <strong>{wo.assignedTechnician}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    wo.priority === 'EMERGENCY' ? 'bg-rose-100 text-rose-800 animate-pulse' :
                    wo.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {wo.priority} Priority
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    wo.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                    wo.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {wo.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                {wo.description}
              </p>

              {/* Required Spares Pill */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
                <span className="text-stone-400 font-bold">Allocated Parts:</span>
                {wo.requiredParts.map((part, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-[#e5e3dc] text-stone-700 font-medium">
                    📦 {part}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200/70 text-xs">
                <div className="text-[11px] text-stone-500 flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Logged: {wo.createdDate} · Target Resolution: <strong>{wo.etaDays} Days</strong></span>
                </div>

                <div className="flex items-center space-x-2">
                  {wo.status === 'OPEN' && (
                    <button
                      onClick={() => updateWOStatus(wo.id, 'IN_PROGRESS')}
                      className="px-3 py-1 rounded-lg font-bold bg-blue-600 hover:bg-blue-700 text-white transition text-xs"
                    >
                      Start Task
                    </button>
                  )}
                  {wo.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => updateWOStatus(wo.id, 'COMPLETED')}
                      className="px-3 py-1 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition text-xs"
                    >
                      ✓ Mark Completed
                    </button>
                  )}
                  {wo.status === 'COMPLETED' && (
                    <button
                      onClick={() => updateWOStatus(wo.id, 'OPEN')}
                      className="px-2.5 py-1 rounded-lg font-bold bg-stone-200 text-stone-700 hover:bg-stone-300 transition text-xs"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CREATE WORK ORDER MODAL ── */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-sans text-xs">
          <div className="bg-white border border-[#e5e3dc] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center space-x-2">
                <Wrench className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900">Create New Maintenance Job Card</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkOrder} className="space-y-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Target Equipment</label>
                <select
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc] text-stone-900 font-medium"
                >
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} ({eq.healthPercent}% Health · {eq.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Assigned Tech</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. Rajesh Sharma"
                    value={techName}
                    onChange={(e) => setTechName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc] text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc] text-stone-900 font-medium"
                  >
                    <option value="LOW">Low (Routine)</option>
                    <option value="MEDIUM">Medium (Scheduled)</option>
                    <option value="HIGH">High (Warning)</option>
                    <option value="EMERGENCY">Emergency (Critical Fail)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valve inspection & filter replacement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc] text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Detailed Procedure / Observations</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Specify symptoms, anomaly logs, or procedure steps..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#f8f7f4] border border-[#e5e3dc] text-stone-900 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 bg-stone-100 hover:bg-stone-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Authorize & Issue Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
