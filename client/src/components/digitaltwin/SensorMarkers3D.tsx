import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { SensorDefinition, SensorStatus } from '../../services/AssetInternalCatalog';

interface SensorMarkers3DProps {
  sensors: SensorDefinition[];
  selectedSensorId: string | null;
  onSelectSensor: (sensor: SensorDefinition) => void;
  visible?: boolean;
}

function getSensorColor(status: SensorStatus): {
  color: string;
  emissive: string;
} {
  switch (status) {
    case 'CRITICAL':
      return { color: '#ef4444', emissive: '#ff0000' };
    case 'HIGH_RISK':
      return { color: '#f97316', emissive: '#ff5500' };
    case 'WARNING':
      return { color: '#eab308', emissive: '#ffaa00' };
    case 'OFFLINE':
      return { color: '#64748b', emissive: '#334155' };
    default:
      return { color: '#10b981', emissive: '#00ff88' };
  }
}

export const SensorMarkers3D: React.FC<SensorMarkers3DProps> = ({
  sensors,
  selectedSensorId,
  onSelectSensor,
  visible = true
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!visible || sensors.length === 0) return null;

  return (
    <group>
      {sensors.map((sensor) => {
        const val = sensor.getValue(null, null, null, '');
        const status = sensor.getStatus(val);
        const colors = getSensorColor(status);
        const isSelected = selectedSensorId === sensor.id;
        const isHovered = hoveredId === sensor.id;

        const handleClick = (e: any) => {
          e.stopPropagation();
          onSelectSensor(sensor);
        };

        const handleOver = (e: any) => {
          e.stopPropagation();
          setHoveredId(sensor.id);
        };

        const handleOut = (e: any) => {
          e.stopPropagation();
          if (hoveredId === sensor.id) setHoveredId(null);
        };

        return (
          <group
            key={sensor.id}
            position={sensor.relativePosition}
            onClick={handleClick}
            onPointerOver={handleOver}
            onPointerOut={handleOut}
          >
            {/* Metallic Mounting Pin / Stalk */}
            <mesh position={[0, -0.06, 0]}>
              <cylinderGeometry args={[0.015, 0.025, 0.12, 8]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.2} />
            </mesh>

            {/* Hex Sensor Housing Collar */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.04, 6]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
            </mesh>

            {/* Glowing Sensor Status Optical Head */}
            <mesh position={[0, 0.04, 0]}>
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial
                color={colors.color}
                emissive={colors.emissive}
                emissiveIntensity={isSelected || isHovered ? 1.2 : 0.7}
                roughness={0.1}
              />
            </mesh>

            {/* Selection Pulse Ring */}
            {isSelected && (
              <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.06, 0.08, 16]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.0} side={THREE.DoubleSide} transparent opacity={0.8} />
              </mesh>
            )}

            {/* Hover Floating Mini-Badge */}
            {(isHovered || isSelected) && (
              <Html
                position={[0, 0.16, 0]}
                center
                distanceFactor={18}
                zIndexRange={[0, 5]}
                style={{ pointerEvents: 'none' }}
              >
                <div className={`px-2 py-1 rounded-lg text-[9px] font-sans font-black shadow-2xl border whitespace-nowrap flex flex-col backdrop-blur-md transition ${
                  status === 'CRITICAL' ? 'bg-rose-950/95 text-rose-200 border-rose-600 shadow-rose-900/50' :
                  status === 'WARNING' || status === 'HIGH_RISK' ? 'bg-amber-950/95 text-amber-200 border-amber-600 shadow-amber-900/50' :
                  'bg-stone-900/95 text-emerald-300 border-emerald-600 shadow-stone-950'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono text-stone-400">{sensor.id}</span>
                    <span>•</span>
                    <span className="text-white font-extrabold">{val} {sensor.unit}</span>
                  </div>
                  <div className="text-[8px] text-stone-300 font-normal">
                    {sensor.name} ({sensor.normalRange[0]}–{sensor.normalRange[1]} {sensor.unit})
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};
