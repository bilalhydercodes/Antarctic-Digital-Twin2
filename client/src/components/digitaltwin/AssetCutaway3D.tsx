import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { InternalComponent, ComponentStatus } from '../../services/AssetInternalCatalog';

interface AssetCutaway3DProps {
  components: InternalComponent[];
  selectedComponentId: string | null;
  onSelectComponent: (component: InternalComponent) => void;
  isThermalIR?: boolean;
}

// ─── Status Color Helper ───────────────────────────────────────────────────
function getComponentColor(status: ComponentStatus, isThermalIR: boolean, isSelected: boolean, isHovered: boolean): {
  color: string;
  emissive: string;
  emissiveIntensity: number;
} {
  if (isThermalIR) {
    if (status === 'CRITICAL') return { color: '#ff2200', emissive: '#ff0000', emissiveIntensity: 0.8 };
    if (status === 'WARNING') return { color: '#ff8800', emissive: '#ff4400', emissiveIntensity: 0.6 };
    return { color: '#0066ff', emissive: '#0033aa', emissiveIntensity: 0.4 };
  }

  if (isSelected) {
    return { color: '#0284c7', emissive: '#38bdf8', emissiveIntensity: 0.6 };
  }
  if (isHovered) {
    return { color: '#0ea5e9', emissive: '#0284c7', emissiveIntensity: 0.35 };
  }

  switch (status) {
    case 'CRITICAL':
      return { color: '#ef4444', emissive: '#dc2626', emissiveIntensity: 0.5 };
    case 'WARNING':
      return { color: '#f59e0b', emissive: '#d97706', emissiveIntensity: 0.35 };
    case 'OFFLINE':
      return { color: '#64748b', emissive: '#334155', emissiveIntensity: 0.1 };
    default:
      return { color: '#475569', emissive: '#0f172a', emissiveIntensity: 0.05 };
  }
}

// ─── 1. Engine Block 3D ────────────────────────────────────────────────────
const EngineBlock3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const meshRef = useRef<THREE.Group>(null);
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);

  useFrame((state) => {
    if (meshRef.current && status === 'CRITICAL') {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 15) * 0.015;
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* Crankcase Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[size[0], size[1] * 0.5, size[2]]} />
        <meshStandardMaterial color={colors.color} roughness={0.4} metalness={0.8} emissive={colors.emissive} emissiveIntensity={colors.emissiveIntensity} />
      </mesh>
      {/* Cylinder Bank */}
      <mesh position={[0, size[1] * 0.45, 0]} castShadow>
        <boxGeometry args={[size[0] * 0.85, size[1] * 0.4, size[2] * 0.75]} />
        <meshStandardMaterial color={status === 'CRITICAL' ? '#dc2626' : '#334155'} roughness={0.3} metalness={0.85} emissive={colors.emissive} emissiveIntensity={colors.emissiveIntensity} />
      </mesh>
      {/* Cylinder Valve Covers */}
      {[-0.25, 0.25].map((x, i) => (
        <mesh key={i} position={[x, size[1] * 0.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, size[0] * 0.7, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* Front Pulley */}
      <mesh position={[-size[0] / 2 - 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.08, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} />
      </mesh>
    </group>
  );
};

// ─── 2. Alternator / Stator 3D ─────────────────────────────────────────────
const Alternator3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);
  const radius = Math.min(size[1], size[2]) * 0.48;

  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* Outer Stator Shell */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, size[0], 24]} />
        <meshStandardMaterial color={colors.color} roughness={0.35} metalness={0.8} emissive={colors.emissive} emissiveIntensity={colors.emissiveIntensity} />
      </mesh>
      {/* Copper Windings visible at ends */}
      {[-size[0] / 2 - 0.02, size[0] / 2 + 0.02].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 0.75, radius * 0.75, 0.04, 16]} />
          <meshStandardMaterial color="#b45309" roughness={0.2} metalness={0.95} emissive="#d97706" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* Terminal Junction Box on Top */}
      <mesh position={[0, radius + 0.1, 0]}>
        <boxGeometry args={[0.25, 0.15, 0.25]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.7} />
      </mesh>
    </group>
  );
};

// ─── 3. Cooling Radiator & Coolant Loop 3D ────────────────────────────────
const CoolingRadiator3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fanRef.current && status !== 'OFFLINE') {
      fanRef.current.rotation.x += delta * (status === 'CRITICAL' ? 2 : 12);
    }
  });

  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* Radiator Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={colors.color} roughness={0.5} metalness={0.6} emissive={colors.emissive} emissiveIntensity={colors.emissiveIntensity} />
      </mesh>
      {/* Radiator Grille Matrix */}
      <mesh position={[0, 0, size[2] / 2 + 0.01]}>
        <planeGeometry args={[size[0] * 0.85, size[1] * 0.85]} />
        <meshStandardMaterial color={status === 'CRITICAL' ? '#ef4444' : '#0284c7'} roughness={0.2} metalness={0.9} emissive={status === 'CRITICAL' ? '#dc2626' : '#0369a1'} emissiveIntensity={0.3} />
      </mesh>
      {/* Ducted Fan Hub */}
      <group ref={fanRef} position={[0, 0, -size[2] / 2 - 0.05]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[size[1] * 0.35, size[1] * 0.35, 0.04, 16]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} />
        </mesh>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <mesh key={i} rotation={[0, 0, (deg * Math.PI) / 180]} position={[0, size[1] * 0.18, 0]}>
            <boxGeometry args={[0.04, size[1] * 0.32, 0.01]} />
            <meshStandardMaterial color="#64748b" metalness={0.7} />
          </mesh>
        ))}
      </group>
      {/* Coolant Hose */}
      <mesh position={[size[0] / 2 + 0.1, size[1] * 0.3, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
    </group>
  );
};

// ─── 4. Fuel Common Rail 3D ────────────────────────────────────────────────
const FuelRail3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);

  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* Main Rail Tube */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, size[0], 12]} />
        <meshStandardMaterial color={colors.color} metalness={0.95} roughness={0.15} emissive={colors.emissive} emissiveIntensity={colors.emissiveIntensity} />
      </mesh>
      {/* 4 Injector Stems */}
      {[-0.25, -0.08, 0.08, 0.25].map((x, i) => (
        <mesh key={i} position={[x, -0.08, 0]}>
          <cylinderGeometry args={[0.02, 0.015, 0.14, 8]} />
          <meshStandardMaterial color="#b45309" metalness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// ─── 5. Exhaust Turbocharger 3D ───────────────────────────────────────────
const ExhaustTurbo3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);

  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* Turbo Turbine Snail Housing */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.12, 0.06, 12, 24]} />
        <meshStandardMaterial color={status === 'CRITICAL' ? '#ff3300' : '#78716c'} roughness={0.3} metalness={0.85} emissive={status === 'CRITICAL' ? '#ff0000' : '#292524'} emissiveIntensity={status === 'CRITICAL' ? 0.8 : 0.1} />
      </mesh>
      {/* Exhaust Pipe Upward */}
      <mesh position={[0.08, 0.2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 12]} />
        <meshStandardMaterial color="#44403c" metalness={0.8} />
      </mesh>
    </group>
  );
};

// ─── 6. Battery Modules Rack 3D ───────────────────────────────────────────
const BatteryRack3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);

  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* Outer Enclosure Frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={colors.color} roughness={0.3} metalness={0.7} emissive={colors.emissive} emissiveIntensity={colors.emissiveIntensity} />
      </mesh>
      {/* Prismatic Cell Rows */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={i} position={[x * (size[0] * 0.55), 0, size[2] / 2 + 0.01]}>
          <boxGeometry args={[size[0] * 0.25, size[1] * 0.7, 0.02]} />
          <meshStandardMaterial color={status === 'CRITICAL' ? '#ef4444' : '#10b981'} emissive={status === 'CRITICAL' ? '#dc2626' : '#059669'} emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* BMS Status LED */}
      <mesh position={[0, size[1] * 0.4, size[2] / 2 + 0.02]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial color={status === 'CRITICAL' ? '#ef4444' : '#22c55e'} emissive={status === 'CRITICAL' ? '#ff0000' : '#00ff66'} emissiveIntensity={1.0} />
      </mesh>
    </group>
  );
};

// ─── 7. Wind Turbine Gearbox 3D ───────────────────────────────────────────
const WindGearbox3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);

  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={colors.color} roughness={0.3} metalness={0.8} emissive={colors.emissive} emissiveIntensity={colors.emissiveIntensity} />
      </mesh>
      {/* Brake Disc */}
      <mesh position={[size[0] * 0.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} />
      </mesh>
    </group>
  );
};

// ─── 8. Generic / Controller / Pump Component 3D ───────────────────────────
const GenericComponent3D: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  status: ComponentStatus;
  isThermalIR: boolean;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (e: any) => void;
  onPointerOver: (e: any) => void;
  onPointerOut: (e: any) => void;
}> = ({ position, size, status, isThermalIR, isSelected, isHovered, onClick, onPointerOver, onPointerOut }) => {
  const colors = getComponentColor(status, isThermalIR, isSelected, isHovered);

  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      castShadow
      receiveShadow
    >
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={colors.color}
        roughness={0.4}
        metalness={0.7}
        emissive={colors.emissive}
        emissiveIntensity={colors.emissiveIntensity}
      />
    </mesh>
  );
};

// ─── MASTER CUTAWAY RENDERER ───────────────────────────────────────────────
export const AssetCutaway3D: React.FC<AssetCutaway3DProps> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  isThermalIR = false,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <group>
      {components.map((comp) => {
        const isSelected = selectedComponentId === comp.id;
        const isHovered = hoveredId === comp.id;
        const health = comp.getHealth(null, null, null, '');
        const status = health.status;

        const handleClick = (e: any) => {
          e.stopPropagation();
          onSelectComponent(comp);
        };

        const handleOver = (e: any) => {
          e.stopPropagation();
          setHoveredId(comp.id);
        };

        const handleOut = (e: any) => {
          e.stopPropagation();
          if (hoveredId === comp.id) setHoveredId(null);
        };

        return (
          <group key={comp.id}>
            {/* Component 3D Geometry based on meshType */}
            {comp.meshType === 'ENGINE_BLOCK' && (
              <EngineBlock3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}
            {comp.meshType === 'ALTERNATOR' && (
              <Alternator3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}
            {comp.meshType === 'COOLING_SYSTEM' && (
              <CoolingRadiator3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}
            {comp.meshType === 'FUEL_SYSTEM' && (
              <FuelRail3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}
            {comp.meshType === 'EXHAUST_SYSTEM' && (
              <ExhaustTurbo3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}
            {comp.meshType === 'BATTERY_PACK' && (
              <BatteryRack3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}
            {comp.meshType === 'ROTOR_GEARBOX' && (
              <WindGearbox3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}
            {!['ENGINE_BLOCK', 'ALTERNATOR', 'COOLING_SYSTEM', 'FUEL_SYSTEM', 'EXHAUST_SYSTEM', 'BATTERY_PACK', 'ROTOR_GEARBOX'].includes(comp.meshType) && (
              <GenericComponent3D
                position={comp.relativePosition}
                size={comp.size}
                status={status}
                isThermalIR={isThermalIR}
                isSelected={isSelected}
                isHovered={isHovered}
                onClick={handleClick}
                onPointerOver={handleOver}
                onPointerOut={handleOut}
              />
            )}

            {/* Hover Floating Component Tag */}
            {isHovered && (
              <Html
                position={[comp.relativePosition[0], comp.relativePosition[1] + comp.size[1] * 0.6 + 0.2, comp.relativePosition[2]]}
                center
                distanceFactor={18}
                zIndexRange={[0, 5]}
                style={{ pointerEvents: 'none' }}
              >
                <div className="px-2 py-1 rounded-md bg-stone-900/90 text-white text-[10px] font-sans font-bold shadow-xl border border-stone-700 whitespace-nowrap flex items-center space-x-1.5 backdrop-blur-sm">
                  <span className={`w-2 h-2 rounded-full ${
                    status === 'CRITICAL' ? 'bg-rose-500 animate-ping' :
                    status === 'WARNING' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <span>{comp.name}</span>
                  <span className="text-stone-400">({health.healthPercent}%)</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
