import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface Drone3DProps {
  active: boolean;
  onSelect?: () => void;
  waypointTarget?: [number, number, number];
  stationId: 'maitri' | 'bharati';
}

export const Drone3D: React.FC<Drone3DProps> = ({ active, onSelect, stationId }) => {
  const droneGroupRef = useRef<THREE.Group>(null);
  const rotorsRef = useRef<THREE.Group[]>([]);
  const { camera } = useThree();

  // Define inspection flight path waypoints
  const waypoints = stationId === 'maitri' ? [
    new THREE.Vector3(0, 8, 0),        // Main Station
    new THREE.Vector3(-9, 7, -4),     // Generator Bay
    new THREE.Vector3(-13, 6, -5),    // Fuel Farm
    new THREE.Vector3(8, 7, -8),      // Water System
    new THREE.Vector3(10, 10, 9),     // Comms Tower
    new THREE.Vector3(0, 6, -14),     // Helipad
  ] : [
    new THREE.Vector3(0, 9, 0),        // Bharati Main
    new THREE.Vector3(-9, 8, -6),     // Research Lab
    new THREE.Vector3(-11, 7, 0),     // Generator Bay
    new THREE.Vector3(-12, 7, 7),     // Fuel Storage
    new THREE.Vector3(9, 7, -6),      // Water System
    new THREE.Vector3(11, 10, 9),     // Comms Tower
    new THREE.Vector3(0, 6, 15),      // Landing Zone
  ];

  const waypointIndex = useRef(0);
  const flightProgress = useRef(0);

  useFrame((state, delta) => {
    // Spin rotors
    rotorsRef.current.forEach((rotor) => {
      if (rotor) rotor.rotation.y += delta * 35;
    });

    if (!droneGroupRef.current || !active) return;

    // Move along waypoints
    const currentWP = waypoints[waypointIndex.current];
    const nextWPIndex = (waypointIndex.current + 1) % waypoints.length;
    const nextWP = waypoints[nextWPIndex];

    flightProgress.current += delta * 0.25; // Flight speed

    if (flightProgress.current >= 1.0) {
      flightProgress.current = 0;
      waypointIndex.current = nextWPIndex;
    }

    const currentPos = new THREE.Vector3().lerpVectors(currentWP, nextWP, flightProgress.current);
    // Add subtle hover sway
    currentPos.y += Math.sin(state.clock.getElapsedTime() * 3) * 0.15;
    droneGroupRef.current.position.copy(currentPos);

    // Look towards next waypoint
    droneGroupRef.current.lookAt(nextWP.x, currentPos.y, nextWP.z);
  });

  if (!active) return null;

  return (
    <group ref={droneGroupRef} position={[0, 8, 0]} onClick={onSelect}>
      {/* Central Drone Frame */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.15, 0.5]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Camera Dome */}
      <mesh position={[0, -0.12, 0.15]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.6} roughness={0.1} />
      </mesh>

      {/* Quadcopter Arms */}
      {[
        [-0.4, 0, -0.4],
        [0.4, 0, -0.4],
        [-0.4, 0, 0.4],
        [0.4, 0, 0.4]
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh rotation={[0, Math.atan2(z, x), 0]}>
            <boxGeometry args={[0.5, 0.05, 0.05]} />
            <meshStandardMaterial color="#475569" metalness={0.8} />
          </mesh>

          {/* Rotor Motor */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 8]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} />
          </mesh>

          {/* Rotor Blade Group */}
          <group ref={(el) => { if (el) rotorsRef.current[i] = el; }} position={[0, 0.1, 0]}>
            <mesh>
              <boxGeometry args={[0.5, 0.01, 0.04]} />
              <meshStandardMaterial color="#94a3b8" transparent opacity={0.8} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]}>
              <boxGeometry args={[0.5, 0.01, 0.04]} />
              <meshStandardMaterial color="#94a3b8" transparent opacity={0.8} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Downward Thermal Spotlight */}
      <spotLight
        position={[0, -0.2, 0]}
        target-position={[0, -10, 0]}
        color="#38bdf8"
        intensity={3}
        angle={0.6}
        penumbra={0.5}
        distance={25}
      />

      {/* Drone Status Floating Badge */}
      <Html position={[0, 0.6, 0]} center distanceFactor={22} zIndexRange={[0, 5]} style={{ pointerEvents: 'none' }}>
        <div className="px-2 py-0.5 rounded bg-cyan-900/90 text-cyan-200 text-[10px] font-mono font-bold shadow border border-cyan-500/50 flex items-center space-x-1 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>🛸 UAV-PATROL ACTIVE</span>
        </div>
      </Html>
    </group>
  );
};
