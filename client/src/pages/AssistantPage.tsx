import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { ComponentPrediction } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Cpu, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Wrench,
  Zap,
  Droplets,
  BatteryCharging,
  Flame,
  Check,
  ArrowRight,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  componentPredictions?: ComponentPrediction[];
  structuredResponse?: {
    currentSensorData?: string;
    documentedProcedure?: string;
    systemRecommendation?: string;
    unknownOrInsufficientData?: string;
    componentPredictions?: ComponentPrediction[];
  };
}

export const AssistantPage: React.FC = () => {
  const { activeStationId, triggerScenario } = useSimulation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Greetings Operator! I'm FrostByte ❄️💻 — your Antarctic Digital Twin Mission AI for ${activeStationId.toUpperCase()} Research Station, powered by real-time physics telemetry & official NCPOR polar SOPs.\n\nWinter is approaching across Queen Maud Land & Prydz Bay. Ask me what conservation steps are required to protect your station infrastructure, and I'll predict exactly how each component will be saved!`,
      source: 'GROQ_RAG_AI',
      timestamp: new Date().toLocaleTimeString(),
      componentPredictions: [
        {
          componentName: activeStationId === 'maitri' ? 'Primary Diesel Generator #1' : 'CHP Co-Gen Unit #1',
          componentId: activeStationId === 'maitri' ? 'GEN-MTR-01' : 'CHP-BHR-01',
          currentRisk: 'Winter heating demand surge will push generator load to 91% and winding temp to 94°C (thermal trip threshold).',
          conservationAction: 'Shed Tier-3 non-critical research lab heating (-38 kW demand reduction).',
          predictedSavedBenefit: 'Reduces generator load to 64%, stabilizes temp at 68°C, avoids catastrophic shutdown, and extends lifespan by +35%.',
          savingsMetric: '-26°C Cooler / +35% Lifespan Extended',
          urgency: 'CRITICAL',
          actionType: 'SHED_LOAD'
        },
        {
          componentName: activeStationId === 'maitri' ? 'Priyadarshini Lake Water Pump House' : 'Prydz Bay Seawater Intake RO Line',
          componentId: activeStationId === 'maitri' ? 'MAITRI-PUMP-LAKE' : 'BHARATI-SEAWATER-PUMP',
          currentRisk: 'Sub-zero lake freezing drops intake fluid below 0.8°C; frazil ice slush will lock pump impeller and burst delivery pipes.',
          conservationAction: 'Engage secondary recirculating trace-heating loop and cycle warm return water.',
          predictedSavedBenefit: 'Maintains intake fluid at +2.8°C, eliminating frazil ice formation and saving the water pump and conduit from freeze rupture.',
          savingsMetric: '100% Water Security / Zero Freeze Risk',
          urgency: 'HIGH',
          actionType: 'ACTIVATE_TRACE_HEAT'
        }
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedActions, setAppliedActions] = useState<Record<string, string>>({});
  const [applyingAction, setApplyingAction] = useState<string | null>(null);

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToSend = customQuery || inputPrompt;
    if (!queryToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.queryAssistant(activeStationId, queryToSend);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: res.answer || res.response?.fullMarkdownAnswer,
        source: res.response?.source || 'GROQ_RAG_AI',
        structuredResponse: res.response,
        componentPredictions: res.componentPredictions || res.response?.componentPredictions,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Error querying FrostByte AI engine. Check telemetry network.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyConservation = async (pred: ComponentPrediction) => {
    const actionKey = `${pred.actionType}-${pred.componentName}`;
    setApplyingAction(actionKey);
    try {
      const result = await api.applyConservationAction(activeStationId, pred.actionType, pred.componentName);
      setAppliedActions(prev => ({
        ...prev,
        [actionKey]: result.appliedEffect || result.message || 'Conservation action executed successfully.'
      }));
    } finally {
      setApplyingAction(null);
    }
  };

  const sampleQuestions = [
    "Winter is approaching! What must we do to conserve energy and save our station components?",
    "How do we prevent Generator #1 from overheating during high winter load?",
    "What conservation steps save Priyadarshini water pump from freezing?",
    "How do we preserve our battery buffer through polar night?",
    "What is the official NCPOR SOP during a katabatic blizzard?",
    "Explain how AI works in our Antarctic Digital Twin in a few words"
  ];

  const getComponentIcon = (actionType: string) => {
    switch (actionType) {
      case 'SHED_LOAD':
      case 'BALANCED_GENERATOR':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'ACTIVATE_TRACE_HEAT':
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case 'RESERVE_OPTIMIZATION':
        return <BatteryCharging className="w-4 h-4 text-emerald-600" />;
      case 'MODULATE_SETPOINT':
        return <Flame className="w-4 h-4 text-rose-600" />;
      case 'STOW_SOLAR':
        return <Wrench className="w-4 h-4 text-purple-600" />;
      default:
        return <Wrench className="w-4 h-4 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-polar flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Layer 10: RAG Mission Intelligence & Predictive Conservation</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <span className="text-2xl">❄️</span>
            <span className="uppercase tracking-wide">FrostByte // Polar AI Operations & Conservation Advisor</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-Time Predictive Equipment Preservation • Consequence Propagation • {activeStationId.toUpperCase()} Research Station
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center space-x-2 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>PREDICTIVE CONSERVATION ACTIVE</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>COMPONENT AUTO-PROTECT</span>
          </span>
        </div>
      </div>

      {/* QUICK WINTER SCENARIO LAUNCH BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-900 via-indigo-900 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-cyan-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
              Winter Approaching Simulation Test
            </div>
            <div className="text-xs text-slate-200 mt-0.5">
              Simulate severe polar winter conditions and ask FrostByte AI how to conserve power, fuel, and protect critical components.
            </div>
          </div>
        </div>

        <button
          onClick={() => handleSend(undefined, "Winter is approaching! What must we do to conserve energy and save our station components?")}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1.5 shrink-0"
        >
          <span>Ask FrostByte to Predict Savings</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-white rounded-2xl border border-[#e5e3dc] shadow-polar overflow-hidden flex flex-col h-[680px]">
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs font-sans">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
            >
              {msg.sender === 'assistant' && (
                <div className="p-2.5 rounded-xl bg-indigo-100 border border-indigo-300 text-indigo-800 shrink-0 shadow-sm">
                  <Bot className="w-4 h-4 text-indigo-700" />
                </div>
              )}

              <div 
                className={`max-w-4xl p-5 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-700 text-white shadow-sm' 
                    : 'bg-[#fcfbf9] border border-[#e2e0d8] text-slate-900 space-y-4 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-200/70 mb-2">
                  <div className="flex items-center space-x-2">
                    {msg.sender === 'user' ? (
                      <span className="font-bold tracking-wider text-indigo-100">STATION OPERATOR</span>
                    ) : (
                      <span className="flex items-center space-x-1.5 font-extrabold text-cyan-950">
                        <span className="text-sm">❄️</span>
                        <span>FROSTBYTE // POLAR MISSION INTELLIGENCE</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-mono font-bold">
                          {msg.source || 'GROQ_RAG_AI'}
                        </span>
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs text-slate-800 selection:bg-indigo-100">
                  {msg.text}
                </div>

                {/* COMPONENT PRESERVATION & CONSERVATION MATRIX */}
                {(msg.componentPredictions || msg.structuredResponse?.componentPredictions) && (
                  <div className="pt-3 border-t border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                          Component Conservation & Predictive Savings Matrix
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        "If You Do This, Your Component Will Be Saved"
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {(msg.componentPredictions || msg.structuredResponse?.componentPredictions || []).map((pred, pIdx) => {
                        const actionKey = `${pred.actionType}-${pred.componentName}`;
                        const isApplied = !!appliedActions[actionKey];
                        const isCurrentlyApplying = applyingAction === actionKey;

                        return (
                          <div 
                            key={pIdx}
                            className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                              isApplied
                                ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400'
                                : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
                            }`}
                          >
                            <div>
                              {/* Header & Badges */}
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center space-x-2">
                                  <div className="p-1 rounded-lg bg-slate-100 border border-slate-200">
                                    {getComponentIcon(pred.actionType)}
                                  </div>
                                  <span className="text-xs font-black text-slate-900">
                                    {pred.componentName}
                                  </span>
                                </div>
                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                  pred.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                                  pred.urgency === 'HIGH' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                  'bg-blue-100 text-blue-800 border border-blue-200'
                                }`}>
                                  {pred.urgency}
                                </span>
                              </div>

                              {/* Imminent Threat */}
                              <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200/80 mb-2">
                                <div className="text-[10px] font-extrabold text-rose-900 uppercase flex items-center gap-1 mb-0.5">
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  <span>Winter Threat (If No Action Taken):</span>
                                </div>
                                <p className="text-[11px] text-rose-950 font-medium leading-relaxed">
                                  {pred.currentRisk}
                                </p>
                              </div>

                              {/* Recommended Action */}
                              <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200 mb-2">
                                <div className="text-[10px] font-extrabold text-indigo-900 uppercase flex items-center gap-1 mb-0.5">
                                  <Wrench className="w-3 h-3 text-indigo-600" />
                                  <span>Recommended Conservation Action:</span>
                                </div>
                                <p className="text-[11px] text-indigo-950 font-medium leading-relaxed">
                                  {pred.conservationAction}
                                </p>
                              </div>

                              {/* "If you do this, your component will be saved" */}
                              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300">
                                <div className="text-[10px] font-black text-emerald-950 uppercase flex items-center gap-1 mb-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>If You Do This, Your Component Is Saved:</span>
                                </div>
                                <p className="text-[11px] text-emerald-900 font-semibold leading-relaxed">
                                  {pred.predictedSavedBenefit}
                                </p>
                                <div className="mt-2 pt-1.5 border-t border-emerald-200/80 flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-emerald-800 font-mono">
                                    Impact: {pred.savingsMetric}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Action Execution Button */}
                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                              {isApplied ? (
                                <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5 py-1">
                                  <Check className="w-4 h-4 text-emerald-600" />
                                  <span>Action Applied • Component Saved</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleApplyConservation(pred)}
                                  disabled={isCurrentlyApplying}
                                  className="w-full py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition shadow-sm flex items-center justify-center space-x-1.5 disabled:opacity-50"
                                >
                                  {isCurrentlyApplying ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>Applying Conservation...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                                      <span>Apply Conservation Action</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-indigo-700 font-medium">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
              <span>FrostByte AI analyzing winter consequence propagation & component preservation...</span>
            </div>
          )}
        </div>

        {/* Sample Question Chips */}
        <div className="px-6 py-3 bg-[#f8f7f4] border-t border-[#e5e3dc] flex flex-wrap gap-2">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(undefined, q)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium border border-[#e5e3dc] transition shadow-sm flex items-center space-x-1"
            >
              <span>"{q}"</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#f8f7f4] border-t border-[#e5e3dc] flex items-center space-x-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask FrostByte: "Winter is coming, how do we conserve and save our components?"`}
            className="flex-1 bg-white border border-[#e5e3dc] rounded-xl px-4 py-2.5 text-xs text-stone-900 font-sans focus:outline-none focus:border-cyan-600 shadow-sm"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs shadow-md transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>ASK FROSTBYTE</span>
          </button>
        </form>
      </div>
    </div>
  );
};
