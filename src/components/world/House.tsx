import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQualityTier } from '../../hooks/useQualityTier';

export interface HouseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const House = ({
  position = [0, 0.2, -2],
  rotation = [0, 0, 0],
}: HouseProps) => {
  const { preset } = useQualityTier();
  const windowLightRef = useRef<THREE.PointLight>(null);
  const lanternLightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    // Gentle warm candle flicker on porch lantern and window glow
    if (windowLightRef.current) {
      windowLightRef.current.intensity = 2.2 + Math.sin(elapsed * 2.5) * 0.2;
    }
    if (lanternLightRef.current) {
      lanternLightRef.current.intensity = 1.4 + Math.cos(elapsed * 3.1) * 0.15;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Stone Foundation Base */}
      <mesh
        position={[0, 0.15, 0]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <boxGeometry args={[2.7, 0.3, 2.3]} />
        <meshStandardMaterial color="#4b5563" roughness={0.9} flatShading />
      </mesh>

      {/* Main Cottage Timber Walls */}
      <mesh
        position={[0, 1.0, 0]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <boxGeometry args={[2.4, 1.5, 2.0]} />
        <meshStandardMaterial color="#854d0e" roughness={0.7} flatShading />
      </mesh>

      {/* Cottage Gable Triangles (Front & Back) */}
      <mesh
        position={[0, 2.05, 0]}
        rotation={[0, 0, 0]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <cylinderGeometry args={[0, 1.45, 0.8, 4, 1, false, Math.PI / 4]} />
        <meshStandardMaterial color="#713f12" roughness={0.75} flatShading />
      </mesh>

      {/* Pitched Roof (Sloped Prism / Left & Right Slabs) */}
      <mesh
        position={[-0.7, 2.05, 0]}
        rotation={[0, 0, Math.PI / 4.5]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <boxGeometry args={[1.5, 0.12, 2.4]} />
        <meshStandardMaterial color="#991b1b" roughness={0.65} flatShading />
      </mesh>

      <mesh
        position={[0.7, 2.05, 0]}
        rotation={[0, 0, -Math.PI / 4.5]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <boxGeometry args={[1.5, 0.12, 2.4]} />
        <meshStandardMaterial color="#991b1b" roughness={0.65} flatShading />
      </mesh>

      {/* Roof Ridge Beam */}
      <mesh position={[0, 2.55, 0]} castShadow={preset.shadows}>
        <boxGeometry args={[0.2, 0.16, 2.44]} />
        <meshStandardMaterial color="#5c1111" roughness={0.7} flatShading />
      </mesh>

      {/* Stone Chimney */}
      <mesh
        position={[0.75, 2.4, -0.4]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <boxGeometry args={[0.38, 1.1, 0.38]} />
        <meshStandardMaterial color="#52525b" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.75, 2.95, -0.4]} castShadow={preset.shadows}>
        <boxGeometry args={[0.46, 0.1, 0.46]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.9} flatShading />
      </mesh>

      {/* Wooden Front Door */}
      <mesh position={[0.35, 0.75, 1.02]}>
        <boxGeometry args={[0.55, 1.0, 0.08]} />
        <meshStandardMaterial color="#451a03" roughness={0.8} />
      </mesh>
      {/* Door Handle */}
      <mesh position={[0.55, 0.75, 1.08]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glowing Emissive Front Window */}
      <mesh position={[-0.55, 1.05, 1.02]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshStandardMaterial
          color="#ffb74d"
          emissive="#ffa726"
          emissiveIntensity={2.8}
          roughness={0.2}
        />
      </mesh>
      {/* Front Window Frame Grid */}
      <mesh position={[-0.55, 1.05, 1.04]}>
        <boxGeometry args={[0.58, 0.04, 0.02]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[-0.55, 1.05, 1.04]}>
        <boxGeometry args={[0.04, 0.58, 0.02]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>

      {/* Glowing Side Windows */}
      <mesh
        position={[1.22, 1.05, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial
          color="#ffb74d"
          emissive="#ffa726"
          emissiveIntensity={2.4}
          roughness={0.2}
        />
      </mesh>
      <mesh
        position={[-1.22, 1.05, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial
          color="#ffb74d"
          emissive="#ffa726"
          emissiveIntensity={2.4}
          roughness={0.2}
        />
      </mesh>

      {/* Front Porch Platform */}
      <mesh
        position={[0.35, 0.12, 1.4]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <boxGeometry args={[1.2, 0.2, 0.8]} />
        <meshStandardMaterial color="#78350f" roughness={0.8} />
      </mesh>

      {/* Porch Pillar & Lantern */}
      <mesh position={[-0.2, 0.8, 1.7]} castShadow={preset.shadows}>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#451a03" />
      </mesh>
      <mesh position={[-0.2, 1.2, 1.7]}>
        <octahedronGeometry args={[0.08]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#facc15"
          emissiveIntensity={3.2}
        />
      </mesh>

      {/* Soft Warm Point Lights from House Windows & Porch Lantern */}
      <pointLight
        ref={windowLightRef}
        position={[-0.5, 1.0, 1.5]}
        color="#ff9800"
        distance={4.5}
        intensity={2.2}
      />
      <pointLight
        ref={lanternLightRef}
        position={[-0.2, 1.2, 1.7]}
        color="#fde047"
        distance={3.2}
        intensity={1.4}
      />
    </group>
  );
};
