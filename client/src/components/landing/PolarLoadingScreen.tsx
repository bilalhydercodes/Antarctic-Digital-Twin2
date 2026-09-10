import React, { useState, useEffect } from 'react';
import { 
  Snowflake, 
  Compass, 
  Sparkles, 
  Quote, 
  ArrowRight,
  Radio,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { RBACRole, NavTab } from '../../types';

interface PolarLoadingScreenProps {
  role: RBACRole;
  targetTab?: NavTab;
  onComplete: () => void;
}

interface AntarcticaQuote {
  quote: string;
  author: string;
  context: string;
}

const POLAR_QUOTES: AntarcticaQuote[] = [
  {
    quote: "Difficulties are just things to overcome, after all.",
    author: "Sir Ernest Shackleton",
    context: "Imperial Trans-Antarctic Expedition"
  },
  {
    quote: "In Antarctica, we find not just a continent, but a glimpse of a purer, untouched Earth.",
    author: "National Centre for Polar and Ocean Research",
    context: "MoES Mission Charter"
  },
  {
    quote: "The land looks like a fairytale... White, majestic, and completely untouched by human greed.",
    author: "Roald Amundsen",
    context: "First to Reach the South Pole (1911)"
  },
  {
    quote: "Standing at 70° South: where scientific curiosity pierces the deep history of Earth’s climate.",
    author: "Indian Antarctic Research Mission",
    context: "Maitri & Bharati Stations"
  },
  {
    quote: "Antarctica is the heartbeat of our planet's oceans, atmosphere, and global climate.",
    author: "Scientific Committee on Antarctic Research",
    context: "Polar Earth Science"
  }
];

export const PolarLoadingScreen: React.FC<PolarLoadingScreenProps> = ({
  role,
  targetTab = 'dashboard',
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * POLAR_QUOTES.length));

  useEffect(() => {
    // Smooth progress increment from 0 to 100 over ~2.2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate smoothly
        const diff = Math.max(1, Math.floor((100 - prev) * 0.12));
        return Math.min(100, prev + diff);
      });
    }, 45);

    return () => clearInterval(interval);
  }, []);

  // When progress reaches 100%, trigger completion with slight pause for smooth fade
  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const activeQuote = POLAR_QUOTES[quoteIndex];

  // Dynamic status text based on progress stage
  const getStatusText = () => {
    if (progress < 25) return 'Establishing Ku-Band satellite uplink to NCPOR Goa...';
    if (progress < 55) return 'Calibrating Maitri (70.76°S) & Bharati (69.40°S) sensor streams...';
    if (progress < 85) return 'Initializing 3D Digital Twin physics engine & hybrid microgrid...';
    return 'Telemetry synchronized. Entering Mission Command Center...';
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-slate-950 text-white font-sans select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* 1. CINEMATIC BACKGROUND GLOWS & POLAR RADAR OVERLAYS */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 filter blur-sm scale-105"
        style={{
          backgroundImage: `url('/antarctic-landing-bg.jpg')`,
        }}
      />
      
      {/* Radial soft lighting vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/90 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 2. TOP STATUS BAR */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="tracking-widest uppercase text-[11px] font-bold">
            POLAR LINK INITIALIZATION
          </span>
        </div>

        <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
          <span>STATION: <strong className="text-white">MAITRI & BHARATI</strong></span>
          <span>•</span>
          <span>ROLE: <strong className="text-cyan-300 uppercase">{role}</strong></span>
        </div>
      </header>

      {/* 3. CENTER HERO: ANIMATED LOADING SYMBOL & QUOTE */}
      <main className="relative z-10 w-full max-w-2xl flex flex-col items-center justify-center my-auto space-y-8 text-center">
        
        {/* Animated Loading Symbol with Concentric Glowing Rings */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          {/* Outer Dashed Spinning Radar Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 border-dashed animate-[spin_12s_linear_infinite]" />
          
          {/* Middle Counter-rotating Hexagonal Ring */}
          <div className="absolute inset-3 rounded-full border-2 border-sky-400/20 border-t-cyan-400 animate-[spin_4s_linear_infinite_reverse]" />
          
          {/* Inner Pulsing Aura */}
          <div className="absolute inset-6 rounded-full bg-cyan-500/10 animate-pulse" />

          {/* Central Snowflake / Compass Icon */}
          <div className="relative flex items-center justify-center text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
            <Snowflake className="w-12 h-12 sm:w-16 sm:h-16 animate-[spin_20s_linear_infinite]" />
          </div>

          {/* Progress Percent in Center */}
          <div className="absolute -bottom-3 px-2.5 py-0.5 rounded-full bg-slate-900 border border-cyan-500/50 text-[11px] font-mono font-black text-cyan-300 shadow-md">
            {progress}%
          </div>
        </div>

        {/* EMPEROR PENGUIN COMPANION BADGE */}
        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 text-xs text-cyan-300 shadow-lg">
          <span className="text-lg animate-bounce">🐧</span>
          <span className="font-bold tracking-wide">Emperor Penguin Polar Companion</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* INSPIRING ANTARCTICA QUOTE CARD */}
        <div className="relative max-w-xl mx-auto px-6 py-5 rounded-2xl bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md shadow-2xl space-y-2.5">
          <Quote className="w-6 h-6 text-cyan-400/60 mx-auto" />
          
          <blockquote className="text-sm sm:text-base font-medium italic text-slate-100 leading-relaxed font-serif">
            &ldquo;{activeQuote.quote}&rdquo;
          </blockquote>

          <div className="pt-1">
            <div className="text-xs font-bold text-cyan-300 tracking-wider">
              {activeQuote.author}
            </div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest mt-0.5">
              {activeQuote.context}
            </div>
          </div>
        </div>

        {/* PROGRESS BAR & STEP TICKER */}
        <div className="w-full max-w-md space-y-2">
          {/* Progress Bar Container */}
          <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-cyan-500/30 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(34,211,238,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text */}
          <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse shrink-0" />
            <span className="truncate">{getStatusText()}</span>
          </div>
        </div>

      </main>

      {/* 4. BOTTOM CONTROLS & SKIP BUTTON */}
      <footer className="relative z-10 w-full max-w-4xl flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div>
          <span>MINISTRY OF EARTH SCIENCES • INDIA</span>
        </div>

        {/* Fast skip button */}
        <button
          onClick={onComplete}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-cyan-300 border border-slate-700/60 transition"
          title="Skip loading transition"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </footer>

    </div>
  );
};
