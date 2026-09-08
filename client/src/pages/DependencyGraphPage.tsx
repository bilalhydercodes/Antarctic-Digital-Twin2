import React, { useState, useEffect } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { 
  GitFork, 
  AlertOctagon, 
  ShieldCheck, 
  Flame, 
  Zap, 
  Waves, 
  Radio, 
  HeartHandshake, 
  ArrowRight,
  Activity,
  Layers
} from 'lucide-react';
import { DependencyNode, DependencyPropagationResult } from '../types';

export const DependencyGraphPage: React.FC = () => {
  const { activeStationId } = useSimulation();

  const [nodes, setNodes] = useState<DependencyNode[]>([]);
  const [selectedFailedComponent, setSelectedFailedComponent] = useState<string>('generators_chp');
  const [evaluation, setEvaluation] = useState<DependencyPropagationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runEvaluation = async (componentId: string) => {
    setSelectedFailedComponent(componentId);
    setLoading(true);
    try {
      const res = await api.evaluateDependencies(activeStationId, componentId);
      if (res.success) {
        setNodes(res.nodes || []);
        setEvaluation(res.evaluation || null);
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runEvaluation('generators_chp');
  }, [activeStationId]);

  const getNodeIcon = (category: string) => {
    switch (category) {
      case 'FUEL': return <Flame className="w-4 h-4 text-amber-500" />;
      case 'POWER': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'HEATING': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'WATER': return <Waves className="w-4 h-4 text-blue-500" />;
      case 'COMMS': return <Radio className="w-4 h-4 text-purple-500" />;
      case 'LIFE_SUPPORT': return <HeartHandshake className="w-4 h-4 text-rose-500" />;
      default: return <Activity className="w-4 h-4 text-stone-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
            <GitFork className="w-4 h-4" />
            <span>Layer 16 & 17: Multi-System Dependency Engine</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            {activeStationId === 'maitri' ? 'Maitri' : 'Bharati'} Topological Dependency Graph
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Simulates cascading system failures across Station Fuel, Primary CHP Generators, 415V Switchgear, Hydronic Heating Loops, Seawater Intake, Satellite Links, and Crew Life Support.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-purple-100 text-purple-800 border border-purple-300">
            Graph: Directed Acyclic
          </span>
        </div>
      </div>

      {/* Component Trip Selector */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-md border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase">Select Root Failure Component for Propagation Test</h2>
          </div>
          <span className="text-xs text-stone-400 font-mono">BFS Cascading Evaluation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {[
            { id: 'fuel_storage', label: 'Fuel Day-Tanks', cat: 'FUEL' },
            { id: 'generators_chp', label: 'CHP Generators', cat: 'POWER' },
            { id: 'electrical_grid', label: '415V Main Grid', cat: 'POWER' },
            { id: 'hydronic_heating', label: 'Heating Boiler Loop', cat: 'HEATING' },
            { id: 'intake_water_pumps', label: 'Lake/Intake Pumps', cat: 'WATER' },
            { id: 'satellite_comms', label: 'Earth Station Link', cat: 'COMMS' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => runEvaluation(item.id)}
              className={`p-3 rounded-xl text-left border transition ${
                selectedFailedComponent === item.id
                  ? 'bg-rose-950/80 border-rose-500 text-white shadow-md'
                  : 'bg-stone-800/80 border-stone-700 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="font-bold text-xs">{item.label}</div>
              <div className="text-[10px] text-stone-400 mt-1 uppercase font-mono">{item.cat}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Propagation Impact Results Bar */}
      {evaluation && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Direct System Impacts</div>
            <div className="text-2xl font-black text-rose-600 mt-1">{evaluation.directImpacts.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">
              {evaluation.directImpacts.join(', ') || 'None'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Indirect Cascades</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{evaluation.indirectImpacts.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">
              {evaluation.indirectImpacts.join(', ') || 'None'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e5e3dc] shadow-sm">
            <div className="text-[10px] font-bold text-stone-400 uppercase">Critical Dependencies At Risk</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{evaluation.criticalDependenciesAtRisk.length}</div>
            <div className="text-[11px] text-stone-500 mt-1">
              Level 1 & 2 Infrastructure
            </div>
          </div>

          <div className={`p-4 rounded-xl border shadow-sm ${
            evaluation.lifeSupportImpacted ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}>
            <div className="text-[10px] font-bold uppercase tracking-wider">Crew Life Support Status</div>
            <div className="text-xl font-black mt-1">
              {evaluation.lifeSupportImpacted ? 'CRITICAL RISK' : 'PRESERVED'}
            </div>
            <div className="text-[11px] mt-1 font-medium">
              {evaluation.lifeSupportImpacted ? 'Automated load-shedding engaged' : 'Thermal isolation intact'}
            </div>
          </div>
        </div>
      )}

      {/* Visual Topological Nodes Representation */}
      <div className="bg-white rounded-2xl p-6 border border-[#e5e3dc] shadow-sm">
        <h2 className="text-base font-extrabold text-stone-900 mb-2">
          Interactive Node Architecture & Cascading Path
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          Nodes highlighted in RED represent the initial point of failure, ORANGE indicates directly affected dependencies, and PURPLE marks cascaded downstream impacts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {nodes.map((node) => {
            const isRootFail = selectedFailedComponent === node.id;
            const isDirect = evaluation?.directImpacts.includes(node.id);
            const isIndirect = evaluation?.indirectImpacts.includes(node.id);
            const isAffected = isRootFail || isDirect || isIndirect;

            return (
              <div
                key={node.id}
                className={`p-4 rounded-2xl border transition ${
                  isRootFail ? 'bg-rose-50 border-rose-500 shadow-md ring-2 ring-rose-400/40' :
                  isDirect ? 'bg-amber-50 border-amber-500 shadow-sm' :
                  isIndirect ? 'bg-purple-50 border-purple-400' :
                  'bg-[#fcfbf9] border-[#e5e3dc]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getNodeIcon(node.category)}
                    <span className="font-bold text-xs text-stone-900">{node.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    isRootFail ? 'bg-rose-600 text-white' :
                    isDirect ? 'bg-amber-600 text-white' :
                    isIndirect ? 'bg-purple-600 text-white' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {isRootFail ? 'TRIPPED' : isDirect ? 'IMPACTED' : isIndirect ? 'CASCADED' : 'NOMINAL'}
                  </span>
                </div>

                <div className="text-[11px] text-stone-600 space-y-1 mt-2">
                  <div><strong>Critical Level:</strong> Level {node.criticalLevel} {node.criticalLevel === 1 ? '(Life Safety)' : node.criticalLevel === 2 ? '(Critical Infra)' : '(Station Ops)'}</div>
                  <div><strong>Feeds Into:</strong> {node.supports.length > 0 ? node.supports.join(', ') : 'Terminal Node'}</div>
                  <div><strong>Depends On:</strong> {node.dependsOn.length > 0 ? node.dependsOn.join(', ') : 'Primary Source'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
