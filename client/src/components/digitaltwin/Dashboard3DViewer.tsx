import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Dashboard3DViewerProps {
  stationId: 'maitri' | 'bharati';
  mode?: 'exterior' | 'interior' | 'thermal';
}

// 3D Station Mini Model
function StationModel({ stationId, mode }: { stationId: 'maitri' | 'bharati'; mode: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const isThermal = mode === 'thermal';
  const isInterior = mode === 'interior';

  if (stationId === 'maitri') {
    return (
      <group ref={groupRef} position={[0, -0.5, 0]} scale={[0.85, 0.85, 0.85]}>
        {/* Rocky Terrain Base */}
        <mesh position={[0, -0.4, 0]} receiveShadow>
          <cylinderGeometry args={[5, 5.2, 0.4, 24]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>

        {/* Support Stilts */}
        {[-2.2, -0.8, 0.8, 2.2].map((x) =>
          [-1.2, 1.2].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.3, z]}>
              <cylinderGeometry args={[0.08, 0.08, 1.0, 8]} />
              <meshStandardMaterial color="#0f172a" metalness={0.8} />
            </mesh>
          ))
        )}

        {/* Main Block (Stilts on Moraine) */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[5.2, 1.4, 2.8]} />
          <meshStandardMaterial 
            color={isThermal ? '#f59e0b' : '#f8fafc'} 
            roughness={0.3} 
            metalness={0.2}
            wireframe={isInterior}
          />
        </mesh>

        {/* Secondary Generator Block */}
        <mesh position={[-2.8, 0.8, 1.8]} castShadow>
          <boxGeometry args={[2.0, 1.2, 1.6]} />
          <meshStandardMaterial color={isThermal ? '#ef4444' : '#334155'} />
        </mesh>

        {/* Fuel Tanks */}
        <mesh position={[2.8, 0.6, -1.8]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 1.2, 16]} />
          <meshStandardMaterial color={isThermal ? '#06b6d4' : '#ea580c'} />
        </mesh>

        {/* Comms Tower */}
        <mesh position={[-2.4, 2.5, -1.5]}>
          <cylinderGeometry args={[0.04, 0.08, 2.6, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
      </group>
    );
  }

  // Bharati Aerodynamic ISO Model
  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* Coastal Promontory Terrain */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <cylinderGeometry args={[5, 5.2, 0.4, 24]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Aerodynamic Hull on Stilts */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[5.6, 1.3, 2.6]} />
        <meshStandardMaterial 
          color={isThermal ? '#f43f5e' : '#0284c7'} 
          roughness={0.2} 
          metalness={0.4}
          wireframe={isInterior}
        />
      </mesh>

      {/* ISO Container Wings */}
      <mesh position={[2.2, 0.9, 1.6]} castShadow>
        <boxGeometry args={[2.2, 1.1, 1.4]} />
        <meshStandardMaterial color={isThermal ? '#eab308' : '#3b82f6'} />
      </mesh>

      {/* Roof Satellite Radome */}
      <mesh position={[0.5, 2.2, 0]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
    </group>
  );
}

export const Dashboard3DViewer: React.FC<Dashboard3DViewerProps> = ({ stationId, mode = 'exterior' }) => {
  return (
    <Canvas
      camera={{ position: [5, 4, 6], fov: 45 }}
      style={{ width: '100%', height: '100%', background: '#070f1e' }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#38bdf8" />
      
      <StationModel stationId={stationId} mode={mode} />
      <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2.1} />
    </Canvas>
  );
};
