import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';
import { Bot, Send, Sparkles, User, Cpu, ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  structuredResponse?: {
    currentSensorData?: string;
    documentedProcedure?: string;
    systemRecommendation?: string;
    unknownOrInsufficientData?: string;
  };
}

export const AssistantPage: React.FC = () => {
  const { activeStationId } = useSimulation();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Yo Operator! I'm FrostByte ❄️💻 — your Antarctic Digital Twin AI for ${activeStationId.toUpperCase()} Research Station, powered by Google Gemini Flash LLM.\n\nI crunch live station telemetry, detect sub-zero risks, and cross-reference official NCPOR/MoES Polar Standard Operating Procedures (SOP) to keep your mission rock-solid. What's on your radar today?`,
      source: 'GOOGLE_GEMINI_AI',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputPrompt,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputPrompt;
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await api.queryAssistant(activeStationId, currentInput);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: res.answer || res.response?.fullMarkdownAnswer,
        source: res.response?.source || 'GOOGLE_GEMINI_AI',
        structuredResponse: res.response,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Error querying FrostByte AI engine.',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    "Explain how AI works in our Antarctic Digital Twin in a few words",
    `What's the current telemetry vibe at ${activeStationId.toUpperCase()}?`,
    "What is the SOP during a katabatic blizzard?",
    "What happens if Generator #1 suffers a thermal trip?",
    "How is the lake water pump protected against freezing?",
    "How does Bharati CHP waste-heat recovery work?"
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e3dc] shadow-polar flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span>Layer 10: RAG Mission Intelligence & Decision Support</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 flex items-center space-x-2">
            <span className="text-2xl">❄️</span>
            <span className="uppercase tracking-wide">FrostByte // Polar AI Operations Terminal</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time Digital Twin Telemetry Retrieval • NCPOR Polar SOP Knowledge Base • {activeStationId.toUpperCase()} Station
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center space-x-2 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>FROSTBYTE AI • GEMINI FLASH</span>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1.5 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>GROUNDED RAG ACTIVE</span>
          </span>
        </div>
      </div>

      {/* CHAT CONTAINER */}
      <div className="bg-white rounded-2xl border border-[#e5e3dc] shadow-polar overflow-hidden flex flex-col h-[620px]">
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs font-sans">
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
                className={`max-w-3xl p-5 rounded-2xl ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-700 text-white shadow-sm' 
                    : 'bg-[#fcfbf9] border border-[#e2e0d8] text-slate-900 space-y-3 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-200/70 mb-2">
                  <div className="flex items-center space-x-2">
                    {msg.sender === 'user' ? (
                      <span className="font-bold tracking-wider text-indigo-100">STATION OPERATOR</span>
                    ) : (
                      <span className="flex items-center space-x-1.5 font-extrabold text-cyan-950">
                        <span className="text-sm">❄️</span>
                        <span>FROSTBYTE (GOOGLE GEMINI FLASH LLM)</span>
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-mono font-bold">
                          NCPOR SOP RAG
                        </span>
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">{msg.timestamp}</span>
                </div>

                <div className="whitespace-pre-wrap leading-relaxed font-sans text-xs text-slate-800 selection:bg-indigo-100">
                  {msg.text}
                </div>

                {/* STRUCTURED CARDS IF PRESENT */}
                {msg.structuredResponse && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    {msg.structuredResponse.currentSensorData && (
                      <div className="p-3 bg-white rounded-xl border border-sky-200 text-xs">
                        <div className="font-bold text-sky-950 flex items-center gap-1.5 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-sky-600" />
                          CURRENT SENSOR DATA
                        </div>
                        <p className="text-sky-900">{msg.structuredResponse.currentSensorData}</p>
                      </div>
                    )}

                    {msg.structuredResponse.documentedProcedure && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                        <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
                          <FileText className="w-4 h-4 text-amber-600" />
                          DOCUMENTED PROCEDURE (OFFICIAL SOP)
                        </div>
                        <p className="text-amber-900 whitespace-pre-wrap">{msg.structuredResponse.documentedProcedure}</p>
                      </div>
                    )}

                    {msg.structuredResponse.systemRecommendation && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                        <div className="font-bold text-emerald-950 flex items-center gap-1.5 mb-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          SYSTEM RECOMMENDATION
                        </div>
                        <p className="text-emerald-900">{msg.structuredResponse.systemRecommendation}</p>
                      </div>
                    )}

                    {msg.structuredResponse.unknownOrInsufficientData && (
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs">
                        <div className="font-bold text-rose-950 flex items-center gap-1.5 mb-1">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          UNKNOWN / INSUFFICIENT DATA
                        </div>
                        <p className="text-rose-900">{msg.structuredResponse.unknownOrInsufficientData}</p>
                      </div>
                    )}
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
              <span>Retrieving Digital Twin telemetry & SOP context...</span>
            </div>
          )}
        </div>

        {/* Sample Question Chips */}
        <div className="px-6 py-3 bg-[#f8f7f4] border-t border-[#e5e3dc] flex flex-wrap gap-2">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setInputPrompt(q)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium border border-[#e5e3dc] transition shadow-sm"
            >
              "{q}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#f8f7f4] border-t border-[#e5e3dc] flex items-center space-x-3">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={`Ask FrostByte about ${activeStationId.toUpperCase()} telemetry, blizzards, or polar SOPs...`}
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
