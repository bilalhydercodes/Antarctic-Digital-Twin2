import React, { useState, useEffect, useRef } from 'react';
import { RBACRole, NavTab } from '../../types';
import { useSimulation } from '../../context/SimulationContext';
import { 
  ArrowRight, 
  Play, 
  Thermometer, 
  Wind, 
  Gauge, 
  Eye, 
  Search, 
  Globe, 
  Layers, 
  Radio, 
  Cpu, 
  Activity, 
  ChevronRight, 
  ChevronDown,
  Building2, 
  FileText, 
  Bell, 
  ExternalLink,
  MapPin,
  Calendar,
  X,
  Youtube,
  Twitter,
  Linkedin,
  Info,
  Camera,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Mountain,
  Compass,
  Database,
  History,
  ShieldAlert
} from 'lucide-react';

interface AntarcticLandingPageProps {
  onEnter: (role: RBACRole, targetTab?: NavTab) => void;
  initialRole?: RBACRole;
}

export const AntarcticLandingPage: React.FC<AntarcticLandingPageProps> = ({ 
  onEnter, 
  initialRole = 'ADMIN' 
}) => {
  const { environment, setActiveStationId } = useSimulation();
  
  // Navigation & Dropdown states
  const [openDropdown, setOpenDropdown] = useState<'stations' | 'research' | 'resources' | null>(null);
  const [activeNoticeTab, setActiveNoticeTab] = useState<'updates' | 'notifications' | 'tenders' | 'events'>('updates');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDakshinGangotriModal, setShowDakshinGangotriModal] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentTemp = environment?.temperature?.toFixed(1) || '-32.4';
  const currentWind = environment?.windSpeed?.toFixed(0) || '27';
  const currentPressure = environment?.pressure?.toFixed(1) || '981.7';

  const handleLaunchTwin = (tab: NavTab = 'dashboard', stationId?: 'maitri' | 'bharati') => {
    setOpenDropdown(null);
    if (stationId) {
      setActiveStationId(stationId);
    }
    onEnter('ADMIN', tab);
  };

  const researchDomains = [
    { title: 'Atmospheric Science', img: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=400&q=80', tab: 'glaciology' as NavTab },
    { title: 'Glaciology', img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=400&q=80', tab: 'glaciology' as NavTab },
    { title: 'Marine Sciences', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80', tab: 'research' as NavTab },
    { title: 'Geophysics', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80', tab: 'sensors' as NavTab },
    { title: 'Environmental Monitoring', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80', tab: 'environment' as NavTab },
    { title: 'Space Weather', img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=400&q=80', tab: 'satellite' as NavTab },
    { title: 'Climate Studies', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=400&q=80', tab: 'analytics' as NavTab }
  ];

  const galleryItems = [
    { title: 'Maitri Station in Polar Winter', img: '/maitri-3d-station-view.jpg', location: 'Schirmacher Oasis' },
    { title: 'Bharati Modular Container Complex', img: '/bharati-station-view.jpg', location: 'Larsemann Hills' },
    { title: 'Antarctic Continental Panorama & Weather Mast', img: '/antarctic-landing-bg.jpg', location: 'East Antarctica' },
    { title: 'Aurora Australis over Larsemann Hills', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=600&q=80', location: 'Bharati Station' },
    { title: 'Priyadarshini Freshwater Glacial Lake', img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80', location: 'Schirmacher Oasis' },
    { title: 'Indian Polar Research Vessel Expedition', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', location: 'Southern Ocean' }
  ];

  const notices = [
    { id: 1, date: '28', month: 'Sep 2026', title: '44th Indian Scientific Expedition to Antarctica (44-ISEA) wintering team deployed', category: 'updates' },
    { id: 2, date: '22', month: 'Sep 2026', title: 'Larsemann Hills atmospheric ozone and lidar datasets uploaded to Polar Data Centre', category: 'updates' },
    { id: 3, date: '15', month: 'Sep 2026', title: 'MoES technical committee approves Maitri II station modernization master plan', category: 'updates' },
    { id: 4, date: '05', month: 'Sep 2026', title: 'Priyadarshini Lake sub-glacial hydrology and water trace heating survey released', category: 'updates' },
    { id: 5, date: '18', month: 'Aug 2026', title: 'NCPOR issues call for research proposals for 45th Indian Antarctic Expedition', category: 'updates' }
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 font-sans flex flex-col selection:bg-blue-800 selection:text-white">
      
      {/* ─── 1. TOP NATIONAL UTILITY BAR ─── */}
      <header className="bg-[#0b1e36] text-slate-300 text-[11px] font-sans border-b border-[#1b3453]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 flex items-center justify-between flex-wrap gap-2">
          
          {/* Government of India Official Emblem Strip */}
          <div className="flex items-center space-x-2">
            <svg className="w-3.5 h-4 fill-current text-amber-400" viewBox="0 0 24 30">
              <path d="M12 2L9 9H15L12 2ZM6 11H18V13H6V11ZM4 15H20V17H4V15ZM8 19H16V26H8V19Z" />
            </svg>
            <span className="font-semibold text-slate-200">भारत सरकार</span>
            <span className="text-slate-500">|</span>
            <span className="font-medium text-slate-300">Government of India</span>
          </div>

          {/* Accessibility & Search */}
          <div className="flex items-center space-x-3 text-[11px]">
            <a href="#main-content" className="hover:text-white transition">Skip to main content</a>
            <span className="text-slate-600">|</span>
            <span onClick={() => setShowAboutModal(true)} className="hover:text-white cursor-pointer transition">Screen Reader Access</span>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1">
              <button className="px-1 hover:text-white">A-</button>
              <button className="px-1 hover:text-white font-bold">A</button>
              <button className="px-1 hover:text-white font-extrabold">A+</button>
            </div>
            <span className="text-slate-600">|</span>
            <button onClick={() => alert('हिन्दी संस्करण सक्रिय है (Hindi Language Support Active)')} className="font-semibold hover:text-white transition">हिन्दी</button>
            <span className="text-slate-600">|</span>
            
            {/* Search Input */}
            <div className="relative flex items-center">
              <input 
                type="text"
                placeholder="Search telemetry, notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLaunchTwin('analytics');
                  }
                }}
                className="w-32 sm:w-44 py-0.5 pl-2 pr-6 rounded-xs bg-[#162d4a] border border-[#23456e] text-slate-200 placeholder-slate-400 text-[10px] focus:outline-none focus:border-cyan-400"
              />
              <Search className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
            </div>
          </div>

        </div>
      </header>

      {/* ─── 2. MAIN HEADER & INSTITUTIONAL BRANDING ─── */}
      <div className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-40" ref={navRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Dual Institutional Logos */}
          <div className="flex items-center space-x-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            
            {/* MoES Emblem */}
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-11 flex items-center justify-center">
                <svg className="w-8 h-10 text-[#0b1e36]" viewBox="0 0 24 32" fill="currentColor">
                  <path d="M12 2C8 2 5 5 5 9C5 12 7 14 9 15V18H15V15C17 14 19 12 19 9C19 5 16 2 12 2ZM12 4C14.8 4 17 6.2 17 9C17 11.2 15.2 13 13 13H11C8.8 13 7 11.2 7 9C7 6.2 9.2 4 12 4ZM7 20H17V22H7V20ZM9 24H15V26H9V24ZM6 28H18V30H6V28Z"/>
                </svg>
              </div>
              <div className="border-r border-slate-300 pr-4">
                <div className="text-xs font-bold text-slate-900 leading-tight">पृथ्वी विज्ञान मंत्रालय</div>
                <div className="text-[11px] font-bold text-[#102a43] leading-tight">Ministry of Earth Sciences</div>
                <div className="text-[9px] text-slate-500 uppercase tracking-tight">Government of India</div>
              </div>
            </div>

            {/* NCPOR Emblem */}
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full border-2 border-blue-900 bg-blue-50 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full border border-blue-700 flex flex-col items-center justify-center bg-white text-[7px] font-black text-blue-950">
                  NCPOR
                </div>
              </div>
              <div>
                <div className="text-xs font-black text-[#102a43] tracking-tight">NCPOR</div>
                <div className="text-[10px] font-bold text-slate-800 leading-tight">राष्ट्रीय ध्रुवीय एवं समुद्री अनुसंधान केंद्र</div>
                <div className="text-[10px] font-semibold text-slate-600 leading-tight">National Centre for Polar and Ocean Research</div>
                <div className="text-[8px] text-slate-500">Ministry of Earth Sciences, Government of India</div>
              </div>
            </div>

          </div>

          {/* Navigation Menu with Interactive Dropdowns */}
          <nav className="flex items-center space-x-1 sm:space-x-5 text-xs font-bold text-slate-700 relative">
            
            {/* 1. Home */}
            <button 
              onClick={() => {
                setOpenDropdown(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="text-blue-800 border-b-2 border-blue-800 pb-1 font-extrabold cursor-pointer"
            >
              Home
            </button>

            {/* 2. About */}
            <button 
              onClick={() => {
                setOpenDropdown(null);
                setShowAboutModal(true);
              }} 
              className="hover:text-blue-800 transition pb-1 cursor-pointer flex items-center gap-0.5"
            >
              About
            </button>

            {/* 3. Stations Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'stations' ? null : 'stations')}
                className={`hover:text-blue-800 transition pb-1 cursor-pointer flex items-center gap-0.5 ${openDropdown === 'stations' ? 'text-blue-800' : ''}`}
              >
                <span>Stations</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {openDropdown === 'stations' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-300 rounded-xs shadow-xl p-2 z-50 animate-fade-in text-xs font-normal">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Indian Antarctic Bases
                  </div>
                  <button 
                    onClick={() => handleLaunchTwin('dashboard', 'maitri')}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Maitri Station</div>
                      <div className="text-[10px] text-slate-500">Schirmacher Oasis (70.76°S, 11.73°E)</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700" />
                  </button>

                  <button 
                    onClick={() => handleLaunchTwin('dashboard', 'bharati')}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group transition"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Bharati Station</div>
                      <div className="text-[10px] text-slate-500">Larsemann Hills (69.40°S, 76.32°E)</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700" />
                  </button>

                  <button 
                    onClick={() => {
                      setOpenDropdown(null);
                      setShowDakshinGangotriModal(true);
                    }}
                    className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group transition border-t border-slate-100 mt-1"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Dakshin Gangotri</div>
                      <div className="text-[10px] text-slate-500">First Base (1983) • Historical Site</div>
                    </div>
                    <History className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button 
                    onClick={() => handleLaunchTwin('compare')}
                    className="w-full text-left p-2 bg-blue-50/50 hover:bg-blue-50 rounded-xs flex items-center justify-between text-blue-900 font-bold mt-1"
                  >
                    <span>Station Comparison Matrix</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Digital Twin (LIVE) */}
            <button 
              onClick={() => handleLaunchTwin('dashboard')} 
              className="hover:text-blue-800 transition pb-1 text-blue-900 font-extrabold flex items-center gap-1 cursor-pointer"
            >
              <span>Digital Twin</span>
              <span className="px-1 py-0.2 bg-blue-100 text-blue-800 text-[9px] rounded-xs font-mono animate-pulse">LIVE</span>
            </button>

            {/* 5. Research Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'research' ? null : 'research')}
                className={`hover:text-blue-800 transition pb-1 cursor-pointer flex items-center gap-0.5 ${openDropdown === 'research' ? 'text-blue-800' : ''}`}
              >
                <span>Research</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {openDropdown === 'research' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-300 rounded-xs shadow-xl p-2 z-50 animate-fade-in text-xs font-normal">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Scientific Domains
                  </div>
                  <button onClick={() => handleLaunchTwin('glaciology')} className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Atmospheric & Cryosphere</div>
                      <div className="text-[10px] text-slate-500">Radar, Ice Cores, Met telemetry</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button onClick={() => handleLaunchTwin('sensors')} className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Geomagnetism & Seismology</div>
                      <div className="text-[10px] text-slate-500">Induction coil magnetometers</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button onClick={() => handleLaunchTwin('research')} className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Marine & Southern Ocean</div>
                      <div className="text-[10px] text-slate-500">CTD Profilers, Phytoplankton</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* 6. Resources Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setOpenDropdown(openDropdown === 'resources' ? null : 'resources')}
                className={`hover:text-blue-800 transition pb-1 cursor-pointer flex items-center gap-0.5 ${openDropdown === 'resources' ? 'text-blue-800' : ''}`}
              >
                <span>Resources</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {openDropdown === 'resources' && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-300 rounded-xs shadow-xl p-2 z-50 animate-fade-in text-xs font-normal">
                  <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Platform Tools & Data
                  </div>
                  <button onClick={() => handleLaunchTwin('analytics')} className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Polar Data Centre (PDC)</div>
                      <div className="text-[10px] text-slate-500">Long-term telemetry archives</div>
                    </div>
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button onClick={() => handleLaunchTwin('replay')} className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Telemetry Time Machine</div>
                      <div className="text-[10px] text-slate-500">Replay historic storm telemetry</div>
                    </div>
                    <History className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button onClick={() => handleLaunchTwin('incidents')} className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">Incident Command & Log</div>
                      <div className="text-[10px] text-slate-500">Emergency failover protocols</div>
                    </div>
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  <button onClick={() => handleLaunchTwin('settings')} className="w-full text-left p-2 hover:bg-slate-50 rounded-xs flex items-center justify-between group border-t border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-blue-800">System Settings & Logout</div>
                      <div className="text-[10px] text-slate-500">Security credentials & RBAC</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* 7. Media */}
            <button 
              onClick={() => {
                setOpenDropdown(null);
                setShowMediaModal(true);
              }} 
              className="hover:text-blue-800 transition pb-1 cursor-pointer flex items-center gap-0.5"
            >
              Media
            </button>

            {/* 8. Contact */}
            <button 
              onClick={() => {
                setOpenDropdown(null);
                setShowContactModal(true);
              }} 
              className="hover:text-blue-800 transition pb-1 cursor-pointer flex items-center gap-0.5"
            >
              Contact
            </button>

          </nav>

        </div>
      </div>

      {/* ─── 3. HERO SECTION (ANTARCTIC PANORAMA & LIVE METEOROLOGY) ─── */}
      <main id="main-content" className="relative bg-[#071527] overflow-hidden border-b border-slate-300">
        
        {/* Background Panoramic Image with Dark Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-75 transform scale-102 transition duration-1000"
          style={{ backgroundImage: `url('/antarctic-landing-bg.jpg')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#071322]/95 via-[#0a1b30]/75 to-transparent"></div>

        {/* Hero Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-4 text-white">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif drop-shadow-md">
              Antarctic Digital Twin
            </h1>
            <h2 className="text-base sm:text-lg font-semibold text-slate-200 tracking-wide font-sans">
              Integrated Station Monitoring, Simulation & Decision Support
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-sans font-normal drop-shadow-xs">
              A unified digital platform for monitoring India's Antarctic research stations,
              analysing telemetry, simulating operational scenarios and supporting
              scientific and emergency decision-making.
            </p>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleLaunchTwin('dashboard')}
                className="px-6 py-2.5 bg-[#102a43] hover:bg-[#1b3d5f] text-white text-xs font-bold rounded-xs shadow-md border border-cyan-500/40 flex items-center space-x-2 transition cursor-pointer"
              >
                <span>Explore Digital Twin</span>
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>
          </div>

          {/* Right Floating Weather Widget */}
          <div className="lg:col-span-5 flex justify-end">
            <div className="w-full max-w-sm bg-white/95 backdrop-blur-md rounded-xs border border-slate-300 shadow-xl p-4 text-slate-900 font-sans">
              
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs font-bold text-[#102a43] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Maitri Station (Live Conditions)</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    30 Sep 2026 12:27 IST
                  </div>
                </div>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-xs border border-emerald-300">
                  ONLINE
                </span>
              </div>

              {/* Weather Met Metrics */}
              <div className="space-y-2.5 text-xs font-medium">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Thermometer className="w-4 h-4 text-blue-600" />
                    <span>Air Temperature</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm">{currentTemp} °C</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Wind className="w-4 h-4 text-cyan-600" />
                    <span>Wind Speed</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{currentWind} km/h (WSW)</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Gauge className="w-4 h-4 text-indigo-600" />
                    <span>Pressure</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{currentPressure} hPa</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Eye className="w-4 h-4 text-emerald-600" />
                    <span>Visibility</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">8 km</span>
                </div>
              </div>

              <div className="mt-3 pt-2 text-right">
                <button 
                  onClick={() => handleLaunchTwin('dashboard')}
                  className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center justify-end gap-1 ml-auto cursor-pointer"
                >
                  <span>View All Telemetry</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Station Location Badge */}
        <div className="absolute bottom-2 right-4 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xs border border-white/20 text-[10px] text-slate-200 font-mono">
          Maitri Research Station • Schirmacher Oasis, East Antarctica
        </div>

      </main>

      {/* ─── 4. FEATURES RIBBON STRIP ─── */}
      <section className="bg-[#f0f4f8] py-4 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            
            {/* Feature 1 */}
            <div 
              onClick={() => handleLaunchTwin('environment')}
              className="bg-white border border-[#cbd5e1] rounded-xs p-3 flex items-start space-x-2.5 hover:border-blue-700 transition cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xs bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#102a43] leading-tight">Real-time Station Monitoring</div>
                <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">Environmental and infrastructure telemetry in real time</div>
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              onClick={() => handleLaunchTwin('twin')}
              className="bg-white border border-[#cbd5e1] rounded-xs p-3 flex items-start space-x-2.5 hover:border-blue-700 transition cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xs bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#102a43] leading-tight">3D Digital Twin</div>
                <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">Interactive visualization of Maitri and Bharati stations</div>
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              onClick={() => handleLaunchTwin('edge')}
              className="bg-white border border-[#cbd5e1] rounded-xs p-3 flex items-start space-x-2.5 hover:border-blue-700 transition cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xs bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#102a43] leading-tight">Satellite & Edge Connectivity</div>
                <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">Resilient communication with low-bandwidth support</div>
              </div>
            </div>

            {/* Feature 4 */}
            <div 
              onClick={() => handleLaunchTwin('scenarios')}
              className="bg-white border border-[#cbd5e1] rounded-xs p-3 flex items-start space-x-2.5 hover:border-blue-700 transition cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xs bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#102a43] leading-tight">Simulation & Incidents</div>
                <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">Scenario testing and emergency decision support</div>
              </div>
            </div>

            {/* Feature 5 */}
            <div 
              onClick={() => handleLaunchTwin('research')}
              className="bg-white border border-[#cbd5e1] rounded-xs p-3 flex items-start space-x-2.5 hover:border-blue-700 transition cursor-pointer shadow-2xs"
            >
              <div className="w-8 h-8 rounded-xs bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#102a43] leading-tight">Scientific Data Integration</div>
                <div className="text-[10px] text-slate-600 mt-0.5 leading-snug">Support for India's Antarctic research programmes</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 5. MAIN CONTENT 3-COLUMN GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: India in Antarctica (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-[#cbd5e1] rounded-xs p-4 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-[#102a43] border-b border-slate-200 pb-2">
              India in Antarctica
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              Initiated in 1981 under the Ministry of Earth Sciences (MoES), the Indian Antarctic
              Programme conducts continuous scientific research across East Antarctica through
              Maitri (Schirmacher Oasis) and Bharati (Larsemann Hills), supporting cryosphere,
              atmospheric, geomagnetic and oceanographic science under the Antarctic Treaty System.
            </p>

            <button 
              onClick={() => handleLaunchTwin('research')}
              className="px-3 py-1.5 bg-[#102a43] hover:bg-[#1b3d5f] text-white text-[11px] font-bold rounded-xs flex items-center space-x-1.5 transition cursor-pointer"
            >
              <span>Explore Research Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* 4 Stat Cards Grid (2x2) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 font-sans">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs text-center">
                <div className="text-xl font-extrabold text-[#102a43]">44th</div>
                <div className="text-[10px] text-slate-500 font-medium">Expedition in Ops</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs text-center">
                <div className="text-xl font-extrabold text-[#102a43]">1981</div>
                <div className="text-[10px] text-slate-500 font-medium">Programme Inception</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs text-center">
                <div className="text-xl font-extrabold text-[#102a43]">2,800+</div>
                <div className="text-[10px] text-slate-500 font-medium">Polar Personnel</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xs text-center">
                <div className="text-xl font-extrabold text-[#102a43]">2 Active</div>
                <div className="text-[10px] text-slate-500 font-medium">Permanent Bases</div>
              </div>
            </div>
          </div>

          {/* Column 2: Our Research Stations (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-[#cbd5e1] rounded-xs p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-base font-bold text-[#102a43]">
                Our Research Stations
              </h3>
              <button 
                onClick={() => handleLaunchTwin('compare')}
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View Station Comparison</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Stations Cards Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Station 1: Maitri */}
              <div className="border border-slate-200 rounded-xs overflow-hidden flex flex-col justify-between hover:border-slate-400 transition bg-slate-50/50">
                <div>
                  <div className="h-28 overflow-hidden relative">
                    <img 
                      src="/maitri-3d-station-view.jpg" 
                      alt="Maitri Station" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 text-white font-mono text-[9px] rounded-xs">
                      EST. 1988
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-bold text-slate-900">Maitri Station</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Schirmacher Oasis (70.76°S, 11.73°E)</p>
                    <p className="text-[10px] text-slate-600 mt-1.5 leading-snug">
                      Inland rocky oasis base. Operational since 1988–89. Hosts automated weather stations (AWS), seismological observatory, and Priyadarshini Lake water intake pump trace loop.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 pt-0">
                  <button 
                    onClick={() => handleLaunchTwin('dashboard', 'maitri')}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore Maitri SCADA</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Station 2: Bharati */}
              <div className="border border-slate-200 rounded-xs overflow-hidden flex flex-col justify-between hover:border-slate-400 transition bg-slate-50/50">
                <div>
                  <div className="h-28 overflow-hidden relative">
                    <img 
                      src="/bharati-station-view.jpg" 
                      alt="Bharati Station" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/70 text-white font-mono text-[9px] rounded-xs">
                      EST. 2012
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-bold text-slate-900">Bharati Station</h4>
                    <p className="text-[10px] text-slate-500 font-mono">Larsemann Hills (69.40°S, 76.32°E)</p>
                    <p className="text-[10px] text-slate-600 mt-1.5 leading-snug">
                      Coastal modern station commissioned on 18 March 2012. Built from 134 modular prefabricated containers. Features direct satellite transceivers and oceanography suites.
                    </p>
                  </div>
                </div>

                <div className="p-2.5 pt-0">
                  <button 
                    onClick={() => handleLaunchTwin('dashboard', 'bharati')}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore Bharati SCADA</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Column 3: Notice Board / Latest Updates (3 cols) */}
          <div className="lg:col-span-3 bg-white border border-[#cbd5e1] rounded-xs p-4 shadow-xs space-y-3">
            
            {/* Notice Board Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-[11px]">
              <div className="flex items-center space-x-2 font-bold">
                <button 
                  onClick={() => setActiveNoticeTab('updates')}
                  className={`${activeNoticeTab === 'updates' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-slate-500 hover:text-slate-800'} pb-1 cursor-pointer`}
                >
                  Latest Updates
                </button>
                <button 
                  onClick={() => setActiveNoticeTab('notifications')}
                  className={`${activeNoticeTab === 'notifications' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-slate-500 hover:text-slate-800'} pb-1 cursor-pointer`}
                >
                  Notifications
                </button>
              </div>

              <button 
                onClick={() => handleLaunchTwin('alerts')}
                className="text-[10px] font-bold text-blue-700 hover:underline flex items-center cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </button>
            </div>

            {/* List of Notices */}
            <div className="divide-y divide-slate-100 space-y-2">
              {notices.map((notice) => (
                <div 
                  key={notice.id} 
                  onClick={() => handleLaunchTwin('alerts')}
                  className="pt-2 first:pt-0 flex items-start space-x-2.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xs bg-slate-100 border border-slate-200 flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:border-blue-300 transition">
                    <span className="text-xs font-black text-slate-800 group-hover:text-blue-700">{notice.date}</span>
                    <span className="text-[8px] text-slate-500 uppercase font-semibold">{notice.month.split(' ')[0]}</span>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-medium text-slate-800 group-hover:text-blue-800 transition leading-tight">
                      {notice.title}
                    </h5>
                    <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{notice.month}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ─── 6. KEY RESEARCH DOMAINS STRIP ─── */}
      <section className="bg-white border-t border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#102a43]">
              Key Research Domains
            </h3>
            <button 
              onClick={() => handleLaunchTwin('research')}
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {researchDomains.map((dom, index) => (
              <div 
                key={index}
                onClick={() => handleLaunchTwin(dom.tab)}
                className="group border border-slate-200 rounded-xs overflow-hidden hover:border-blue-700 transition cursor-pointer bg-slate-50 shadow-2xs"
              >
                <div className="h-16 overflow-hidden">
                  <img 
                    src={dom.img} 
                    alt={dom.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-2 text-center">
                  <div className="text-[11px] font-bold text-slate-800 group-hover:text-blue-800 transition leading-tight">
                    {dom.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 7. INSTITUTIONAL FOOTER ─── */}
      <footer className="bg-[#0b1e36] text-slate-300 font-sans border-t border-[#1a385f] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          
          {/* Institutional Badges (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-8 text-amber-400" viewBox="0 0 24 32" fill="currentColor">
                <path d="M12 2C8 2 5 5 5 9C5 12 7 14 9 15V18H15V15C17 14 19 12 19 9C19 5 16 2 12 2Z"/>
              </svg>
              <div>
                <div className="font-bold text-white text-xs">Ministry of Earth Sciences</div>
                <div className="text-[10px] text-slate-400">Government of India</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full border border-blue-400 flex items-center justify-center font-black text-[7px] text-white">
                NCPOR
              </div>
              <div>
                <div className="font-bold text-white text-xs">NCPOR</div>
                <div className="text-[10px] text-slate-400">National Centre for Polar and Ocean Research</div>
              </div>
            </div>
            
            <p className="text-[11px] text-slate-400 leading-relaxed pr-6">
              NCPOR is India's premier R&D institution responsible for the country's research activities in the Polar and Southern Ocean realms.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-1">
              Quick Links
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition cursor-pointer">Home</button></li>
              <li><button onClick={() => setShowAboutModal(true)} className="hover:text-white transition cursor-pointer">About MoES / NCPOR</button></li>
              <li><button onClick={() => handleLaunchTwin('compare')} className="hover:text-white transition cursor-pointer">Research Stations</button></li>
              <li><button onClick={() => handleLaunchTwin('dashboard')} className="hover:text-white transition cursor-pointer">Digital Twin Live</button></li>
            </ul>
          </div>

          {/* Important Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-1">
              Important Links
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li><a href="https://moes.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition">MoES Portal</a></li>
              <li><a href="https://ncpor.res.in" target="_blank" rel="noreferrer" className="hover:text-white transition">NCPOR Official Site</a></li>
              <li><button onClick={() => handleLaunchTwin('analytics')} className="hover:text-white transition cursor-pointer">Polar Data Centre</button></li>
              <li><button onClick={() => handleLaunchTwin('research')} className="hover:text-white transition cursor-pointer">Scientific Dossier</button></li>
            </ul>
          </div>

          {/* Follow Us & Contact */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-1">
              Follow Us
            </div>
            <div className="flex items-center space-x-3 text-slate-300 mb-3">
              <a href="#" className="hover:text-white transition"><Youtube className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition"><Linkedin className="w-4 h-4" /></a>
            </div>

            <div className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-1 pt-1">
              Contact
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              NCPOR, Headland Sada, Vasco-da-Gama, Goa - 403804, India
            </p>
            <div className="text-[10px] text-cyan-300 font-mono">
              director@ncpor.res.in
            </div>
          </div>

        </div>

        {/* Bottom Rights Strip */}
        <div className="bg-[#071322] border-t border-[#132943] py-2.5 text-[10px] text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              © 2026 Ministry of Earth Sciences, Government of India. All rights reserved.
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowAboutModal(true)} className="hover:text-white transition cursor-pointer">Privacy Policy</button>
              <button onClick={() => setShowAboutModal(true)} className="hover:text-white transition cursor-pointer">Terms of Use</button>
              <button onClick={() => setShowAboutModal(true)} className="hover:text-white transition cursor-pointer">Accessibility</button>
              <button onClick={() => setShowAboutModal(true)} className="hover:text-white transition cursor-pointer">Sitemap</button>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── MODAL 1: ABOUT MOES & NCPOR ─── */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xs border border-slate-300 w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-in font-sans">
            <div className="bg-[#102a43] text-white p-3 flex items-center justify-between border-b border-slate-300">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-tight">About Indian Antarctic Programme • MoES & NCPOR</h3>
              </div>
              <button onClick={() => setShowAboutModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs text-slate-700 leading-relaxed">
              <div className="bg-slate-50 p-3 rounded-xs border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">National Centre for Polar and Ocean Research (NCPOR)</h4>
                <p className="text-[11px] text-slate-600">
                  NCPOR is an autonomous R&D institution under the Ministry of Earth Sciences (MoES), Government of India. It serves as the nodal agency for planning, coordinating and executing the Indian Antarctic, Arctic, Southern Ocean and Himalayan cryosphere research expeditions.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 mb-1">Key Scientific Mandates:</h5>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
                  <li>Continuous atmospheric, ozone, and geomagnetic observations at Maitri and Bharati stations.</li>
                  <li>Deep ice-core paleoclimate reconstructions and glacier velocity monitoring.</li>
                  <li>Operational monitoring and maintenance of India's research bases under Antarctic Treaty System (ATS) environmental compliance.</li>
                  <li>Real-time telemetry digitization and life-support simulation through the Antarctic Digital Twin platform.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowAboutModal(false);
                    handleLaunchTwin('research');
                  }}
                  className="px-4 py-2 bg-[#102a43] text-white text-xs font-bold rounded-xs cursor-pointer"
                >
                  Explore Scientific Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: MEDIA GALLERY ─── */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xs border border-slate-300 w-full max-w-3xl overflow-hidden shadow-2xl animate-scale-in font-sans">
            <div className="bg-[#102a43] text-white p-3 flex items-center justify-between border-b border-slate-300">
              <div className="flex items-center space-x-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-tight">Indian Antarctic Programme • Photo & Field Gallery</h3>
              </div>
              <button onClick={() => setShowMediaModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {galleryItems.map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xs overflow-hidden bg-slate-50">
                    <div className="h-32 overflow-hidden">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                    </div>
                    <div className="p-2">
                      <div className="text-[11px] font-bold text-slate-900 leading-tight">{item.title}</div>
                      <div className="text-[9px] text-slate-500 font-mono mt-0.5">{item.location}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xs cursor-pointer"
                >
                  Close Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: CONTACT NCPOR GOA ─── */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xs border border-slate-300 w-full max-w-xl overflow-hidden shadow-2xl animate-scale-in font-sans">
            <div className="bg-[#102a43] text-white p-3 flex items-center justify-between border-b border-slate-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-tight">Contact NCPOR • Ministry of Earth Sciences</h3>
              </div>
              <button onClick={() => setShowContactModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Headquarters & Polar Ops:</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    National Centre for Polar and Ocean Research (NCPOR)<br />
                    Ministry of Earth Sciences, Govt. of India<br />
                    Headland Sada, Vasco-da-Gama, Goa - 403804, India
                  </p>
                </div>
                <div className="space-y-1 text-[11px] text-slate-600 font-mono">
                  <div><strong>Phone:</strong> +91-832-2525600</div>
                  <div><strong>Email:</strong> director@ncpor.res.in</div>
                  <div><strong>Satcom Ops:</strong> ops@ncpor.res.in</div>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xs text-center space-y-1">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="font-bold text-emerald-900 text-xs">Inquiry Dispatched to NCPOR Goa Secretariat</div>
                  <div className="text-[10px] text-emerald-700">Thank you. An authorized officer will respond to your official request.</div>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-2.5"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Your Name</label>
                      <input required type="text" placeholder="Dr. / Officer Name" className="w-full p-1.5 border border-slate-300 rounded-xs text-xs" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Official Email</label>
                      <input required type="email" placeholder="name@domain.gov.in" className="w-full p-1.5 border border-slate-300 rounded-xs text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Expedition / Research Inquiry Subject</label>
                    <input required type="text" placeholder="Antarctic Expedition Proposal / Telemetry Query" className="w-full p-1.5 border border-slate-300 rounded-xs text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">Message / Specification</label>
                    <textarea required rows={3} placeholder="Provide details of your research inquiry or feedback..." className="w-full p-1.5 border border-slate-300 rounded-xs text-xs" />
                  </div>
                  <div className="flex justify-end space-x-2 pt-1">
                    <button type="button" onClick={() => setShowContactModal(false)} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xs text-xs font-semibold">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-1.5 bg-[#102a43] hover:bg-[#1a385f] text-white font-bold rounded-xs text-xs flex items-center space-x-1">
                      <Send className="w-3 h-3" />
                      <span>Submit Inquiry</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 4: DAKSHIN GANGOTRI HISTORICAL BASE ─── */}
      {showDakshinGangotriModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-xs border border-slate-300 w-full max-w-xl overflow-hidden shadow-2xl animate-scale-in font-sans">
            <div className="bg-[#102a43] text-white p-3 flex items-center justify-between border-b border-slate-300">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-tight">Dakshin Gangotri • First Indian Antarctic Base (1983)</h3>
              </div>
              <button onClick={() => setShowDakshinGangotriModal(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="bg-slate-50 p-3 rounded-xs border border-slate-200">
                <div className="font-bold text-slate-900 text-sm">Coordinates: 70°05′S, 12°00′E • Ice Shelf Base</div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Dakshin Gangotri was established during the 3rd Indian Scientific Expedition (1983–84). It was an unmanned containerized base in ice that supported wintering teams until 1989.
                </p>
              </div>

              <p className="text-[11px] text-slate-600">
                In 1989, due to natural ice-shelf accumulation and submergence under snow, it was decommissioned and designated as a protected Historic Site and Monument (HSM-44) under the Antarctic Treaty System. It now functions as a supply transit and fuel cache depot.
              </p>

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={() => setShowDakshinGangotriModal(false)}
                  className="px-3 py-1.5 bg-[#102a43] text-white text-xs font-bold rounded-xs cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── END OF MODALS ─── */}
    </div>
  );
};

export default AntarcticLandingPage;
