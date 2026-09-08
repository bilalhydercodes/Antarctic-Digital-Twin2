import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSimulation } from '../../context/SimulationContext';
import { EquipmentItem } from '../../types';
import { Flame } from 'lucide-react';
import { 
  getAssetInspectionData, 
  AssetInspectionData, 
  InternalComponent, 
  SensorDefinition 
} from '../../services/AssetInternalCatalog';
import { AssetCutaway3D } from './AssetCutaway3D';
import { SensorMarkers3D } from './SensorMarkers3D';
import { AssetInspectionPanel } from './AssetInspectionPanel';
import { Drone3D } from './Drone3D';

// ─── Static mesh helpers ───────────────────────────────────────────────────────
const StaticBox: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
}> = ({ position, size, color, roughness = 0.7, metalness = 0.1 }) => (
  <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  </mesh>
);

const StaticCylinder: React.FC<{
  position: [number, number, number];
  args: [number, number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
}> = ({ position, args, color, roughness = 0.5, metalness = 0.4 }) => (
  <mesh position={position} castShadow>
    <cylinderGeometry args={args} />
    <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
  </mesh>
);

// ─── Snow Particles ──────────────────────────────────────────────────────────
const SnowParticles: React.FC<{ windSpeed: number; active: boolean }> = ({ windSpeed, active }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = Math.min(Math.floor(windSpeed * 35), 3000);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 80;
      arr[i * 3 + 1] = Math.random() * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !active) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const drift = (windSpeed / 80) * 12 * delta;
    for (let i = 0; i < count; i++) {
      pos.setY(i, pos.getY(i) - (2 + windSpeed * 0.04) * delta);
      pos.setX(i, pos.getX(i) + drift);
      if (pos.getY(i) < -1) pos.setY(i, 30);
      if (pos.getX(i) > 40) pos.setX(i, -40);
    }
    pos.needsUpdate = true;
  });

  if (!active) return null;
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ddeeff" transparent opacity={0.75} sizeAttenuation />
    </points>
  );
};

// ─── Power Flow Line ──────────────────────────────────────────────────────────
const PowerFlowLine: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  color: string;
  active: boolean;
}> = ({ from, to, color, active }) => {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.emissiveIntensity = active
        ? 0.4 + Math.sin(state.clock.getElapsedTime() * 3) * 0.3
        : 0.05;
    }
  });
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 12, 0.06, 6, false);
  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial
        ref={matRef}
        color={active ? color : '#374151'}
        emissive={active ? color : '#000'}
        emissiveIntensity={0.4}
        roughness={0.3}
        metalness={0.8}
        transparent
        opacity={active ? 0.9 : 0.3}
      />
    </mesh>
  );
};

// ─── Exhaust Smoke ──────────────────────────────────────────────────────────
const ExhaustSmoke: React.FC<{ position: [number, number, number]; loadPercent: number; isThermalIR: boolean }> = ({ position, loadPercent, isThermalIR }) => {
  const pRef = useRef<THREE.Points>(null);
  const count = Math.max(4, Math.floor(loadPercent / 10));
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i*3] = (Math.random()-0.5)*0.3; a[i*3+1] = Math.random()*2; a[i*3+2] = (Math.random()-0.5)*0.3;
    }
    return a;
  }, [count]);
  useFrame((_, delta) => {
    if (!pRef.current) return;
    const p = pRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      p.setY(i, p.getY(i) + delta * (0.5 + Math.random() * 0.5));
      if (p.getY(i) > 2.5) p.setY(i, 0);
    }
    p.needsUpdate = true;
  });
  return (
    <points ref={pRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={isThermalIR ? 0.25 : 0.18} color={isThermalIR ? '#ff6600' : '#9ca3af'} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

// ─── Fuel Level Mesh ──────────────────────────────────────────────────────────
const FuelLevelMesh: React.FC<{ position: [number, number, number]; fuelPercent: number; radius: number }> = ({ position, fuelPercent, radius }) => {
  const fillH = (radius * 2.5) * (fuelPercent / 100);
  const color = fuelPercent < 20 ? '#ef4444' : fuelPercent < 40 ? '#f59e0b' : '#22c55e';
  return (
    <mesh position={[position[0], position[1] - radius * 1.25 + fillH / 2, position[2]]} rotation={[Math.PI/2,0,0]}>
      <cylinderGeometry args={[radius * 0.85, radius * 0.85, fillH, 16]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.3} transparent opacity={0.75}
        emissive={fuelPercent < 20 ? '#ef4444' : '#000'} emissiveIntensity={fuelPercent < 20 ? 0.4 : 0} />
    </mesh>
  );
};

// ─── Fire Effect (scenario) ───────────────────────────────────────────────────
const FireEffect: React.FC<{ position: [number, number, number]; active: boolean }> = ({ position, active }) => {
  const pRef = useRef<THREE.Points>(null);
  const count = 60;
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { a[i*3]=(Math.random()-0.5)*1.2; a[i*3+1]=Math.random()*3; a[i*3+2]=(Math.random()-0.5)*1.2; }
    return a;
  }, []);
  useFrame((state, delta) => {
    if (!pRef.current || !active) return;
    const p = pRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      p.setY(i, p.getY(i) + delta * (1.5 + Math.random()));
      p.setX(i, p.getX(i) + (Math.random()-0.5)*0.05);
      if (p.getY(i) > 4) p.setY(i, 0);
    }
    p.needsUpdate = true;
  });
  if (!active) return null;
  return (
    <group position={position}>
      <points ref={pRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" count={count} array={pos} itemSize={3} /></bufferGeometry>
        <pointsMaterial size={0.3} color="#ff6600" transparent opacity={0.85} sizeAttenuation />
      </points>
      <pointLight color="#ff4400" intensity={3} distance={8} />
    </group>
  );
};

// ─── Camera Controller ────────────────────────────────────────────────────────
interface CameraPreset { position: [number,number,number]; target: [number,number,number]; }
const CameraController: React.FC<{ preset: CameraPreset | null; controlsRef: React.RefObject<any>; onDone: () => void }> = ({ preset, controlsRef, onDone }) => {
  const { camera } = useThree();
  const startCamPos = useRef(new THREE.Vector3());
  const startTargetPos = useRef(new THREE.Vector3());
  const endCamPos = useRef(new THREE.Vector3());
  const endTargetPos = useRef(new THREE.Vector3());
  const progress = useRef(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!preset) return;

    startCamPos.current.copy(camera.position);
    if (controlsRef.current) {
      startTargetPos.current.copy(controlsRef.current.target);
      controlsRef.current.enabled = false;
    } else {
      startTargetPos.current.set(0, 0, 0);
    }

    endCamPos.current.set(...preset.position);
    endTargetPos.current.set(...preset.target);

    progress.current = 0;
    isAnimating.current = true;
  }, [preset]);

  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    progress.current += delta * 2.2;

    if (progress.current >= 1.0) {
      progress.current = 1.0;
      camera.position.copy(endCamPos.current);
      if (controlsRef.current) {
        controlsRef.current.target.copy(endTargetPos.current);
        controlsRef.current.update();
        controlsRef.current.enabled = true;
      }
      isAnimating.current = false;
      onDone();
      return;
    }

    const t = progress.current;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.lerpVectors(startCamPos.current, endCamPos.current, ease);

    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startTargetPos.current, endTargetPos.current, ease);
      controlsRef.current.update();
    }
  });

  return null;
};

// ─── Interactive 3D Building ───────────────────────────────────────────────────
interface Interactive3DBuildingProps {
  assetId: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  status?: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  label: string;
  isThermalIR: boolean;
  isSelected?: boolean;
  isCutawayMode?: boolean;
  showSensors?: boolean;
  inspectionData?: AssetInspectionData | null;
  selectedComponentId?: string | null;
  onSelectComponent?: (comp: InternalComponent) => void;
  selectedSensorId?: string | null;
  onSelectSensor?: (sensor: SensorDefinition) => void;
  onClick: () => void;
  roofColor?: string;
  hasRoof?: boolean;
}

const Interactive3DBuilding: React.FC<Interactive3DBuildingProps> = ({
  assetId, position, size, color, status = 'HEALTHY', label, isThermalIR, isSelected = false,
  isCutawayMode = false, showSensors = false, inspectionData = null, selectedComponentId = null,
  onSelectComponent, selectedSensorId = null, onSelectSensor, onClick, roofColor, hasRoof = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const getNormalColor = () => {
    switch (status) {
      case 'WARNING': return '#f59e0b';
      case 'CRITICAL': return '#ef4444';
      case 'OFFLINE': return '#78716c';
      default: return color;
    }
  };

  const getThermalColor = () => {
    switch (status) {
      case 'CRITICAL': return '#ff0000';
      case 'WARNING': return '#ff7700';
      default: return '#0077ff';
    }
  };

  useFrame((state) => {
    if (meshRef.current && status === 'CRITICAL') {
      meshRef.current.scale.y = size[1] + Math.sin(state.clock.getElapsedTime() * 5) * 0.05;
    }
  });

  const displayColor = isThermalIR ? getThermalColor() : getNormalColor();
  const emissiveColor = isThermalIR
    ? (status === 'CRITICAL' ? '#ff0000' : '#0055ff')
    : (isSelected ? '#0284c7' : hovered ? '#0369a1' : status === 'CRITICAL' ? '#ef4444' : '#000000');

  const isCutaway = isSelected && isCutawayMode;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={displayColor}
          roughness={isCutaway ? 0.1 : 0.35}
          metalness={isCutaway ? 0.9 : 0.55}
          emissive={emissiveColor}
          emissiveIntensity={isThermalIR ? 0.6 : (isSelected ? 0.4 : hovered ? 0.25 : status === 'CRITICAL' ? 0.4 : 0)}
          transparent={isCutaway}
          opacity={isCutaway ? 0.15 : 1.0}
        />
      </mesh>

      {hasRoof && !isCutaway && (
        <mesh position={[0, size[1] / 2 + size[1] * 0.15, 0]} castShadow>
          <coneGeometry args={[Math.max(size[0], size[2]) * 0.72, size[1] * 0.3, 4]} />
          <meshStandardMaterial color={roofColor || '#475569'} roughness={0.7} />
        </mesh>
      )}

      {isCutaway && inspectionData && onSelectComponent && (
        <AssetCutaway3D
          components={inspectionData.components}
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
          isThermalIR={isThermalIR}
        />
      )}

      {isSelected && showSensors && inspectionData && onSelectSensor && (
        <SensorMarkers3D
          sensors={inspectionData.components.flatMap(c => c.sensors)}
          selectedSensorId={selectedSensorId}
          onSelectSensor={onSelectSensor}
          visible={true}
        />
      )}

      <Html position={[0, size[1] / 2 + 0.7, 0]} center distanceFactor={22} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{ pointerEvents: 'auto' }}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-sans font-bold shadow-md whitespace-nowrap transition-all ${
            isSelected ? 'scale-110 ring-2 ring-blue-400 font-black' : hovered ? 'scale-105' : ''
          } ${
            isThermalIR ? 'bg-stone-900 text-orange-400 border border-orange-500'
            : isSelected ? 'bg-blue-600 text-white shadow-blue-500/50'
            : status === 'CRITICAL' ? 'bg-rose-600 text-white'
            : status === 'WARNING' ? 'bg-amber-500 text-white'
            : status === 'OFFLINE' ? 'bg-stone-600 text-white'
            : 'bg-white/90 text-stone-900 border border-stone-200'
          }`}
        >
          {isThermalIR ? `🔥 ${label}` : label}
        </button>
      </Html>
    </group>
  );
};

// ─── Wind Turbine ─────────────────────────────────────────────────────────────
const WindTurbine3D: React.FC<{
  position: [number, number, number];
  speed: number;
  scale?: number;
  isSelected?: boolean;
  isCutawayMode?: boolean;
  showSensors?: boolean;
  inspectionData?: AssetInspectionData | null;
  onSelectComponent?: (comp: InternalComponent) => void;
  onSelectSensor?: (sensor: SensorDefinition) => void;
  onClick: () => void;
}> = ({ position, speed, scale = 1, isSelected = false, isCutawayMode = false, showSensors = false, inspectionData = null, onSelectComponent, onSelectSensor, onClick }) => {
  const bladesRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (bladesRef.current) bladesRef.current.rotation.z += delta * (speed / 12);
  });

  const h = 5 * scale;
  const isCutaway = isSelected && isCutawayMode;

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh position={[0, h / 2, 0]} castShadow>
        <cylinderGeometry args={[0.1 * scale, 0.22 * scale, h, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, h, 0]} castShadow>
        <boxGeometry args={[0.6 * scale, 0.35 * scale, 0.35 * scale]} />
        <meshStandardMaterial
          color={isSelected ? '#0284c7' : hovered ? '#38bdf8' : '#64748b'}
          metalness={0.6}
          roughness={isCutaway ? 0.1 : 0.4}
          transparent={isCutaway}
          opacity={isCutaway ? 0.2 : 1.0}
        />
      </mesh>
      {isCutaway && inspectionData && onSelectComponent && (
        <group position={[0, h, 0]} scale={scale * 0.4}>
          <AssetCutaway3D
            components={inspectionData.components}
            selectedComponentId={null}
            onSelectComponent={onSelectComponent}
          />
        </group>
      )}
      {isSelected && showSensors && inspectionData && onSelectSensor && (
        <group position={[0, h, 0]} scale={scale * 0.4}>
          <SensorMarkers3D
            sensors={inspectionData.components.flatMap(c => c.sensors)}
            selectedSensorId={null}
            onSelectSensor={onSelectSensor}
          />
        </group>
      )}
      <group ref={bladesRef} position={[0.3 * scale, h, 0]}>
        {[0, 120, 240].map((deg, i) => (
          <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]} position={[0, 1.0 * scale, 0]}>
            <boxGeometry args={[0.07 * scale, 2.0 * scale, 0.035 * scale]} />
            <meshStandardMaterial color="#f0f4ff" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// ─── Comms Tower ─────────────────────────────────────────────────────────────
const CommsTower: React.FC<{
  position: [number, number, number];
  height?: number;
  isSelected?: boolean;
  isCutawayMode?: boolean;
  showSensors?: boolean;
  inspectionData?: AssetInspectionData | null;
  onSelectComponent?: (comp: InternalComponent) => void;
  onSelectSensor?: (sensor: SensorDefinition) => void;
  onClick: () => void;
}> = ({ position, height = 7, isSelected = false, isCutawayMode = false, showSensors = false, inspectionData = null, onSelectComponent, onSelectSensor, onClick }) => (
  <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
    {[[-0.3, -0.3], [0.3, -0.3], [0.3, 0.3], [-0.3, 0.3]].map(([x, z], i) => (
      <mesh key={i} position={[x * 0.5, height / 2, z * 0.5]} castShadow>
        <cylinderGeometry args={[0.04, 0.07, height, 6]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
      </mesh>
    ))}
    {[1.5, 3, 4.5, 6].map((y, i) => (
      <mesh key={i} position={[0, y, 0]} rotation={[0, (i % 2) * Math.PI / 4, 0]}>
        <boxGeometry args={[0.7, 0.04, 0.04]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} />
      </mesh>
    ))}
    <mesh position={[0, height + 0.5, 0]} rotation={[-0.4, 0, 0]}>
      <cylinderGeometry args={[0.7, 0.7, 0.06, 20, 1, true]} />
      <meshStandardMaterial color={isSelected ? '#38bdf8' : '#e2e8f0'} side={THREE.DoubleSide} metalness={0.5} />
    </mesh>
    <mesh position={[0, height + 1, 0]}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
    </mesh>
    {isSelected && showSensors && inspectionData && onSelectSensor && (
      <group position={[0, height * 0.5, 0]}>
        <SensorMarkers3D
          sensors={inspectionData.components.flatMap(c => c.sensors)}
          selectedSensorId={null}
          onSelectSensor={onSelectSensor}
        />
      </group>
    )}
  </group>
);

// ─── Weather Station ──────────────────────────────────────────────────────────
const WeatherStation: React.FC<{ position: [number, number, number]; onClick?: () => void }> = ({ position, onClick }) => {
  const vaneRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (vaneRef.current) vaneRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 2;
  });
  return (
    <group position={position} onClick={onClick}>
      <StaticCylinder position={[0, 1.5, 0]} args={[0.05, 0.05, 3, 8]} color="#94a3b8" metalness={0.8} />
      <group position={[0, 3.1, 0]}>
        {[0, 120, 240].map((deg, i) => (
          <group key={i} rotation={[0, (deg * Math.PI) / 180, 0]}>
            <mesh position={[0.35, 0, 0]}><sphereGeometry args={[0.12, 8, 8]} /><meshStandardMaterial color="#cbd5e1" metalness={0.6} /></mesh>
            <mesh position={[0.175, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.35, 6]} /><meshStandardMaterial color="#94a3b8" /></mesh>
          </group>
        ))}
      </group>
      <group ref={vaneRef} position={[0, 2.7, 0]}>
        <mesh position={[0.2, 0, 0]}><boxGeometry args={[0.4, 0.02, 0.15]} /><meshStandardMaterial color="#f8fafc" /></mesh>
        <mesh position={[-0.1, 0, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[0.08, 0.2, 3]} /><meshStandardMaterial color="#ef4444" /></mesh>
      </group>
      <StaticBox position={[0, 0.35, 0.3]} size={[0.4, 0.3, 0.15]} color="#e2e8f0" roughness={0.4} />
    </group>
  );
};

// ─── Fuel Tank ────────────────────────────────────────────────────────────────
const FuelTank: React.FC<{
  position: [number, number, number];
  radius?: number;
  color?: string;
  isSelected?: boolean;
  isCutawayMode?: boolean;
  showSensors?: boolean;
  inspectionData?: AssetInspectionData | null;
  onSelectComponent?: (comp: InternalComponent) => void;
  onSelectSensor?: (sensor: SensorDefinition) => void;
  onClick: () => void;
}> = ({ position, radius = 0.7, color = '#d97706', isSelected = false, isCutawayMode = false, showSensors = false, inspectionData = null, onSelectComponent, onSelectSensor, onClick }) => {
  const isCutaway = isSelected && isCutawayMode;

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, radius * 2.5, 20]} />
        <meshStandardMaterial
          color={isSelected ? '#f59e0b' : color}
          roughness={isCutaway ? 0.1 : 0.4}
          metalness={0.5}
          transparent={isCutaway}
          opacity={isCutaway ? 0.2 : 1.0}
        />
      </mesh>
      {[-0.5, 0.5].map((dx, i) => (
        <mesh key={i} position={[dx * radius * 1.5, -radius * 0.9, 0]}>
          <boxGeometry args={[0.08, radius * 0.4, 0.08]} />
          <meshStandardMaterial color="#78716c" metalness={0.7} />
        </mesh>
      ))}

      {isSelected && showSensors && inspectionData && onSelectSensor && (
        <group position={[0, 0, 0]}>
          <SensorMarkers3D
            sensors={inspectionData.components.flatMap(c => c.sensors)}
            selectedSensorId={null}
            onSelectSensor={onSelectSensor}
          />
        </group>
      )}
    </group>
  );
};

// ─── Snow Vehicle ─────────────────────────────────────────────────────────────
const SnowVehicle: React.FC<{ position: [number, number, number]; rotation?: number; color?: string }> = ({ position, rotation = 0, color = '#f59e0b' }) => (
  <group position={position} rotation={[0, rotation, 0]}>
    <mesh position={[0, 0.4, 0]} castShadow><boxGeometry args={[2.2, 0.6, 1.0]} /><meshStandardMaterial color={color} roughness={0.5} metalness={0.4} /></mesh>
    <mesh position={[0.5, 0.85, 0]} castShadow><boxGeometry args={[0.9, 0.5, 0.85]} /><meshStandardMaterial color={color} roughness={0.4} /></mesh>
    <mesh position={[0.5, 0.85, 0]}><boxGeometry args={[0.92, 0.48, 0.83]} /><meshStandardMaterial color="#93c5fd" roughness={0.1} metalness={0.8} opacity={0.6} transparent /></mesh>
    {[-0.45, 0.45].map((z, i) => (
      <mesh key={i} position={[0, 0.15, z]}><boxGeometry args={[2.4, 0.22, 0.28]} /><meshStandardMaterial color="#292524" roughness={0.9} metalness={0.2} /></mesh>
    ))}
    <mesh position={[-1.25, 0.35, 0]}><boxGeometry args={[0.12, 0.6, 1.2]} /><meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} /></mesh>
  </group>
);

// ─── Rocky Boulder & Ice ──────────────────────────────────────────────────────
const RockyBoulder: React.FC<{ position: [number, number, number]; size?: number }> = ({ position, size = 1 }) => {
  const rng = Math.sin(position[0] * 13.7 + position[2] * 7.3);
  return (
    <mesh position={position} rotation={[rng * 0.5, rng * 2, rng * 0.3]} castShadow receiveShadow>
      <dodecahedronGeometry args={[size * 0.6, 0]} />
      <meshStandardMaterial color={`hsl(${25 + rng * 10}, ${15 + Math.abs(rng) * 8}%, ${45 + Math.abs(rng) * 10}%)`} roughness={0.95} metalness={0.05} />
    </mesh>
  );
};

const IceChunk: React.FC<{ position: [number, number, number]; size?: [number, number, number] }> = ({ position, size = [2, 0.8, 1.5] }) => (
  <mesh position={position} castShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color="#cce8f4" roughness={0.2} metalness={0.1} opacity={0.85} transparent />
  </mesh>
);

// ─── Battery Bank ─────────────────────────────────────────────────────────────
const BatteryBank: React.FC<{
  position: [number, number, number];
  isThermalIR: boolean;
  status?: string;
  isSelected?: boolean;
  isCutawayMode?: boolean;
  showSensors?: boolean;
  inspectionData?: AssetInspectionData | null;
  onSelectComponent?: (comp: InternalComponent) => void;
  onSelectSensor?: (sensor: SensorDefinition) => void;
  onClick: () => void;
}> = ({ position, isThermalIR, status = 'HEALTHY', isSelected = false, isCutawayMode = false, showSensors = false, inspectionData = null, onSelectComponent, onSelectSensor, onClick }) => {
  const isCutaway = isSelected && isCutawayMode;

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[i * 1.1 - 1.1, 0.5, 0]} castShadow>
          <boxGeometry args={[0.9, 1.0, 0.6]} />
          <meshStandardMaterial
            color={isThermalIR ? '#0055ff' : isSelected ? '#38bdf8' : '#10b981'}
            roughness={isCutaway ? 0.1 : 0.3}
            metalness={0.7}
            emissive={isSelected ? '#0284c7' : status === 'CRITICAL' ? '#ef4444' : '#064e3b'}
            emissiveIntensity={0.3}
            transparent={isCutaway}
            opacity={isCutaway ? 0.2 : 1.0}
          />
        </mesh>
      ))}

      {isCutaway && inspectionData && onSelectComponent && (
        <group position={[0, 0.5, 0]}>
          <AssetCutaway3D
            components={inspectionData.components}
            selectedComponentId={null}
            onSelectComponent={onSelectComponent}
            isThermalIR={isThermalIR}
          />
        </group>
      )}

      {isSelected && showSensors && inspectionData && onSelectSensor && (
        <group position={[0, 0.5, 0]}>
          <SensorMarkers3D
            sensors={inspectionData.components.flatMap(c => c.sensors)}
            selectedSensorId={null}
            onSelectSensor={onSelectSensor}
          />
        </group>
      )}

      <Html position={[0, 1.4, 0]} center distanceFactor={22} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <button onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ pointerEvents: 'auto' }} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow whitespace-nowrap transition ${isSelected ? 'scale-110 bg-emerald-500 text-stone-950 font-black' : 'bg-emerald-700 text-white'}`}>
          🔋 BATTERY BANK
        </button>
      </Html>
    </group>
  );
};

// ─── Water Tank ───────────────────────────────────────────────────────────────
const WaterTank: React.FC<{
  position: [number, number, number];
  label?: string;
  isSelected?: boolean;
  isCutawayMode?: boolean;
  showSensors?: boolean;
  inspectionData?: AssetInspectionData | null;
  onSelectComponent?: (comp: InternalComponent) => void;
  onSelectSensor?: (sensor: SensorDefinition) => void;
  onClick: () => void;
}> = ({ position, label = 'WATER SYSTEM', isSelected = false, isCutawayMode = false, showSensors = false, inspectionData = null, onSelectComponent, onSelectSensor, onClick }) => {
  const isCutaway = isSelected && isCutawayMode;

  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.9, 0.9, 2.0, 20]} />
        <meshStandardMaterial
          color={isSelected ? '#38bdf8' : '#0369a1'}
          metalness={0.6}
          roughness={isCutaway ? 0.1 : 0.4}
          transparent={isCutaway}
          opacity={isCutaway ? 0.2 : 1.0}
        />
      </mesh>
      <StaticCylinder position={[0, 2.05, 0]} args={[0.92, 0.92, 0.1, 20]} color="#0284c7" metalness={0.7} />

      {isCutaway && inspectionData && onSelectComponent && (
        <group position={[0, 1.0, 0]}>
          <AssetCutaway3D
            components={inspectionData.components}
            selectedComponentId={null}
            onSelectComponent={onSelectComponent}
          />
        </group>
      )}

      {isSelected && showSensors && inspectionData && onSelectSensor && (
        <group position={[0, 1.0, 0]}>
          <SensorMarkers3D
            sensors={inspectionData.components.flatMap(c => c.sensors)}
            selectedSensorId={null}
            onSelectSensor={onSelectSensor}
          />
        </group>
      )}

      <Html position={[0, 2.5, 0]} center distanceFactor={22} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <button onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ pointerEvents: 'auto' }} className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow whitespace-nowrap transition ${isSelected ? 'scale-110 bg-blue-500 text-stone-950 font-black' : 'bg-blue-700 text-white'}`}>
          💧 {label}
        </button>
      </Html>
    </group>
  );
};

// ─── Generator Unit ───────────────────────────────────────────────────────────
const GeneratorUnit: React.FC<{
  assetId: string;
  position: [number, number, number];
  label: string;
  status: string;
  isThermalIR: boolean;
  isSelected?: boolean;
  isCutawayMode?: boolean;
  showSensors?: boolean;
  inspectionData?: AssetInspectionData | null;
  selectedComponentId?: string | null;
  onSelectComponent?: (comp: InternalComponent) => void;
  selectedSensorId?: string | null;
  onSelectSensor?: (sensor: SensorDefinition) => void;
  onClick: () => void;
}> = ({
  position, label, status, isThermalIR, isSelected = false, isCutawayMode = false,
  showSensors = false, inspectionData = null, selectedComponentId = null, onSelectComponent,
  selectedSensorId = null, onSelectSensor, onClick
}) => {
  const isCutaway = isSelected && isCutawayMode;
  const color = isThermalIR
    ? (status === 'CRITICAL' ? '#ff0000' : '#0077ff')
    : (isSelected ? '#0284c7' : status === 'CRITICAL' ? '#ef4444' : status === 'WARNING' ? '#f59e0b' : '#374151');

  return (
    <group position={position}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[2.2, 1.0, 1.1]} />
        <meshStandardMaterial
          color={color}
          roughness={isCutaway ? 0.1 : 0.4}
          metalness={isCutaway ? 0.9 : 0.6}
          emissive={isSelected ? '#38bdf8' : status === 'CRITICAL' ? '#ef4444' : '#000'}
          emissiveIntensity={isSelected ? 0.35 : status === 'CRITICAL' ? 0.4 : 0}
          transparent={isCutaway}
          opacity={isCutaway ? 0.15 : 1.0}
        />
      </mesh>

      {!isCutaway && (
        <>
          <mesh position={[0.8, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.7, 8]} />
            <meshStandardMaterial color="#292524" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.56]}>
            <boxGeometry args={[1.8, 0.7, 0.04]} />
            <meshStandardMaterial color="#1c1917" roughness={0.8} />
          </mesh>
        </>
      )}

      {isCutaway && inspectionData && onSelectComponent && (
        <group position={[0, 0, 0]}>
          <AssetCutaway3D
            components={inspectionData.components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={onSelectComponent}
            isThermalIR={isThermalIR}
          />
        </group>
      )}

      {isSelected && showSensors && inspectionData && onSelectSensor && (
        <group position={[0, 0, 0]}>
          <SensorMarkers3D
            sensors={inspectionData.components.flatMap(c => c.sensors)}
            selectedSensorId={selectedSensorId}
            onSelectSensor={onSelectSensor}
            visible={true}
          />
        </group>
      )}

      <Html position={[0, 1.0, 0]} center distanceFactor={22} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <button
          onClick={(e) => { e.stopPropagation(); onClick(); }}
          style={{ pointerEvents: 'auto' }}
          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow whitespace-nowrap transition-transform ${
            isSelected ? 'scale-110 ring-2 ring-blue-400 font-black' : ''
          } ${
            isThermalIR ? 'bg-stone-900 text-orange-400 border border-orange-500'
            : isSelected ? 'bg-blue-600 text-white shadow-blue-500/50'
            : status === 'CRITICAL' ? 'bg-rose-600 text-white'
            : status === 'WARNING' ? 'bg-amber-500 text-white'
            : 'bg-stone-800 text-amber-300 border border-stone-600'
          }`}
        >
          ⚡ {label}
        </button>
      </Html>
    </group>
  );
};

// ─── MAITRI STATION 3D COMPONENT ──────────────────────────────────────────────
export const Maitri3DCanvas: React.FC = () => {
  const { 
    environment, 
    energy, 
    equipment, 
    simulationState,
    alerts,
    acknowledgeAlert,
    resolveAlert,
    triggerScenario
  } = useSimulation();

  const [isThermalIR, setIsThermalIR] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [droneActive, setDroneActive] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>(null);
  const controlsRef = useRef<any>(null);

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAssetPos, setSelectedAssetPos] = useState<[number, number, number] | null>(null);
  const [isCutawayMode, setIsCutawayMode] = useState(false);
  const [showSensors, setShowSensors] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<InternalComponent | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorDefinition | null>(null);

  const windSpeed = environment?.windSpeed || 28;
  const fuelPercent = energy?.fuelStorage?.fuelPercent ?? 60;
  const scenario = simulationState.activeScenario;

  const isBlizzard = scenario === 'blizzard' || scenario === 'multi_system_failure';
  const isFire = scenario === 'generator_failure' || scenario === 'multi_system_failure';
  const isBlackout = scenario === 'battery_low' || scenario === 'multi_system_failure';
  const snowActive = windSpeed > 25 || isBlizzard;

  const inspectionData: AssetInspectionData | null = useMemo(() => {
    if (!selectedAssetId) return null;
    return getAssetInspectionData(selectedAssetId, 'maitri', energy, environment, equipment, scenario);
  }, [selectedAssetId, energy, environment, equipment, scenario]);

  const handleSelectAsset = (assetId: string, position: [number, number, number]) => {
    setSelectedAssetId(assetId);
    setSelectedAssetPos(position);
    setSelectedComponent(null);
    setSelectedSensor(null);

    setCameraPreset({
      position: [position[0] + 6.0, position[1] + 10.0, position[2] + 10.0],
      target: position
    });
  };

  const handleSelectComponent = (comp: InternalComponent | null) => {
    setSelectedComponent(comp);
    if (comp && selectedAssetPos) {
      setCameraPreset({
        position: [
          selectedAssetPos[0] + comp.relativePosition[0] + 3.5,
          selectedAssetPos[1] + comp.relativePosition[1] + 5.0,
          selectedAssetPos[2] + comp.relativePosition[2] + 5.0
        ],
        target: [
          selectedAssetPos[0] + comp.relativePosition[0],
          selectedAssetPos[1] + comp.relativePosition[1],
          selectedAssetPos[2] + comp.relativePosition[2]
        ]
      });
    }
  };

  const handleFocusCurrentAsset = () => {
    if (selectedAssetPos) {
      setCameraPreset({
        position: [selectedAssetPos[0] + 6.0, selectedAssetPos[1] + 10.0, selectedAssetPos[2] + 10.0],
        target: selectedAssetPos
      });
    }
  };

  const handleResetCamera = () => {
    setSelectedAssetId(null);
    setSelectedAssetPos(null);
    setIsCutawayMode(false);
    setShowSensors(false);
    setSelectedComponent(null);
    setSelectedSensor(null);
    setCameraPreset({ position: [0, 22, 32], target: [0, 0, 0] });
  };

  const handleExecuteFailover = () => {
    triggerScenario('normal');
  };

  const presets: Record<string, CameraPreset> = {
    birdsEye:  { position: [0, 52, 10],  target: [0, 0, 0] },
    station:   { position: [0, 22, 32],  target: [0, 1.25, 0] },
    helipad:   { position: [0, 22, -34], target: [0, 0.5, -14] },
    genBay:    { position: [-22, 18, 0], target: [-9, 1, 0] },
  };

  const getEq = (id: string) => equipment.find(e => e.id.includes(id));
  const gen1 = getEq('gen-m1');
  const gen2 = getEq('gen-m2');
  const gen3 = getEq('gen-m3') || getEq('eq-m3');
  const gen4 = getEq('gen-m4') || getEq('eq-m4');

  const bgColor = isThermalIR ? '#090d16' : isBlackout ? '#0a0a0f' : '#dbeafe';
  const canvasBg = isThermalIR ? '#090d16' : isBlackout ? '#05050a' : '#c7dff7';
  const powerActive = !isBlackout;

  return (
    <div className="relative w-full h-full overflow-hidden font-sans select-none" style={{ background: bgColor }}>
      {/* ── LEFT HUD PANEL ── */}
      <div className="absolute top-4 left-4 z-10 flex flex-col items-start space-y-2">
        <button
          onClick={() => setIsThermalIR(!isThermalIR)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5 ${
            isThermalIR ? 'bg-rose-600 text-white animate-pulse' : 'bg-white text-stone-800 border border-[#e5e3dc] hover:bg-stone-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>{isThermalIR ? '🛸 DRONE IR ACTIVE' : '🛸 DRONE IR VIEW'}</span>
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-1.5 ${
            autoRotate ? 'bg-indigo-600 text-white' : 'bg-white text-stone-800 border border-[#e5e3dc] hover:bg-stone-50'
          }`}
        >
          <span style={{ display:'inline-block', animation: autoRotate ? 'spin 2s linear infinite' : 'none' }}>🔄</span>
          <span>{autoRotate ? '360° ROTATING' : '360° AUTO-ROTATE'}</span>
        </button>

        <div className="flex flex-col space-y-1 mt-1">
          <div className="text-[9px] font-bold text-stone-400 uppercase px-1">Camera Views</div>
          {[
            { key: 'birdsEye', label: "Bird's Eye", icon: '🦅' },
            { key: 'station',  label: 'Main Station', icon: '🏢' },
            { key: 'helipad',  label: 'Helipad', icon: '🛬' },
            { key: 'genBay',   label: 'Generator Bay', icon: '⚡' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => {
                setSelectedAssetId(null);
                setSelectedAssetPos(null);
                const p = presets[key];
                setCameraPreset({ position: [...p.position], target: [...p.target] });
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/90 text-stone-700 border border-stone-200 hover:bg-stone-100 shadow-sm transition flex items-center space-x-1.5"
            >
              <span>{icon}</span><span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TOP RIGHT: Scenario Alert & Fuel Indicator ── */}
      <div className={`absolute top-4 ${selectedAssetId ? 'right-[26rem]' : 'right-4'} z-10 flex flex-col items-end space-y-2 transition-all duration-300`}>
        {scenario !== 'normal' && (
          <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-700 text-white shadow-lg border border-rose-500 animate-pulse">
            ⚠️ {simulationState.scenarioTitle}
          </div>
        )}
        <div className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm border ${
          fuelPercent < 20 ? 'bg-rose-900 text-rose-100 border-rose-700'
          : fuelPercent < 40 ? 'bg-amber-900 text-amber-100 border-amber-700'
          : 'bg-stone-800 text-stone-200 border-stone-600'
        }`}>
          ⛽ {fuelPercent.toFixed(0)}% Fuel · {energy?.fuelStorage?.estimatedDaysRemaining ?? '--'} days
        </div>
      </div>

      {/* ── INSPECTION PANEL ── */}
      {selectedAssetId && inspectionData && (
        <AssetInspectionPanel
          data={inspectionData}
          isCutawayMode={isCutawayMode}
          onToggleCutaway={() => setIsCutawayMode(!isCutawayMode)}
          showSensors={showSensors}
          onToggleSensors={() => setShowSensors(!showSensors)}
          selectedComponent={selectedComponent}
          onSelectComponent={handleSelectComponent}
          selectedSensor={selectedSensor}
          onSelectSensor={setSelectedSensor}
          onFocusCamera={handleFocusCurrentAsset}
          onResetCamera={handleResetCamera}
          onClose={() => { setSelectedAssetId(null); setIsCutawayMode(false); }}
          onExecuteFailover={handleExecuteFailover}
          alerts={alerts}
          onAcknowledgeAlert={acknowledgeAlert}
          onResolveAlert={resolveAlert}
        />
      )}

      {/* ── 3D CANVAS ── */}
      <Canvas shadows camera={{ position: [0, 22, 32], fov: 45 }}>
        <color attach="background" args={[canvasBg]} />
        {isBlizzard && <fog attach="fog" args={['#b0c8e0', 15, 60]} />}

        <ambientLight intensity={isBlackout ? 0.05 : isThermalIR ? 0.25 : 0.85} />
        <directionalLight
          position={[20, 30, 25]}
          intensity={isBlackout ? 0.1 : isThermalIR ? 0.4 : 1.3}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-15, 10, -15]} intensity={isThermalIR || isBlackout ? 0 : 0.3} color="#93c5fd" />
        {isBlackout && <pointLight position={[0, 5, 0]} intensity={1.5} color="#ff2200" distance={20} />}
        {isFire && <pointLight position={[-9, 3, 0]} intensity={4} color="#ff4400" distance={15} />}

        <SnowParticles windSpeed={windSpeed} active={snowActive && !isThermalIR} />

        <Drone3D active={droneActive} stationId="maitri" />

        <PowerFlowLine from={[-9, 1, 0]}  to={[-5, 0.8, 10]} color="#10b981" active={powerActive} />
        <PowerFlowLine from={[-5, 0.8, 10]} to={[0, 1.5, 0]} color="#3b82f6" active={powerActive} />
        <PowerFlowLine from={[0, 1.5, 0]}  to={[0, 1.2, 7]} color="#6366f1" active={powerActive} />
        <PowerFlowLine from={[0, 1.5, 0]}  to={[0, 1.0, -7]} color="#6366f1" active={powerActive} />

        <ExhaustSmoke position={[-8.2, 1.6, -4.5]} loadPercent={(energy?.generators?.[0] as any)?.loadPercent || 60} isThermalIR={isThermalIR} />
        <ExhaustSmoke position={[-8.2, 1.6, -1.5]} loadPercent={(energy?.generators?.[1] as any)?.loadPercent || 55} isThermalIR={isThermalIR} />
        <ExhaustSmoke position={[-8.2, 1.6,  1.5]} loadPercent={50} isThermalIR={isThermalIR} />
        <ExhaustSmoke position={[-8.2, 1.6,  4.5]} loadPercent={45} isThermalIR={isThermalIR} />

        <FuelLevelMesh position={[-13, 0.7, -5]}   fuelPercent={fuelPercent} radius={0.9} />
        <FuelLevelMesh position={[-13, 0.7, -2.5]} fuelPercent={Math.max(fuelPercent-5,0)} radius={0.8} />
        <FuelLevelMesh position={[-13, 0.7, 0]}    fuelPercent={fuelPercent} radius={0.9} />
        <FuelLevelMesh position={[-13, 0.7, 2.5]}  fuelPercent={Math.min(fuelPercent+8,100)} radius={0.7} />

        <FireEffect position={[-9, 0, 0]} active={isFire} />

        {/* MAITRI 3D SCENE */}
        <group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[120, 120]} />
            <meshStandardMaterial color={isThermalIR ? '#050a14' : '#b8a48c'} roughness={0.97} metalness={0.0} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <planeGeometry args={[55, 45]} />
            <meshStandardMaterial color={isThermalIR ? '#080f1e' : '#9b8b74'} roughness={0.98} metalness={0.0} />
          </mesh>
          {[
            { pos: [0, 0, -40] as [number,number,number], size: [120, 0.3, 30] as [number,number,number] },
            { pos: [0, 0, 40] as [number,number,number], size: [120, 0.3, 30] as [number,number,number] },
            { pos: [-45, 0, 0] as [number,number,number], size: [30, 0.3, 80] as [number,number,number] },
            { pos: [45, 0, 0] as [number,number,number], size: [30, 0.3, 80] as [number,number,number] },
          ].map((s, i) => (
            <mesh key={i} position={s.pos} receiveShadow>
              <boxGeometry args={s.size} />
              <meshStandardMaterial color={isThermalIR ? '#050a14' : '#ddeeff'} roughness={0.3} metalness={0.0} opacity={isThermalIR ? 1 : 0.88} transparent />
            </mesh>
          ))}
          {[
            [-14, 0.3, -8], [-17, 0.4, 3], [-13, 0.5, 9], [14, 0.4, -7], [18, 0.3, 5],
            [13, 0.6, 11], [-7, 0.5, -15], [4, 0.4, -16], [10, 0.5, -14], [-10, 0.3, 14],
            [7, 0.4, 15], [-20, 0.5, -5], [21, 0.5, -3], [0, 0.3, -18], [2, 0.4, 18],
          ].map((p, i) => <RockyBoulder key={i} position={[p[0], p[1], p[2]]} size={0.5 + (i % 3) * 0.3} />)}
          <IceChunk position={[-22, 0.15, 0]} size={[4, 0.3, 8]} />
          <IceChunk position={[22, 0.15, -2]} size={[3, 0.25, 6]} />
          <IceChunk position={[0, 0.1, 20]} size={[6, 0.2, 3]} />
          <IceChunk position={[-5, 0.1, -20]} size={[5, 0.2, 2.5]} />

          {/* MAIN BLOCK */}
          <Interactive3DBuilding
            assetId="main-m1"
            position={[0, 1.25, 0]}
            size={[7, 2.5, 5]}
            color="#1e3a8a"
            status="HEALTHY"
            label="MAITRI MAIN BLOCK"
            isThermalIR={isThermalIR}
            hasRoof
            roofColor="#1e40af"
            isSelected={selectedAssetId === 'main-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'main-m1' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('main-m1', [0, 1.25, 0])}
          />

          {/* RESEARCH LAB */}
          <Interactive3DBuilding
            assetId="research-m1"
            position={[-6, 0.9, -7]}
            size={[5, 1.8, 3.5]}
            color="#1d4ed8"
            status="HEALTHY"
            label="RESEARCH LAB"
            isThermalIR={isThermalIR}
            isSelected={selectedAssetId === 'research-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'research-m1' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('research-m1', [-6, 0.9, -7])}
          />

          {/* ACCOMMODATION */}
          <Interactive3DBuilding
            assetId="accomm-m1"
            position={[6, 1.0, 7]}
            size={[6, 2.0, 3.5]}
            color="#2563eb"
            status="HEALTHY"
            label="ACCOMMODATION"
            isThermalIR={isThermalIR}
            hasRoof
            roofColor="#1d4ed8"
            isSelected={selectedAssetId === 'accomm-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'accomm-m1' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('accomm-m1', [6, 1.0, 7])}
          />

          {/* GENERATORS */}
          <GeneratorUnit
            assetId="gen-m1"
            position={[-9, 0.5, -4.5]}
            label={`GEN #1 (${(gen1 as any)?.loadPercent || 60}% Load)`}
            status={gen1?.status || 'HEALTHY'}
            isThermalIR={isThermalIR}
            isSelected={selectedAssetId === 'gen-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'gen-m1' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('gen-m1', [-9, 0.5, -4.5])}
          />
          <GeneratorUnit
            assetId="gen-m2"
            position={[-9, 0.5, -1.5]}
            label={`GEN #2 (${gen2?.temperature || 68}°C)`}
            status={gen2?.status || 'HEALTHY'}
            isThermalIR={isThermalIR}
            isSelected={selectedAssetId === 'gen-m2'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'gen-m2' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('gen-m2', [-9, 0.5, -1.5])}
          />
          <GeneratorUnit
            assetId="gen-m3"
            position={[-9, 0.5, 1.5]}
            label="GEN #3"
            status={gen3?.status || 'HEALTHY'}
            isThermalIR={isThermalIR}
            isSelected={selectedAssetId === 'gen-m3'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'gen-m3' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('gen-m3', [-9, 0.5, 1.5])}
          />
          <GeneratorUnit
            assetId="gen-m4"
            position={[-9, 0.5, 4.5]}
            label="GEN #4"
            status={gen4?.status || 'HEALTHY'}
            isThermalIR={isThermalIR}
            isSelected={selectedAssetId === 'gen-m4'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'gen-m4' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('gen-m4', [-9, 0.5, 4.5])}
          />
          <StaticBox position={[-9, 1.6, 0]} size={[2.6, 0.15, 12]} color="#374151" roughness={0.6} metalness={0.5} />

          {/* FUEL STORAGE */}
          <FuelTank
            position={[-13, 0.7, -5]}
            radius={0.9}
            color="#b45309"
            isSelected={selectedAssetId === 'fuel-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'fuel-m1' ? inspectionData : null}
            onSelectComponent={handleSelectComponent}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('fuel-m1', [-13, 0.7, -5])}
          />
          <FuelTank position={[-13, 0.7, -2.5]} radius={0.8} color="#92400e" onClick={() => handleSelectAsset('fuel-m1', [-13, 0.7, -2.5])} />
          <FuelTank position={[-13, 0.7, 0]} radius={0.9} color="#b45309" onClick={() => handleSelectAsset('fuel-m1', [-13, 0.7, 0])} />
          <FuelTank position={[-13, 0.7, 2.5]} radius={0.7} color="#d97706" onClick={() => handleSelectAsset('fuel-m1', [-13, 0.7, 2.5])} />

          {/* BATTERY & POWER DIST */}
          <BatteryBank
            position={[-4.5, 0, 10]}
            isThermalIR={isThermalIR}
            isSelected={selectedAssetId === 'battery-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'battery-m1' ? inspectionData : null}
            onSelectComponent={handleSelectComponent}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('battery-m1', [-4.5, 0, 10])}
          />
          <Interactive3DBuilding
            assetId="power-dist-m1"
            position={[-9, 0.6, 10]}
            size={[1.8, 1.2, 1.4]}
            color="#1e40af"
            status="HEALTHY"
            label="POWER DIST."
            isThermalIR={isThermalIR}
            onClick={() => handleSelectAsset('battery-m1', [-9, 0.6, 10])}
          />

          {/* WATER */}
          <WaterTank
            position={[8, 0, -8]}
            label="PRIYADARSHINI WATER"
            isSelected={selectedAssetId === 'water-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'water-m1' ? inspectionData : null}
            onSelectComponent={handleSelectComponent}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('water-m1', [8, 0, -8])}
          />
          <StaticBox position={[8, 0.5, -5.5]} size={[2, 1.0, 1.5]} color="#0369a1" roughness={0.5} metalness={0.4} />

          {/* COMMS TOWER */}
          <CommsTower
            position={[10, 0, 9]}
            height={9}
            isSelected={selectedAssetId === 'comms-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'comms-m1' ? inspectionData : null}
            onSelectComponent={handleSelectComponent}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('comms-m1', [10, 0, 9])}
          />

          {/* WEATHER STATION */}
          <WeatherStation position={[12, 0, 0]} onClick={() => handleSelectAsset('weather-m1', [12, 0, 0])} />

          {/* WAREHOUSE */}
          <Interactive3DBuilding
            assetId="warehouse-m1"
            position={[8, 0.9, 4]}
            size={[4, 1.8, 3]}
            color="#374151"
            status="HEALTHY"
            label="WAREHOUSE"
            isThermalIR={isThermalIR}
            hasRoof
            roofColor="#4b5563"
            isSelected={selectedAssetId === 'warehouse-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'warehouse-m1' ? inspectionData : null}
            selectedComponentId={selectedComponent?.id || null}
            onSelectComponent={handleSelectComponent}
            selectedSensorId={selectedSensor?.id || null}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('warehouse-m1', [8, 0.9, 4])}
          />

          {/* HELIPAD */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -14]}>
            <circleGeometry args={[4.5, 32]} />
            <meshStandardMaterial color={isThermalIR ? '#0a1628' : '#374151'} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -14]}>
            <ringGeometry args={[3.8, 4.3, 32]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.5} />
          </mesh>
          <Html position={[0, 0.3, -14]} center distanceFactor={22} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
            <div className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-yellow-800 text-yellow-100 shadow whitespace-nowrap">🛬 LOGISTICS / HELIPAD</div>
          </Html>

          {/* SNOW VEHICLES */}
          <SnowVehicle position={[3, 0.22, -11]} rotation={0.2} color="#f59e0b" />
          <SnowVehicle position={[6, 0.22, -10]} rotation={-0.4} color="#d97706" />
          <StaticBox position={[-3, 0.2, -11]} size={[2.5, 0.4, 1.2]} color="#6b7280" roughness={0.7} />

          {/* WIND TURBINES */}
          <WindTurbine3D
            position={[16, 0, 3]}
            speed={windSpeed}
            scale={1.0}
            isSelected={selectedAssetId === 'wind-m1'}
            isCutawayMode={isCutawayMode}
            showSensors={showSensors}
            inspectionData={selectedAssetId === 'wind-m1' ? inspectionData : null}
            onSelectComponent={handleSelectComponent}
            onSelectSensor={setSelectedSensor}
            onClick={() => handleSelectAsset('wind-m1', [16, 0, 3])}
          />
          <WindTurbine3D position={[18, 0, 0]} speed={windSpeed} scale={0.9} onClick={() => handleSelectAsset('wind-m1', [18, 0, 0])} />

          {/* PATHWAYS */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, -6.5]}>
            <planeGeometry args={[2, 7]} />
            <meshStandardMaterial color={isThermalIR ? '#080e1c' : '#6b7280'} roughness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0.04, 0]}>
            <planeGeometry args={[7, 2]} />
            <meshStandardMaterial color={isThermalIR ? '#080e1c' : '#6b7280'} roughness={0.9} />
          </mesh>
        </group>

        <CameraController preset={cameraPreset} controlsRef={controlsRef} onDone={() => setCameraPreset(null)} />
        <OrbitControls ref={controlsRef} makeDefault minDistance={4} maxDistance={55} autoRotate={autoRotate} autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
};
