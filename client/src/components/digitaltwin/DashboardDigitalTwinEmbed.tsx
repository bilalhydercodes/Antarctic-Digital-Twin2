import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { 
  Maximize2, 
  CheckCircle2, 
  X, 
  Activity, 
  Zap, 
  Thermometer, 
  Wrench, 
  Flame,
  Fuel,
  Compass,
  Layers,
  RotateCw,
  ZoomIn,
  Move
} from 'lucide-react';

interface DashboardDigitalTwinEmbedProps {
  stationId: 'maitri' | 'bharati';
  mode?: 'exterior' | 'interior' | 'thermal';
  onNavigate?: (tab: any) => void;
}

interface HotspotData {
  id: string;
  label: string;
  category: string;
  pos: [number, number, number];
  status: string;
  temp: string;
  power: string;
  description: string;
  equipment: string[];
}

const MAITRI_HOTSPOTS: HotspotData[] = [
  {
    id: 'power-house',
    label: 'Power House & GenSets',
    category: 'Energy Microgrid',
    pos: [-10, 3.2, 4],
    status: 'OPERATIONAL (NOMINAL)',
    temp: '+74.2 °C',
    power: '310 kW Active',
    description: '3x Kirloskar 125 kVA diesel generators with automated load-shedding and synchronized microgrid bus.',
    equipment: ['Kirloskar DG-01 (Primary)', 'Kirloskar DG-02 (Standby)', 'Sync Switchgear 415V', 'Fuel Day Tank (1,500L)']
  },
  {
    id: 'living-block',
    label: 'Main Living & Research Complex',
    category: 'Habitation / Labs',
    pos: [-1, 3.8, -3],
    status: 'OPTIMAL (47 CREW)',
    temp: '+19.4 °C',
    power: '42 kW Heating',
    description: 'Central insulated living quarters, medical surgical bay, communications room, and atmospheric science laboratories.',
    equipment: ['Hydronic Boiler Loop #1', 'Life-Support HVAC', 'IMD Brewer Spectrophotometer', 'Medical O2 Storage']
  },
  {
    id: 'lake-pump',
    label: 'Lake Priyadarshini Trace Loop',
    category: 'Water Life Support',
    pos: [14, 1.2, 12],
    status: 'HEATED (+3.2 °C)',
    temp: '+3.2 °C (Safe > +2.0°C)',
    power: '18 kW Trace Heat',
    description: '1.2 km heated fresh water pipeline from Lake Priyadarshini submersible intake with anti-freeze trace heating.',
    equipment: ['Submersible Pump Unit A', 'Submersible Pump Unit B', 'Electric Trace-Heating Cable', 'Anti-Freeze Recirculator']
  },
  {
    id: 'fuel-farm',
    label: 'AN-8 Polar Diesel Tank Farm',
    category: 'Fuel Logistics',
    pos: [-9, 2.2, -9],
    status: 'RESERVE: 48.6 DAYS',
    temp: '-14.8 °C',
    power: '80,000 L Storage',
    description: 'Insulated fuel tanks holding specialized aviation turbine fuel ATF/AN-8 with low-temperature anti-gel additives.',
    equipment: ['Tank Farm #1 (40kL)', 'Tank Farm #2 (40kL)', 'Heated Transfer Manifold', 'Emergency Cutoff Valves']
  },
  {
    id: 'comms-tower',
    label: 'Comms Tower & Weather Mast',
    category: 'Telemetry / SATCOM',
    pos: [-16, 6.5, -1],
    status: 'LINKED (VSAT-C)',
    temp: '-32.4 °C (Ambient)',
    power: '45 ms Latency',
    description: 'High-gain C-band satellite dish, HF radio transceiver array, and IMD ultrasonic wind sensor mast.',
    equipment: ['C-Band Primary Earth Station', 'HF Dipole Antenna', 'IMD AWS 3D Anemometer', 'IIG Fluxgate Cable']
  }
];

const BHARATI_HOTSPOTS: HotspotData[] = [
  {
    id: 'chp-energy',
    label: 'MAN CHP Co-Generation Plant',
    category: 'Microgrid / Thermal',
    pos: [-8, 3.2, 3],
    status: 'OPERATIONAL (+28% EFF)',
    temp: '+82.4 °C',
    power: '284 kW / 185 kWth',
    description: '3x 100 kVA MAN engines capturing 185 kW of waste exhaust heat for station hydronic space heating.',
    equipment: ['MAN DG-01 CHP Unit', 'MAN DG-02 CHP Unit', 'Plate Heat Exchangers', '415V Bus Synchronizer']
  },
  {
    id: 'iso-core',
    label: 'Central ISO Container Core',
    category: 'Habitation / Structural',
    pos: [0, 3.6, 0],
    status: 'NOMINAL (35 CREW)',
    temp: '+20.5 °C',
    power: '38 kW Base Load',
    description: '134 ISO container modules housed within an aerodynamic double-skinned insulated envelope on structural stilts.',
    equipment: ['Central HVAC Air Handler', 'Madrid Protocol Bioreactor', 'Command Bridge', 'Seismic Sensor Vault']
  },
  {
    id: 'ro-plant',
    label: 'Prydz Bay Seawater RO Plant',
    category: 'Potable Water',
    pos: [12, 1.8, 8],
    status: 'DESALINATING',
    temp: '+4.8 °C Intake',
    power: '14 kW Demand',
    description: 'Sub-sea heated seawater intake pipeline feeding automated reverse osmosis desalination membrane trains.',
    equipment: ['High-Pressure RO Pump', 'Pre-Treatment Sand Filters', 'Heated Seawater Intake Line', 'Potable Water Buffer Tank']
  },
  {
    id: 'isro-radome',
    label: 'ISRO 7.5m Dual Radome Station',
    category: 'Satellite Earth Station',
    pos: [6, 7.2, -4],
    status: 'TRACKING (RESOURCESAT)',
    temp: '+12.0 °C Radome',
    power: 'Gigabit Downlink',
    description: 'National Remote Sensing Centre (NRSC/ISRO) tracking antenna relaying polar satellite passes directly to Shadnagar.',
    equipment: ['7.5m S/X-Band Antenna', 'Dual Tracking Pedestal', 'Cryo-Cooled LNA Receivers', 'Fibre-Optic Ground Interface']
  }
];

// Procedural Terrain Texture
function createProceduralTerrainTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 0, 512, 512);
    // Rocky gravel specks
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const gray = Math.floor(60 + Math.random() * 80);
      ctx.fillStyle = `rgb(${gray},${gray + 5},${gray + 15})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }
  return new THREE.CanvasTexture(canvas);
}

// 3D Maitri Station Detailed Procedural Model
function MaitriDetailedScene({ mode, onSelectHotspot }: { mode: string; onSelectHotspot: (h: HotspotData) => void }) {
  const isThermal = mode === 'thermal';
  const isInterior = mode === 'interior';
  const terrainTexture = useMemo(() => createProceduralTerrainTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Terrain Base (Moraine rock & snow) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={terrainTexture} roughness={0.8} />
      </mesh>

      {/* Main Accommodation Complex (Elevation Stilts on Rocky Moraine) */}
      <group position={[-1, 0, -3]}>
        {/* Foundation Stilts */}
        {[-4, -1.5, 1.5, 4].map((x) =>
          [-2.2, 2.2].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.6, z]}>
              <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
          ))
        )}

        {/* Main 2-Storey Insulated Building Block */}
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[9.5, 3.2, 5.8]} />
          <meshStandardMaterial 
            color={isThermal ? '#f59e0b' : '#f8fafc'} 
            roughness={0.3} 
            metalness={0.2}
            wireframe={isInterior}
          />
        </mesh>

        {/* Green Roof Trim */}
        <mesh position={[0, 3.85, 0]} castShadow>
          <boxGeometry args={[9.7, 0.15, 6.0]} />
          <meshStandardMaterial color="#166534" roughness={0.4} />
        </mesh>

        {/* Windows Row */}
        {[-3.5, -2, -0.5, 1, 2.5, 4].map((x, i) => (
          <mesh key={i} position={[x, 2.4, 2.92]}>
            <planeGeometry args={[0.9, 0.8]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Power Plant House (DG Sets) */}
      <group position={[-10, 0, 4]}>
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.8, 3.0, 4.0]} />
          <meshStandardMaterial 
            color={isThermal ? '#ef4444' : '#334155'} 
            roughness={0.5} 
            metalness={0.5}
            wireframe={isInterior}
          />
        </mesh>
        {/* Exhaust Stacks */}
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <mesh key={i} position={[x, 3.6, -1]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 1.4, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Fuel Storage Tank Complex */}
      <group position={[-9, 0, -9]}>
        {[-2, 0, 2].map((x, i) => (
          <mesh key={i} position={[x, 1.1, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[1.0, 1.0, 2.4, 16]} />
            <meshStandardMaterial color={isThermal ? '#06b6d4' : '#ea580c'} roughness={0.4} metalness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Communication Lattice Mast */}
      <group position={[-16, 0, -1]}>
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.25, 10, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh position={[0, 10.2, 0]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.0} />
        </mesh>
      </group>

      {/* Helipad with 'H' markings */}
      <group position={[14, 0, -5]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
          <circleGeometry args={[5.5, 32]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
        {/* Helicopter model */}
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[3.2, 1.0, 1.2]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
            <cylinderGeometry args={[2.5, 2.5, 0.04, 8]} />
            <meshStandardMaterial color="#0f172a" wireframe={true} />
          </mesh>
        </group>
      </group>

      {/* Lake Priyadarshini Submersible Pump Station Pipeline */}
      <group position={[14, 0, 12]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[2.4, 1.6, 2.4]} />
          <meshStandardMaterial color={isThermal ? '#38bdf8' : '#0284c7'} />
        </mesh>
        {/* Pipeline running towards station */}
        <mesh position={[-6, 0.1, -6]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[14, 0.15, 0.15]} />
          <meshStandardMaterial color="#475569" metalness={0.7} />
        </mesh>
      </group>

      {/* 3D Interactive Hotspot Pins */}
      {MAITRI_HOTSPOTS.map((hotspot) => (
        <Html
          key={hotspot.id}
          position={hotspot.pos}
          center
          distanceFactor={30}
          zIndexRange={[20, 0]}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectHotspot(hotspot);
            }}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-sm bg-[#102a43]/90 hover:bg-[#1f3a56] border border-cyan-400/80 text-white font-mono text-[9px] font-bold shadow-md transition transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>{hotspot.label}</span>
          </button>
        </Html>
      ))}
    </group>
  );
}

// 3D Bharati Station Detailed Procedural Model
function BharatiDetailedScene({ mode, onSelectHotspot }: { mode: string; onSelectHotspot: (h: HotspotData) => void }) {
  const isThermal = mode === 'thermal';
  const isInterior = mode === 'interior';
  const terrainTexture = useMemo(() => createProceduralTerrainTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Coastal Promontory Bedrock Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial map={terrainTexture} roughness={0.8} />
      </mesh>

      {/* Bharati Aerodynamic Monolithic Envelope (134 ISO Container Core) */}
      <group position={[0, 0, 0]}>
        {/* Heavy Steel Support Stilts */}
        {[-3.5, -1.2, 1.2, 3.5].map((x) =>
          [-2, 2].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.8, z]}>
              <cylinderGeometry args={[0.12, 0.12, 1.6, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
          ))
        )}

        {/* Aerodynamic Main Bi-Axial Body */}
        <mesh position={[0, 2.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[10.5, 2.8, 5.2]} />
          <meshStandardMaterial 
            color={isThermal ? '#f43f5e' : '#0284c7'} 
            roughness={0.2} 
            metalness={0.4}
            wireframe={isInterior}
          />
        </mesh>

        {/* Aerodynamic Curvature Caps */}
        <mesh position={[-5.3, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.4, 1.4, 0.4, 16]} />
          <meshStandardMaterial color={isThermal ? '#f43f5e' : '#0369a1'} />
        </mesh>
        <mesh position={[5.3, 2.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[1.4, 1.4, 0.4, 16]} />
          <meshStandardMaterial color={isThermal ? '#f43f5e' : '#0369a1'} />
        </mesh>

        {/* Panoramic Observation Windows Strip */}
        <mesh position={[0, 2.6, 2.62]}>
          <planeGeometry args={[9.2, 0.9]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} />
        </mesh>
      </group>

      {/* ISRO Satellite Tracking Radomes (Roof) */}
      <group position={[3.5, 4.4, -0.8]}>
        <mesh castShadow>
          <sphereGeometry args={[1.2, 24, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} />
        </mesh>
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 0.6, 16]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      </group>

      {/* MAN CHP Waste-Heat Generator Building */}
      <group position={[-8, 0, 3]}>
        <mesh position={[0, 1.4, 0]} castShadow>
          <boxGeometry args={[4.8, 2.8, 3.6]} />
          <meshStandardMaterial 
            color={isThermal ? '#ef4444' : '#1e293b'} 
            roughness={0.5} 
            wireframe={isInterior}
          />
        </mesh>
        {/* 185 kW Thermal Exhaust Heat Exchanger */}
        <mesh position={[0, 3.0, 0]}>
          <boxGeometry args={[2.0, 0.6, 1.2]} />
          <meshStandardMaterial color="#d97706" />
        </mesh>
      </group>

      {/* Prydz Bay Seawater RO Desalination Intake */}
      <group position={[12, 0, 8]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[3.2, 1.8, 2.8]} />
          <meshStandardMaterial color={isThermal ? '#06b6d4' : '#0891b2'} />
        </mesh>
      </group>

      {/* 3D Interactive Hotspot Pins */}
      {BHARATI_HOTSPOTS.map((hotspot) => (
        <Html
          key={hotspot.id}
          position={hotspot.pos}
          center
          distanceFactor={30}
          zIndexRange={[20, 0]}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectHotspot(hotspot);
            }}
            className="flex items-center space-x-1 px-2 py-0.5 rounded-sm bg-[#102a43]/90 hover:bg-[#1f3a56] border border-cyan-400/80 text-white font-mono text-[9px] font-bold shadow-md transition transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>{hotspot.label}</span>
          </button>
        </Html>
      ))}
    </group>
  );
}

export const DashboardDigitalTwinEmbed: React.FC<DashboardDigitalTwinEmbedProps> = ({
  stationId,
  mode = 'exterior',
  onNavigate
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);

  return (
    <div className="w-full h-full relative font-sans">
      
      {/* 3D Hotspot Inspection Modal Overlay */}
      {selectedHotspot && (
        <div className="absolute top-2 right-2 z-30 w-72 bg-[#102a43]/95 border border-cyan-400/60 rounded-xs p-2.5 text-white shadow-xl font-sans text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-slate-700">
            <div className="font-bold text-[11px] text-sky-200 flex items-center gap-1 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="truncate">{selectedHotspot.label}</span>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">STATUS:</span>
              <span className="text-emerald-400 font-bold">{selectedHotspot.status}</span>
            </div>

            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">OPERATING TEMP:</span>
              <span className="text-amber-300 font-bold">{selectedHotspot.temp}</span>
            </div>

            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400">POWER / LOAD:</span>
              <span className="text-cyan-300 font-bold">{selectedHotspot.power}</span>
            </div>

            <p className="text-[10px] text-slate-300 leading-tight bg-slate-900/80 p-1.5 rounded-xs border border-slate-800">
              {selectedHotspot.description}
            </p>

            <div className="pt-1">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Monitored Components:
              </div>
              <div className="space-y-0.5">
                {selectedHotspot.equipment.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-1.5 text-[9px] text-slate-300 font-mono">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [18, 16, 26], fov: 42 }}
        style={{ width: '100%', height: '100%', background: '#070f1e' }}
      >
        <ambientLight intensity={0.9} color="#cbd5e1" />
        <directionalLight
          position={[30, 25, 30]}
          intensity={2.0}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-20, 15, -20]} intensity={0.5} color="#93c5fd" />

        {stationId === 'maitri' ? (
          <MaitriDetailedScene mode={mode} onSelectHotspot={setSelectedHotspot} />
        ) : (
          <BharatiDetailedScene mode={mode} onSelectHotspot={setSelectedHotspot} />
        )}

        <OrbitControls
          maxPolarAngle={Math.PI / 2.05}
          minDistance={8}
          maxDistance={50}
          target={[0, 1.2, 0]}
        />
      </Canvas>
    </div>
  );
};
