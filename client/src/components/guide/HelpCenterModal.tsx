import React, { useState } from 'react';
import { 
  HelpCircle, 
  X, 
  Search, 
  BookOpen, 
  Zap, 
  Thermometer, 
  Mountain, 
  ShieldAlert, 
  Bot, 
  ArrowRight,
  Sparkles,
  Compass,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenTour: () => void;
}

interface GlossaryEntry {
  term: string;
  category: 'Polar' | 'Power' | 'Weather' | 'System';
  plainExplanation: string;
  whyItMatters: string;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenTour
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'glossary' | 'compare' | 'shortcuts'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const glossaryEntries: GlossaryEntry[] = [
    {
      term: 'Digital Twin',
      category: 'System',
      plainExplanation: 'A real-time virtual replica of the physical Antarctic research station that continuously mirrors real equipment status, temperatures, and power loads.',
      whyItMatters: 'Allows scientists and engineers to test scenarios, spot failing parts, and predict problems without risking lives in Antarctica.'
    },
    {
      term: 'SITREP (Situation Report)',
      category: 'System',
      plainExplanation: 'A concise daily operational summary delivered to the Station Commander highlighting power health, fuel reserves, incoming storms, and crew status.',
      whyItMatters: 'Keeps station leadership instantly informed of critical anomalies.'
    },
    {
      term: 'Maitri Station',
      category: 'Polar',
      plainExplanation: 'India’s second permanent Antarctic research station, established in 1988 in the rocky Schirmacher Oasis. Houses ~47 personnel through the winter.',
      whyItMatters: 'Historic station supporting vital geomagnetism, atmospheric, and biology research near Lake Priyadarshini.'
    },
    {
      term: 'Bharati Station',
      category: 'Polar',
      plainExplanation: 'India’s modern third Antarctic research station, commissioned in 2012 on the coast of Larsemann Hills. Built from 134 interconnected ISO containers on stilts.',
      whyItMatters: 'Aerodynamically designed so Antarctic snow drifts pass underneath without burying the buildings.'
    },
    {
      term: 'Microgrid & Hybrid Power',
      category: 'Power',
      plainExplanation: 'A self-contained electrical grid that integrates clean solar panels, wind turbines, and backup diesel generators into a stable power system.',
      whyItMatters: 'Antarctica has no public power lines. If the microgrid fails, indoor temperatures become life-threatening in hours.'
    },
    {
      term: 'DG-01 / DG-02 / DG-03',
      category: 'Power',
      plainExplanation: 'Diesel Generators. Polar stations use heavy-duty Caterpillar or Scania engines configured in an N+1 redundancy setup.',
      whyItMatters: 'If one generator trips from overheating or fuel line freeze, the secondary backup generator automatically starts within seconds.'
    },
    {
      term: 'Fuel Reserves Autonomy',
      category: 'Power',
      plainExplanation: 'The calculated number of days the station can survive on its current fuel storage without any new delivery ship arriving.',
      whyItMatters: 'Resupply ships can only reach Antarctica during the brief 3-month polar summer. Bases require 40+ days of reserve margin.'
    },
    {
      term: 'hPa (Hectopascals)',
      category: 'Weather',
      plainExplanation: 'A metric unit of atmospheric air pressure. Normal sea level pressure is around 1013 hPa.',
      whyItMatters: 'A rapid drop in barometric pressure (e.g. falling below 970 hPa) is the earliest warning of an incoming catastrophic polar blizzard.'
    },
    {
      term: 'Katabatic Winds',
      category: 'Weather',
      plainExplanation: 'Violent gravity-driven winds that rush down the high inland ice plateau toward the coast at speeds exceeding 150 km/h.',
      whyItMatters: 'Causes blinding whiteouts, damages solar panels, and forces the station into emergency lockdown.'
    },
    {
      term: 'Telemetry',
      category: 'System',
      plainExplanation: 'Automated digital measurement data streamed continuously from physical sensors in Antarctica via satellite to the digital twin in India.',
      whyItMatters: 'Provides 24/7 visibility into generator vibration, pipe freezing, and battery health from 11,000 km away.'
    },
    {
      term: 'Load Shedding',
      category: 'Power',
      plainExplanation: 'An automated emergency action where the station computer cuts power to non-critical items (sauna, hobby rooms, non-essential lights) when power is limited.',
      whyItMatters: 'Ensures life-support heaters, medical equipment, and radio communications never lose electricity.'
    },
    {
      term: 'NCPOR',
      category: 'Polar',
      plainExplanation: 'National Centre for Polar and Ocean Research, based in Goa, India, under the Ministry of Earth Sciences. The government body that leads Indian Antarctic expeditions.',
      whyItMatters: 'Headquarters directing all scientific research, resupply logistics, and station maintenance.'
    }
  ];

  const filteredGlossary = glossaryEntries.filter(entry => 
    entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.plainExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200 font-sans select-none">
      <div className="relative w-full max-w-3xl bg-white border border-[#e5e3dc] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                  Visitor Help Center
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Plain English
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white">
                Antarctic Digital Twin Guide & Glossary
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition"
            title="Close Help Center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-[#f8f7f4] border-b border-[#e5e3dc] flex items-center space-x-2 overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'overview'
                ? 'bg-white text-blue-800 shadow-sm border border-[#e5e3dc]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📖 In 60 Seconds
          </button>

          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'glossary'
                ? 'bg-white text-blue-800 shadow-sm border border-[#e5e3dc]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            <span>Plain-English Glossary ({glossaryEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`px-3.5 py-2 rounded-xl transition ${
              activeTab === 'compare'
                ? 'bg-white text-blue-800 shadow-sm border border-[#e5e3dc]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🏔️ Maitri vs Bharati
          </button>

          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
              activeTab === 'shortcuts'
                ? 'bg-white text-blue-800 shadow-sm border border-[#e5e3dc]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Things to Try</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: OVERVIEW IN 60 SECONDS */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center space-x-2 text-blue-900 font-extrabold text-sm">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>What is this website in simple words?</span>
                </div>
                <p className="text-stone-700">
                  Imagine building a video game simulation of a real space station—except it’s on Earth, at the South Pole! 
                  India has two active scientific bases in Antarctica: <strong>Maitri</strong> and <strong>Bharati</strong>.
                  This <strong>Digital Twin</strong> gives you a live dashboard and 3D model that simulates everything keeping the scientists alive in -89°C blizzards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>1. Power & Heating</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Solar panels, wind turbines, and diesel generators produce electricity and pump recycled exhaust heat into living quarters.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-sky-500" />
                    <span>2. Weather & Storms</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Live satellite telemetry monitors 150 km/h winds, sub-zero temperatures, and atmospheric barometric drops.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                  <div className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-emerald-500" />
                    <span>3. AI Copilot</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    FrostByte AI analyzes sensor data and answers questions in simple language to help operators avoid mistakes.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div>
                  <div className="font-bold text-stone-900 text-xs">Want a step-by-step interactive walkthrough?</div>
                  <div className="text-[11px] text-stone-500">Takes 2 minutes to show you the highlights.</div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenTour();
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5"
                >
                  <span>Start 2-Min Tour</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PLAIN ENGLISH GLOSSARY */}
          {activeTab === 'glossary' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search any term (e.g. SITREP, microgrid, DG-02, hPa, Maitri)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e5e3dc] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-stone-50 font-medium"
                />
              </div>

              {/* Glossary List */}
              <div className="space-y-2.5">
                {filteredGlossary.map((entry, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-[#e5e3dc] hover:border-sky-300 transition shadow-sm space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-stone-900">
                        {entry.term}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        entry.category === 'Polar' ? 'bg-cyan-50 text-cyan-800 border border-cyan-200' :
                        entry.category === 'Power' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                        entry.category === 'Weather' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                        'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}>
                        {entry.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-normal">
                      {entry.plainExplanation}
                    </p>

                    <div className="text-[11px] text-stone-500 font-medium pt-0.5">
                      <span className="font-bold text-stone-700">Why it matters: </span>
                      {entry.whyItMatters}
                    </div>
                  </div>
                ))}

                {filteredGlossary.length === 0 && (
                  <div className="text-center py-8 text-stone-400 text-xs">
                    No matching polar terms found. Try searching for &ldquo;fuel&rdquo;, &ldquo;grid&rdquo;, or &ldquo;weather&rdquo;.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MAITRI VS BHARATI */}
          {activeTab === 'compare' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Maitri Card */}
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900 uppercase">🏔️ MAITRI STATION</span>
                    <span className="px-2 py-0.5 bg-blue-200 text-blue-900 font-bold rounded text-[10px]">EST. 1988</span>
                  </div>
                  <div className="text-[11px] text-blue-800 font-medium">
                    Schirmacher Oasis, Queen Maud Land (70.76°S)
                  </div>
                  <ul className="space-y-1 text-stone-700 leading-snug">
                    <li>• <strong>Terrain:</strong> Rocky, ice-free oasis surrounded by glaciers.</li>
                    <li>• <strong>Freshwater:</strong> Fed by freshwater Lake Priyadarshini.</li>
                    <li>• <strong>Capacity:</strong> ~25 in winter, up to 72 in polar summer.</li>
                    <li>• <strong>Focus:</strong> Meteorology, geomagnetism, atmospheric science.</li>
                    <li>• <strong>Design:</strong> Modular steel building on concrete footings.</li>
                  </ul>
                  <button
                    onClick={() => {
                      onNavigateTab('compare');
                      onClose();
                    }}
                    className="mt-2 w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition"
                  >
                    View Maitri vs Bharati Specs
                  </button>
                </div>

                {/* Bharati Card */}
                <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-sky-900 uppercase">🏔️ BHARATI STATION</span>
                    <span className="px-2 py-0.5 bg-sky-200 text-sky-900 font-bold rounded text-[10px]">EST. 2012</span>
                  </div>
                  <div className="text-[11px] text-sky-800 font-medium">
                    Larsemann Hills, Prydz Bay (69.40°S)
                  </div>
                  <ul className="space-y-1 text-stone-700 leading-snug">
                    <li>• <strong>Terrain:</strong> Coastal promontory facing the Antarctic Ocean.</li>
                    <li>• <strong>Architecture:</strong> 134 prefabricated ISO containers on stilts.</li>
                    <li>• <strong>Capacity:</strong> ~47 crew year-round.</li>
                    <li>• <strong>Aerodynamics:</strong> Elevated stilts stop snowdrifts from burying the base.</li>
                    <li>• <strong>Focus:</strong> Oceanography, satellite ground station, glaciology.</li>
                  </ul>
                  <button
                    onClick={() => {
                      onNavigateTab('compare');
                      onClose();
                    }}
                    className="mt-2 w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs transition"
                  >
                    Compare Telemetry Side-by-Side
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: THINGS TO TRY */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-600 font-medium">
                Here are 4 exciting things any first-time visitor can try right now to understand how the system works:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => {
                    onNavigateTab('twin');
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 hover:bg-indigo-100/80 cursor-pointer transition space-y-1"
                >
                  <div className="text-xs font-black text-indigo-900 flex items-center justify-between">
                    <span>🎮 1. Rotate the 3D Base</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <p className="text-[11px] text-indigo-800">
                    See the 3D digital model of the station containers, solar panels, and generator rooms.
                  </p>
                </div>

                <div 
                  onClick={() => {
                    onNavigateTab('scenarios');
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 hover:bg-rose-100/80 cursor-pointer transition space-y-1"
                >
                  <div className="text-xs font-black text-rose-900 flex items-center justify-between">
                    <span>❄️ 2. Simulate a Blizzard</span>
                    <ArrowRight className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <p className="text-[11px] text-rose-800">
                    Trigger a 140 km/h blizzard and watch the automated load-shedder protect life support.
                  </p>
                </div>

                <div 
                  onClick={() => {
                    onNavigateTab('compare');
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 hover:bg-emerald-100/80 cursor-pointer transition space-y-1"
                >
                  <div className="text-xs font-black text-emerald-900 flex items-center justify-between">
                    <span>🏔️ 3. Compare Both Bases</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    See side-by-side fuel consumption, solar generation, and crew numbers.
                  </p>
                </div>

                <div 
                  onClick={() => {
                    onNavigateTab('assistant');
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 hover:bg-cyan-100/80 cursor-pointer transition space-y-1"
                >
                  <div className="text-xs font-black text-cyan-900 flex items-center justify-between">
                    <span>🤖 4. Ask FrostByte AI</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-600" />
                  </div>
                  <p className="text-[11px] text-cyan-800">
                    Ask questions like &ldquo;How do they survive winter?&rdquo; in everyday English.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f8f7f4] border-t border-[#e5e3dc] flex items-center justify-between shrink-0 text-xs">
          <span className="text-stone-500 font-medium">
            Ministry of Earth Sciences • NCPOR #26060
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
