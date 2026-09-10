import React, { useState } from 'react';
import { RBACRole, NavTab } from '../../types';
import { PolarLoadingScreen } from './PolarLoadingScreen';
import { audioService } from '../../services/AudioService';
import { 
  Shield, 
  Crown, 
  Settings as SettingsIcon, 
  FlaskConical, 
  Eye, 
  Users, 
  ChevronDown, 
  ArrowRight, 
  Thermometer, 
  Mountain, 
  UserX, 
  Sparkles
} from 'lucide-react';

interface AntarcticLandingPageProps {
  onEnter: (role: RBACRole, targetTab?: NavTab) => void;
  initialRole?: RBACRole;
}

export const AntarcticLandingPage: React.FC<AntarcticLandingPageProps> = ({ 
  onEnter, 
  initialRole = 'COMMANDER' 
}) => {
  const [selectedRole, setSelectedRole] = useState<RBACRole>(initialRole);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Closed by default so page fits screen and showcases the penguin!
  const [showPenguinFact, setShowPenguinFact] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ICE');
  const [isEntering, setIsEntering] = useState(false);
  const [pendingTab, setPendingTab] = useState<NavTab | undefined>(undefined);

  const rolesList: { id: RBACRole; label: string; sublabel: string; icon: React.ReactNode; isRecommended?: boolean }[] = [
    { 
      id: 'COMMANDER', 
      label: 'COMMANDER / EXPLORER', 
      sublabel: 'Full access to all modules, 3D twin, simulations (Recommended for visitors)', 
      icon: <Shield className="w-4 h-4 text-sky-400" />,
      isRecommended: true
    },
    { 
      id: 'SCIENTIST', 
      label: 'SCIENTIST', 
      sublabel: 'Focus on weather, glaciers, climate trends & research dossier', 
      icon: <FlaskConical className="w-4 h-4 text-emerald-400" /> 
    },
    { 
      id: 'OPERATOR', 
      label: 'STATION OPERATOR', 
      sublabel: 'Focus on power grid, diesel generators & fuel reserves', 
      icon: <SettingsIcon className="w-4 h-4 text-blue-300" /> 
    },
    { 
      id: 'ADMIN', 
      label: 'SYSTEM ADMINISTRATOR', 
      sublabel: 'Full system architecture, edge gateways & stress testing', 
      icon: <Crown className="w-4 h-4 text-amber-300" /> 
    },
    { 
      id: 'VIEWER', 
      label: 'READ-ONLY VIEWER', 
      sublabel: 'Live stream telemetry monitoring without operational controls', 
      icon: <Eye className="w-4 h-4 text-stone-300" /> 
    },
  ];

  const handleEnter = (tab?: NavTab, launchTour: boolean = false) => {
    if (launchTour) {
      sessionStorage.setItem('auto_start_tour', 'true');
    }
    setPendingTab(tab);
    audioService.playClick();
    setIsEntering(true);
  };

  const handleLoadingComplete = () => {
    onEnter(selectedRole, pendingTab);
  };

  const getSelectedRoleIcon = () => {
    switch (selectedRole) {
      case 'ADMIN': return <Crown className="w-4 h-4 text-amber-300" />;
      case 'COMMANDER': return <Shield className="w-4 h-4 text-sky-400" />;
      case 'OPERATOR': return <SettingsIcon className="w-4 h-4 text-blue-300" />;
      case 'SCIENTIST': return <FlaskConical className="w-4 h-4 text-emerald-400" />;
      case 'VIEWER': return <Eye className="w-4 h-4 text-stone-300" />;
      default: return <Shield className="w-4 h-4 text-sky-400" />;
    }
  };

  if (isEntering) {
    return (
      <PolarLoadingScreen
        role={selectedRole}
        targetTab={pendingTab}
        onComplete={handleLoadingComplete}
      />
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden select-none flex flex-col justify-between">
      {/* 1. CINEMATIC BACKGROUND IMAGE WITH POLAR OVERLAYS - Anchored to left_bottom to showcase Emperor Penguin */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-[position:left_bottom] bg-no-repeat transition-all duration-1000 transform scale-100"
        style={{
          backgroundImage: `url('/antarctic-landing-bg.jpg')`,
        }}
      >
        {/* Soft atmospheric gradient vignette preserving the penguin on left and station on right */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/50 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-slate-950/20 via-transparent to-slate-950/40 pointer-events-none" />
      </div>

      {/* 2. TOP NAVIGATION BAR */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleEnter()}>
          {/* Stylized Mountain Geometric Vector Icon */}
          <div className="w-9 h-9 flex items-center justify-center">
            <svg viewBox="0 0 36 36" fill="none" className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              <polygon points="18,4 32,30 4,30" stroke="currentColor" strokeWidth="2" fill="none" />
              <polyline points="18,13 25,27 11,27" stroke="#38bdf8" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-[0.25em] text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ANTARCTIC
            </span>
            <span className="text-[9px] font-bold tracking-[0.35em] text-sky-200/80 leading-tight">
              DIGITAL TWIN
            </span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-[0.25em] text-slate-300">
          <button 
            onClick={() => handleEnter('twin')} 
            className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition"
          >
            EXPLORE
          </button>
          <button 
            onClick={() => handleEnter('dashboard')} 
            className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition"
          >
            MONITOR
          </button>
          <button 
            onClick={() => handleEnter('scenarios')} 
            className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition"
          >
            SIMULATE
          </button>
          <button 
            onClick={() => handleEnter('analytics')} 
            className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition"
          >
            ANALYZE
          </button>
          <button 
            onClick={() => handleEnter('incidents')} 
            className="hover:text-cyan-300 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)] transition"
          >
            PROTECT
          </button>
          <a 
            href="/presentation.html" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-amber-300 hover:text-amber-200 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] font-bold transition flex items-center gap-1"
          >
            <span>📽️</span>
            <span>DECK PPT</span>
          </a>
        </nav>

        {/* Right Seismograph / Pulse & Slogan */}
        <div className="hidden sm:flex items-center space-x-3 text-right">
          <div className="text-cyan-400">
            <svg className="w-6 h-6 animate-pulse drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 12h4l2-6 4 12 3-8 2 4h5" />
            </svg>
          </div>
          <div className="text-[9px] font-mono tracking-widest text-slate-300 uppercase leading-snug">
            <div>A CLEANER</div>
            <div>COLDER</div>
            <div className="text-cyan-300">BRIGHTER TOMORROW</div>
          </div>
        </div>
      </header>

      {/* 3. MAIN HERO & FLOATING HUD ELEMENTS */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-2 flex flex-col items-center justify-center my-auto">
        
        {/* LEFT HUD: HOLOGRAPHIC 3D RADAR GLOBE & COORDINATES (Positioned gracefully in upper left) */}
        <div className="hidden lg:block absolute left-4 top-[34%] -translate-y-1/2 font-mono z-20">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Outer Compass Dashed Radar Ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-5 rounded-full border border-sky-400/10" />

            {/* Glowing Holographic Antarctica Continent Contour */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] opacity-85">
                {/* Polar Coordinates Grid Lines */}
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(56,189,248,0.2)" strokeWidth="0.8" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(56,189,248,0.15)" strokeWidth="0.8" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(56,189,248,0.15)" strokeWidth="0.8" />

                {/* Antarctica Continent Outline */}
                <path
                  d="M50,22 C58,23 68,28 73,35 C78,42 82,53 79,62 C76,71 67,78 58,80 C49,82 38,79 32,73 C26,67 22,57 24,48 C26,39 31,31 38,26 C43,23 46,22 50,22 Z"
                  fill="rgba(56, 189, 248, 0.15)"
                  stroke="rgba(125, 211, 252, 0.9)"
                  strokeWidth="1.5"
                />

                {/* Antarctic Peninsula projection */}
                <path
                  d="M32,48 C25,40 18,32 14,24 C13,22 17,21 21,26 C25,31 29,38 34,44"
                  fill="none"
                  stroke="rgba(125, 211, 252, 0.9)"
                  strokeWidth="1.5"
                />

                {/* Station Location Beacon (Maitri & Bharati) */}
                <circle cx="48" cy="38" r="2.5" fill="#38bdf8" className="animate-ping" />
                <circle cx="48" cy="38" r="1.5" fill="#ffffff" />
                <circle cx="68" cy="52" r="1.5" fill="#38bdf8" />
              </svg>
            </div>
          </div>

          {/* Coordinates crosshair */}
          <div className="mt-2 text-[10px] text-slate-300 space-y-0.5 pl-2 border-l border-cyan-500/40">
            <div className="flex items-center space-x-1">
              <span className="text-cyan-400 font-bold">+</span>
              <span>70.4631° S</span>
            </div>
            <div className="pl-2">8.2275° E</div>
          </div>

          {/* Real data highlights */}
          <div className="mt-4 text-[10px] tracking-widest uppercase space-y-1 text-slate-400 pl-2">
            <div className="w-5 h-[1px] bg-cyan-400 mb-1" />
            <div className="text-slate-300 font-bold">REAL DATA</div>
            <div>REAL INSIGHTS</div>
          </div>
        </div>

        {/* EMPEROR PENGUIN SPOTLIGHT CALLOUT & INTERACTIVE BADGE */}
        <div 
          onClick={() => {
            audioService.playClick();
            setShowPenguinFact(!showPenguinFact);
          }}
          className="hidden md:flex flex-col absolute left-6 sm:left-10 bottom-24 sm:bottom-28 z-30 cursor-pointer group select-none"
        >
          {showPenguinFact && (
            <div className="mb-2.5 p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-400/60 backdrop-blur-xl shadow-2xl max-w-xs text-xs text-slate-100 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center space-x-1.5 text-cyan-300 font-bold mb-1">
                <span className="text-base">🐧</span>
                <span>Emperor Penguin (Aptenodytes forsteri)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Native to the Antarctic coastline near Maitri and Bharati stations. They thrive in temperatures down to -50°C and 200 km/h blizzards by huddling together in thousands!
              </p>
            </div>
          )}

          <div className="px-3.5 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-900 border border-cyan-400/50 hover:border-cyan-300 backdrop-blur-md text-xs text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] flex items-center space-x-2 transition transform group-hover:scale-105">
            <span className="text-lg animate-bounce">🐧</span>
            <div className="text-left">
              <div className="font-extrabold text-cyan-300 text-[11px] flex items-center gap-1.5 leading-tight">
                <span>EMPEROR PENGUIN</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-[9px] text-slate-400 font-mono">
                Click for Polar Fact
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT HUD: VERTICAL TIMELINE / TOPIC INDEX */}
        <div className="hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest uppercase">
          <div className="relative pl-5 space-y-3.5 border-l border-cyan-500/30">
            {['ICE', 'WILDLIFE', 'CLIMATE', 'RESEARCH', 'HUMAN ACTIVITY', 'A BRIGHTER TOMORROW'].map((cat) => (
              <div 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative cursor-pointer transition ${
                  activeCategory === cat 
                    ? 'text-cyan-300 font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {activeCategory === cat && (
                  <span className="absolute -left-[25px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
                {cat}
              </div>
            ))}
          </div>

          {/* Environmental Quote */}
          <div className="mt-14 max-w-[200px] text-right text-slate-300 italic font-serif text-[11px] leading-relaxed">
            &ldquo;In Antarctica, we find not just a continent, but a glimpse of a purer Earth.&rdquo;
            <div className="w-8 h-[1px] bg-slate-500 ml-auto mt-2" />
          </div>
        </div>

        {/* HERO TYPOGRAPHY */}
        <div className="text-center space-y-1 mt-2 mb-6">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.45em] text-cyan-300 uppercase">
            W E L C O M E &nbsp; T O
          </div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight uppercase">
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-sky-300 drop-shadow-[0_4px_30px_rgba(56,189,248,0.55)]">
              ANTARCTIC
            </span>
          </h1>

          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.35em] text-white uppercase drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)]">
            DIGITAL TWIN
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto pt-2 font-normal leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            Explore. Simulate. Understand Antarctica.<br />
            Interactive 3D digital replica of India’s <span className="text-cyan-300 font-bold">Maitri (1988)</span> and <span className="text-cyan-300 font-bold">Bharati (2012)</span> polar research bases.
          </p>
        </div>

        {/* 4. DEMO ACCESS CARD */}
        <div className="relative w-full max-w-lg mx-auto backdrop-blur-xl bg-slate-950/75 border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_10px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.15)] space-y-4">
          
          {/* RECOMMENDED VISITOR QUICK START */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-slate-900/60 border border-cyan-400/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
            <div className="text-left">
              <div className="flex items-center space-x-1.5 text-cyan-300 font-extrabold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>NEW VISITOR? START HERE</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Interactive 2-min guided walkthrough with everything unlocked.
              </p>
            </div>
            <button
              onClick={() => handleEnter('dashboard', true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs tracking-wider uppercase transition shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center space-x-1.5 shrink-0"
            >
              <span>QUICK TOUR</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </div>

          {/* Card Header */}
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center space-x-2 text-slate-300">
              <Users className="w-4 h-4 text-cyan-300" />
              <span className="text-xs font-mono font-bold tracking-[0.15em] text-slate-300 uppercase">
                OR CHOOSE OPERATIONAL PROFILE
              </span>
            </div>
          </div>

          {/* Role Dropdown Selector */}
          <div className="relative">
            {/* Trigger Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-slate-900/90 hover:bg-slate-850 border border-cyan-500/50 rounded-xl px-4 py-3 flex items-center justify-between text-white font-bold text-xs shadow-inner transition focus:outline-none"
            >
              <div className="flex items-center space-x-3">
                {getSelectedRoleIcon()}
                <span className="tracking-wider uppercase font-bold">{selectedRole}</span>
                <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
                  ({rolesList.find(r => r.id === selectedRole)?.sublabel})
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Options List */}
            {dropdownOpen && (
              <div className="mt-2 bg-slate-950/95 border border-cyan-500/40 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl divide-y divide-slate-800/80">
                {rolesList.map((role) => {
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-start space-x-3 px-4 py-3 text-xs text-left transition ${
                        isSelected
                          ? 'bg-blue-900/60 text-white font-black border-l-4 border-cyan-400'
                          : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">{role.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="tracking-wider uppercase font-bold text-white">{role.label}</span>
                          {role.isRecommended && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5 leading-snug">
                          {role.sublabel}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ENTER DIGITAL TWIN CTA BUTTON */}
          <button
            onClick={() => handleEnter()}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-700 via-sky-700 to-blue-700 hover:from-blue-600 hover:to-sky-600 text-white font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 transform hover:scale-[1.01] shadow-[0_0_20px_rgba(2,132,199,0.4)] border border-sky-400/40 flex items-center justify-center space-x-2"
          >
            <span>ENTER AS {selectedRole}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          {/* Direct module shortcuts */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-300">
            <span className="text-slate-400">Direct Jump:</span>
            <button 
              onClick={() => handleEnter('twin')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 transition"
            >
              🎮 3D Base
            </button>
            <button 
              onClick={() => handleEnter('energy')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 transition"
            >
              ⚡ Power & Fuel
            </button>
            <button 
              onClick={() => handleEnter('scenarios')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-rose-300 border border-slate-700 transition"
            >
              ❄️ Blizzard Test
            </button>
            <button 
              onClick={() => handleEnter('assistant')}
              className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 transition"
            >
              🤖 Ask AI
            </button>
          </div>

          {/* Card Footer Disclaimer */}
          <div className="text-center pt-1">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
              DEMO MODE • OPEN ACCESS FOR EVALUATORS & VISITORS
            </span>
          </div>
        </div>
      </main>

      {/* 5. BOTTOM METRIC TILES & FOOTER SLOGAN */}
      <footer className="relative z-20 w-full px-6 sm:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* KPI Badges Row */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          {/* Coldest Temp */}
          <div className="flex items-center space-x-2.5">
            <Thermometer className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-sm font-black text-white">-89.2°C</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">COLDEST TEMPERATURE</div>
            </div>
          </div>

          {/* Area */}
          <div className="flex items-center space-x-2.5">
            <Mountain className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-sm font-black text-white">14M km²</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">AREA</div>
            </div>
          </div>

          {/* Residents */}
          <div className="flex items-center space-x-2.5">
            <UserX className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-sm font-black text-white">~0</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">PERMANENT RESIDENTS</div>
            </div>
          </div>

          {/* Discoveries */}
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-sm font-black text-white">UNLIMITED</div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">DISCOVERIES</div>
            </div>
          </div>
        </div>

        {/* Center Bottom Slogan */}
        <div className="text-[10px] tracking-[0.25em] text-slate-400 uppercase">
          · SCIENCE TODAY &nbsp; · &nbsp; A BRIGHTER TOMORROW ·
        </div>
      </footer>
    </div>
  );
};
