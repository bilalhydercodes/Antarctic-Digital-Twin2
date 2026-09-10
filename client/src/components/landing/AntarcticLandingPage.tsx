import React, { useState } from 'react';
import { RBACRole, NavTab } from '../../types';
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
  const [dropdownOpen, setDropdownOpen] = useState(true); // Open by default matching the screenshot mockup!
  const [activeCategory, setActiveCategory] = useState<string>('ICE');

  const rolesList: { id: RBACRole; label: string; icon: React.ReactNode }[] = [
    { id: 'ADMIN', label: 'ADMIN', icon: <Crown className="w-4 h-4 text-amber-300" /> },
    { id: 'COMMANDER', label: 'COMMANDER', icon: <Shield className="w-4 h-4 text-sky-400" /> },
    { id: 'OPERATOR', label: 'OPERATOR', icon: <SettingsIcon className="w-4 h-4 text-blue-300" /> },
    { id: 'SCIENTIST', label: 'SCIENTIST', icon: <FlaskConical className="w-4 h-4 text-emerald-400" /> },
    { id: 'VIEWER', label: 'VIEWER', icon: <Eye className="w-4 h-4 text-stone-300" /> },
  ];

  const handleEnter = (tab?: NavTab) => {
    onEnter(selectedRole, tab);
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

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden select-none flex flex-col justify-between">
      {/* 1. CINEMATIC BACKGROUND IMAGE WITH POLAR OVERLAYS */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-100"
        style={{
          backgroundImage: `url('/antarctic-landing-bg.jpg')`,
        }}
      >
        {/* Soft gradient vignette matching the cinematic atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/70 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/30 to-slate-950/80 pointer-events-none" />
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
        
        {/* LEFT HUD: HOLOGRAPHIC 3D RADAR GLOBE & COORDINATES */}
        <div className="hidden lg:block absolute left-4 top-1/2 -translate-y-1/2 font-mono">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Outer Compass Dashed Radar Ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/20" />
            <div className="absolute inset-5 rounded-full border border-sky-400/10" />

            {/* Glowing Holographic Antarctica Continent Contour */}
            <div className="relative w-28 h-28 flex items-center justify-center">
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
          <div className="mt-6 text-[10px] tracking-widest uppercase space-y-1 text-slate-400 pl-2">
            <div className="w-5 h-[1px] bg-cyan-400 mb-2" />
            <div className="text-slate-300 font-bold">REAL DATA</div>
            <div>REAL INSIGHTS</div>
            <div className="text-cyan-300">A BRIGHTER TOMORROW</div>
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
            An interactive digital representation of the Antarctic environment.
          </p>
        </div>

        {/* 4. DEMO ACCESS CARD (EXACT COPY OF SCREENSHOT) */}
        <div className="relative w-full max-w-md mx-auto backdrop-blur-xl bg-slate-950/70 border border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_10px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(6,182,212,0.15)]">
          {/* Card Header */}
          <div className="text-center space-y-1 mb-5">
            <div className="flex items-center justify-center space-x-2 text-cyan-400">
              <Users className="w-5 h-5 text-cyan-300" />
              <span className="text-xs font-mono font-extrabold tracking-[0.2em] text-cyan-300 uppercase">
                DEMO ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Select a role to enter (No authentication required)
            </p>
          </div>

          {/* Role Dropdown Selector */}
          <div className="relative mb-5">
            {/* Trigger Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-slate-900/80 hover:bg-slate-850 border border-cyan-500/50 rounded-xl px-4 py-3 flex items-center justify-between text-white font-bold text-xs shadow-inner transition focus:outline-none"
            >
              <div className="flex items-center space-x-3">
                {getSelectedRoleIcon()}
                <span className="tracking-wider uppercase">{selectedRole}</span>
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
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-xs text-left transition ${
                        isSelected
                          ? 'bg-blue-600 text-white font-black shadow-md'
                          : 'text-slate-300 hover:bg-slate-900/80 hover:text-white font-medium'
                      }`}
                    >
                      <span>{role.icon}</span>
                      <span className="tracking-wider uppercase">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ENTER DIGITAL TWIN CTA BUTTON */}
          <button
            onClick={() => handleEnter()}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-xs tracking-[0.2em] uppercase transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_25px_rgba(2,132,199,0.55)] border border-sky-400/50 flex items-center justify-center space-x-2"
          >
            <span>ENTER DIGITAL TWIN</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          {/* Card Footer Disclaimer */}
          <div className="mt-4 text-center">
            <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase">
              DEMO MODE • FOR EDUCATIONAL AND EXPLORATION PURPOSES
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
