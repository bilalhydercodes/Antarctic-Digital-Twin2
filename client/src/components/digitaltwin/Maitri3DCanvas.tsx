import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { RBACRole, NavTab, ScenarioId } from '../../types';
import { 
  Search, 
  Wind, 
  Droplets, 
  Eye, 
  Sun, 
  CheckCircle2, 
  X, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Flame, 
  Thermometer, 
  Wrench, 
  ChevronRight, 
  Radio, 
  Layers,
  Compass as CompassIcon,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Play,
  Pause,
  TrendingUp,
  Sliders,
  Battery,
  Package
} from 'lucide-react';

// ─── DYNAMIC PROCEDURAL TEXTURE GENERATORS ───────────────────────────────────
function createMaitriFacadeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // White wall with arctic panel lines
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 512, 256);

    // Subtle steel cladding panel grooves
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    for (let x = 32; x < 512; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }

    // Windows row with warm interior light
    for (let x = 36; x < 480; x += 44) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(x, 140, 30, 24);
      ctx.fillStyle = 'rgba(253, 230, 138, 0.85)';
      ctx.fillRect(x + 3, 143, 24, 18);
    }

    // Indian Flag 🇮🇳
    const flagX = 140;
    const flagY = 36;
    const flagW = 90;
    const flagH = 60;
    // Saffron
    ctx.fillStyle = '#ff9933';
    ctx.fillRect(flagX, flagY, flagW, flagH / 3);
    // White
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(flagX, flagY + flagH / 3, flagW, flagH / 3);
    // Green
    ctx.fillStyle = '#138808';
    ctx.fillRect(flagX, flagY + (2 * flagH) / 3, flagW, flagH / 3);
    // Ashoka Chakra
    ctx.strokeStyle = '#000080';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(flagX + flagW / 2, flagY + flagH / 2, flagH / 6.5, 0, Math.PI * 2);
    ctx.stroke();

    // Bold MAITRI Lettering
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 38px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('MAITRI', 255, 80);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createHelipadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Dark asphalt pad
    ctx.fillStyle = '#262626';
    ctx.beginPath();
    ctx.arc(256, 256, 250, 0, Math.PI * 2);
    ctx.fill();

    // Outer border ring
    ctx.strokeStyle = '#525252';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.stroke();

    // Yellow inner target circle
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(256, 256, 175, 0, Math.PI * 2);
    ctx.stroke();

    // Yellow landing 'H'
    ctx.fillStyle = '#eab308';
    ctx.font = 'bold 160px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('H', 256, 256);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// ─── 3D ANTARCTIC HELICOPTER ──────────────────────────────────────────────────
const AntarcticHelicopter: React.FC<{ position: [number, number, number]; rotation?: number }> = ({ position, rotation = -0.3 }) => {
  const rotorRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 5;
    }
  });

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Fuselage body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 2.4]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Cockpit Canopy */}
      <mesh position={[0, 0.65, 1.4]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.55, 0.8, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} transparent opacity={0.8} />
      </mesh>
      {/* Tail boom */}
      <mesh position={[0, 0.8, -1.8]} rotation={[0.08, 0, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.22, 1.8, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Vertical tail stabilizer */}
      <mesh position={[0, 1.1, -2.6]} castShadow>
        <boxGeometry args={[0.06, 0.7, 0.4]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Landing Skids */}
      {[-0.55, 0.55].map((x, i) => (
        <group key={i} position={[x, 0.1, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.6, 8]} />
            <meshStandardMaterial color="#1f2937" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.3, 0.5]} rotation={[0, 0, (x > 0 ? -1 : 1) * 0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
          <mesh position={[0, 0.3, -0.5]} rotation={[0, 0, (x > 0 ? -1 : 1) * 0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
            <meshStandardMaterial color="#1f2937" />
          </mesh>
        </group>
      ))}
      {/* Main Rotor */}
      <group position={[0, 1.15, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.9} />
        </mesh>
        <group ref={rotorRef} position={[0, 0.16, 0]}>
          <mesh>
            <boxGeometry args={[0.12, 0.02, 4.4]} />
            <meshStandardMaterial color="#111827" roughness={0.5} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.12, 0.02, 4.4]} />
            <meshStandardMaterial color="#111827" roughness={0.5} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// ─── 3D COMMUNICATION LATTICE TOWER ───────────────────────────────────────────
const LatticeCommsTower: React.FC<{ position: [number, number, number]; height?: number }> = ({ position, height = 12 }) => {
  return (
    <group position={position}>
      {/* 4 main vertical corner steel legs with taper */}
      {[[-0.6, -0.6], [0.6, -0.6], [0.6, 0.6], [-0.6, 0.6]].map(([x, z], i) => (
        <mesh key={i} position={[x * 0.6, height / 2, z * 0.6]} castShadow>
          <cylinderGeometry args={[0.04, 0.1, height, 6]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#ef4444' : '#ffffff'} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {/* Cross braces along height */}
      {[2, 4, 6, 8, 10, 11.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[0, (i % 2) * Math.PI / 4, 0]}>
          <boxGeometry args={[1.2 * (1 - y / 16), 0.06, 0.06]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#ffffff' : '#ef4444'} metalness={0.7} />
        </mesh>
      ))}
      {/* Microwave Dishes */}
      <mesh position={[0.4, height * 0.7, 0]} rotation={[0, 0.8, -0.2]}>
        <cylinderGeometry args={[0.7, 0.7, 0.1, 16, 1, true]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Top Aircraft Warning Beacon */}
      <mesh position={[0, height + 0.3, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0, height + 0.3, 0]} color="#ff2222" intensity={2.5} distance={15} />
    </group>
  );
};

// ─── 3D FUEL STORAGE COMPLEX ──────────────────────────────────────────────────
const FuelStorageComplex: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  return (
    <group position={position}>
      {/* 4 large white cylindrical fuel tanks */}
      {[
        [-1.8, -1.8, 1.3],
        [ 1.8, -1.8, 1.4],
        [-1.8,  1.8, 1.4],
        [ 1.8,  1.8, 1.3]
      ].map(([x, z, r], idx) => (
        <group key={idx} position={[x, 0, z]}>
          {/* Main vertical tank cylinder */}
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[r, r, 3.6, 24]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.35} metalness={0.4} />
          </mesh>
          {/* Domed top cap */}
          <mesh position={[0, 3.6, 0]} castShadow>
            <sphereGeometry args={[r * 0.98, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.5} />
          </mesh>
          {/* Tank Ladder */}
          <mesh position={[0, 1.8, r + 0.05]}>
            <boxGeometry args={[0.25, 3.6, 0.04]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Interconnecting transfer pipes */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 4.2, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4.2, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} />
      </mesh>
      {/* Concrete safety containment pad */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[6.5, 0.1, 6.5]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.9} />
      </mesh>
    </group>
  );
};

// ─── 3D SATELLITE RADOME ───────────────────────────────────────────────────────
const SatelliteRadome: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    {/* Base support stand */}
    <mesh position={[0, 1.2, 0]} castShadow>
      <cylinderGeometry args={[1.2, 1.5, 2.4, 12]} />
      <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.5} />
    </mesh>
    {/* Geodesic spherical white dome */}
    <mesh position={[0, 2.8, 0]} castShadow>
      <sphereGeometry args={[1.4, 24, 24]} />
      <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
    </mesh>
  </group>
);

// ─── 3D POLAR SNOWCAT VEHICLE ─────────────────────────────────────────────────
const PolarSnowcat: React.FC<{ position: [number, number, number]; rotation?: number; color?: string }> = ({ position, rotation = 0, color = '#dc2626' }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    {/* Chassis */}
    <mesh position={[0, 0.45, 0]} castShadow>
      <boxGeometry args={[1.5, 0.6, 2.4]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </mesh>
    {/* Cabin & Windshield */}
    <mesh position={[0, 0.95, 0.3]} castShadow>
      <boxGeometry args={[1.3, 0.6, 1.2]} />
      <meshStandardMaterial color={color} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.95, 0.92]}>
      <boxGeometry args={[1.1, 0.4, 0.05]} />
      <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
    </mesh>
    {/* Dual Tracks */}
    {[-0.8, 0.8].map((x, i) => (
      <mesh key={i} position={[x, 0.2, 0]} castShadow>
        <boxGeometry args={[0.3, 0.35, 2.5]} />
        <meshStandardMaterial color="#1c1917" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

// ─── 3D DISTANT MOUNTAIN BACKDROP ─────────────────────────────────────────────
const DistantMountainRange: React.FC = () => {
  const mountainGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 40;
    const positions = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 1.4 + 0.8;
      const radius = 65 + Math.sin(i * 1.7) * 12;
      const x = Math.cos(angle) * radius;
      const z = -Math.sin(angle) * radius - 10;
      const h = 18 + Math.sin(i * 2.3) * 10 + Math.cos(i * 0.9) * 6;

      positions.push(
        x - 4, 0, z - 4,
        x, h, z,
        x + 4, 0, z + 4
      );
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={mountainGeometry} position={[0, -0.5, 0]}>
      <meshStandardMaterial
        color="#ffffff"
        roughness={0.65}
        metalness={0.1}
        emissive="#ffedd5"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};

// ─── COMPASS AZIMUTH TRACKER ──────────────────────────────────────────────────
const CompassAzimuthTracker: React.FC<{ onAngleChange: (angle: number) => void }> = ({ onAngleChange }) => {
  const { camera } = useThree();
  useFrame(() => {
    // Calculate polar azimuth angle from camera position
    const angle = Math.atan2(camera.position.x, camera.position.z) * (180 / Math.PI);
    onAngleChange(angle);
  });
  return null;
};

// ─── HOTSPOT DEFINITIONS MATCHING SCREENSHOT ──────────────────────────────────
interface StationHotspot {
  id: string;
  label: string;
  pos: [number, number, number];
  category: string;
  status: string;
  temp: string;
  power: string;
  description: string;
  equipment: string[];
}

const MAITRI_HOTSPOTS: StationHotspot[] = [
  {
    id: 'comms-tower',
    label: 'Communication Tower',
    pos: [-16, 7.5, -1],
    category: 'TELECOMMUNICATIONS',
    status: 'OPERATIONAL',
    temp: '-12.4°C',
    power: '4.8 kW',
    description: '12m steel lattice tower carrying dual Ku-band satellite uplink, VHF air-to-ground transceiver, and HF Antarctic communications.',
    equipment: ['Ku-Band VSAT Uplink', 'VHF Air-Band Transceiver', 'Iridium Extreme Gateway', 'Aviation Warning Beacon']
  },
  {
    id: 'power-plant',
    label: 'Power Plant',
    pos: [-10, 2.5, 4],
    category: 'ENERGY & MICROGRID',
    status: 'OPTIMAL (4/4 CHP)',
    temp: '68.2°C',
    power: '128 kW Gen',
    description: 'Main co-generation station power house featuring 4x 62.5 kVA diesel generators with waste-heat hydronic recovery loop.',
    equipment: ['CHP Generator #1 (Primary)', 'CHP Generator #2 (Co-gen)', 'CHP Generator #3 (Standby)', 'Hydronic Heat Exchanger']
  },
  {
    id: 'fuel-storage',
    label: 'Fuel Storage',
    pos: [-9, 2.8, -9],
    category: 'LOGISTICS & RESERVES',
    status: 'NORMAL (78% FULL)',
    temp: '-4.1°C',
    power: '1.2 kW Heaters',
    description: 'Heated bulk fuel tank farm storing Arctic-grade aviation kerosene (ATF-50) with automated leak detection & trace heating.',
    equipment: ['Tank #1 (12,000L ATF-50)', 'Tank #2 (12,000L ATF-50)', 'Tank #3 (12,000L)', 'Tank #4 (12,000L)', 'Heated Transfer Manifold']
  },
  {
    id: 'main-building',
    label: 'Main Building',
    pos: [-1, 3.8, -3],
    category: 'COMMAND & RESIDENTIAL',
    status: 'ACTIVE OCCUPANCY (25)',
    temp: '+21.5°C',
    power: '44 kW Load',
    description: 'Two-story central station structure housing the command room, radio shacks, mess hall, library, medical infirmary, and boiler room.',
    equipment: ['Central PLC Station Automation', 'Medical Surgery Infirmary', '415V Main Switchboard', 'Pressurized Water Distribution']
  },
  {
    id: 'research-lab',
    label: 'Research Lab',
    pos: [3, 3.2, 5],
    category: 'SCIENCE & SENSORS',
    status: 'CALIBRATED & ONLINE',
    temp: '+19.8°C',
    power: '18.4 kW Load',
    description: 'Multidisciplinary research wing for atmospheric physics, geomagnetism, seismology, ozone spectrophotometry, and meteorology.',
    equipment: ['Proton Magnetometer', 'Broadband Seismograph', 'Brewer Ozone Spectrophotometer', 'Riometer Aurora Monitor']
  },
  {
    id: 'living-quarters',
    label: 'Living Quarters',
    pos: [9, 2.2, 0],
    category: 'LIFE SUPPORT',
    status: 'PRESSURIZED & NOMINAL',
    temp: '+20.8°C',
    power: '22 kW Load',
    description: 'Insulated modular container blocks providing private cabins, sanitation units, laundry, air recycling, and water heaters for overwintering crew.',
    equipment: ['HVAC Air Recirculator', 'Greywater Recycling Loop', 'Fire Suppression Halon Array', 'Emergency Battery Lighting']
  },
  {
    id: 'helipad',
    label: 'Helipad',
    pos: [15, 1.2, -6],
    category: 'AVIATION & LOGISTICS',
    status: 'ACTIVE / LANDING CLEAR',
    temp: '-8.2°C',
    power: '2.5 kW Lighting',
    description: 'Reinforced 18m circular arctic helicopter landing pad equipped with green perimeter guidance lights and parked rescue helicopter.',
    equipment: ['Antarctic Medical Evac Helicopter', 'Green Perimeter Heli-Lights', 'Approach Wind Direction Indicator', 'Foam Fire Extinguisher Station']
  },
  {
    id: 'met-mast',
    label: 'Meteorological Mast',
    pos: [19, 4.5, 6],
    category: 'ATMOSPHERIC SENSING',
    status: 'TRANSMITTING',
    temp: '-8.2°C',
    power: '0.4 kW',
    description: '10m WMO-standard synoptic weather mast with ultrasonic anemometers, pyranometers, barometric sensors, and snow accumulation gauges.',
    equipment: ['Sonic Anemometer (14.6 m/s E)', 'Thermistor String (-8.2°C)', 'Capacitive Barometer', 'Campbell Scientific Data Logger']
  }
];

// ─── MAIN 3D DIGITAL TWIN VIEW COMPONENT ──────────────────────────────────────
interface Maitri3DCanvasProps {
  onNavigate?: (tab: NavTab) => void;
}

export const Maitri3DCanvas: React.FC<Maitri3DCanvasProps> = ({ onNavigate }) => {
  const { 
    userRole, 
    setUserRole, 
    activeStationId, 
    setActiveStationId,
    environment,
    energy,
    simulationState,
    triggerScenario,
    setSpeed,
    toggleSimulation
  } = useSimulation();

  const [activeNavTab, setActiveNavTab] = useState<'stations' | 'data' | 'simulation' | 'resources'>('stations');
  const [stationDropdownOpen, setStationDropdownOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<StationHotspot | null>(null);
  const [compassAngle, setCompassAngle] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Live IST Clock matching the screenshot
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
      setCurrentTime(`Mon, 8 Sep 2026 ${timeStr} IST`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Textures created once memoized
  const maitriFacadeTexture = useMemo(() => createMaitriFacadeTexture(), []);
  const helipadTexture = useMemo(() => createHelipadTexture(), []);

  const filteredHotspots = useMemo(() => {
    if (!searchQuery) return MAITRI_HOTSPOTS;
    return MAITRI_HOTSPOTS.filter(h => 
      h.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="relative w-full h-full min-h-[720px] bg-slate-950 font-sans overflow-hidden select-none">
      
      {/* ── 1. TOP HEADER OVERLAY (EXACT COPY OF SCREENSHOT) ── */}
      <div className="absolute top-0 inset-x-0 z-30 px-6 py-3 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between gap-4 text-white text-xs">
        
        {/* Left: Search Bar */}
        <div className="relative flex items-center">
          <div 
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-500 text-slate-300 w-64 md:w-80 cursor-pointer shadow-inner transition"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 font-medium truncate">
              {searchQuery || 'Search systems, buildings, or data...'}
            </span>
            <span className="ml-auto px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
              Ctrl K
            </span>
          </div>

          {/* Quick Jump Search Dropdown */}
          {searchOpen && (
            <div className="absolute top-10 left-0 w-80 bg-slate-900/95 border border-cyan-500/40 rounded-xl shadow-2xl p-2 z-50 divide-y divide-slate-800 backdrop-blur-xl">
              <div className="p-1 flex items-center justify-between">
                <input
                  type="text"
                  placeholder="Type to filter station facilities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none px-2 py-1 font-sans"
                />
                <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="pt-2 max-h-56 overflow-y-auto space-y-1">
                {filteredHotspots.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSelectedHotspot(h);
                      setSearchOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-left transition"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-xs text-white">{h.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{h.category}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Center: Main Navigation Tabs (Stations, Data, Simulation, Resources) */}
        <nav className="relative hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-wider">
          {/* 1. STATIONS */}
          <div className="relative">
            <button
              onClick={() => {
                setActiveNavTab('stations');
                setStationDropdownOpen(prev => !prev);
              }}
              className={`flex items-center space-x-1.5 pb-0.5 transition cursor-pointer ${
                activeNavTab === 'stations'
                  ? 'text-white font-bold border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                  : 'text-slate-400 hover:text-white border-b-2 border-transparent'
              }`}
            >
              <span>Stations</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${stationDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
            </button>

            {/* Station Dropdown */}
            {stationDropdownOpen && (
              <div className="absolute top-9 left-1/2 -translate-x-1/2 w-80 bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl p-2.5 z-50 divide-y divide-slate-800 backdrop-blur-2xl animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Select Antarctic Station (3D Twin)
                </div>
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      setActiveStationId('maitri');
                      setStationDropdownOpen(false);
                      setActiveNavTab('stations');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition cursor-pointer ${
                      activeStationId === 'maitri'
                        ? 'bg-blue-600/30 border border-blue-500/60 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-xs">
                        <span className="text-sm">🇮🇳</span>
                        <span className="text-white">MAITRI STATION</span>
                        {activeStationId === 'maitri' && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[9px] font-black text-white">ACTIVE</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        70°45&apos;S, 11°44&apos;E • Schirmacher Oasis • Est. 1988
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveStationId('bharati');
                      setStationDropdownOpen(false);
                      setActiveNavTab('stations');
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition cursor-pointer ${
                      activeStationId === 'bharati'
                        ? 'bg-cyan-600/30 border border-cyan-500/60 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-xs">
                        <span className="text-sm">🇮🇳</span>
                        <span className="text-white">BHARATI STATION</span>
                        {activeStationId === 'bharati' && (
                          <span className="px-1.5 py-0.5 rounded bg-cyan-500 text-[9px] font-black text-slate-950">ACTIVE</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        69°24&apos;S, 76°11&apos;E • Larsemann Hills • 2012
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. DATA */}
          <button
            onClick={() => {
              setActiveNavTab(prev => prev === 'data' ? 'stations' : 'data');
              setStationDropdownOpen(false);
            }}
            className={`pb-0.5 transition cursor-pointer ${
              activeNavTab === 'data'
                ? 'text-white font-bold border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            Data
          </button>

          {/* 3. SIMULATION */}
          <button
            onClick={() => {
              setActiveNavTab(prev => prev === 'simulation' ? 'stations' : 'simulation');
              setStationDropdownOpen(false);
            }}
            className={`pb-0.5 transition cursor-pointer ${
              activeNavTab === 'simulation'
                ? 'text-white font-bold border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            Simulation
          </button>

          {/* 4. RESOURCES */}
          <button
            onClick={() => {
              setActiveNavTab(prev => prev === 'resources' ? 'stations' : 'resources');
              setStationDropdownOpen(false);
            }}
            className={`pb-0.5 transition cursor-pointer ${
              activeNavTab === 'resources'
                ? 'text-white font-bold border-b-2 border-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                : 'text-slate-400 hover:text-white border-b-2 border-transparent'
            }`}
          >
            Resources
          </button>
        </nav>

        {/* Right Section: Weather, Clock, Role, Profile */}
        <div className="flex items-center space-x-4">
          {/* Weather pill */}
          <div className="hidden sm:flex items-center space-x-1.5 font-mono text-xs text-slate-200">
            <Sun className="w-4 h-4 text-amber-400" />
            <span className="font-bold">-8.2°C</span>
            <span className="text-[11px] text-slate-400">Clear Sky</span>
          </div>

          {/* Time indicator */}
          <div className="hidden md:flex flex-col text-right font-mono text-[11px] leading-tight text-slate-300">
            <span>{currentTime || 'Mon, 8 Sep 2026 15:42 IST'}</span>
          </div>

          {/* Role selector dropdown */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-bold text-white shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as RBACRole)}
              className="bg-transparent font-black text-xs text-white focus:outline-none cursor-pointer uppercase tracking-wider"
            >
              <option value="COMMANDER" className="bg-slate-900">COMMANDER</option>
              <option value="ADMIN" className="bg-slate-900">ADMIN</option>
              <option value="OPERATOR" className="bg-slate-900">OPERATOR</option>
              <option value="SCIENTIST" className="bg-slate-900">SCIENTIST</option>
              <option value="VIEWER" className="bg-slate-900">VIEWER</option>
            </select>
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md">
              B
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="font-bold text-white text-xs">Bilal</span>
              <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span>Online</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. TOP-LEFT STATION METADATA OVERLAY ── */}
      <div className="absolute top-16 left-6 z-20 space-y-1.5 text-white pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        <div className="flex items-center space-x-2 text-xs font-bold tracking-widest text-sky-300 uppercase">
          <span className="w-3 h-3 rounded-full border border-sky-400 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          </span>
          <span>INDIA</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          MAITRI STATION
        </h1>

        <div className="text-xs text-slate-300 font-medium">
          Queen Maud Land, East Antarctica
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-300 font-mono">
          <span>70°45&apos;S, 11°44&apos;E</span>
          <span>•</span>
          <span>Elevation: ~50 m (NCPOR Profile)</span>
        </div>

        <div className="pt-1 flex items-center space-x-3">
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500 text-emerald-400 text-[10px] font-mono font-extrabold tracking-wider flex items-center space-x-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL</span>
          </span>
        </div>

        <div className="text-xs text-slate-400 italic font-serif pt-1 max-w-xs leading-snug">
          &ldquo;Science beyond boundaries for a sustainable planet.&rdquo;
        </div>
      </div>

      {/* ── 3. TOP-RIGHT LOCAL WEATHER CARD & COMPASS ── */}
      <div className="absolute top-16 right-6 z-20 flex flex-col items-end space-y-3 pointer-events-auto">
        {/* Weather Card */}
        <div className="backdrop-blur-xl bg-slate-900/65 border border-slate-700/70 rounded-2xl p-4 text-white shadow-2xl w-60">
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-sky-300 mb-2">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Local Weather</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <Sun className="w-7 h-7 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
              <div>
                <div className="text-2xl font-black font-mono leading-none">-8.2°C</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Clear Sky</div>
              </div>
            </div>
          </div>

          <div className="pt-2.5 space-y-1.5 text-[11px] font-mono text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1">
                <Wind className="w-3 h-3 text-slate-400" />
                <span>Wind</span>
              </span>
              <span className="font-bold">14.6 m/s (E)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1">
                <Droplets className="w-3 h-3 text-slate-400" />
                <span>Humidity</span>
              </span>
              <span className="font-bold">68%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center space-x-1">
                <Eye className="w-3 h-3 text-slate-400" />
                <span>Visibility</span>
              </span>
              <span className="font-bold">15 km</span>
            </div>
          </div>
        </div>

        {/* 3D North Compass Rose Indicator */}
        <div className="relative w-12 h-12 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-lg flex items-center justify-center text-white">
          <span className="absolute top-1 text-[9px] font-black text-sky-400 font-mono">N</span>
          <div 
            className="w-6 h-6 transition-transform duration-75"
            style={{ transform: `rotate(${-compassAngle}deg)` }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]">
              {/* North blue arrow pointer */}
              <polygon points="12,2 16,14 12,11" fill="#38bdf8" />
              <polygon points="12,2 8,14 12,11" fill="#0284c7" />
              {/* South gray arrow pointer */}
              <polygon points="12,22 16,13 12,14" fill="#64748b" />
              <polygon points="12,22 8,13 12,14" fill="#475569" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── 4. BOTTOM FLOATING CONTROLS PILL ── */}
      <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="backdrop-blur-xl bg-slate-950/75 border border-slate-700/70 rounded-full px-6 py-2.5 shadow-2xl text-xs font-medium text-slate-300 flex items-center space-x-6">
          <div className="flex items-center space-x-1.5">
            <span>👆</span>
            <span>Click on a building to view details</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-1.5">
            <span>🔄</span>
            <span>Hold and drag to rotate</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center space-x-1.5">
            <span>🔍</span>
            <span>Scroll to zoom</span>
          </div>
        </div>
      </div>

      {/* ── 5. BUILDING DETAILS INSPECTION MODAL ── */}
      {selectedHotspot && (
        <div className="absolute top-20 right-6 z-40 w-96 backdrop-blur-2xl bg-slate-950/90 border border-cyan-500/50 rounded-2xl p-5 text-white shadow-[0_10px_50px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-right-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wide">
                {selectedHotspot.label}
              </h3>
            </div>
            <button 
              onClick={() => setSelectedHotspot(null)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3 text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">CATEGORY</span>
              <span className="px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800 font-bold">
                {selectedHotspot.category}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">OPERATIONAL STATUS</span>
              <span className="text-emerald-400 font-bold">{selectedHotspot.status}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-slate-300 leading-relaxed text-xs">
              {selectedHotspot.description}
            </div>

            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">OPERATING TEMP</div>
                <div className="text-base font-bold text-cyan-400 mt-0.5">{selectedHotspot.temp}</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-500">POWER / TELEMETRY</div>
                <div className="text-base font-bold text-amber-400 mt-0.5">{selectedHotspot.power}</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                ACTIVE SUBSYSTEMS & ASSETS
              </div>
              <div className="space-y-1">
                {selectedHotspot.equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-[11px] text-slate-300 font-mono py-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5B. DATA & TELEMETRY HUB MODAL ── */}
      {activeNavTab === 'data' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl backdrop-blur-2xl bg-slate-950/92 border border-cyan-500/50 rounded-2xl p-5 text-white shadow-[0_12px_60px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Station Telemetry & Data Streams</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  LIVE 10 Hz
                </span>
              </h3>
            </div>
            <button 
              onClick={() => setActiveNavTab('stations')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {/* 1. Atmospheric Grid */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center space-x-1.5">
                <Wind className="w-3 h-3 text-sky-400" />
                <span>Atmospheric & Meteorological Sensors</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-500">AMBIENT TEMP</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {environment?.ambientTemp?.toFixed(1) ?? '-8.2'}°C
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-500">WIND SPEED</div>
                  <div className="text-sm font-bold text-sky-400 mt-0.5">
                    {environment?.windSpeed?.toFixed(1) ?? '14.6'} m/s
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-500">HUMIDITY</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {environment?.humidity?.toFixed(0) ?? '68'}%
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-500">PRESSURE</div>
                  <div className="text-sm font-bold text-indigo-300 mt-0.5">
                    {environment?.barometricPressure?.toFixed(0) ?? '984'} hPa
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Microgrid & Power Grid */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center space-x-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Energy & Microgrid Distribution</span>
              </div>
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-500">CHP DIESEL GEN</div>
                  <div className="text-sm font-bold text-cyan-400 mt-0.5">
                    {energy?.powerGeneration?.dieselKw?.toFixed(0) ?? '128'} kW
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-500">SOLAR PV YIELD</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {energy?.powerGeneration?.solarKw?.toFixed(1) ?? '24.5'} kW
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="text-[10px] text-slate-500">BATTERY BANK SOC</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">
                    {energy?.batteryStorage?.batteryPercent?.toFixed(0) ?? '92'}%
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Quick Action Buttons */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] text-slate-400">
                Explore deep sensor graphs & telemetry archives:
              </div>
              <div className="flex items-center space-x-2">
                {onNavigate && (
                  <>
                    <button
                      onClick={() => onNavigate('sensors')}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/60 text-cyan-200 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Sensor Matrix</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigate('analytics')}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Trends & Logs</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5C. SIMULATION CONTROL OVERLAY ── */}
      {activeNavTab === 'simulation' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl backdrop-blur-2xl bg-slate-950/92 border border-purple-500/50 rounded-2xl p-5 text-white shadow-[0_12px_60px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#c084fc]" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Polar Simulation Engine</span>
                <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
                  {simulationState?.activeScenario ? simulationState.activeScenario.toUpperCase().replace('_', ' ') : 'NORMAL CONDITIONS'}
                </span>
              </h3>
            </div>
            <button 
              onClick={() => setActiveNavTab('stations')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {/* Simulation Clock Speeds */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Simulation Engine State</div>
                <div className="text-[11px] text-slate-400">Control clock progression rate across digital twin models</div>
              </div>
              <div className="flex items-center space-x-1.5 font-mono">
                <button
                  onClick={() => toggleSimulation?.()}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                    !simulationState?.isRunning ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Pause className="w-3 h-3" />
                  <span>Pause</span>
                </button>
                {[1, 5, 20].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed?.(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      simulationState?.speed === s && simulationState?.isRunning
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Scenario Triggers */}
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                1-Click Antarctic Scenario Injection
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => triggerScenario?.('normal')}
                  className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-600/50 text-emerald-200 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    <span>⚡</span>
                    <span>Baseline Normal</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/80 mt-0.5">Restore all safe nominals</div>
                </button>

                <button
                  onClick={() => triggerScenario?.('blizzard')}
                  className="p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-950/70 border border-sky-600/50 text-sky-200 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    <span>❄️</span>
                    <span>Blizzard Surge</span>
                  </div>
                  <div className="text-[10px] text-sky-400/80 mt-0.5">65 kt winds & whiteout</div>
                </button>

                <button
                  onClick={() => triggerScenario?.('generator_failure')}
                  className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-600/50 text-rose-200 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    <span>🔥</span>
                    <span>DG Generator Trip</span>
                  </div>
                  <div className="text-[10px] text-rose-400/80 mt-0.5">Auto-failover to backup</div>
                </button>

                <button
                  onClick={() => triggerScenario?.('battery_low')}
                  className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-950/70 border border-amber-600/50 text-amber-200 text-left transition text-xs cursor-pointer"
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    <span>🔋</span>
                    <span>Battery Critical</span>
                  </div>
                  <div className="text-[10px] text-amber-400/80 mt-0.5">Load shedding & priority</div>
                </button>

                <button
                  onClick={() => triggerScenario?.('multi_system_failure')}
                  className="p-2.5 rounded-xl bg-red-950/50 hover:bg-red-950/80 border border-red-500/60 text-red-200 text-left transition text-xs col-span-2 sm:col-span-2 cursor-pointer"
                >
                  <div className="font-bold flex items-center space-x-1.5">
                    <span>⚠️</span>
                    <span>Compound Multi-System Disaster</span>
                  </div>
                  <div className="text-[10px] text-red-300/80 mt-0.5">Blizzard + power trip + heating crisis</div>
                </button>
              </div>
            </div>

            {/* Quick Action Button */}
            {onNavigate && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Need advanced Monte Carlo what-if modeling?
                </div>
                <button
                  onClick={() => onNavigate('scenarios')}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/60 text-purple-200 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <span>Open Full Scenario Lab</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 5D. RESOURCES & LOGISTICS OVERLAY ── */}
      {activeNavTab === 'resources' && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-2xl backdrop-blur-2xl bg-slate-950/92 border border-emerald-500/50 rounded-2xl p-5 text-white shadow-[0_12px_60px_rgba(0,0,0,0.9)] animate-in fade-in slide-in-from-top-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <h3 className="font-extrabold text-sm text-white uppercase tracking-wider flex items-center space-x-2">
                <span>Station Resources & Reserves</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  OVERWINTER RESERVES
                </span>
              </h3>
            </div>
            <button 
              onClick={() => setActiveNavTab('stations')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
              {/* 1. Fuel Reserves */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1.5 font-sans font-bold">
                    <span>⛽</span>
                    <span>ATF-50 Fuel Reserves</span>
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {energy?.fuelStorage?.fuelPercent ?? 78}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${energy?.fuelStorage?.fuelPercent ?? 78}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Capacity: 120,000 L</span>
                  <span className="text-white font-bold">{energy?.fuelStorage?.estimatedDaysRemaining ?? 195} Days Remaining</span>
                </div>
              </div>

              {/* 2. Freshwater & Melter */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1.5 font-sans font-bold">
                    <span>💧</span>
                    <span>Freshwater Storage</span>
                  </span>
                  <span className="text-cyan-400 font-bold">88%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-cyan-500 h-2 rounded-full w-[88%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Melter Rate: 1,200 L/d</span>
                  <span className="text-white font-bold">Greywater Loop: 82%</span>
                </div>
              </div>

              {/* 3. Battery Energy Reserves */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1.5 font-sans font-bold">
                    <span>🔋</span>
                    <span>Battery Bank Storage</span>
                  </span>
                  <span className="text-amber-400 font-bold">
                    {energy?.batteryStorage?.batteryPercent?.toFixed(0) ?? '92'}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${energy?.batteryStorage?.batteryPercent ?? 92}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>LiFePO4 240 kWh</span>
                  <span className="text-white font-bold">Autonomy: 14.2 Hours</span>
                </div>
              </div>

              {/* 4. Crew Provisions */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1.5 font-sans font-bold">
                    <span>📦</span>
                    <span>Crew Rations & Medical</span>
                  </span>
                  <span className="text-emerald-400 font-bold">96%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full w-[96%]" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Medical O2: 18 Cylinders</span>
                  <span className="text-white font-bold">210 Days Food Stores</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            {onNavigate && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Full inventory tracking & consumable dispatch:
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onNavigate('logistics')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 text-emerald-200 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Station Stores Ledger</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate('energy')}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Power Grid</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 6. REAL INTERACTIVE THREE.JS 3D CANVAS ── */}
      <Canvas
        shadows
        camera={{ position: [16, 18, 28], fov: 42 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <OrbitControls
          maxPolarAngle={Math.PI / 2.05}
          minDistance={10}
          maxDistance={65}
          target={[0, 1.5, 0]}
        />

        <CompassAzimuthTracker onAngleChange={setCompassAngle} />

        {/* Cinematic Golden Sunrise Atmospheric Lighting */}
        <color attach="background" args={['#0a1322']} />
        <fog attach="fog" args={['#0f1c30', 25, 80]} />

        {/* Ambient polar fill light */}
        <ambientLight intensity={0.9} color="#cbd5e1" />

        {/* Low golden morning sunrise light casting long shadows */}
        <directionalLight
          position={[38, 14, 45]}
          intensity={2.4}
          color="#ffedd5"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-25}
          shadow-camera-right={25}
          shadow-camera-top={25}
          shadow-camera-bottom={-25}
          shadow-bias={-0.0002}
        />

        {/* Icy blue secondary bounce light */}
        <directionalLight
          position={[-30, 20, -30]}
          intensity={0.6}
          color="#93c5fd"
        />

        {/* Distant Mountain Peak Range */}
        <DistantMountainRange />

        {/* Snow Terrain Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[120, 120]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.7} metalness={0.1} />
        </mesh>

        {/* Station Gravel & Track Plateau */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[50, 42]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.8} metalness={0.05} />
        </mesh>

        {/* ── STATION BUILDINGS & MESHES ── */}

        {/* 1. MAIN BUILDING (With 🇮🇳 Indian Flag & MAITRI Texture) */}
        <group position={[-1, 0, -3]}>
          <mesh position={[0, 2.0, 0]} castShadow receiveShadow>
            <boxGeometry args={[9.5, 4.0, 6.0]} />
            <meshStandardMaterial
              map={maitriFacadeTexture}
              roughness={0.3}
              metalness={0.3}
            />
          </mesh>
          {/* Green roof trim */}
          <mesh position={[0, 4.05, 0]} castShadow>
            <boxGeometry args={[9.7, 0.15, 6.2]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} />
          </mesh>
          {/* Rooftop antennas & ventilation units */}
          <mesh position={[-2.5, 4.4, 1.2]} castShadow>
            <boxGeometry args={[1.2, 0.6, 1.2]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[2.5, 4.4, -1.2]} castShadow>
            <boxGeometry args={[1.4, 0.7, 1.0]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
        </group>

        {/* 2. RESEARCH LAB COMPLEX */}
        <group position={[3, 0, 5]}>
          <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
            <boxGeometry args={[7.2, 3.6, 4.8]} />
            <meshStandardMaterial color="#d97706" roughness={0.4} metalness={0.4} />
          </mesh>
          <mesh position={[0, 3.65, 0]} castShadow>
            <boxGeometry args={[7.3, 0.15, 4.9]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
        </group>

        {/* 3. LIVING QUARTERS / ACCOMMODATION UNITS */}
        <group position={[9, 0, 0]}>
          {[-1.5, 1.5].map((z, i) => (
            <mesh key={i} position={[0, 1.1, z]} castShadow receiveShadow>
              <boxGeometry args={[5.2, 2.2, 2.2]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.3} />
            </mesh>
          ))}
          {/* Connecting corridor */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[1.5, 1.8, 1.2]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>

        {/* 4. FUEL STORAGE TANK COMPLEX */}
        <FuelStorageComplex position={[-9, 0, -9]} />

        {/* 5. POWER PLANT GENERATOR HOUSE */}
        <group position={[-10, 0, 4]}>
          <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.0, 3.2, 4.2]} />
            <meshStandardMaterial color="#334155" roughness={0.5} metalness={0.6} />
          </mesh>
          {/* Generator Exhaust Stacks */}
          {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
            <mesh key={i} position={[x, 3.8, -1]} castShadow>
              <cylinderGeometry args={[0.09, 0.09, 1.4, 8]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} />
            </mesh>
          ))}
        </group>

        {/* 6. COMMUNICATION LATTICE TOWER */}
        <LatticeCommsTower position={[-16, 0, -1]} height={13} />

        {/* 7. HELIPAD & HELICOPTER */}
        <group position={[15, 0, -6]}>
          {/* Circular asphalt pad with 'H' */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]} receiveShadow>
            <circleGeometry args={[5.8, 32]} />
            <meshStandardMaterial
              map={helipadTexture}
              roughness={0.8}
            />
          </mesh>
          {/* Perimeter runway guidance lights */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x = Math.cos(rad) * 5.6;
            const z = Math.sin(rad) * 5.6;
            return (
              <mesh key={i} position={[x, 0.12, z]}>
                <cylinderGeometry args={[0.06, 0.06, 0.18, 8]} />
                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1.5} />
              </mesh>
            );
          })}
          {/* Parked Antarctic Rescue Helicopter */}
          <AntarcticHelicopter position={[0, 0, 0]} rotation={-0.4} />
        </group>

        {/* 8. SATELLITE RADOME */}
        <SatelliteRadome position={[4, 0, -8]} />

        {/* 9. METEOROLOGICAL SENSOR MAST */}
        <group position={[19, 0, 6]}>
          <mesh position={[0, 3.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.1, 7, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          <mesh position={[0, 7.1, 0]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* 10. PARKED POLAR EXPEDITION VEHICLES */}
        <PolarSnowcat position={[-3.5, 0, 2.5]} rotation={0.6} color="#dc2626" />
        <PolarSnowcat position={[5, 0, -2.5]} rotation={-0.3} color="#2563eb" />
        <PolarSnowcat position={[-12, 0, 8]} rotation={1.4} color="#ea580c" />

        {/* ── 3D FLOATING HOTSPOT BADGES (MATCHING SCREENSHOT) ── */}
        {MAITRI_HOTSPOTS.map((hotspot) => (
          <Html
            key={hotspot.id}
            position={hotspot.pos}
            center
            distanceFactor={28}
            zIndexRange={[15, 0]}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHotspot(hotspot);
              }}
              className={`group flex items-center space-x-1.5 px-3 py-1 rounded-full backdrop-blur-md text-white font-sans text-xs font-semibold shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap ${
                selectedHotspot?.id === hotspot.id
                  ? 'bg-blue-600 border-2 border-blue-300 ring-4 ring-blue-500/40'
                  : 'bg-slate-950/85 border border-cyan-500/50 hover:border-cyan-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse shrink-0" />
              <span className="drop-shadow-sm">{hotspot.label}</span>
            </button>
          </Html>
        ))}
      </Canvas>
    </div>
  );
};

export default Maitri3DCanvas;
